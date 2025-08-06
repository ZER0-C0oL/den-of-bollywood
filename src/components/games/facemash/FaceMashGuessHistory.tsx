import React from 'react';
import { FaceMashGameData } from '../../../types/gameTypes';
import { ActorState } from './FaceMashGameService';

interface FaceMashGuessHistoryProps {
  actorKey: 'actor1' | 'actor2';
  gameData: FaceMashGameData;
  actorState: ActorState;
}

const FaceMashGuessHistory: React.FC<FaceMashGuessHistoryProps> = ({
  actorKey,
  gameData,
  actorState
}) => {
  const actor = actorKey === 'actor1' ? gameData.actor1 : gameData.actor2;
  
  if (actorState.guesses.length === 0) return null;
  
  const isLeftActor = actorKey === 'actor1';
  
  return (
    <div className={'bg-gray-50 p-3 rounded-lg ' + (isLeftActor ? 'text-left' : 'text-right')}>
      <h5 className="font-medium text-gray-800 mb-2">
        Your Guesses:
      </h5>
      <div className="flex flex-wrap gap-1">
        {actorState.guesses.map((guess, index) => {
          const isCorrect = guess.toLowerCase() === actor.name.toLowerCase();
          return (
            <span 
              key={index}
              className={`px-2 py-1 rounded text-xs ${
                isCorrect 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {guess}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default FaceMashGuessHistory;
