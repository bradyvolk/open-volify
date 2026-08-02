import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ContactForm } from "../components/contact-form"
import { fetchContact, updateContact, deleteContact, peopleKeys } from "../api"
import { authClient } from "@/lib/auth-client"
import type { UpdateContactInput } from "../api"

export function PeopleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = authClient.useSession()
  const canDelete =
    !!session?.user.role &&
    authClient.admin.checkRolePermission({
      role: session.user.role as "volunteer" | "staff" | "admin",
      permissions: { contact: ["delete"] },
    })

  const { data: contact, isLoading } = useQuery({
    queryKey: peopleKeys.detail(id!),
    queryFn: () => fetchContact(id!),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateContactInput) => updateContact(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.detail(id!) })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteContact(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all })
      navigate("/platform/people")
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Contact not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-muted-foreground mt-2 capitalize">{contact.role}</p>
          </div>
          {!isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              {canDelete && (
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          )}
        </div>

        {(updateMutation.isError || deleteMutation.isError) && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
            Something went wrong. Please try again.
          </div>
        )}

        {isEditing ? (
          <ContactForm
            defaultValues={contact}
            onSubmit={(data) => updateMutation.mutate(data)}
            onCancel={() => setIsEditing(false)}
            isSubmitting={updateMutation.isPending}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Field label="Email" value={contact.email} />
              <Field label="Phone" value={contact.phone} />
              <Field label="Pronouns" value={contact.pronouns} />
            </div>

            {(contact.addressLine1 || contact.city) && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Address
                </p>
                <div className="space-y-1 text-sm">
                  {contact.addressLine1 && <p>{contact.addressLine1}</p>}
                  {contact.addressLine2 && <p>{contact.addressLine2}</p>}
                  {(contact.city || contact.state || contact.postalCode) && (
                    <p>
                      {[contact.city, contact.state, contact.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {contact.country && <p>{contact.country}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm">{value || "—"}</p>
    </div>
  )
}
