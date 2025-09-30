import { NextResponse } from 'next/server';
import { tasks } from '@/lib/store';
import type { Task } from '@/lib/types';

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask: Task = {
    id: crypto.randomUUID(),
    ...body,
  };
  tasks.push(newTask);
  return NextResponse.json(newTask);
}
