Here's the updated **README** to include your Flask routes and authentication system endpoints:

---

## Task Manager Application

### Overview

The **Task Manager Application** provides an organized way to manage tasks and subtasks with user authentication. It supports task creation, updates, deletions, and displays due dates dynamically. The app features a **dashboard**, **subtask management**, and **authentication system** powered by **JWT tokens** to secure user interactions.

---

### Key Features

- **Authentication**:
  - Secure login, registration, and logout with JWT tokens.
  - Password reset functionality with email token validation.
  - Admin route to view all users and clean expired tokens.

- **Task Management**:
  - Create, update, delete, and complete tasks.
  - Subtasks supported under tasks for better organization.
  - Categorize tasks by **priority** (High, Medium, Low).
  - Due dates shown as time remaining (e.g., "2 days remaining" or "Overdue").

- **Dashboard**:
  - Visual task statistics, including completion rate.
  - Quick access to recent tasks and activities.
  - Real-time status updates with **color-coded checkboxes**.

- **Subtask Management**:
  - Create, update, and delete subtasks under specific tasks.
  - Toggle subtask completion statuses.

---

### Technology Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Flask REST API with JWT Authentication
- **Database**: SQLAlchemy ORM with PostgreSQL/MySQL (SQLite for development)

---

### Installation

#### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Task_Manager
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

4. **Run the backend server**:
   ```bash
   flask run
   ```

The backend will run at `http://127.0.0.1:5000`.

---

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

---

### API Endpoints

#### Authentication Routes

| Endpoint                                  | Method | Description                                |
|-------------------------------------------|--------|--------------------------------------------|
| `/auth/register`                          | POST   | Register a new user                        |
| `/auth/login`                             | POST   | Login and receive JWT token               |
| `/auth/logout`                            | POST   | Logout user (invalidate token)            |
| `/auth/profile`                           | GET    | Get the current user's profile            |
| `/auth/refresh`                           | POST   | Refresh the user's JWT token              |
| `/auth/reset-password`                    | POST   | Request a password reset token            |
| `/auth/reset-password/<token>`            | POST   | Reset password with a valid token         |
| `/auth/validate-reset-password/<token>`   | GET    | Validate password reset token             |
| `/auth/admin/users`                       | GET    | View all registered users (Admin)         |
| `/auth/admin/cleanup-tokens`              | DELETE | Clean expired tokens (Admin)              |

#### Task Management Routes

| Endpoint                                  | Method | Description                                |
|-------------------------------------------|--------|--------------------------------------------|
| `/tasks`                                  | GET    | Get all tasks for the logged-in user       |
| `/tasks/new-task`                         | POST   | Create a new task                          |
| `/tasks/<task_id>`                        | GET    | Retrieve a specific task                  |
| `/tasks/<task_id>`                        | PUT    | Update a specific task                    |
| `/tasks/<task_id>`                        | DELETE | Delete a specific task                    |
| `/tasks/categories`                       | GET    | Get all task categories                   |
| `/tasks/categories`                       | POST   | Create a new category                     |
| `/tasks/categories/<category_id>`         | GET    | Get a specific category                   |
| `/tasks/categories/<category_id>`         | PUT    | Update a category                         |
| `/tasks/categories/<category_id>`         | DELETE | Delete a category                         |
| `/tasks/<task_id>/subtasks`               | GET    | Get all subtasks for a task               |
| `/tasks/<task_id>/subtasks`               | POST   | Create a new subtask                      |
| `/tasks/<task_id>/subtasks/<subtask_id>`  | PUT    | Update a specific subtask                 |
| `/tasks/<task_id>/subtasks/<subtask_id>`  | DELETE | Delete a specific subtask                 |

---

### Usage Instructions

1. **User Registration and Login**:
   - Register as a new user or login with existing credentials.
   - JWT tokens will be issued upon successful login.

2. **Task Management**:
   - Use the **Add Task** button to create new tasks.
   - Tasks can be edited, deleted, and marked as completed.

3. **Subtask Management**:
   - Open a task and click **Subtasks** to manage subtasks.
   - Subtasks can be added, updated, or deleted within tasks.

4. **Dashboard**:
   - Monitor your task progress and view recent activities.
   - Use the search bar to filter tasks by title.

---

### Known Issues & Troubleshooting

- **Token Expiry**:
  Ensure that users refresh their JWT tokens before expiration.

- **Subtasks Not Updating**:
  Verify that subtasks are correctly linked to their parent tasks.

- **Checkbox Not Updating**:
  Confirm that the backend is processing `PUT` requests properly and returning a **200 OK** response.

---

### Future Enhancements

- **Role-Based Access Control**:
  Implement roles (admin, user) to manage feature access.

- **Push Notifications**:
  Add notifications for task reminders and overdue tasks.

- **Drag-and-Drop Functionality**:
  Introduce drag-and-drop task management to improve usability.

---

### Contributing

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit**:
   ```bash
   git commit -m "Add your commit message"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a pull request** to the main branch.

---

### License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

### Thank You

Thank you for using the Task Manager Application! If you encounter any issues, feel free to open an issue or contribute to the project.

---

This version of the **README** includes the authentication routes and provides a comprehensive overview of your project.