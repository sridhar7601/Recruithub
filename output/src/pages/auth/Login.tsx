import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleMicrosoftLogin = () => {
    // In a real implementation, this would redirect to Microsoft SSO
    // For now, we'll just navigate to the drives page
    navigate('/drives');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with illustration */}
      <div className="hidden lg:block lg:w-3/5 bg-blue-50">
        {/* Placeholder for illustration */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-4/5 h-4/5 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-16 w-16 rounded-md ${
                      index % 3 === 0 ? 'bg-orange-400' : 'bg-blue-400'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-between p-8 md:p-12">
        <div className="w-full flex justify-end">
          {/* Presidio logo placeholder */}
          <div className="h-8 text-[#0088CE] font-bold">PRESIDIO®</div>
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
            className="w-full flex items-center justify-center bg-[#0078D4] text-white py-3 px-4 rounded hover:bg-[#006cbe] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Log in with Microsoft
          </button>
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