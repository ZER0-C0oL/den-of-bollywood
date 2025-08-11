import React from 'react';
import { FaceMashGameData } from '../../../types/gameTypes';
import { ActorState, FaceMashGameService } from './FaceMashGameService';
import { getActorHints } from '../../../data/actorsData';

interface FaceMashHintsProps {
  actorKey: 'actor1' | 'actor2';
  gameData: FaceMashGameData;
  actorState: ActorState;
}

const FaceMashHints: React.FC<FaceMashHintsProps> = ({
  actorKey,
  gameData,
  actorState
}) => {
  const actor = actorKey === 'actor1' ? gameData.actor1 : gameData.actor2;
  const hints = getActorHints(actor.actorId);
  const orderedHints = FaceMashGameService.getOrderedHints(hints);
  
  if (actorState.hintsRevealed === 0) return null;
  
  const isLeftActor = actorKey === 'actor1';
  
  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${isLeftActor ? 'text-left' : 'text-right'}`}>
      <ul className="space-y-1">
        {orderedHints.slice(0, actorState.hintsRevealed).map((hint, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium capitalize">{hint.type.replace('_', ' ')}:</span> {hint.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaceMashHints;
