export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">
        Analyzing your URL. This may take a moment...
      </p>
    </div>
  );
}
