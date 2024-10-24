import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import TaskManager from './components/tasks/TaskManager';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';

import { NavigationProvider } from './contexts/NavigationContext'; // Import NavigationProvider

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <Router>
      <NavigationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-reset" element={<RequestReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;
