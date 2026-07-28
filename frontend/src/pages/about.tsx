import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import logoIcon from "@/assets/open-volify-icon-large.svg";

export function About() {
  return (
    <div className="min-h-screen bg-muted/10">
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <img src={logoIcon} alt="OpenVolify" className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About <span className="text-brand">OpenVolify</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Building communities through open-source volunteer management
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Goal
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              OpenVolify is being created to make volunteer management
              accessible to impact-focused organizations of all sizes. We
              believe, with the collective knowledge of the open-source
              community, we can build a great foundation for volunteer
              management software that is free and open.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join the Community
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              OpenVolify is early and under active development. If you'd like
              to help shape it, we'd love to have you contribute.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="text-base" asChild>
                <a
                  href="https://github.com/bradyvolk/open-volify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.gitHub className="size-4" />
                  Contribute
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
