import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Empower Your Community with{" "}
            <span className="text-primary">OpenVolify</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            The open-source volunteer management platform that makes it easy to
            organize, schedule, and engage volunteers for your cause.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" className="text-base">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
