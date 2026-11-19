export default function BlogLoading() {
  return (
    <div className="container-page pt-32 pb-16">
      <div className="h-3 w-24 animate-pulse rounded-full bg-line" />
      <div className="mt-5 h-10 w-2/3 animate-pulse rounded-xl bg-line" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-line/70" />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-line/70" />
        <div className="space-y-3">
          <div className="h-3 w-40 animate-pulse rounded-full bg-line/70" />
          <div className="h-8 w-4/5 animate-pulse rounded-xl bg-line/70" />
          <div className="h-4 w-full animate-pulse rounded-full bg-line/50" />
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-line/50" />
        </div>
      </div>

      <div className="mt-14 grid gap-x-6 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-line/70" />
            <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-line/70" />
            <div className="mt-3 h-5 w-4/5 animate-pulse rounded-full bg-line/70" />
            <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-line/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
