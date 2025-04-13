import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import LandingPage from '../pages/LandingPage';
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}; 