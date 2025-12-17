import { Users, Calendar, Shield } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureCardProps[] = [
  {
    icon: Users,
    title: "Easy Volunteer Management",
    description:
      "Streamline volunteer sign-ups, scheduling, and communication all in one place.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Create events, manage shifts, and let volunteers choose times that work for them.",
  },
  {
    icon: Shield,
    title: "Open Source & Secure",
    description:
      "Built with transparency and security in mind. Your data, your control.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage volunteers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, powerful tools designed for organizations of all sizes.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
