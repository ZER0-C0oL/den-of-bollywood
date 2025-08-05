import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameNavigation from './GameNavigation';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children, title, description }) => {
  // Set document title based on page
  useEffect(() => {
    const pageTitle = title ? `${title} - Den of Bollywood` : 'Den of Bollywood - Daily Bollywood Challenges';
    document.title = pageTitle;
  }, [title]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bollywood-darkBlue to-bollywood-lightBlue ">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 hover:text-blue-200 transition-colors duration-200">
              <img 
                src="/images/icons/dob-logo.png" 
                alt="Den of Bollywood Logo" 
                className="w-20 h-20 object-contain"
              />
              {!title && (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Den of Bollywood</h1>
                  <p className="text-white/80">Daily Bollywood Challenges</p>
                </div>
              )}
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-white/80">{description}</p>
            )}
          </div>
          <GameNavigation />
        </header>
        
        {/* Main Content */}
        <main className="bg-white rounded-lg shadow-xl p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="text-center text-white/60 mt-8">
          <p>&copy; 2025 Den of Bollywood. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default GameLayout;
