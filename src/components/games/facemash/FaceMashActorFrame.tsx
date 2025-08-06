import React from 'react';
import { FaceMashGameData } from '../../../types/gameTypes';
import { ActorState } from './FaceMashGameService';

interface FaceMashActorFrameProps {
  actorKey: 'actor1' | 'actor2';
  gameData: FaceMashGameData;
  actorState: ActorState;
  isSelected: boolean;
  showAnswers: boolean;
  onFrameClick: (target: 'actor1' | 'actor2') => void;
}

const FaceMashActorFrame: React.FC<FaceMashActorFrameProps> = ({
  actorKey,
  gameData,
  actorState,
  isSelected,
  showAnswers,
  onFrameClick
}) => {
  const actor = actorKey === 'actor1' ? gameData.actor1 : gameData.actor2;

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      }`}
      onClick={() => onFrameClick(actorKey)}
    >
      <div className="w-48 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
        {actorState.found || showAnswers ? (
          <img 
            src={actor.image} 
            alt={actor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 relative">
            <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <div className="absolute bottom-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">?</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Actor name (shown when found or game completed) */}
      {(actorState.found || showAnswers) && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-center">
          <p className="font-semibold">{actor.name}</p>
        </div>
      )}
      
      {/* Target indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          ✓
        </div>
      )}
    </div>
  );
};

export default FaceMashActorFrame;
