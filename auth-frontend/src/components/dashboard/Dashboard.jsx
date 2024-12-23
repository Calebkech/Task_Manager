// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getTasks } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const calculateTimeRemaining = (dueDate) => {
    if (!dueDate) return 'No due date';

    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;

    if (diffMs <= 0) return 'Overdue';

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 60) return `${minutes} mins remaining`;
    if (hours < 24) return `${hours} hrs remaining`;
    if (days < 7) return `${days} days remaining`;
    return `${weeks} weeks remaining`;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length },
          { label: 'Completed Tasks', value: completedTasks },
          { label: 'Pending Tasks', value: pendingTasks },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-sm font-medium text-gray-600">{stat.label}</h2>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Task Completion</h2>
        <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
          <div
            className="bg-gray-800 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completionRate.toFixed(2)}% of tasks completed
        </p>
      </div>

      {/* Task Summary and Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Summary */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Summary</h3>
          <ul className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <li key={task.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <span
                    className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {task.title}
                  </span>
                  <span className="text-sm text-gray-500">{task.priority}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateTimeRemaining(task.due_date)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity with Checkbox Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
          <ul className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id} className="flex justify-between items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className={`h-5 w-5 ${
                    task.completed ? 'text-green-600' : 'text-yellow-600'
                  }`}
                  style={{
                    accentColor: task.completed ? 'green' : 'orange',
                  }}
                />
                <span className="text-gray-500 text-sm">{task.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/tasks')}
          className="w-full bg-gray-800 text-white py-3 rounded-lg shadow hover:bg-gray-900 transition"
        >
          View All Tasks
        </button>
        <button
          onClick={() => navigate('/tasks')}
          className="w-full bg-gray-700 text-white py-3 rounded-lg shadow hover:bg-gray-800 transition"
        >
          Add New Task
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
