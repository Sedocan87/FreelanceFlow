
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useClientStore from "@/store/clientStore";
import useProjectStore from "@/store/projectStore";
import useAuthStore from "@/store/authStore";
import useInvoiceStore from "@/store/invoiceStore";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopClients from "@/components/dashboard/TopClients";
import ProjectStatus from "@/components/dashboard/ProjectStatus";
import OutstandingInvoices from "@/components/dashboard/OutstandingInvoices";
import RecentActivity from "@/components/dashboard/RecentActivity";

const DashboardPage = () => {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { invoices } = useInvoiceStore();
  const { user } = useAuthStore();

  const totalHoursLogged = projects.reduce((total, project) => {
    return total + project.tasks.reduce((sum, task) => sum + task.hours, 0);
  }, 0);

  const totalRevenue = invoices.reduce((total, invoice) => {
    return total + invoice.totalAmount;
  }, 0);

  const completedProjects = projects.filter(
    project => project.tasks.length > 0 && 
    project.tasks.every(task => task.completed)
  ).length;

  const averageProjectValue = totalRevenue / (projects.length || 1);

  return (
    <div className="space-y-6 p-6">
      {user && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Across {invoices.length} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hours Logged</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHoursLogged}h</div>
                <p className="text-xs text-muted-foreground">
                  Across {projects.length} projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg. Project Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${averageProjectValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per project</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedProjects} completed projects
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RevenueChart />
            </div>
            <div className="col-span-3">
              <ProjectStatus />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <OutstandingInvoices />
            </div>
            <div className="col-span-3">
              <TopClients />
            </div>
          </div>

          <div className="col-span-7">
            <RecentActivity />
          </div>
        </>
      )}
    </div>
  );
    
}

export default DashboardPage;
