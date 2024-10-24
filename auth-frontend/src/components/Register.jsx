import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&#]/.test(password),
    };
    setPasswordCriteria(criteria);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword); // Check if passwords match
  };

  const handleConfirmPasswordChange = (e) => {
    const confirm = e.target.value;
    setConfirmPassword(confirm);
    setPasswordsMatch(password === confirm); // Check if passwords match
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
  
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }
    if (!isPasswordValid) {
      setError('Please ensure the password meets all criteria');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/register', {
        username,
        email,
        password,
      });
  
      setMessage(response.data.msg); // Display success message
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after success
    } catch (err) {
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg); // Display backend error message
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };
  

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

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
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <ul className="mt-2 text-sm">
            <li className={passwordCriteria.length ? 'text-green-500' : 'text-red-500'}>
              At least 8 characters
            </li>
            <li className={passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}>
              At least one uppercase letter
            </li>
            <li className={passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}>
              At least one lowercase letter
            </li>
            <li className={passwordCriteria.number ? 'text-green-500' : 'text-red-500'}>
              At least one number
            </li>
            <li className={passwordCriteria.special ? 'text-green-500' : 'text-red-500'}>
              At least one special character (@, $, !, %, *, ?, &)
            </li>
          </ul>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-3 py-2 border rounded-md ${
              passwordsMatch ? '' : 'border-red-500'
            }`}
            required
          />
          {!passwordsMatch && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded transition ${
            isPasswordValid && passwordsMatch
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!isPasswordValid || !passwordsMatch}
        >
          Register
        </button>
      </form>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
