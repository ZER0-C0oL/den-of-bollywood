import React from 'react';
import GameNavigation from './GameNavigation';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bollywood-orange to-bollywood-red">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
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
