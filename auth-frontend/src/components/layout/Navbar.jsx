// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/dashboard"
          className="text-white text-2xl font-extrabold hover:text-gray-300 transition"
        >
          Dashboard
        </Link>

        <div className="space-x-6 flex items-center">
          <Link
            to="/tasks"
            className="text-white text-lg hover:text-gray-300 transition"
          >
            Tasks
          </Link>
          <Link
            to="/profile"
            className="text-white text-lg hover:text-gray-300 transition"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
