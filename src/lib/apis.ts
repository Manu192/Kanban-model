import axios from 'axios';
import type { Task, NewTask, TaskUpdate } from '@/lib/types';

export const fetchTasks = (): Promise<Task[]> =>
  axios.get('/api/task').then((res) => res.data);

export const createTask = (task: NewTask): Promise<Task> =>
  axios.post('/api/task', task).then((res) => res.data);

export const updateTask = (id: string, updates: TaskUpdate): Promise<Task> =>
  axios.put(`/api/task/${id}`, updates).then((res) => res.data);

export const deleteTask = (id: string): Promise<{ message: string }> =>
  axios.delete(`/api/task/${id}`).then((res) => res.data);