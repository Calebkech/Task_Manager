import TaskCard from './TaskCard';

const TaskList = ({ tasks }) => {
  return (
    <div className="grid gap-4 mt-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
