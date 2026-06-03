export function PageSpinner() {
  return (
    <div className="grid place-items-center py-32">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
