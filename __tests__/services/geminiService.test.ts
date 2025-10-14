/**
 * @jest-environment jsdom
 */
// Fix: Import Jest globals to resolve TypeScript errors about missing type definitions.
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createInitialState, getNextTurn } from '../../services/geminiService';
import { GoogleGenAI } from '@google/genai';
import type { Character, GameTurnResponse, WorldState, GameLogEntry } from '../../types';

// Mock do módulo @google/genai
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn(),
    },
  })),
  Type: {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
    ARRAY: 'ARRAY',
    INTEGER: 'INTEGER',
    BOOLEAN: 'BOOLEAN',
  },
}));


const mockGenerateContent = (GoogleGenAI as jest.Mock).mock.results[0].value.models.generateContent;

const mockSuccessResponse: GameTurnResponse = {
  narrative: 'Você acorda em uma floresta escura.',
  choices: ['Olhar ao redor', 'Gritar por ajuda'],
  character: {
    name: 'Test',
    race: 'Humano',
    class: 'Guerreiro',
    stats: { health: 100, maxHealth: 100, strength: 15, dexterity: 12, intelligence: 10 },
    inventory: ['Espada Curta', 'Pão'],
  },
  worldState: {
    location: 'Floresta Sombria',
    time: 'Noite',
    description: 'A lua ilumina fracamente as árvores retorcidas.',
  },
  isGameOver: false,
};

describe('geminiService', () => {
  beforeEach(() => {
    // Limpa mocks antes de cada teste
    mockGenerateContent.mockClear();
  });

  it('createInitialState deve retornar um estado de jogo válido em caso de sucesso', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockSuccessResponse),
    });

    const result = await createInitialState('Test', 'Humano', 'Guerreiro');
    
    expect(result).toEqual(mockSuccessResponse);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        contents: expect.arrayContaining([
            expect.objectContaining({
                parts: expect.arrayContaining([
                    expect.objectContaining({
                        text: expect.stringContaining("O nome do personagem é Test")
                    })
                ])
            })
        ])
    }));
  });

  it('createInitialState deve lançar um erro se a API retornar JSON inválido', async () => {
    mockGenerateContent.mockResolvedValue({
      text: 'Isso não é um JSON',
    });
    
    await expect(createInitialState('Test', 'Humano', 'Guerreiro')).rejects.toThrow(
      'Recebida uma resposta mal formatada do narrador de IA.'
    );
  });
  
  it('getNextTurn deve retornar um estado de jogo válido em caso de sucesso', async () => {
    mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockSuccessResponse),
    });

    const mockCharacter: Character = mockSuccessResponse.character;
    const mockWorldState: WorldState = mockSuccessResponse.worldState;
    const mockGameLog: GameLogEntry[] = [{role: 'model', text: 'narrativa anterior'}];
    const playerChoice = 'Olhar ao redor';

    const result = await getNextTurn(mockCharacter, mockWorldState, mockGameLog, playerChoice);

    expect(result).toEqual(mockSuccessResponse);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        contents: expect.arrayContaining([
            expect.objectContaining({
                parts: expect.arrayContaining([
                    expect.objectContaining({
                        text: expect.stringContaining(`escolheu a ação: "${playerChoice}"`)
                    })
                ])
            })
        ])
    }));
  });

  it('getNextTurn deve lançar um erro se a API falhar', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Falha na API'));

      const mockCharacter: Character = mockSuccessResponse.character;
      const mockWorldState: WorldState = mockSuccessResponse.worldState;

      await expect(getNextTurn(mockCharacter, mockWorldState, [], 'qualquer escolha')).rejects.toThrow(
          'A voz do narrador desaparece na estática. Por favor, verifique sua conexão ou tente novamente.'
      );
  });
});