import {
  ANSWER_STATUS_CONFIG,
  isAnswerStatusKey,
  isQuestionStatusKey,
  QUESTION_STATUS_CONFIG,
  type AnswerStatusKey,
  type BadgeTone,
  type QuestionStatusKey,
} from "@/lib/ui/status-config";

type StatusBadgeProps = {
  kind: "question" | "answer";
  status: string;
  className?: string;
};

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "status-badge--neutral",
  green: "status-badge--green",
  amber: "status-badge--amber",
  blue: "status-badge--blue",
  red: "status-badge--red",
};

function resolveConfig(kind: "question" | "answer", status: string) {
  if (kind === "question" && isQuestionStatusKey(status)) {
    return QUESTION_STATUS_CONFIG[status as QuestionStatusKey];
  }

  if (kind === "answer" && isAnswerStatusKey(status)) {
    return ANSWER_STATUS_CONFIG[status as AnswerStatusKey];
  }

  return { label: status, tone: "neutral" as const };
}

export function StatusBadge({ kind, status, className = "" }: StatusBadgeProps) {
  const config = resolveConfig(kind, status);

  return (
    <span
      className={`status-badge ${TONE_CLASS[config.tone]} ${className}`.trim()}
    >
      {config.label}
    </span>
  );
}
