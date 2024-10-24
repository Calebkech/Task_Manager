import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        navigate('/login');
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <p className="text-sm text-red-500 text-center bg-red-100 p-2 rounded-md">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          User Profile
        </h1>

        {user ? (
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-medium text-gray-700">Username</h2>
              <p className="text-gray-600">{user.username}</p>
            </div>
            <div className="border-b pb-2">
              <h2 className="text-lg font-medium text-gray-700">Email</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="border-b pb-2">
              <h2 className="text-lg font-medium text-gray-700">Role</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
            <div className="border-b pb-2">
              <h2 className="text-lg font-medium text-gray-700">Join Date</h2>
              <p className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="border-b pb-2">
              <h2 className="text-lg font-medium text-gray-700">Total Tasks</h2>
              <p className="text-gray-600">{user.tasks_count}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Logout
            </button>
            <Link
              to="/request-reset"
              className="block text-center text-sm text-blue-500 hover:underline"
            >
              Change Password?
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
