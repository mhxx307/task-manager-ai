import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Footer, Tabs, TaskInput, TaskList } from './components';
import { useState } from 'react';
import { prioritizeTasks } from './helpers/groq';

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Complete';
  deadline?: string; // Optional deadline
}

function Main() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const addTask = (title: string) => {
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title,
        priority: 'Medium',
        status: 'Active',
      },
    ]);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'Active' ? 'Complete' : 'Active',
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const clearTasks = () => {
    setTasks(tasks.filter((task) => task.status !== activeCategory));
  };

  const prioritizeTasksWithAI = async () => {
    const orderedTaskTitles = await prioritizeTasks(tasks);
    console.log('orderedTaskTitles: ', orderedTaskTitles);

    if (orderedTaskTitles.length > 0) {
      // Update tasks' priorities based on AI output
      const priorityLevels: Array<Task['priority']> = ['High', 'Medium', 'Low'];

      const updatedTasks = tasks.map((task) => {
        const position = orderedTaskTitles.findIndex(
          (title) => title.trim() === task.title.trim(),
        );

        // Assign new priority based on the position in AI result
        if (position !== -1) {
          const newPriority =
            priorityLevels[Math.min(position, priorityLevels.length - 1)];
          return { ...task, priority: newPriority };
        }

        return task; // No changes for tasks not in the AI result
      });

      setTasks(updatedTasks);
      console.log('Tasks reprioritized successfully:', updatedTasks);
    } else {
      console.error('Failed to prioritize tasks. Check your AI response.');
    }
  };

  const updateTaskPriority = (
    taskId: string,
    newPriority: Task['priority'],
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task,
      ),
    );
  };

  const filteredTasks =
    activeCategory === 'All'
      ? tasks
      : tasks.filter((task) => task.status === activeCategory);

  return (
    <div className="container mx-auto p-4">
      <TaskInput onAddTask={addTask} />
      <Tabs
        categories={['All', 'Active', 'Complete']}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <TaskList
        tasks={filteredTasks}
        onToggleTask={toggleTaskStatus}
        onDeleteTask={deleteTask}
        onUpdatePriority={updateTaskPriority}
      />
      <Footer
        onClearTasks={clearTasks}
        onPrioritizeTasks={prioritizeTasksWithAI}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

/*
response:

response Based on the urgency and importance, the task titles in descending order of priority are:

1. DOING HOMEWORK - Priority: Medium, Deadline: None, Status: Active
2. doing excercise - Priority: Medium, Deadline: None, Status: Active

Both tasks have the same priority (Medium) and deadline (None), but since they are both active, I would prioritize them equally.
*/
