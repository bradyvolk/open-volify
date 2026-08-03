import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Projects() {
  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your OpenVolify projects
            </p>
          </div>
          <Button>Create Project</Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Project Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Sample Project</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is a placeholder for your future projects
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>

          {/* Empty State Card */}
          <Card className="p-6 border-dashed">
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">No projects yet</p>
              <Button variant="ghost" size="sm">
                + Add Project
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
