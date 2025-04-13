import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const { darkMode, toggleTheme } = useTheme();
  const profileDropdownRef = useRef(null);
  
  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport('mobile');
      } else if (width < 1024) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (profileOpen) setProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  // Profile dropdown component
  const ProfileDropdown = () => (
    <div className={`absolute right-0 top-full mt-2 p-5 rounded-xl shadow-lg backdrop-blur-md border border-gray-200 dark:border-gray-700 w-[260px] ${profileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            JD
          </div>
          <div>
            <h3 className="font-montserrat font-semibold text-lg">John Doe</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            Profile Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            My Interviews
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile menu component
  const MobileMenu = () => (
    <div className={`absolute top-[70px] right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <ul className="flex flex-col space-y-3 font-montserrat font-semibold text-sm">
        <li>
          <Link 
            to="/" 
            className={`block px-4 py-2 rounded-full ${
              isActive('/') 
                ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-gray-100' 
                : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard" 
            className={`block px-4 py-2 rounded-full ${
              isActive('/dashboard') 
                ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-gray-100' 
                : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/interview" 
            className={`block px-4 py-2 rounded-full ${
              isActive('/interview') 
                ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-gray-100' 
                : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Take Interview
          </Link>
        </li>
        <li>
          <button 
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-start px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
            <span className="ml-2">
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </span>
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full mt-4">
      <nav className={`flex items-center px-4 h-[60px] relative
        ${viewport !== 'desktop'
          ? 'w-[95vw] bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full shadow-sm border border-gray-200 dark:border-gray-700 justify-between' 
          : 'w-[70vw] bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full shadow-sm border border-gray-200 dark:border-gray-700 justify-between'
        }`}>
        {/* Left section - Logo */}
        <div className="flex flex-col justify-center">
          <Link to="/" className="group">
            <h1 className="font-zen font-bold text-2xl text-gray-900 dark:text-gray-100 group-hover:text-pink-500 dark:group-hover:text-pink-400">VerQ</h1>
          </Link>
        </div>
        
        {/* Middle section - Navigation pills - Centered with absolute positioning */}
        {viewport !== 'mobile' && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full shadow-sm inline-flex items-center border border-gray-300 dark:border-gray-700 p-0.5">
              <ul className="flex font-chakra font-semibold text-sm items-center">
                <li className="flex items-center">
                  <Link 
                    to="/" 
                    className={`inline-block px-4 py-2 rounded-full ${
                      isActive('/') 
                        ? 'bg-white dark:bg-black text-gray-900 dark:text-heading backdrop-blur-md' 
                        : 'text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link 
                    to="/dashboard" 
                    className={`inline-block px-4 py-2 rounded-full ${
                      isActive('/dashboard') 
                        ? 'bg-white dark:bg-black text-gray-900 dark:text-heading backdrop-blur-sm' 
                        : 'text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link 
                    to="/interview" 
                    className={`inline-block px-4 py-2 rounded-full ${
                      isActive('/interview') 
                        ? 'bg-white dark:bg-black text-gray-900 dark:text-heading backdrop-blur-sm' 
                        : 'text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    Interview
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Right section - Profile dropdown and theme toggle on larger screens, Menu button on mobile */}
        <div className="flex items-center gap-2">
          
          
          {viewport === 'mobile' ? (
            <>
              <button 
                onClick={toggleMenu}
                className="px-3 py-2 text-gray-900 dark:text-gray-100 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
              <MobileMenu />
            </>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={toggleProfile}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90"
              >
                JD
              </button>
              <ProfileDropdown />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar; 