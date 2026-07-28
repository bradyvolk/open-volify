import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function Community() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand/15 via-transparent to-primary/10">
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              Coming soon
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-brand">Community</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              OpenVolify is built in the open, with the people who use it. A
              home for contributors and users alike, to ask questions, share
              ideas, and help shape where the project goes, is on its way.
            </p>
            <div className="mt-8">
              <Button size="lg" className="text-base" asChild>
                <a
                  href="https://github.com/bradyvolk/open-volify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.gitHub className="size-4" />
                  Join us on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
