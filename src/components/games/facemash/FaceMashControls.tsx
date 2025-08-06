import React, { useState } from 'react';
import { getActorSuggestions } from '../../../data/actorsData';

interface FaceMashControlsProps {
  gameCompleted: boolean;
  onSubmitGuess: (guess: string) => void;
  onShare: () => void;
}

const FaceMashControls: React.FC<FaceMashControlsProps> = ({
  gameCompleted,
  onSubmitGuess,
  onShare
}) => {
  const [actorGuess, setActorGuess] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value: string) => {
    setActorGuess(value);
    const suggestions = getActorSuggestions(value);
    setActorSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
  };

  const selectActorSuggestion = (actorName: string) => {
    setActorGuess(actorName);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (!actorGuess.trim()) return;
    onSubmitGuess(actorGuess);
    setActorGuess('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (gameCompleted) {
    return (
      <div className="flex justify-center gap-4">
        <button
          onClick={onShare}
          className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500"
        >
          📤 Share Result
        </button>
      </div>
    );
  }

  return (
    <div className="relative mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={actorGuess}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Guess an actor's name..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bollywood-teal focus:border-transparent"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSubmit}
          disabled={!actorGuess.trim()}
          className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guess
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && actorSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-12 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {actorSuggestions.slice(0, 5).map((actor, index) => (
            <button
              key={index}
              onClick={() => selectActorSuggestion(actor.name)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              {actor.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaceMashControls;
