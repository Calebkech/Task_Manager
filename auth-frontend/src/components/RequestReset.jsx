import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Disable button to avoid multiple clicks

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/reset-password', { email });
      setMessage(response.data.msg);
    } catch (err) {
      setError('Failed to send password reset link. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button after response
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center">Forgot Password?</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <button
          type="submit"
          disabled={isSubmitting} // Disable while submitting
          className={`w-full py-2 px-4 rounded transition ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="flex items-center justify-between mt-4">
        <Link to="/login" className="text-sm text-blue-500 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default RequestReset;
