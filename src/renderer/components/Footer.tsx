interface FooterProps {
  onClearTasks: () => void; // Clear all tasks in the current category
  onPrioritizeTasks: () => void; // Trigger AI-based task prioritization
}

const Footer: React.FC<FooterProps> = ({ onClearTasks, onPrioritizeTasks }) => {
  return (
    <div className="mt-4 flex justify-between">
      <button
        onClick={onClearTasks}
        className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
      >
        Clear List
      </button>
      <button
        onClick={onPrioritizeTasks}
        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
      >
        Help Me Prioritize
      </button>
    </div>
  );
};

export default Footer;
