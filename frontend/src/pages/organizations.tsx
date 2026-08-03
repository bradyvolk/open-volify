import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Organizations() {
  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground mt-2">
              Collaborate with teams and manage organization settings
            </p>
          </div>
          <Button>Create Organization</Button>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Organization Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Sample Organization</h3>
            <p className="text-sm text-muted-foreground mb-4">5 members · 3 projects</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </Card>

          {/* Empty State Card */}
          <Card className="p-6 border-dashed">
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">No organizations yet</p>
              <Button variant="ghost" size="sm">
                + Add Organization
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
