export default function PropertiesLoading() {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="container-page">
        <div className="h-3 w-40 animate-pulse rounded-full bg-line" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded-xl bg-line" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[276px_1fr] lg:gap-12">
          <div className="hidden space-y-3 lg:block">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-line/70" />
            ))}
          </div>
          <div className="grid gap-x-6 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/3] animate-pulse rounded-[1.35rem] bg-line/70" />
                <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-line/70" />
                <div className="mt-3 h-5 w-4/5 animate-pulse rounded-full bg-line/70" />
                <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-line/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
