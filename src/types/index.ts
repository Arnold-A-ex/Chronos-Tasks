type TaskCategory = 'personal' | 'workout' | 'work' | 'shopping' | 'other';

export interface TaskItem {
    id: string; // Unique identifier for the task
    text: string; // The main content/title of the task (formerly 'name')
    description?: string; // Optional longer description for the task detail page
    category: TaskCategory; // For assigning icons/styles and filtering
    createdAt: string; // ISO 8601 string for when the task was created (formerly 'date')
    dueDate?: string; // Optional ISO 8601 string for the task's due date (e.g., "YYYY-MM-DD")
    completed?: boolean; // Whether the task is completed or not
}