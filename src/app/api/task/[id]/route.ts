import { NextResponse } from 'next/server';
import { tasks } from '@/lib/store';
import type { Task } from '@/lib/types';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const index = tasks.findIndex((t) => t.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  tasks[index] = { ...tasks[index], ...updates };
  return NextResponse.json(tasks[index]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const index = tasks.findIndex((t) => t.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const deleted = tasks.splice(index, 1)[0];
  return NextResponse.json({ message: 'Deleted', task: deleted });
}
