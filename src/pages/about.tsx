import { Code, Users, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/open-volify-icon-large.svg";

export function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <img
                src={logoIcon}
                alt="OpenVolify"
                className="h-12 w-12"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About <span className="text-brand">OpenVolify</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Empowering communities through open-source volunteer management
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              OpenVolify was created to make volunteer management accessible to
              organizations of all sizes. We believe that every community
              deserves powerful, flexible tools to coordinate volunteers and
              amplify their impact—without the barriers of expensive software or
              vendor lock-in.
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              As an open-source project, OpenVolify is built by the community, for
              the community. We're committed to transparency, security, and
              giving you full control over your data.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Open Source</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Free, transparent, and community-driven
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Privacy First</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your data stays yours, always
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Community</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built by volunteers, for volunteers
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Accessibility</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tools for everyone, everywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join the Movement
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Whether you're looking to manage volunteers or contribute to the
              project, we'd love to have you join our community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Contribute
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

