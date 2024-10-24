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

  const handleTaskSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      fetchTasks();
      closeTaskModal(); // Close and clear the modal
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
      await fetchSubtasks(activeTaskId);
      closeSubtaskModal(); // Close and clear the modal
    } catch (error) {
      console.error('Error saving subtask:', error);
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

  const handleToggleTaskComplete = async (task) => {
    try {
      await updateTask(task.id, { ...task, completed: !task.completed });
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
      await fetchSubtasks(activeTaskId);
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null); // Clear task data from memory
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
    setSelectedSubtask(null); // Clear subtask data from memory
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>

      <ul className="mt-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-100 p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTaskComplete(task)}
                  className="mr-2"
                />
                <span
                  className={task.completed ? 'line-through text-gray-400' : ''}
                >
                  {task.title}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="bg-green-500 text-white text-sm px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => fetchSubtasks(task.id)}
                  className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600"
                >
                  Manage Subtasks
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete Task
                </button>
              </div>
            </div>

            {activeTaskId === task.id && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedSubtask(null);
                    setIsSubtaskModalOpen(true);
                  }}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mb-2"
                >
                  Add Subtask
                </button>
                <SubtaskList
                  subtasks={subtasks}
                  onEdit={(subtask) => {
                    setSelectedSubtask(subtask);
                    setIsSubtaskModalOpen(true);
                  }}
                  onDelete={async (subtaskId) => {
                    await deleteSubtask(task.id, subtaskId);
                    await fetchSubtasks(task.id);
                  }}
                  onToggleComplete={handleToggleSubtaskComplete}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
        initialData={selectedTask}
      />

      <SubtaskModal
        isOpen={isSubtaskModalOpen}
        onClose={closeSubtaskModal}
        onSubmit={handleSubtaskSubmit}
        initialData={selectedSubtask}
      />
    </div>
  );
};

export default TaskManager;
