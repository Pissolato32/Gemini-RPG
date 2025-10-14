import React, { useRef, useEffect } from 'react';
import type { GameLogEntry } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface GameScreenProps {
  gameLog: GameLogEntry[];
  choices: string[];
  onChoice: (choice: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameLog, choices, onChoice, isLoading, isGameOver }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Rola para o final do log sempre que uma nova entrada é adicionada.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLog]);

  return (
    <div className="bg-stone-dark/90 border-2 border-wood shadow-inset-strong rounded-lg p-6 h-[80vh] flex flex-col">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
        {gameLog.map((entry, index) => (
          <div key={index} className={`mb-4 ${entry.role === 'user' ? 'text-right' : 'text-left'}`}>
            {entry.role === 'model' ? (
              <p className="text-off-white text-lg leading-relaxed whitespace-pre-wrap">{entry.text}</p>
            ) : (
              <p className="text-off-white/80 italic text-md">
                &gt; {entry.text}
              </p>
            )}
          </div>
        ))}
        {isLoading && <LoadingSpinner />}
        <div ref={logEndRef} />
      </div>
      <div className="mt-6 flex-shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              disabled={isLoading}
              className="font-medieval text-lg bg-wood text-off-white py-3 px-4 rounded-md border-2 border-transparent hover:bg-ink hover:border-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-dark focus:ring-gold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {choice}
            </button>
          ))}
        </div>
        {isGameOver && gameLog.length > 0 && (
             <div className="text-center mt-6">
                 <p className="font-medieval text-3xl text-red-600">Fim de Jogo</p>
                 <p className="text-off-white">Sua lenda terminou. Você forjará uma nova?</p>
             </div>
        )}
      </div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(140, 109, 94, 0.7); /* Cor 'wood' com transparência */
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(234, 234, 234, 0.5); /* Cor 'off-white' com transparência */
        }
      `}</style>
    </div>
  );
};

export default GameScreen;
