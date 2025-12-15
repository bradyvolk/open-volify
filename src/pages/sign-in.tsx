import logoIcon from "@/assets/open-volify-icon-large.svg";
import { SignInForm } from "@/components/auth/sign-in-form";

export function SignIn() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <img src={logoIcon} alt="OpenVolify" className="h-12 w-12" />
            </div>
            <SignInForm />
          </div>
        </div>
      </section>
    </div>
  );
}
