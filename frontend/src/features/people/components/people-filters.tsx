import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ContactFilters, ContactRole } from "../api"

interface PeopleFiltersProps {
  filters: ContactFilters
  onChange: (filters: ContactFilters) => void
}

export function PeopleFilters({ filters, onChange }: PeopleFiltersProps) {
  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search by name..."
        value={filters.search ?? ""}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value || undefined })
        }
        className="max-w-xs"
      />
      <Select
        value={filters.role ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            role: value === "all" ? undefined : (value as ContactRole),
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="volunteer">Volunteer</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
