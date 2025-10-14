import React from 'react';
import type { Character } from '../types';
import { HealthIcon, StrengthIcon, DexterityIcon, IntelligenceIcon } from './Icons';

interface CharacterSheetProps {
  character: Character | null;
  onResetGame: () => void;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-stone-dark/50 p-3 rounded-lg">
    <div className="text-gold">{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm text-off-white/70 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-off-white">{value}</span>
    </div>
  </div>
);

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onResetGame }) => {
  if (!character) {
    return null;
  }

  return (
    <div className="bg-stone-dark/90 border-2 border-wood shadow-inset-strong rounded-lg p-5 text-off-white space-y-4">
      <h2 className="text-2xl font-medieval text-center text-gold border-b-2 border-wood/50 pb-2 mb-4">
        {character.name}
      </h2>
      <p className="text-center text-off-white/80 italic text-lg -mt-2 mb-4">
        {character.race} {character.class}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <StatDisplay
          icon={<HealthIcon className="w-6 h-6" />}
          label="Vida"
          value={`${character.stats.health} / ${character.stats.maxHealth}`}
        />
        <StatDisplay
          icon={<StrengthIcon className="w-6 h-6" />}
          label="Força"
          value={character.stats.strength}
        />
        <StatDisplay
          icon={<DexterityIcon className="w-6 h-6" />}
          label="Destreza"
          value={character.stats.dexterity}
        />
        <StatDisplay
          icon={<IntelligenceIcon className="w-6 h-6" />}
          label="Inteligência"
          value={character.stats.intelligence}
        />
      </div>

      <div>
        <h3 className="text-lg font-medieval text-gold mb-2">Inventário</h3>
        <div className="bg-stone-dark/50 p-3 rounded-lg min-h-[60px]">
          {character.inventory.length > 0 ? (
            <ul className="list-disc list-inside text-off-white/90">
              {character.inventory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-off-white/60 italic">Seus bolsos estão vazios.</p>
          )}
        </div>
      </div>
       <button 
        onClick={onResetGame}
        className="w-full mt-4 font-medieval text-md bg-red-900/60 text-off-white py-2 px-4 rounded-md border-2 border-transparent hover:bg-ink hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-dark focus:ring-red-500 transition-all duration-200 shadow-md"
       >
        Nova Aventura
       </button>
    </div>
  );
};

export default CharacterSheet;
