import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Task } from '@/lib/types';

let tasks: Task[] = [];

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const updates = await request.json();
  const { id } = context.params;

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  tasks[index] = { ...tasks[index], ...updates };
  return NextResponse.json(tasks[index]);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const deleted = tasks.splice(index, 1)[0];
  return NextResponse.json({ message: 'Deleted', task: deleted });
}
