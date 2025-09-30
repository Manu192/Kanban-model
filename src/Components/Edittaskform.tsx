'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '@/lib/apis'; 
import type { Task, TaskUpdate } from '@/lib/types';

export default function EditableTaskCard({ task }: { task: Task }) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    
    const [form, setForm] = useState<TaskUpdate>({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
    });

    const updateMutation = useMutation({
        mutationFn: () => updateTask(task.id, form),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsEditing(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTask(task.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title?.trim()) {
            alert('Title cannot be empty!');
            return;
        }
        updateMutation.mutate();
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
            deleteMutation.mutate();
        }
    };

    const isSubmitting = updateMutation.isPending || deleteMutation.isPending;
    
    const priorityColor = task.priority === 'HIGH' ? 'text-red-700' : 
                          task.priority === 'MEDIUM' ? 'text-yellow-700' : 'text-blue-700';

    return (
        <div 
            className={`bg-white border border-gray-100 rounded-xl p-4 shadow-md transition duration-200 
            ${isSubmitting ? 'opacity-50 pointer-events-none' : 'hover:shadow-lg'}`}
        >
            {isEditing ? (
            

                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-2">Edit Task</h3>
                    
                    {/* Title Input */}
                    <div>
                        <label htmlFor={`title-${task.id}`} className="block text-xs font-medium text-gray-900 mb-1">Title</label>
                        <input
                            id={`title-${task.id}`}
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-gray-900"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* Description Textarea */}
                    <div>
                        <label htmlFor={`desc-${task.id}`} className="block text-xs font-medium text-gray-900 mb-1">Description</label>
                        <textarea
                            id={`desc-${task.id}`}
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-gray-900"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* Status and Priority Selects */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Status */}
                        <div>
                            <label htmlFor={`status-${task.id}`} className="block text-xs font-medium text-gray-900 mb-1">Status</label>
                            <select
                                id={`status-${task.id}`}
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
                                className="w-full border border-gray-300 p-2 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                                disabled={isSubmitting}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        
                        {/* Priority */}
                        <div>
                            <label htmlFor={`priority-${task.id}`} className="block text-xs font-medium text-gray-900 mb-1">Priority</label>
                            <select
                                id={`priority-${task.id}`}
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                                className="w-full border border-gray-300 p-2 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                                disabled={isSubmitting}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2 border-t mt-4">
                        <button 
                            type="submit" 
                            className="text-sm px-3 py-1 rounded font-medium text-white bg-green-600 hover:bg-green-700 transition"
                            disabled={isSubmitting}
                        >
                            {updateMutation.isPending ? 'Saving...' : '✅ Save'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)} 
                            className="text-sm px-3 py-1 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                // --- READ-ONLY DISPLAY ---
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-900 pr-4">{task.title}</h3>
                        <div className={`text-xs font-semibold ${priorityColor}`}>
                            {task.priority}
                        </div>
                    </div>
                    
                    {task.description && <p className="text-sm text-gray-800 line-clamp-2">{task.description}</p>}
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2 border-t mt-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-sm text-red-600 hover:text-red-800 font-medium transition"
                        >
                            {deleteMutation.isPending ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}