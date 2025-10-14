/**
 * @jest-environment jsdom
 */
// Fix: Import Jest globals to resolve TypeScript errors about missing type definitions.
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as geminiService from '../services/geminiService';
import { GameTurnResponse } from '../types';

// Mock do geminiService
jest.mock('../services/geminiService');
const mockCreateInitialState = geminiService.createInitialState as jest.Mock;
const mockGetNextTurn = geminiService.getNextTurn as jest.Mock;

const mockInitialResponse: GameTurnResponse = {
  narrative: 'Você está em uma taverna.',
  choices: ['Beber', 'Sair'],
  character: {
    name: 'Brave Sir Robin',
    race: 'Humano',
    class: 'Guerreiro',
    stats: { health: 100, maxHealth: 100, strength: 15, dexterity: 12, intelligence: 10 },
    inventory: ['Espada'],
  },
  worldState: {
    location: 'Taverna do Pônei Saltitante',
    time: 'Noite',
    description: 'A taverna está barulhenta.',
  },
  isGameOver: false,
};

describe('App Component', () => {
  beforeEach(() => {
    // Limpa todos os mocks e o localStorage antes de cada teste
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('deve renderizar a tela de criação de personagem inicialmente', () => {
    render(<App />);
    expect(screen.getByText('Forje Sua Lenda')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  test('deve chamar createInitialState e renderizar a tela do jogo após a criação do personagem', async () => {
    mockCreateInitialState.mockResolvedValue(mockInitialResponse);
    
    render(<App />);

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Brave Sir Robin' } });
    fireEvent.click(screen.getByText('Iniciar Aventura'));

    // Espera o carregamento e a chamada da API
    await waitFor(() => {
      expect(mockCreateInitialState).toHaveBeenCalledWith('Brave Sir Robin', 'Humano', 'Guerreiro');
    });

    // Verifica se a tela do jogo é renderizada
    expect(screen.getByText('RPG de Texto')).toBeInTheDocument();
    expect(screen.getByText('Brave Sir Robin')).toBeInTheDocument();
    expect(screen.getByText('Você está em uma taverna.')).toBeInTheDocument();
    expect(screen.getByText('Beber')).toBeInTheDocument();
  });
  
  test('deve chamar getNextTurn quando um jogador faz uma escolha', async () => {
      mockCreateInitialState.mockResolvedValue(mockInitialResponse);
      const mockNextTurnResponse = { ...mockInitialResponse, narrative: "Você bebeu. Foi bom." };
      mockGetNextTurn.mockResolvedValue(mockNextTurnResponse);
      
      render(<App />);
      
      // Criar personagem
      fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Brave Sir Robin' } });
      fireEvent.click(screen.getByText('Iniciar Aventura'));
      
      // Esperar a renderização da tela do jogo
      await screen.findByText('Beber');
      
      // Fazer uma escolha
      fireEvent.click(screen.getByText('Beber'));

      await waitFor(() => {
          expect(mockGetNextTurn).toHaveBeenCalledTimes(1);
      });

      // Verificar se a nova narrativa é exibida
      expect(screen.getByText('Você bebeu. Foi bom.')).toBeInTheDocument();
  });

  test('deve carregar o jogo do localStorage se existir um estado salvo', () => {
    localStorage.setItem('characterState', JSON.stringify(mockInitialResponse.character));
    localStorage.setItem('worldState', JSON.stringify(mockInitialResponse.worldState));
    localStorage.setItem('gameLog', JSON.stringify([{ role: 'model', text: 'Você está em uma taverna.' }]));
    localStorage.setItem('choices', JSON.stringify(['Beber', 'Sair']));
    localStorage.setItem('isGameOver', JSON.stringify(false));

    render(<App />);

    // Deve pular a criação de personagem e ir direto para a tela do jogo
    expect(screen.queryByText('Forje Sua Lenda')).not.toBeInTheDocument();
    expect(screen.getByText('Brave Sir Robin')).toBeInTheDocument();
    expect(screen.getByText('Você está em uma taverna.')).toBeInTheDocument();
  });
});