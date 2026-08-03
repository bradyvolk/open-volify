const API_BASE = process.env.NODE_ENV === "production" ? "" : "http://localhost:3006";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export type ContactRole = "volunteer" | "staff" | "admin";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  pronouns: string | null;
  role: ContactRole;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  pronouns?: string;
  role: ContactRole;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type UpdateContactInput = Partial<CreateContactInput>;

export type ContactFilters = { search?: string; role?: ContactRole };

export const peopleKeys = {
  all: ["people"] as const,
  list: (filters: ContactFilters) => ["people", "list", filters] as const,
  detail: (id: string) => ["people", "detail", id] as const,
};

export async function fetchContacts(filters: ContactFilters): Promise<Contact[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  return apiFetch<Contact[]>(`/api/people?${params}`);
}

export async function fetchContact(id: string): Promise<Contact> {
  return apiFetch<Contact>(`/api/people/${id}`);
}

export async function createContact(data: CreateContactInput): Promise<Contact> {
  return apiFetch<Contact>("/api/people", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateContact(id: string, data: UpdateContactInput): Promise<Contact> {
  return apiFetch<Contact>(`/api/people/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteContact(id: string): Promise<void> {
  await apiFetch<void>(`/api/people/${id}`, { method: "DELETE" });
}
