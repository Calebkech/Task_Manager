import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaCheckCircle, FaCalendarAlt, FaUsers } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header Section */}
      <header className="py-8 px-6 text-center">
        <div className="flex items-center justify-center space-x-4">
          <FaTasks className="text-6xl text-blue-400" />
          <h1 className="text-5xl font-extrabold tracking-wide">Task Manager</h1>
        </div>
        <p className="mt-4 text-lg text-gray-300">
          Organize, prioritize, and complete your tasks efficiently. Whether it’s personal or professional – stay ahead of your to-dos!
        </p>
      </header>

      {/* Features Section */}
      <section className="flex flex-col md:flex-row justify-around py-12 px-6 space-y-8 md:space-y-0">
        <FeatureCard
          icon={<FaCheckCircle className="text-green-400 text-4xl" />}
          title="Stay on Top of Tasks"
          description="Track the progress of your tasks, mark them as completed, and see your achievements grow."
        />
        <FeatureCard
          icon={<FaCalendarAlt className="text-yellow-400 text-4xl" />}
          title="Smart Scheduling"
          description="Set due dates and deadlines. Never miss an important task or milestone."
        />
        <FeatureCard
          icon={<FaUsers className="text-pink-400 text-4xl" />}
          title="Collaborate with Ease - (coming soon)"
          description="Work with teams seamlessly by assigning and tracking shared tasks."
        />
      </section>

      {/* Call-to-Action Section */}
      <div className="text-center py-12 px-6">
        <h2 className="text-3xl font-bold mb-4">Get Started Today!</h2>
        <p className="text-lg text-gray-300 mb-8">
          Join hundreds of others and take control of your productivity.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
          <Link
            to="/login"
            className="w-full md:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full md:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-lg shadow-md transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Task Manager. All Rights Reserved.
        </p>
        <p className="text-gray-500 mt-2">
          Built with love and code by calebkech.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm text-center space-y-4">
    <div className="flex justify-center">{icon}</div>
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default LandingPage;
