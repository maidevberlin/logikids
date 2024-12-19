import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaceFrownIcon, 
  ArrowPathIcon, 
  HomeIcon 
} from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center p-8 rounded-2xl bg-gray-50 border-2 border-gray-200 max-w-md mx-auto">
        {/* Sad Face Icon */}
        <div className="mb-4">
          <FaceFrownIcon className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        
        {/* Error Message */}
        <p className="text-gray-600 text-lg mb-6 font-medium">{message}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 items-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-full text-lg font-medium hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg w-full justify-center"
            >
              <ArrowPathIcon className="h-6 w-6" />
              Try Again
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 text-white bg-purple-500 rounded-full text-lg font-medium hover:bg-purple-600 transform hover:scale-105 transition-all shadow-lg w-full justify-center"
          >
            <HomeIcon className="h-6 w-6" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 