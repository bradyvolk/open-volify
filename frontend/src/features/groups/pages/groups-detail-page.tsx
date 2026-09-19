import { useNavigate, useParams } from "react-router";

export function GroupsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Group {id}</h1>
          <p className="text-muted-foreground mt-2">
            Group details are coming in a follow-up release.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/platform/groups")}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Back to Groups
        </button>
      </div>
    </div>
  );
}
