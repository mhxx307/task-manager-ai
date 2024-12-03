import React from 'react';

interface TaskInputProps {
  onAddTask: (task: string) => void; // Callback to handle adding a task
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [task, setTask] = React.useState('');

  const handleAddTask = () => {
    if (task.trim()) {
      onAddTask(task.trim());
      setTask('');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task..."
        className="border border-gray-300 rounded px-3 py-2 flex-1"
      />
      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
};

export default TaskInput;
