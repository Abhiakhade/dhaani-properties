import React from "react";
import { FaWrench, FaHome } from "react-icons/fa";

const Rent = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-2xl shadow-2xl border-t-8 border-blue-600 
                      transform transition duration-500 hover:scale-[1.03] hover:shadow-3xl 
                      opacity-0 animate-fadeIn"> 
            
            {/* Animated Icon Section */}
            <div className="flex justify-center items-center text-7xl text-blue-600 mb-8 space-x-4">
                {/* Home Icon: Subtle bounce for attention */}
                <FaHome 
                  className="animate-bounce-slow" 
                  style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} 
                /> 
                
                {/* Wrench Icon: Continuous spin to signify work */}
                <FaWrench 
                  className="text-gray-500 transform animate-spin-slow" 
                  style={{ animationDuration: '5s', animationIterationCount: 'infinite' }}
                />
            </div>

            {/* Title and Message */}
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                **Coming Soon!**
            </h1>

            <p className="text-xl text-gray-600 mb-10 border-b pb-4">
                Our **Rental Listings** page is currently under development. We're building the best platform to find your dream rental home!
            </p>

            {/* Animated Call to Action */}
            <a 
                href="/" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg shadow-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 animate-pulse-once"
            >
                <span className="mr-2">🏠</span> Go Back to Home
            </a>

            {/* Footer Note */}
            <p className="mt-8 text-sm text-gray-400">
                Thank you for your patience. Error Code: 404
            </p>

        </div>
    </div>
  );
};

export default Rent;