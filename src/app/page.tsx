'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/lib/apis';
import TaskForm from '@/Components/Taskform';
import EditableTaskCard from '@/Components/Edittaskform';
import type { Task } from '@/lib/types';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const filterTasks = (status: Task['status']) =>
    tasks.filter((task) => task.status === status);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">TaskFlow Kanban Board</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg shadow"
        >
          + Create Task
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <TaskForm onClose={() => setIsFormOpen(false)}/>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load tasks.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <div key={status} className="bg-white rounded-lg shadow p-4 min-h-[300px]">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{status.replace('_', ' ')}</h2>
              <div className="space-y-4">
                {filterTasks(status as Task['status']).length === 0 ? (
                  <p className="text-sm text-gray-400">No tasks in this column.</p>
                ) : (
                  filterTasks(status as Task['status']).map((task) => (
                    <EditableTaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
