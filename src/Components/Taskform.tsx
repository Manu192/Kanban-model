'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/lib/apis';

import type { NewTask, Task } from '@/lib/types'; 


const initialFormState: NewTask = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
};


type TaskFormProps = {
  onClose: () => void;
};

export default function TaskForm({ onClose }: TaskFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NewTask>(initialFormState);

  const mutation = useMutation<Task, Error, NewTask>({
    mutationFn: createTask,
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      setForm(initialFormState);
    
      onClose(); 
    },
    onError: (error) => {
        console.error("Task Creation Error:", error);
        alert(`Failed to create task: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) {
        alert("Task title is required!");
        return;
    }
    mutation.mutate(form);
  };

  const isSubmitting = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 bg-white rounded-xl shadow-2xl border border-gray-100"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-4">New Task Details</h2>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Status and Priority Grouping */}
      <fieldset className="grid grid-cols-2 gap-6 pt-2">
        <legend className="text-md font-semibold text-gray-800 mb-3 col-span-2 border-t pt-3">Assignment Details</legend>

        {/* Status Selector */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as NewTask['status'] })}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white appearance-none text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
            disabled={isSubmitting}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Selector */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as NewTask['priority'] })}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white appearance-none text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
            disabled={isSubmitting}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </fieldset>
        
      <div className="flex justify-end pt-4 space-x-3">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition duration-150"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition duration-200 ${
            isSubmitting
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-700 hover:bg-purple-800'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Task...' : '➕ Add Task'}
        </button>
      </div>
    </form>
  );
}