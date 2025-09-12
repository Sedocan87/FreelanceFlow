import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTeamStore, type Role } from '@/store/teamStore';
import useProjectStore from '@/store/projectStore';
import useAuthStore from '@/store/authStore';

const inviteFormSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});

const TeamPage = () => {
  const { members, invites, sendInvite, removeInvite, updateMember, removeMember } = useTeamStore();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const onSubmit = (values: z.infer<typeof inviteFormSchema>) => {
    sendInvite(values.email, values.role as Role);
    setIsInviteDialogOpen(false);
    form.reset();
  };

  const handleRoleChange = (memberId: string, role: Role) => {
    updateMember(memberId, { role });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => console.log('Simulating view activity')}>View Activity</Button>
          <Button onClick={() => setIsInviteDialogOpen(true)}>Invite Member</Button>
        </div>
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="colleague@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Send Invite</Button>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value: Role) => handleRoleChange(member.id, value)}
                        disabled={member.role === 'owner'}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {member.projectIds
                        .map((id) => projects.find((p) => p.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== 'owner' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.email}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{invite.role}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeInvite(invite.email)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Actions only available to administrators.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => console.log('Simulating global role management')}>Manage Roles Globally</Button>
              <Button variant="outline" onClick={() => console.log('Simulating audit log view')}>View Audit Log</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
