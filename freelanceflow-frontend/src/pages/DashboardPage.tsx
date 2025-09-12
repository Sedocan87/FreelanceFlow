import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useClientStore from "@/store/clientStore";
import useProjectStore from "@/store/projectStore";
import useAuthStore from "@/store/authStore";

const DashboardPage = () => {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();

  const totalHoursLogged = projects.reduce((total, project) => {
    return total + project.tasks.reduce((sum, task) => sum + task.hours, 0);
  }, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && <p className="text-muted-foreground">Welcome back, {user.email}!</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursLogged}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Overview</h2>
        <p>This is your central hub. From here you can manage your clients, projects, and invoices using the navigation on the left.</p>
        <p className="mt-2">Phase 1 is now complete! You can now perform the core actions of the application.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
