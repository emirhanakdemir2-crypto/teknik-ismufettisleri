-- 001_initial_schema.sql
-- Müfettişe Sor — initial database skeleton
-- Apply via Supabase CLI: supabase db push (do not run from app code)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM (
  'citizen',
  'inspector_pending',
  'verified_inspector',
  'moderator',
  'admin'
);

CREATE TYPE public.question_status AS ENUM (
  'draft',
  'pending_review',
  'revision_requested',
  'rejected',
  'published',
  'closed'
);

CREATE TYPE public.answer_status AS ENUM (
  'published',
  'hidden',
  'deleted'
);

CREATE TYPE public.application_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role          public.user_role NOT NULL DEFAULT 'citizen',
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX profiles_role_idx ON public.profiles (role);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'citizen');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Rol yükseltme/düşürme yalnızca service role (server-side admin client) ile yapılabilir.
-- Oturumlu kullanıcılar (auth.uid() IS NOT NULL) kendi veya başkasının rolünü değiştiremez.
CREATE OR REPLACE FUNCTION public.protect_profiles_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'profiles.role can only be changed via server-side service role';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_protect_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profiles_role();

-- ---------------------------------------------------------------------------
-- Role helpers (profiles tablosu oluşturulduktan sonra)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() = 'admin'::public.user_role;
$$;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('moderator'::public.user_role, 'admin'::public.user_role);
$$;

CREATE OR REPLACE FUNCTION public.is_verified_inspector()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() = 'verified_inspector'::public.user_role;
$$;

-- Mesleki cevap yazma ile admin yönetimi ayrılır; admin bu fonksiyondan geçmez.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
CREATE TABLE public.categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT,
  section       TEXT NOT NULL DEFAULT 'general',
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX categories_active_sort_idx
  ON public.categories (is_active, sort_order);

CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- questions
-- ---------------------------------------------------------------------------
CREATE TABLE public.questions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id           UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  guest_email         TEXT,
  email_verified_at   TIMESTAMPTZ,
  category_id         UUID NOT NULL REFERENCES public.categories (id) ON DELETE RESTRICT,
  title               TEXT NOT NULL CHECK (char_length(title) BETWEEN 10 AND 200),
  body                TEXT NOT NULL CHECK (char_length(body) >= 20),
  status              public.question_status NOT NULL DEFAULT 'draft',
  moderation_note     TEXT,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT questions_author_or_guest_chk CHECK (
    author_id IS NOT NULL OR guest_email IS NOT NULL
  ),
  CONSTRAINT questions_guest_email_verified_chk CHECK (
    author_id IS NOT NULL
    OR status = 'draft'
    OR email_verified_at IS NOT NULL
  )
);

CREATE INDEX questions_status_created_idx
  ON public.questions (status, created_at DESC);

CREATE INDEX questions_category_status_idx
  ON public.questions (category_id, status);

CREATE INDEX questions_author_id_idx
  ON public.questions (author_id);

CREATE INDEX questions_guest_email_idx
  ON public.questions (guest_email)
  WHERE guest_email IS NOT NULL;

CREATE INDEX questions_published_at_idx
  ON public.questions (published_at DESC)
  WHERE status IN ('published', 'closed');

CREATE TRIGGER questions_set_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Sahip yalnızca category_id, title, body ve gönderim status akışını güncelleyebilir.
-- moderation_note, published_at, guest alanları ve author_id değiştirilemez.
-- Moderator/admin ve service role bu kısıtlamadan muaf (questions_moderate).
CREATE OR REPLACE FUNCTION public.protect_questions_owner_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_moderator_or_admin() THEN
    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.author_id THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.author_id IS DISTINCT FROM OLD.author_id
       OR NEW.guest_email IS DISTINCT FROM OLD.guest_email
       OR NEW.email_verified_at IS DISTINCT FROM OLD.email_verified_at
       OR NEW.moderation_note IS DISTINCT FROM OLD.moderation_note
       OR NEW.published_at IS DISTINCT FROM OLD.published_at
       OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'question owner may only update category_id, title, body, and status for submission';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NOT (
        OLD.status IN ('draft'::public.question_status, 'revision_requested'::public.question_status)
        AND NEW.status = 'pending_review'::public.question_status
      ) THEN
        RAISE EXCEPTION 'invalid question status transition for owner: only draft or revision_requested to pending_review is allowed';
      END IF;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER questions_protect_owner_update
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_questions_owner_update();

-- ---------------------------------------------------------------------------
-- answers
-- ---------------------------------------------------------------------------
CREATE TABLE public.answers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
  author_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  body          TEXT NOT NULL CHECK (char_length(body) >= 20),
  status        public.answer_status NOT NULL DEFAULT 'published',
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX answers_question_id_idx
  ON public.answers (question_id);

CREATE INDEX answers_author_id_idx
  ON public.answers (author_id);

CREATE INDEX answers_status_idx
  ON public.answers (status);

CREATE TRIGGER answers_set_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- verified_inspector kendi cevabında yalnızca body değiştirebilir.
-- admin yalnızca status moderasyonu yapabilir (published/hidden/deleted); body değiştiremez.
-- edited_at body değişince trigger tarafından set edilir; updated_at set_updated_at ile güncellenir.
-- service role (auth.uid() IS NULL) tüm alanlarda muaf.
CREATE OR REPLACE FUNCTION public.protect_answers_owner_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF public.is_admin() THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.question_id IS DISTINCT FROM OLD.question_id
       OR NEW.author_id IS DISTINCT FROM OLD.author_id
       OR NEW.body IS DISTINCT FROM OLD.body
       OR NEW.published_at IS DISTINCT FROM OLD.published_at
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
       OR NEW.edited_at IS DISTINCT FROM OLD.edited_at THEN
      RAISE EXCEPTION 'admin may only change answer status for moderation';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status
       AND NEW.status NOT IN (
         'published'::public.answer_status,
         'hidden'::public.answer_status,
         'deleted'::public.answer_status
       ) THEN
      RAISE EXCEPTION 'invalid answer status for admin moderation';
    END IF;

    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.author_id
     AND public.get_user_role() = 'verified_inspector'::public.user_role THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.question_id IS DISTINCT FROM OLD.question_id
       OR NEW.author_id IS DISTINCT FROM OLD.author_id
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.published_at IS DISTINCT FROM OLD.published_at
       OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'verified_inspector may only update answer body on own answers';
    END IF;

    IF NEW.body IS DISTINCT FROM OLD.body THEN
      NEW.edited_at = NOW();
    ELSIF NEW.edited_at IS DISTINCT FROM OLD.edited_at THEN
      RAISE EXCEPTION 'edited_at is managed by the system';
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER answers_protect_owner_update
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_answers_owner_update();

-- ---------------------------------------------------------------------------
-- inspector_applications
-- ---------------------------------------------------------------------------
CREATE TABLE public.inspector_applications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status                public.application_status NOT NULL DEFAULT 'pending',
  document_storage_path TEXT NOT NULL,
  reviewed_by           UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  reviewed_at           TIMESTAMPTZ,
  rejection_reason      TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX inspector_applications_user_id_idx
  ON public.inspector_applications (user_id);

CREATE INDEX inspector_applications_status_idx
  ON public.inspector_applications (status);

CREATE TRIGGER inspector_applications_set_updated_at
  BEFORE UPDATE ON public.inspector_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- guest_question_tokens (misafir e-posta doğrulama)
-- ---------------------------------------------------------------------------
CREATE TABLE public.guest_question_tokens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  token_hash    TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  verified_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX guest_question_tokens_question_id_idx
  ON public.guest_question_tokens (question_id);

CREATE INDEX guest_question_tokens_email_idx
  ON public.guest_question_tokens (email);

CREATE UNIQUE INDEX guest_question_tokens_token_hash_uidx
  ON public.guest_question_tokens (token_hash);

-- ---------------------------------------------------------------------------
-- moderation_logs
-- ---------------------------------------------------------------------------
CREATE TABLE public.moderation_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   TEXT NOT NULL CHECK (entity_type IN ('question', 'answer')),
  entity_id     UUID NOT NULL,
  action        TEXT NOT NULL,
  actor_id      UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  reason        TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX moderation_logs_entity_idx
  ON public.moderation_logs (entity_type, entity_id);

CREATE INDEX moderation_logs_actor_id_idx
  ON public.moderation_logs (actor_id);

CREATE INDEX moderation_logs_created_at_idx
  ON public.moderation_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action        TEXT NOT NULL,
  actor_id      UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  target_type   TEXT NOT NULL,
  target_id     UUID,
  reason        TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_id_idx
  ON public.audit_logs (actor_id);

CREATE INDEX audit_logs_target_idx
  ON public.audit_logs (target_type, target_id);

CREATE INDEX audit_logs_created_at_idx
  ON public.audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  payload       JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at       TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_id_created_idx
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX notifications_unread_idx
  ON public.notifications (user_id)
  WHERE read_at IS NULL;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Service role gerektiren işlemler (yalnızca server-side admin client):
--   - guest_question_tokens: oluşturma, doğrulama, süre dolumu
--   - guest soru INSERT/UPDATE (author_id NULL, guest_email dolu)
--   - audit_logs INSERT (belge erişimi, rol değişikliği, admin eylemleri)
--   - moderation_logs INSERT (moderasyon kaydı)
--   - notifications INSERT (sistem bildirimi)
--   - profiles.role UPDATE (admin onayı, müfettiş başvurusu sonucu)
--   - inspector_applications INSERT (başvuru oluşturma, belge yükleme)
--   - inspector_applications UPDATE (admin inceleme, belge erişimi audit ile)
--   - inspector_applications SELECT (başvuran durumu — document_storage_path hariç alanlar server action ile)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspector_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_question_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- profiles — tam tablo public değil; ileride herkese açık müfettiş bilgisi ayrı view ile
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY profiles_select_admin
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- profiles INSERT: yalnızca auth.users trigger (handle_new_user); client INSERT yok
-- profiles.role UPDATE: protect_profiles_role trigger + service role (yorum üstte)

-- categories (public read)
CREATE POLICY categories_select_public
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_moderator_or_admin());

CREATE POLICY categories_admin_write
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- questions
-- SELECT published/closed: anon + authenticated (herkese açık içerik)
-- closed sorular görünür ama yeni cevap kabul etmez (cevap INSERT yalnızca published)
-- INSERT authenticated: oturumlu citizen soruları (guest akışı service role)
-- INSERT/UPDATE guest sorular: service role (Server Action)
-- Soruyu closed yapma: moderator/admin (questions_moderate); sahip yapamaz (owner trigger)
CREATE POLICY questions_select_published
  ON public.questions FOR SELECT
  USING (status IN ('published', 'closed'));

CREATE POLICY questions_select_own
  ON public.questions FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY questions_select_moderation_queue
  ON public.questions FOR SELECT
  USING (
    public.is_moderator_or_admin()
    AND status IN ('pending_review', 'revision_requested', 'rejected')
  );

CREATE POLICY questions_insert_authenticated
  ON public.questions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND author_id = auth.uid()
    AND guest_email IS NULL
    AND status IN ('draft', 'pending_review')
  );

CREATE POLICY questions_update_own_draft
  ON public.questions FOR UPDATE
  USING (
    auth.uid() = author_id
    AND status IN ('draft', 'revision_requested')
  )
  WITH CHECK (
    auth.uid() = author_id
    AND status IN ('draft', 'revision_requested', 'pending_review')
  );
  -- Kolon kısıtı: protect_questions_owner_update trigger

CREATE POLICY questions_moderate
  ON public.questions FOR UPDATE
  USING (public.is_moderator_or_admin())
  WITH CHECK (public.is_moderator_or_admin());

-- answers
-- INSERT: yalnızca verified_inspector (admin mesleki cevap yazamaz); soru status published olmalı
-- UPDATE own: müfettiş yalnızca body düzenler (protect_answers_owner_update trigger)
-- UPDATE admin: yalnızca status moderasyonu (protect_answers_owner_update trigger)
CREATE POLICY answers_select_published
  ON public.answers FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.questions q
      WHERE q.id = answers.question_id
        AND q.status IN ('published', 'closed')
    )
  );

CREATE POLICY answers_select_own
  ON public.answers FOR SELECT
  USING (auth.uid() = author_id OR public.is_moderator_or_admin());

CREATE POLICY answers_insert_verified_inspector
  ON public.answers FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'verified_inspector'::public.user_role
    AND author_id = auth.uid()
    AND status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.questions q
      WHERE q.id = question_id
        AND q.status = 'published'
    )
  );

CREATE POLICY answers_update_own
  ON public.answers FOR UPDATE
  USING (
    auth.uid() = author_id
    AND public.get_user_role() = 'verified_inspector'::public.user_role
  )
  WITH CHECK (
    auth.uid() = author_id
    AND status = 'published'::public.answer_status
  );
  -- Kolon kısıtı: protect_answers_owner_update trigger

CREATE POLICY answers_admin_moderate
  ON public.answers FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (
    public.is_admin()
    AND status IN (
      'published'::public.answer_status,
      'hidden'::public.answer_status,
      'deleted'::public.answer_status
    )
  );

-- inspector_applications
-- Başvuru oluşturma server-side yapılır (Server Action + service role).
-- Belge storage path client'tan güvenilerek alınmaz; document_storage_path yalnızca server-side oluşturulur.
-- Admin inceleme ve belge erişimi audit_logs'a yazılır.
-- SELECT: yalnızca admin (document_storage_path dahil)
-- INSERT/UPDATE: service role — client INSERT policy ve GRANT yok
CREATE POLICY inspector_applications_select_admin
  ON public.inspector_applications FOR SELECT
  USING (public.is_admin());

-- guest_question_tokens: client kapalı (anon/authenticated policy yok, REVOKE aşağıda)
-- Tüm CRUD: service role — token oluşturma, doğrulama, verified_at güncelleme

-- moderation_logs: client INSERT yok; okuma moderator/admin
-- Kayıt yazımı: service role (Server Action moderasyon sonrası)
CREATE POLICY moderation_logs_select_staff
  ON public.moderation_logs FOR SELECT
  USING (public.is_moderator_or_admin());

-- audit_logs: client INSERT yok; okuma yalnızca admin
-- Kayıt yazımı: service role (belge erişimi, rol değişikliği, admin eylemleri)
CREATE POLICY audit_logs_select_admin
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- notifications
-- INSERT: service role (sistem bildirimi); client INSERT policy yok
-- SELECT/UPDATE own: kullanıcı kendi bildirimlerini okur/işaretler
CREATE POLICY notifications_select_own
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY notifications_update_own
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.questions TO anon, authenticated;
GRANT SELECT ON public.answers TO anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.questions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.answers TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT ON public.moderation_logs TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- guest_question_tokens: client rollerinden açıkça kapat
REVOKE ALL ON public.guest_question_tokens FROM anon, authenticated;
