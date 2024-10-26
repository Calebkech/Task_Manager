// src/components/tasks/TaskManager.jsx
import React, { useEffect, useState } from 'react';
import TaskModal from './TaskModal';
import SubtaskModal from '../subtasks/SubtaskModal';
import SubtaskList from '../subtasks/SubtaskList';
import {
  getTasks,
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  updateTask,
  createTask,
  deleteTask,
} from '../../services/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskModalKey, setTaskModalKey] = useState(0);
  const [subtaskModalKey, setSubtaskModalKey] = useState(0);

  // Fetch tasks when the component mounts
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

  const fetchSubtasks = async (taskId) => {
    try {
      const response = await getSubtasks(taskId);
      setSubtasks(response.data);
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error fetching subtasks:', error);
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

  const handleTaskSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      fetchTasks();
      closeTaskModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleSubtaskSubmit = async (subtaskData) => {
    try {
      if (selectedSubtask) {
        await updateSubtask(activeTaskId, selectedSubtask.id, subtaskData);
      } else {
        await createSubtask(activeTaskId, subtaskData);
      }
      fetchSubtasks(activeTaskId);
      closeSubtaskModal();
    } catch (error) {
      console.error('Error saving subtask:', error);
    }
  };

  const handleToggleTaskComplete = async (task) => {
    try {
      const updatedTask = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: !task.completed, // Toggle the completed status
        due_date: task.due_date ? task.due_date.split('T')[0] : null, // Ensure correct date format
      };
  
      await updateTask(task.id, updatedTask);
      fetchTasks(); // Refresh tasks after the update
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

  const handleToggleSubtaskComplete = async (subtask) => {
    try {
      await updateSubtask(activeTaskId, subtask.id, {
        ...subtask,
        completed: !subtask.completed,
      });
      fetchSubtasks(activeTaskId);
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask(activeTaskId, subtaskId);
      fetchSubtasks(activeTaskId);
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const openNewTaskModal = () => {
    setSelectedTask(null);
    setTaskModalKey((prevKey) => prevKey + 1);
    setIsTaskModalOpen(true);
  };

  const openNewSubtaskModal = () => {
    setSelectedSubtask(null);
    setSubtaskModalKey((prevKey) => prevKey + 1);
    setIsSubtaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
    setSelectedSubtask(null);
  };

  return (
    <div className="container mx-auto p-8 bg-white min-h-screen">
      <button
        onClick={openNewTaskModal}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition mb-4"
      >
        Add Task
      </button>

      <ul className="mt-6 space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTaskComplete(task)}
                  className="h-5 w-5 accent-gray-800"
                />
                <span
                  className={`${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  } text-lg`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-500">
                  {calculateTimeRemaining(task.due_date)}
                </span>
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => fetchSubtasks(task.id)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Subtasks
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {activeTaskId === task.id && (
              <div className="mt-4">
                <button
                  onClick={openNewSubtaskModal}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition mb-2"
                >
                  Add Subtask
                </button>
                <SubtaskList
                  subtasks={subtasks}
                  onEdit={(subtask) => {
                    setSelectedSubtask(subtask);
                    setIsSubtaskModalOpen(true);
                  }}
                  onDelete={handleDeleteSubtask}
                  onToggleComplete={handleToggleSubtaskComplete}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <TaskModal
        key={taskModalKey}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
        initialData={selectedTask}
      />

      <SubtaskModal
        key={subtaskModalKey}
        isOpen={isSubtaskModalOpen}
        onClose={closeSubtaskModal}
        onSubmit={handleSubtaskSubmit}
        initialData={selectedSubtask}
      />
    </div>
  );
};

export default TaskManager;
