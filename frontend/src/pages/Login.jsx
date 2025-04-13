import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to landing page
      navigate('/landing');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Spline background */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/7Tb0aKWGPlARtmku/scene.splinecode" />
      </div>
      
      {/* Overlay to ensure form is visible */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="glass-card p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
          {error && (
            <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[63%] -translate-y-[37%] text-gray-400 hover:text-white transition-colors duration-200 bg-white/5 p-1 rounded-lg"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600/75 hover:bg-blue-700/75 text-white font-medium rounded-2xl transition duration-200"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(50px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </div>
  );
};

export default Login; 