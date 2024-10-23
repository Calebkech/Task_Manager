const TaskCard = ({ task }) => {
  return (
    <div className="bg-white shadow p-4 rounded-md flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div>
        <button className="text-green-500 hover:underline">Complete</button>
        <button className="text-red-500 hover:underline ml-4">Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
