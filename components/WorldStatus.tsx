import React from 'react';
import type { WorldState } from '../types';
import { LocationIcon, TimeIcon } from './Icons';

interface WorldStatusProps {
  worldState: WorldState | null;
}

const WorldStatus: React.FC<WorldStatusProps> = ({ worldState }) => {
  if (!worldState) {
    return null;
  }

  return (
    <div className="bg-stone-dark/90 border-2 border-wood shadow-inset-strong rounded-lg p-5 text-off-white space-y-4 mb-6">
      <div className="flex items-center space-x-3">
        <LocationIcon className="w-6 h-6 text-gold flex-shrink-0" />
        <div>
          <h3 className="font-medieval text-xl text-gold">{worldState.location}</h3>
        </div>
      </div>
       <div className="flex items-center space-x-3">
        <TimeIcon className="w-6 h-6 text-gold flex-shrink-0" />
        <div>
          <h3 className="font-medieval text-xl text-gold">{worldState.time}</h3>
        </div>
      </div>
      <p className="text-off-white/80 italic">
        {worldState.description}
      </p>
    </div>
  );
};

export default WorldStatus;
