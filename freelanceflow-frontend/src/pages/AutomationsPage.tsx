import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useClientStore from "@/store/clientStore";

const automationSchema = z.object({
  client: z.string().min(1, { message: "Please select a client." }),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format." }),
});

type Automation = z.infer<typeof automationSchema> & { id: string; enabled: boolean };

const AutomationsPage = () => {
  const { clients } = useClientStore();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [automations, setAutomations] = useState<Automation[]>([
    { id: "1", client: "Client A", frequency: "monthly", startDate: "2023-01-01", enabled: true },
    { id: "2", client: "Client B", frequency: "quarterly", startDate: "2023-03-15", enabled: false },
  ]);

  const form = useForm<z.infer<typeof automationSchema>>({
    resolver: zodResolver(automationSchema),
    defaultValues: { client: "", frequency: "monthly", startDate: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = (values: z.infer<typeof automationSchema>) => {
    const newAutomation: Automation = { ...values, id: String(automations.length + 1), enabled: true };
    setAutomations([...automations, newAutomation]);
    setIsFormDialogOpen(false);
    form.reset();
  };

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(auto => auto.id === id ? { ...auto, enabled: !auto.enabled } : auto));
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(auto => auto.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Automations</h1>
        <Button onClick={() => setIsFormDialogOpen(true)}>Create Automation</Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Automation</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Automation</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Active Automations</CardTitle>
          <CardDescription>Manage your recurring invoices and payment reminders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.length > 0 ? (
                automations.map((auto) => (
                  <TableRow key={auto.id}>
                    <TableCell>{clients.find(c => c.id === auto.client)?.name || auto.client}</TableCell>
                    <TableCell>{auto.frequency}</TableCell>
                    <TableCell>{auto.startDate}</TableCell>
                    <TableCell>
                      <Badge variant={auto.enabled ? "default" : "secondary"}>
                        {auto.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => toggleAutomation(auto.id)}>
                        {auto.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteAutomation(auto.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No automations created yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: This is a frontend simulation. Actual recurring invoice generation and sending requires backend implementation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationsPage;
