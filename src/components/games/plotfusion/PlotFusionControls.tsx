import React, { useState, useRef } from 'react';

interface PlotFusionControlsProps {
  gameCompleted: boolean;
  onSubmitGuess: (guess: string) => void;
  onShare: () => void;
  onReplay: () => void;
}

const PlotFusionControls: React.FC<PlotFusionControlsProps> = ({
  gameCompleted,
  onSubmitGuess,
  onShare,
  onReplay
}) => {
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !gameCompleted) {
      onSubmitGuess(guess.trim());
      setGuess('');
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  if (gameCompleted) {
    return (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16,6 12,2 8,6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        
        <button
          onClick={onReplay}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1,4 1,10 7,10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={handleInputChange}
          placeholder="Enter movie name..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!guess.trim() || gameCompleted}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      </form>
      
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>Click on a movie frame to target your guess, or we'll decide for you!</p>
      </div>
    </div>
  );
};

export default PlotFusionControls;
