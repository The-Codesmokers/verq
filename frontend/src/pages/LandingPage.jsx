import { Link } from 'react-router-dom';
import InterviewScene from '../assets/3d/InterviewScene';

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#09090B] relative">
      {/* 3D Scene Section - Full Width */}
      <div className="w-full h-screen absolute inset-0">
        <InterviewScene />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center pointer-events-auto">
          <h1 className="text-9xl font-black text-heading font-raleway leading-tight">
            Welcome to <span className="gradient-text">VerQ</span>
          </h1>
          <h2 className="text-4xl font-medium text-paragraph font-montserrat mt-4">
            your interview buddy!
          </h2>
          <Link 
            to="/interview"
            className="mt-14 inline-block bg-[#E9EAEA] text-[#09090B] font-montserrat font-bold py-4 px-8 rounded-full transition duration-300 hover:bg-opacity-90"
          >
            Let's Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 