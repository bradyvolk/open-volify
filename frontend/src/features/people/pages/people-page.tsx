import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { PeopleFilters } from "../components/people-filters"
import { PeopleTable } from "../components/people-table"
import { fetchContacts, peopleKeys } from "../api"
import type { ContactFilters } from "../api"

export function PeoplePage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ContactFilters>({})

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: peopleKeys.list(filters),
    queryFn: () => fetchContacts(filters),
  })

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">People</h1>
            <p className="text-muted-foreground mt-2">
              Manage your contact directory
            </p>
          </div>
          <Button onClick={() => navigate("/platform/people/new")}>
            Add Person
          </Button>
        </div>

        <div className="mb-4">
          <PeopleFilters filters={filters} onChange={setFilters} />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading...
          </div>
        ) : (
          <PeopleTable contacts={contacts} />
        )}
      </div>
    </div>
  )
}
