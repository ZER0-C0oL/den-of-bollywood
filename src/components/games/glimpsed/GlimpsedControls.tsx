import React, { useState, useEffect, useRef } from 'react';
import { bollywoodMovies } from '../../../data/moviesData';

interface GlimpsedControlsProps {
  onGuess: (guess: string) => void;
  gameCompleted: boolean;
  onShare?: () => void;
  onReplay?: () => void;
}

const GlimpsedControls: React.FC<GlimpsedControlsProps> = ({
  onGuess,
  gameCompleted,
  onShare,
  onReplay
}) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentGuess.length >= 2) {
      const filtered = bollywoodMovies
        .filter(movie =>
          movie.name.toLowerCase().includes(currentGuess.toLowerCase()) ||
          movie.aliases?.some(alias =>
            alias.toLowerCase().includes(currentGuess.toLowerCase())
          )
        )
        .map(movie => movie.name)
    .slice(0, 50); // Keep a reasonable total limit but allow scrolling for more suggestions

      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [currentGuess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim() && !gameCompleted) {
      onGuess(currentGuess.trim());
      setCurrentGuess('');
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentGuess(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Auto-submit the suggestion
    if (!gameCompleted) {
      onGuess(suggestion);
      setCurrentGuess('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const hasSuggestions = filteredSuggestions.length > 0;

  // Show share/replay buttons when game is completed
  if (gameCompleted && onShare) {
    return (
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={onShare}
          className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
        >
          📤 Share Result
        </button>
        {onReplay && (
          <button
            onClick={onReplay}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ↺ Replay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="relative">
  <div className="max-w-lg mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your movie guess..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-bollywood-red focus:outline-none text-lg"
              disabled={gameCompleted}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!currentGuess.trim() || gameCompleted}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-bollywood-red text-white px-4 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Guess
            </button>

            {/* Suggestions Dropdown (moved inside input wrapper so it aligns to input width)
                Animated drop: container animates max-height while children stagger opacity/translateY
            */}
            { /* compute dynamic sizes so the dropdown reveals one suggestion at a time */ }
            {
              (() => {
                const suggestionHeight = 56; // px per suggestion (approx from py-3 + text)
                // Show max 5 suggestions at once; allow scrolling for the rest
                const visibleCount = Math.min(filteredSuggestions.length, 5);
                const openMaxHeight = `${visibleCount * suggestionHeight}px`;
                const closedMaxHeight = '0px';
                const transitionDuration = Math.max(240, filteredSuggestions.length * 120); // ms, longer for more items

                const containerStyle: React.CSSProperties = {
                  maxHeight: showSuggestions && hasSuggestions ? openMaxHeight : closedMaxHeight,
                  transition: `max-height ${transitionDuration}ms ease`,
                };

                return (
                  <div
                    style={containerStyle}
                    className={`absolute top-full left-0 w-full bg-white rounded-lg shadow-lg z-10 overflow-hidden mt-2`}
                  >
                    <div className="overflow-y-auto" style={{ maxHeight: openMaxHeight }}>
                      {filteredSuggestions.map((suggestion, index) => {
                        const itemDelay = `${index * 80}ms`;
                        const itemStyle: React.CSSProperties = {
                          transition: 'opacity 220ms ease, transform 220ms ease',
                          transitionDelay: showSuggestions ? itemDelay : '0ms',
                          opacity: showSuggestions ? 1 : 0,
                          transform: showSuggestions ? 'translateY(0)' : 'translateY(-6px)',
                        };

                        return (
                          <div
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={itemStyle}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                              index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className="font-medium text-gray-800">{suggestion}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            }
          </div>
        </div>
      </form>
    </div>
  );
};

export default GlimpsedControls;
