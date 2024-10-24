// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getTasks } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Calculate statistics
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

  return (
    <div className="container mx-auto p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-medium mb-2">Total Tasks</h2>
          <p className="text-4xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-medium mb-2">Completed Tasks</h2>
          <p className="text-4xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-gray-700 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-medium mb-2">Pending Tasks</h2>
          <p className="text-4xl font-bold">{pendingTasks}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Completion</h2>
        <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="bg-gray-800 h-full rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Tasks and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <ul className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                {task.title}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <button
            onClick={() => navigate('/tasks')}
            className="w-full bg-gray-800 text-white py-3 rounded-lg shadow-md hover:bg-gray-900 transition mb-3"
          >
            View All Tasks
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="w-full bg-gray-700 text-white py-3 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
