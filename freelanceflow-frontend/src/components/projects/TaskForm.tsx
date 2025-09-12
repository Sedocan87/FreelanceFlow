import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Task } from "@/store/projectStore";

import { formSchema } from "./task-form-schema";

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  initialData?: Task;
}

const TaskForm = ({ onSubmit, initialData }: TaskFormProps) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { description: "", hours: 0 } as TaskFormValues,
  });

  const _onSubmit = form.handleSubmit(onSubmit);

  return (
    <Form onSubmit={_onSubmit} className="space-y-4">
        <FormField<TaskFormValues>
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Implement user authentication" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<TaskFormValues>
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="8"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Task</Button>
    </Form>
  );
};

export default TaskForm;
