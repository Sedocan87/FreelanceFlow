import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import useProjectStore, { Project, Task } from '@/store/projectStore';
import TaskForm from './TaskForm';
import * as z from 'zod';

const formSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  hours: z.coerce.number().min(0, { message: "Hours must be a positive number." }),
});

interface TaskListProps {
  project: Project;
}

const TaskList = ({ project }: TaskListProps) => {
  const { addTask, updateTask, deleteTask } = useProjectStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenForm = (task: Task | null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingTask) {
      updateTask(project.id, { ...editingTask, ...values });
    } else {
      addTask(project.id, values);
    }
    handleCloseForm();
  };

  return (
    <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Tasks</h3>
        <Button size="sm" onClick={() => handleOpenForm(null)}>Add Task</Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add a new task'}</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleSubmit} initialData={editingTask || undefined} />
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] text-right">Hours</TableHead>
              <TableHead className="w-[160px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.tasks.length > 0 ? (
              project.tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell className="text-right">{task.hours}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenForm(task)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the task.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTask(project.id, task.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No tasks yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskList;
