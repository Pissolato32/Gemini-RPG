import React, { useState, useEffect } from 'react';
import CharacterCreation from './components/CharacterCreation';
import CharacterSheet from './components/CharacterSheet';
import GameScreen from './components/GameScreen';
import WorldStatus from './components/WorldStatus';
import { createInitialState, getNextTurn } from './services/geminiService';
import type { Character, GameLogEntry, WorldState } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lazy initialize state from localStorage
  const [character, setCharacter] = useState<Character | null>(() => {
    const saved = localStorage.getItem('characterState');
    return saved ? JSON.parse(saved) : null;
  });
  const [worldState, setWorldState] = useState<WorldState | null>(() => {
    const saved = localStorage.getItem('worldState');
    return saved ? JSON.parse(saved) : null;
  });
  const [gameLog, setGameLog] = useState<GameLogEntry[]>(() => {
    const saved = localStorage.getItem('gameLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [choices, setChoices] = useState<string[]>(() => {
    const saved = localStorage.getItem('choices');
    return saved ? JSON.parse(saved) : [];
  });
   const [isGameOver, setIsGameOver] = useState<boolean>(() => {
    const saved = localStorage.getItem('isGameOver');
    return saved ? JSON.parse(saved) : false;
  });

  // Effect to save game state to localStorage whenever it changes
  useEffect(() => {
    if (character) {
      localStorage.setItem('characterState', JSON.stringify(character));
      localStorage.setItem('worldState', JSON.stringify(worldState));
      localStorage.setItem('gameLog', JSON.stringify(gameLog));
      localStorage.setItem('choices', JSON.stringify(choices));
      localStorage.setItem('isGameOver', JSON.stringify(isGameOver));
    }
  }, [character, worldState, gameLog, choices, isGameOver]);

  const handleCharacterCreate = async (name: string, race: string, charClass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const initialState = await createInitialState(name, race, charClass);
      setCharacter(initialState.character);
      setWorldState(initialState.worldState);
      setGameLog([{ role: 'model', text: initialState.narrative }]);
      setChoices(initialState.choices);
      setIsGameOver(initialState.isGameOver);
    } catch (e: any) {
      setError(e.message || "Ocorreu um erro desconhecido ao iniciar o jogo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerChoice = async (choice: string) => {
    if (!character || !worldState || isGameOver) return;

    setIsLoading(true);
    setError(null);
    const newLog: GameLogEntry[] = [...gameLog, { role: 'user', text: choice }];
    setGameLog(newLog);
    const previousChoices = choices;
    setChoices([]);

    try {
      const nextTurn = await getNextTurn(character, worldState, newLog, choice);
      setCharacter(nextTurn.character);
      setWorldState(nextTurn.worldState);
      setGameLog([...newLog, { role: 'model', text: nextTurn.narrative }]);
      setChoices(nextTurn.choices);
      setIsGameOver(nextTurn.isGameOver);
    } catch (e: any) {
      setError(e.message || "Ocorreu um erro desconhecido.");
      setChoices(previousChoices); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetGame = () => {
    if (window.confirm("Tem certeza de que deseja apagar a lenda atual e começar uma nova?")) {
        localStorage.clear();
        setCharacter(null);
        setWorldState(null);
        setGameLog([]);
        setChoices([]);
        setIsGameOver(false);
        setError(null);
    }
  }
  
  if (!character) {
    return <CharacterCreation onCharacterCreate={handleCharacterCreate} isLoading={isLoading} />;
  }

  return (
    <main className="min-h-screen bg-ink font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <aside className="lg:col-span-1 space-y-6">
          <h1 className="text-4xl font-medieval text-gold text-center">RPG de Texto</h1>
          <WorldStatus worldState={worldState} />
          <CharacterSheet character={character} onResetGame={handleResetGame} />
          {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg mt-4">{error}</div>}
        </aside>

        <div className="lg:col-span-2">
          <GameScreen
            gameLog={gameLog}
            choices={choices}
            onChoice={handlePlayerChoice}
            isLoading={isLoading}
            isGameOver={isGameOver}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
