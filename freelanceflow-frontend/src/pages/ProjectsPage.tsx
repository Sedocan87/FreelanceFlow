import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useProjectStore, { type Project } from "@/store/projectStore";
import ProjectForm, { formSchema } from "@/components/projects/ProjectForm";
import useClientStore from "@/store/clientStore";
import * as z from "zod";
import { ChevronRight } from "lucide-react";
import TaskList from "@/components/projects/TaskList";

const ProjectsPage = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const { clients } = useClientStore();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleOpenFormDialog = (project: Project | null) => {
    setEditingProject(project);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setEditingProject(null);
    setIsFormDialogOpen(false);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingProject) {
      updateProject({ ...editingProject, ...values, tasks: editingProject.tasks });
    } else {
      addProject({ ...values, createdAt: new Date(), createdBy: 'system', lastModifiedBy: 'system' });
    }
    handleCloseFormDialog();
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => handleOpenFormDialog(null)}>Create Project</Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Create a new project"}</DialogTitle>
          </DialogHeader>
          <ProjectForm onSubmit={handleSubmit} initialData={editingProject || undefined} />
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <Collapsible asChild key={project.id}>
                <>
                  <TableRow>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Toggle tasks</span>
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{getClientName(project.clientId)}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenFormDialog(project)}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project and all its tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <TaskList project={project} />
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectsPage;
