import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import MyInterviews from '../pages/MyInterviews';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-interviews" element={<MyInterviews />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}; 