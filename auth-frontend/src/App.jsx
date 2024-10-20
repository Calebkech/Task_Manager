import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard'; // Import Dashboard

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the user is logged in (based on token)

  return token ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

function App() {
  return (
    <Router>
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
              <Dashboard /> {/* Dashboard is protected */}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
