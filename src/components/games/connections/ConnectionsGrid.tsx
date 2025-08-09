import React, { useState, useEffect, useRef } from 'react';
import { SelectedItem } from './ConnectionsGameService';

interface ConnectionsGridProps {
  shuffledItems: { item: string; groupId: string }[];
  selectedItems: SelectedItem[];
  onItemClick: (item: string, groupId: string) => void;
  disabled: boolean;
  onFocusSubmit?: () => void; // Callback to focus submit button when Tab is pressed with 4 selected
}

const ConnectionsGrid: React.FC<ConnectionsGridProps> = ({
  shuffledItems,
  selectedItems,
  onItemClick,
  disabled,
  onFocusSubmit
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus the currently focused cell
  useEffect(() => {
    if (cellRefs.current[focusedIndex] && !disabled) {
      cellRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, disabled]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (disabled) return;

    const gridCols = 4;
    const totalItems = shuffledItems.length;
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (row > 0) {
          const newIndex = index - gridCols;
          setFocusedIndex(newIndex);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (row < Math.floor((totalItems - 1) / gridCols)) {
          const newIndex = Math.min(index + gridCols, totalItems - 1);
          setFocusedIndex(newIndex);
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (col > 0) {
          setFocusedIndex(index - 1);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (col < gridCols - 1 && index < totalItems - 1) {
          setFocusedIndex(index + 1);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        const { item, groupId } = shuffledItems[index];
        onItemClick(item, groupId);
        break;

      case 'Tab':
        // If 4 items are selected and user presses Tab, move focus to submit button
        if (selectedItems.length === 4 && onFocusSubmit) {
          event.preventDefault();
          onFocusSubmit();
        }
        break;

      default:
        break;
    }
  };

  const handleClick = (item: string, groupId: string, index: number) => {
    setFocusedIndex(index);
    onItemClick(item, groupId);
  };

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-4 gap-3"
      role="grid"
      aria-label="Connections game grid"
    >
      {shuffledItems.map(({ item, groupId }, index) => (
        <button
          key={`${groupId}-${item}-${index}`}
          ref={(el) => { cellRefs.current[index] = el; }}
          onClick={() => handleClick(item, groupId, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          tabIndex={index === focusedIndex ? 0 : -1}
          role="gridcell"
          aria-selected={selectedItems.some(selected => selected.item === item)}
          aria-label={`${item}${selectedItems.some(selected => selected.item === item) ? ', selected' : ''}`}
          className={`p-3 rounded-lg border-2 transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-bollywood-teal focus:ring-offset-2 ${
            selectedItems.some(selected => selected.item === item)
              ? 'bg-bollywood-teal border-gray-500 text-white'
              : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ConnectionsGrid;
