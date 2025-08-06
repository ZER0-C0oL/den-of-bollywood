import React, { useState } from 'react';
import { getActorSuggestions } from '../../../data/actorsData';

interface FaceMashControlsProps {
  gameCompleted: boolean;
  onSubmitGuess: (guess: string) => void;
  onShare: () => void;
  onReplay?: () => void;
}

const FaceMashControls: React.FC<FaceMashControlsProps> = ({
  gameCompleted,
  onSubmitGuess,
  onShare,
  onReplay
}) => {
  const [actorGuess, setActorGuess] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleInputChange = (value: string) => {
    setActorGuess(value);
    const suggestions = getActorSuggestions(value);
    setActorSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
    setSelectedSuggestionIndex(-1); // Reset selection when input changes
  };

  const selectActorSuggestion = (actorName: string) => {
    setActorGuess(actorName);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleSubmit = () => {
    if (!actorGuess.trim()) return;
    onSubmitGuess(actorGuess);
    setActorGuess('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || actorSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    const visibleSuggestions = actorSuggestions.slice(0, 5);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < visibleSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : visibleSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < visibleSuggestions.length) {
          selectActorSuggestion(visibleSuggestions[selectedSuggestionIndex].name);
        } else {
          handleSubmit();
        }
        break;
      
      default:
        break;
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
        {onReplay && (
          <button
            onClick={onReplay}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            ↺ Replay
          </button>
        )}
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
          onKeyDown={handleKeyDown}
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
              className={`w-full p-3 text-left border-b border-gray-100 last:border-b-0 ${
                index === selectedSuggestionIndex 
                  ? 'bg-bollywood-teal text-white' 
                  : 'hover:bg-gray-50'
              }`}
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
