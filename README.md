## Task Manager Application

### Overview

This **Task Manager Application** is designed to help users manage their tasks efficiently. It allows users to create, update, delete, and mark tasks as complete, with support for **subtasks**. The system also tracks **due dates** and provides meaningful insights such as **progress summaries, task statistics, and recent activities**.

### Key Features

- **Task Management**:
  - Create, update, delete, and complete tasks.
  - Subtasks are supported under each task for better task breakdown.
  - Tasks can be categorized by **priority** (High, Medium, Low).
  - Due dates are shown as time remaining (e.g., "3 days remaining" or "Overdue").
  - Task completion tracked with **checkboxes** (green for completed, orange for pending).

- **Dashboard**:
  - Visual task statistics (Total Tasks, Completed Tasks, Pending Tasks).
  - **Progress bar** showing task completion rate.
  - Quick access to recent tasks and activities.
  - Real-time task status updates using checkboxes.

- **Subtask Support**:
  - Manage subtasks under specific tasks.
  - Toggle subtask completion status.
  - Add, edit, or delete subtasks directly from the task view.

### Technology Stack

- **Frontend**: React.js + TailwindCSS for styling
- **Backend**: Flask REST API
- **Database**: SQLAlchemy ORM with PostgreSQL/MySQL (or SQLite for development)

### Installation

#### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Linux/macOS
   venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend**:
   ```bash
   flask run
   ```

The API will be available at `http://127.0.0.1:5000`.

#### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://127.0.0.1:5173`.

### API Endpoints

| Endpoint                    | Method | Description                          |
|-----------------------------|--------|--------------------------------------|
| `/tasks`                    | GET    | Get all tasks for the logged-in user |
| `/tasks/<task_id>`          | PUT    | Update a specific task              |
| `/tasks/<task_id>`          | DELETE | Delete a specific task              |
| `/tasks/new-task`           | POST   | Create a new task                   |
| `/tasks/<task_id>/subtasks` | GET    | Get subtasks for a specific task    |
| `/tasks/<task_id>/subtasks` | POST   | Create a new subtask                |
| `/tasks/<task_id>/subtasks/<subtask_id>` | PUT | Update a specific subtask |
| `/tasks/<task_id>/subtasks/<subtask_id>` | DELETE | Delete a specific subtask |

### Usage

1. **Creating Tasks**:
   - Click the "Add Task" button to open the task modal.
   - Fill in the task details, including **title, description, priority, and due date**.
   - Save the task, and it will appear on the dashboard and task list.

2. **Managing Subtasks**:
   - From the task list, click **"Subtasks"** to manage subtasks.
   - You can add, edit, or delete subtasks.
   - Use checkboxes to mark subtasks as complete or pending.

3. **Task Completion**:
   - Use the checkbox next to each task to mark it as complete or incomplete.
   - Completed tasks are styled with **line-through text** and tracked with **green checkboxes**.

4. **Dashboard Overview**:
   - View task statistics and progress from the dashboard.
   - Recent activity shows tasks with status indicators (green or orange).

### Known Issues & Troubleshooting

- **Checkbox not updating task status**:
  Ensure the backend correctly handles `PUT` requests and returns a **200 OK** response for task updates.

- **Due date not saving correctly**:
  Confirm that the due date is passed correctly in **`YYYY-MM-DD`** format from the frontend to the backend.

- **Subtasks not appearing under tasks**:
  Ensure subtasks are fetched correctly using the `/tasks/<task_id>/subtasks` endpoint.

### Future Improvements

- **User Authentication**: 
  Add user login and registration functionality to personalize task management.
- **Notifications**:
  Integrate notifications or reminders for tasks nearing their due dates.
- **Drag-and-Drop Tasks**:
  Enhance task management by allowing drag-and-drop functionality for task prioritization.

### Contributing

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit**:
   ```bash
   git commit -m "Add your commit message here"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a pull request** to the main branch.

### License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

### Thank You

Thank you for using the Task Manager Application! If you encounter any issues, feel free to open an issue or contribute to the project.