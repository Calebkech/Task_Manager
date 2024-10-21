import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.msg);
      } catch (err) {
        setError('Failed to load Profile. Please log in again.');
        navigate('/login'); // Redirect to login if unauthorized
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
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/login'); // Redirect to login
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto mt-20">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-lg">{message}</p>}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
