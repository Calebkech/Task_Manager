{tasks.map((task) => (
  <li key={task.id} className="bg-gray-100 p-4 rounded mb-4">
    <div className="flex justify-between items-center">
      <span>{task.title}</span>
      <button
        onClick={() => {
          setSelectedTask(task); // Set the selected task
          fetchSubtasks(task.id); // Fetch subtasks for that task only
          setIsSubtaskModalOpen(true); // Open the subtask modal
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Manage Subtasks
      </button>
    </div>
    <SubtaskList
      subtasks={subtasks.filter((subtask) => subtask.task_id === task.id)} // Filter by task_id
      onEdit={(subtask) => {
        setSelectedSubtask(subtask);
        setIsSubtaskModalOpen(true);
      }}
      onDelete={async (subtaskId) => {
        await deleteSubtask(task.id, subtaskId);
        fetchSubtasks(task.id);
      }}
    />
  </li>
))}
