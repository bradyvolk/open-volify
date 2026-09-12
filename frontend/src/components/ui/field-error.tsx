import { cn } from "@/lib/utils";

/**
 * Renders a form field's validation message. Always mount it beneath the field, passing the
 * message from `form.formState.errors.<field>?.message`, so the reserved space prevents layout shift.
 */
function FieldError({ message, className }: { message?: string; className?: string }) {
  return (
    <p
      data-slot="field-error"
      className={cn(
        "min-h-5 text-sm text-destructive transition-opacity",
        !message && "opacity-0",
        className,
      )}
    >
      {message}
    </p>
  );
}

export { FieldError };
