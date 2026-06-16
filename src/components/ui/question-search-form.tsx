type QuestionSearchFormProps = {
  defaultQuery?: string;
  categorySlug?: string;
  compact?: boolean;
  placeholder?: string;
  className?: string;
};

export function QuestionSearchForm({
  defaultQuery = "",
  categorySlug = "",
  compact = false,
  placeholder = "Başlık veya soru metninde ara…",
  className = "",
}: QuestionSearchFormProps) {
  return (
    <form
      action="/questions"
      method="get"
      className={`question-search ${compact ? "question-search--compact" : ""} ${className}`.trim()}
    >
      <label htmlFor="question-search-input" className="sr-only">
        Yayınlanan sorularda ara
      </label>
      {categorySlug ? (
        <input type="hidden" name="category" value={categorySlug} />
      ) : null}
      <input
        id="question-search-input"
        type="search"
        name="q"
        defaultValue={defaultQuery}
        minLength={2}
        maxLength={100}
        placeholder={placeholder}
        className="question-search__input"
      />
      <button type="submit" className="btn btn-primary question-search__button">
        Ara
      </button>
    </form>
  );
}
