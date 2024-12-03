export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Complete';
}

interface TaskListProps {
  tasks: Task[]; // List of tasks to display
  onToggleTask: (taskId: string) => void; // Toggle between Active and Complete
  onDeleteTask: (taskId: string) => void; // Delete a task
  onUpdatePriority: (taskId: string, newPriority: Task['priority']) => void; // Update task priority
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdatePriority,
}) => {
  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handlePriorityChange = (
    taskId: string,
    currentPriority: Task['priority'],
  ) => {
    const priorities: Task['priority'][] = ['High', 'Medium', 'Low'];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextPriority = priorities[(currentIndex + 1) % priorities.length]; // Cycle to the next priority
    onUpdatePriority(taskId, nextPriority);
  };

  // Sort tasks by priority (High > Medium > Low)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder: Record<Task['priority'], number> = {
      High: 1,
      Medium: 2,
      Low: 3,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 && (
        <p className="text-gray-500">No tasks available.</p>
      )}
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded border ${
            task.priority === 'High'
              ? 'border-red-500'
              : task.priority === 'Medium'
                ? 'border-yellow-500'
                : 'border-green-500'
          } flex items-center justify-between`}
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={task.status === 'Complete'}
              onChange={() => onToggleTask(task.id)}
              className="cursor-pointer"
            />
            <span
              className={`${
                task.status === 'Complete' ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePriorityChange(task.id, task.priority)}
              className={`priority-label px-2 py-1 text-sm rounded ${getPriorityClass(
                task.priority,
              )} hover:opacity-80`}
            >
              {task.priority}
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
