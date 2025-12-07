import logoLarge from "@/assets/open-volify-logo-large.png";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={logoLarge} alt="OpenVolify" className="h-6 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            Open source volunteer management platform
          </p>
        </div>
      </div>
    </footer>
  );
}

