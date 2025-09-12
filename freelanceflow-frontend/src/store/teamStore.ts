import { create } from 'zustand';

export type Role = 'owner' | 'admin' | 'member';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: Role;
  projectIds: string[];
}

interface TeamState {
  members: TeamMember[];
  invites: { email: string; role: Role }[];
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => void;
  removeMember: (id: string) => void;
  assignToProject: (memberId: string, projectId: string) => void;
  removeFromProject: (memberId: string, projectId: string) => void;
  sendInvite: (email: string, role: Role) => void;
  removeInvite: (email: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  invites: [],

  addMember: (member) =>
    set((state) => ({
      members: [...state.members, { ...member, id: crypto.randomUUID() }],
    })),

  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
    })),

  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),

  assignToProject: (memberId, projectId) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              projectIds: [...new Set([...member.projectIds, projectId])],
            }
          : member
      ),
    })),

  removeFromProject: (memberId, projectId) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              projectIds: member.projectIds.filter((id) => id !== projectId),
            }
          : member
      ),
    })),

  sendInvite: (email, role) =>
    set((state) => ({
      invites: [...state.invites, { email, role }],
    })),

  removeInvite: (email) =>
    set((state) => ({
      invites: state.invites.filter((invite) => invite.email !== email),
    })),
}));
