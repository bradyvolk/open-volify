export function Product() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand/15 via-transparent to-primary/10">
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              Coming soon
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-brand">Platform</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We're building a home for everything your organization needs to
              recruit, schedule, and support volunteers, all in one friendly
              place. This page will grow into a full tour of the platform as
              features ship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
