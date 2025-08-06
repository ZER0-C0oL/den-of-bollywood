import React from 'react';
import { SelectedItem } from './ConnectionsGameService';

interface ConnectionsGridProps {
  shuffledItems: { item: string; groupId: string }[];
  selectedItems: SelectedItem[];
  onItemClick: (item: string, groupId: string) => void;
  disabled: boolean;
}

const ConnectionsGrid: React.FC<ConnectionsGridProps> = ({
  shuffledItems,
  selectedItems,
  onItemClick,
  disabled
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {shuffledItems.map(({ item, groupId }, index) => (
        <button
          key={`${groupId}-${item}-${index}`}
          onClick={() => onItemClick(item, groupId)}
          disabled={disabled}
          className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
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
