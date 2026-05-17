import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContactForm } from "../components/contact-form"
import { createContact, peopleKeys } from "../api"
import type { CreateContactInput } from "../api"

export function PeopleNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: (contact) => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all })
      navigate(`/platform/people/${contact.id}`)
    },
  })

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add Person</h1>
          <p className="text-muted-foreground mt-2">
            Add a new contact to your directory
          </p>
        </div>

        {mutation.isError && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
            Failed to create contact. Please try again.
          </div>
        )}

        <ContactForm
          onSubmit={(data: CreateContactInput) => mutation.mutate(data)}
          onCancel={() => navigate("/platform/people")}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  )
}
