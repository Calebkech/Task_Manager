import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setLoading(true); // Disable button while processing

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.access_token); // Store token

      // Redirect to profile on successful login
      navigate('/profile');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          } transition`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center justify-between mt-4">
        <Link to="/request-reset" className="text-sm text-blue-500 hover:underline">
          Forgot Password?
        </Link>
        <Link to="/register" className="text-sm text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
