import React from 'react';
import { ConnectionsGroup } from '../../../types/gameTypes';
import { ConnectionsGameService } from './ConnectionsGameService';

interface SolvedGroupsProps {
  groups: ConnectionsGroup[];
  solvedGroups: string[];
  gameOver: boolean;
}

const SolvedGroups: React.FC<SolvedGroupsProps> = ({
  groups,
  solvedGroups,
  gameOver
}) => {
  const renderSolvedGroup = (group: ConnectionsGroup) => {
    const groupIndex = groups.findIndex(g => g.id === group.id);
    const styling = ConnectionsGameService.getGroupStyling(groupIndex);
    
    return (
      <div 
        key={group.id} 
        className="p-4 rounded-lg mb-4" 
        style={{ 
          backgroundColor: styling.backgroundColor,
          borderLeft: `4px solid ${styling.borderColor}`
        }}
      >
        <h3 className="font-bold text-gray-800 mb-2">{group.category}</h3>
        <div className="grid grid-cols-4 gap-2">
          {group.items.map((item, index) => (
            <div key={index} className="bg-white p-2 rounded text-center text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUnsolvedGroup = (group: ConnectionsGroup) => {
    return (
      <div key={group.id} className={`${group.color} p-4 rounded-lg mb-4 opacity-75`}>
        <h3 className="font-bold text-white text-lg mb-2">{group.category} (Not Found)</h3>
        <div className="grid grid-cols-4 gap-2">
          {group.items.map((item, index) => (
            <div key={index} className="bg-white/20 p-2 rounded text-white text-center font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      {/* Show solved groups first in order they were solved */}
      {groups
        .filter(group => solvedGroups.includes(group.id))
        .sort((a, b) => solvedGroups.indexOf(a.id) - solvedGroups.indexOf(b.id))
        .map(group => renderSolvedGroup(group))}
      
      {/* Show remaining groups if game is over */}
      {gameOver && groups
        .filter(group => !solvedGroups.includes(group.id))
        .map(group => renderUnsolvedGroup(group))}
    </div>
  );
};

export default SolvedGroups;
