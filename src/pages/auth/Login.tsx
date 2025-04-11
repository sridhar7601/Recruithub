import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import presidioLogo from '../../assets/presidio-logo.png';
import loginIllustration from '../../assets/login-right.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would redirect to Microsoft SSO
      // For now, we'll simulate a successful login and navigate to the drives page
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store auth token in localStorage (in a real app, this would come from the API)
      localStorage.setItem('authToken', 'cde7ac9e2f9b7950690b0b44c031309591de0ae033976d762c1b220c02b4614b');
      
      // Navigate to drives page
      navigate('/drives');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with illustration */}
      <div className="hidden lg:block lg:w-3/5">
        <img
          src={loginIllustration}
          alt="RecruitHub Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-between p-8 md:p-12">
        <div className="w-full flex justify-end">
          <img src={presidioLogo} alt="Presidio Logo" className="h-8" />
        </div>

        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-800 mb-2">Hey there! Welcome to</h1>
            <h1 className="text-4xl font-semibold text-[#0088CE]">RecruitHub</h1>
            <p className="mt-6 text-gray-600">
              Already a Presidio member? Login with SSO.
            </p>
          </div>

          <button
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#0078D4] text-white py-3 px-4 rounded hover:bg-[#006cbe] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            )}
            {loading ? 'Logging in...' : 'Log in with Microsoft'}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md w-full">
              {error}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center mt-auto">
          <p className="text-gray-500 text-sm mb-2">Do something great everyday!</p>
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Presidio, Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
