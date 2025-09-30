export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
};

export type NewTask = Omit<Task, 'id'>;
export type TaskUpdate = Partial<Omit<Task, 'id'>>;
