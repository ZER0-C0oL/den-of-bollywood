import React, { useState, useRef, useEffect } from 'react';
import { searchMovies, SearchableMovieEntry } from '../../../data/moviesData';

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
  const [suggestions, setSuggestions] = useState<SearchableMovieEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !gameCompleted) {
      onSubmitGuess(guess.trim());
      setGuess('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuess(value);
    
    if (value.trim().length > 0) {
      const movieSuggestions = searchMovies(value, 8);
      setSuggestions(movieSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1); // Reset selection when input changes
  };

  const handleSuggestionClick = (movieName: string) => {
    setGuess(movieName);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e as any);
      }
      return;
    }

    const visibleSuggestions = suggestions.slice(0, 8);
    
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
          handleSuggestionClick(visibleSuggestions[selectedSuggestionIndex].name);
        } else {
          handleSubmit(e as any);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      
      default:
        break;
    }
  };

  const handleInputFocus = () => {
    if (guess.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
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
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Enter movie name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
            >
              {suggestions.map((movie, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    index === selectedSuggestionIndex 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => handleSuggestionClick(movie.name)}
                >
                  <div className="font-medium">{movie.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!guess.trim() || gameCompleted}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PlotFusionControls;
