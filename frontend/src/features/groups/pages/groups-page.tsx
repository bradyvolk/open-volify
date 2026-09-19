import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function GroupsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
            <p className="text-muted-foreground mt-2">
              Organize your contacts into departments, chapters, or teams
            </p>
          </div>
          <Button onClick={() => navigate("/platform/groups/new")}>Add Group</Button>
        </div>

        <div className="text-center py-12 text-muted-foreground text-sm">No groups yet.</div>
      </div>
    </div>
  );
}
