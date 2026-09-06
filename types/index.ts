export type Member = {
  uid: string;
  name: string;
  email: string;
};

export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  members: Member[];
  createdAt: number;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  groupId: string | null;
  createdAt: number;
};

export type TaskStatus = 'open' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: string | null;
  createdBy: string;
  createdAt: number;
  dueDate: number | null;
};

export type ItemStatus = 'available' | 'borrowed';

export type Item = {
  id: string;
  name: string;
  category: string;
  ownerId: string;
  status: ItemStatus;
  borrowedBy: string | null;
  borrowedAt: number | null;
  createdAt: number;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  createdAt: number;
};
