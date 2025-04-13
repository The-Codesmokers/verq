import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ace Your Next Interview with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Get personalized interview questions based on your resume, practice with voice responses, and receive instant AI feedback to improve your interview skills.
          </p>
          <Link 
            to="/interview"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Start Mock Interview
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-gray-300">Paste your resume text and select your target role.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Practice with AI</h3>
            <p className="text-gray-300">Answer personalized questions using your voice.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Get Instant Feedback</h3>
            <p className="text-gray-300">Receive AI-powered analysis of your responses.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Interview Skills?</h2>
          <p className="text-gray-300 mb-6">Join thousands of professionals who have aced their interviews with VerQ.</p>
          <Link 
            to="/interview"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Start Now - It's Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 