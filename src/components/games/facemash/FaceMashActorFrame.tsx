import React from 'react';
import { FaceMashGameData } from '../../../types/gameTypes';
import { ActorState } from './FaceMashGameService';
import { getActorById } from '../../../data/actorsData';

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
  
  // Get actor details from centralized data to get gender
  const actorDetails = getActorById(actor.actorId);
  const gender = actorDetails?.gender.toLowerCase() || 'unknown';

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
          <div className="relative w-full h-full">
            <img 
              src={`/images/face-mash/unknown-${gender}.png`} 
              alt="Unknown actor"
              className="w-full h-full object-cover"
            />
            {/* Big question mark overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 flex items-center justify-center">
                <span className="text-white font-bold text-8xl select-none pointer-events-none user-select-none">?</span>
              </div>
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
