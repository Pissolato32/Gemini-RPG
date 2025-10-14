export interface Character {
  name: string;
  race: string;
  class: string;
  stats: {
    health: number;
    maxHealth: number;
    strength: number;
    dexterity: number;
    intelligence: number;
  };
  inventory: string[];
}

export interface WorldState {
  location: string;
  time: string;
  description: string;
}

export interface GameLogEntry {
  role: 'user' | 'model';
  text: string;
}

export interface GameTurnResponse {
  narrative: string;
  choices: string[];
  character: Character;
  worldState: WorldState;
  isGameOver: boolean;
}
