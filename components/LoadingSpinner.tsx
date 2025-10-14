import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-wood rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="w-3 h-3 bg-wood rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-3 h-3 bg-wood rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        <span className="text-off-white/80 italic ml-2">O narrador pondera...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
