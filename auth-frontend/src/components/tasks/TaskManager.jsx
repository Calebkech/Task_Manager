import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTasks, FaSearch, FaClipboardCheck } from 'react-icons/fa';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        ...task,
        completed: !task.completed,
        due_date: task.due_date ? task.due_date.split('T')[0] : null,
      };
      await updateTask(task.id, updatedTask);
      fetchTasks();
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
      <div className="flex items-center space-x-4 mb-6">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={openNewTaskModal}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FaPlus className="inline-block mr-2" /> Add Task
        </button>
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTaskComplete(task)}
                  className={`h-5 w-5 ${
                    task.completed ? 'text-green-500' : 'text-yellow-500'
                  }`}
                />
                <span
                  className={`${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  } text-lg`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {task.due_date || 'No due date'}
                </span>
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => fetchSubtasks(task.id)}
                  className="text-green-500 hover:text-green-600"
                >
                  <FaTasks />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {activeTaskId === task.id && (
              <div className="mt-4">
                <button
                  onClick={openNewSubtaskModal}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition mb-2"
                >
                  <FaPlus className="inline-block mr-2" /> Add Subtask
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
