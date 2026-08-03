import { useNavigate } from "react-router";
import type { Contact } from "../api";

interface PeopleTableProps {
  contacts: Contact[];
}

export function PeopleTable({ contacts }: PeopleTableProps) {
  const navigate = useNavigate();

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">No contacts found.</div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Phone</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => navigate(`/platform/people/${contact.id}`)}
            >
              <td className="px-4 py-3 font-medium">
                {contact.firstName} {contact.lastName}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{contact.email ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{contact.phone ?? "—"}</td>
              <td className="px-4 py-3 capitalize">{contact.role}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(contact.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
