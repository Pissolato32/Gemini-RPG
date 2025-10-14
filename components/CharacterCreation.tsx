import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CharacterCreationProps {
  onCharacterCreate: (name: string, race: string, characterClass: string) => void;
  isLoading: boolean;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate, isLoading }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState('Humano');
  const [characterClass, setCharacterClass] = useState('Guerreiro');

  const races = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Orc'];
  const classes = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Ranger'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onCharacterCreate(name.trim(), race, characterClass);
    }
  };

  return (
    <div className="min-h-screen bg-stone-dark text-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-stone-dark/90 border-2 border-wood shadow-inset-strong rounded-lg p-8">
        <h1 className="text-4xl font-medieval text-center text-gold mb-6">Forje Sua Lenda</h1>
        <p className="text-center text-off-white/80 mb-8">
          Uma nova história o aguarda. Quem será você?
        </p>

        {isLoading ? (
            <div className="text-center">
                <LoadingSpinner />
                <p className="text-off-white/80 italic mt-2">O mundo está nascendo...</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medieval text-gold mb-2">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-ink p-3 rounded-md border-2 border-wood/50 focus:border-gold focus:ring-gold focus:outline-none transition-colors duration-200"
                  placeholder="Digite o nome do seu personagem"
                />
              </div>

              <div>
                <label htmlFor="race" className="block text-lg font-medieval text-gold mb-2">
                  Raça
                </label>
                <select
                  id="race"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  className="w-full bg-ink p-3 rounded-md border-2 border-wood/50 focus:border-gold focus:ring-gold focus:outline-none transition-colors duration-200 appearance-none bg-no-repeat bg-right"
                  style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="rgb(234, 234, 234)" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`}}
                >
                  {races.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="class" className="block text-lg font-medieval text-gold mb-2">
                  Classe
                </label>
                <select
                  id="class"
                  value={characterClass}
                  onChange={(e) => setCharacterClass(e.target.value)}
                  className="w-full bg-ink p-3 rounded-md border-2 border-wood/50 focus:border-gold focus:ring-gold focus:outline-none transition-colors duration-200 appearance-none bg-no-repeat bg-right"
                   style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="rgb(234, 234, 234)" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`}}
                >
                  {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || isLoading}
                className="w-full font-medieval text-xl bg-wood text-off-white py-4 px-4 rounded-md border-2 border-transparent hover:bg-ink hover:border-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-dark focus:ring-gold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Iniciar Aventura
              </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default CharacterCreation;