import React from 'react';
import { SelectedItem } from './ConnectionsGameService';

interface ConnectionsControlsProps {
  selectedItems: SelectedItem[];
  onClearSelection: () => void;
  onSubmit: () => void;
  onShuffle: () => void;
  disabled: boolean;
  gameCompleted?: boolean;
  onShare?: () => void;
  onReplay?: () => void;
}

const ConnectionsControls: React.FC<ConnectionsControlsProps> = ({
  selectedItems,
  onClearSelection,
  onSubmit,
  onShuffle,
  disabled,
  gameCompleted = false,
  onShare,
  onReplay
}) => {
  // Show share/replay buttons when game is completed
  if (gameCompleted && onShare) {
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
    <div className="flex items-center justify-between mt-6">
      {/* Empty div for spacing */}
      <div></div>
      
      {/* Clear Selection and Submit Controls - Center */}
      <div className="flex gap-4">
        <button
          onClick={onClearSelection}
          disabled={selectedItems.length === 0 || disabled}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
        >
          Clear Selection
        </button>
        <button
          onClick={onSubmit}
          disabled={selectedItems.length !== 4 || disabled}
          className="px-6 py-2 bg-bollywood-red text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
        >
          Submit ({selectedItems.length}/4)
        </button>
      </div>

      {/* Shuffle Button - Right */}
      <button
        onClick={onShuffle}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        title="Shuffle items"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        Shuffle
      </button>
    </div>
  );
};

export default ConnectionsControls;
