-- Müfettiş başvuru yönetimi: belge zorunluluğu kaldırma, başvuru alanları, kullanıcı SELECT, tek pending kısıtı.
-- INSERT/UPDATE yalnızca service role (Server Action) ile yapılır; client INSERT policy yok.

ALTER TABLE public.inspector_applications
  ALTER COLUMN document_storage_path DROP NOT NULL;

ALTER TABLE public.inspector_applications
  ADD COLUMN IF NOT EXISTS organization_or_title TEXT,
  ADD COLUMN IF NOT EXISTS application_note TEXT,
  ADD COLUMN IF NOT EXISTS review_note TEXT;

COMMENT ON COLUMN public.inspector_applications.organization_or_title IS
  'Başvuranın kurum veya unvan bilgisi.';
COMMENT ON COLUMN public.inspector_applications.application_note IS
  'Başvuranın kısa açıklama/notu.';
COMMENT ON COLUMN public.inspector_applications.review_note IS
  'Admin inceleme notu (onay veya red).';

CREATE UNIQUE INDEX IF NOT EXISTS inspector_applications_one_pending_per_user_idx
  ON public.inspector_applications (user_id)
  WHERE status = 'pending'::public.application_status;

-- Başvuran kendi kaydını (belge yolu hariç server-side seçimle) okuyabilir.
CREATE POLICY inspector_applications_select_own
  ON public.inspector_applications FOR SELECT
  USING (auth.uid() = user_id);

GRANT SELECT ON public.inspector_applications TO authenticated;
