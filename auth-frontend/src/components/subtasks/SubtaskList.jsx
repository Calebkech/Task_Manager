const SubtaskList = ({ subtasks, onEdit, onDelete, onToggleComplete }) => (
  <ul className="mt-4 space-y-2">
    {subtasks.map((subtask) => (
      <li key={subtask.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => onToggleComplete(subtask)}
            className="mr-2"
          />
          <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
            {subtask.title}
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(subtask)}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(subtask.id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default SubtaskList;
