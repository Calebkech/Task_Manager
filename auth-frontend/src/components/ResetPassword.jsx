import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Function to validate password requirements
const validatePassword = (password) => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from the URL
  const navigate = useNavigate(); // For redirection

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState(validatePassword(''));
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setRequirements(validatePassword(newPassword)); // Validate in real-time
  };

  const isPasswordMatch = password && password === confirmPassword; // Check if passwords match
  const isFormValid = Object.values(requirements).every(Boolean) && isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!isFormValid) {
      setError('Please meet all the requirements.');
      return;
    }

    setIsSubmitting(true); // Disable button after submission

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.msg);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login
    } catch (err) {
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false); // Re-enable button if submission fails
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-1">
          <p className={requirements.minLength ? 'text-green-500' : 'text-red-500'}>
            At least 8 characters
          </p>
          <p className={requirements.hasUppercase ? 'text-green-500' : 'text-red-500'}>
            At least one uppercase letter
          </p>
          <p className={requirements.hasLowercase ? 'text-green-500' : 'text-red-500'}>
            At least one lowercase letter
          </p>
          <p className={requirements.hasNumber ? 'text-green-500' : 'text-red-500'}>
            At least one number
          </p>
          <p className={requirements.hasSpecialChar ? 'text-green-500' : 'text-red-500'}>
            At least one special character (@, $, !, %, *, ?, &)
          </p>
          <p className={isPasswordMatch ? 'text-green-500' : 'text-red-500'}>
            Passwords match
          </p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting} // Disable until valid
          className={`w-full py-2 px-4 rounded transition ${
            isSubmitting || !isFormValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
