import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateSelect } from "@/components/ui/state-select";
import { CreateContactSchema } from "@shared/schemas/contact";
import type { z } from "zod";
import type { Contact, CreateContactInput } from "../api";

type ContactFormValues = z.input<typeof CreateContactSchema>;

interface ContactFormProps {
  defaultValues?: Partial<Contact>;
  onSubmit: (data: CreateContactInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({ defaultValues, onSubmit, onCancel, isSubmitting }: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(CreateContactSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      pronouns: defaultValues?.pronouns ?? "",
      role: (defaultValues?.role as "volunteer" | "staff" | "admin") ?? "volunteer",
      addressLine1: defaultValues?.addressLine1 ?? "",
      addressLine2: defaultValues?.addressLine2 ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      postalCode: defaultValues?.postalCode ?? "",
      country: defaultValues?.country ?? "",
    },
  });

  function handleSubmit(values: ContactFormValues) {
    onSubmit(values as CreateContactInput);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name *</Label>
          <Input id="firstName" {...form.register("firstName")} />
          <FieldError message={form.formState.errors.firstName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name *</Label>
          <Input id="lastName" {...form.register("lastName")} />
          <FieldError message={form.formState.errors.lastName?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...form.register("phone")} />
          <FieldError message={form.formState.errors.phone?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select
            value={form.watch("role")}
            onValueChange={(value) =>
              form.setValue("role", value as "volunteer" | "staff" | "admin", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronouns</Label>
          <Input id="pronouns" {...form.register("pronouns")} />
          <FieldError message={form.formState.errors.pronouns?.message} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Street address</Label>
          <Input id="addressLine1" {...form.register("addressLine1")} />
          <FieldError message={form.formState.errors.addressLine1?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Apt, suite, etc.</Label>
          <Input id="addressLine2" {...form.register("addressLine2")} />
          <FieldError message={form.formState.errors.addressLine2?.message} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register("city")} />
            <FieldError message={form.formState.errors.city?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <StateSelect
              id="state"
              value={form.watch("state") ?? ""}
              onValueChange={(value) => form.setValue("state", value, { shouldValidate: true })}
            />
            <FieldError message={form.formState.errors.state?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input id="postalCode" {...form.register("postalCode")} />
            <FieldError message={form.formState.errors.postalCode?.message} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...form.register("country")} />
          <FieldError message={form.formState.errors.country?.message} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
