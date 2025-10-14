import { GoogleGenAI, Type } from "@google/genai";
import type { Character, GameLogEntry, GameTurnResponse, WorldState } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    narrative: { type: Type.STRING, description: "Uma descrição detalhada, imersiva e envolvente da cena atual, eventos e ações de NPCs em um cenário de RPG de fantasia sombria. Deve ter de 2 a 3 parágrafos." },
    choices: { type: Type.ARRAY, description: "Uma lista de 2 a 4 ações distintas e significativas que o jogador pode tomar a seguir. Cada escolha deve levar a resultados diferentes.", items: { type: Type.STRING } },
    character: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        race: { type: Type.STRING },
        class: { type: Type.STRING },
        stats: {
          type: Type.OBJECT,
          properties: {
            health: { type: Type.INTEGER, description: "A vida atual do personagem. Pode diminuir com dano ou aumentar com cura." },
            maxHealth: { type: Type.INTEGER, description: "A vida máxima do personagem. Permanece constante a menos que um evento importante ocorra." },
            strength: { type: Type.INTEGER },
            dexterity: { type: Type.INTEGER },
            intelligence: { type: Type.INTEGER },
          },
        },
        inventory: { type: Type.ARRAY, description: "Uma matriz de strings representando os itens que o personagem está carregando. Pode ser atualizada com base nas ações.", items: { type: Type.STRING } },
      },
    },
    worldState: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "A localização específica atual do jogador (ex: 'As Cavernas Sussurrantes', 'Uma taverna mal iluminada')." },
        time: { type: Type.STRING, description: "A hora atual do dia (ex: 'Manhã', 'Crepúsculo', 'Meia-noite')." },
        description: { type: Type.STRING, description: "Um breve resumo de uma frase da situação ou ambiente atual do mundo." },
      },
    },
    isGameOver: { type: Type.BOOLEAN, description: "Definido como verdadeiro apenas se o personagem morreu ou alcançou um estado final definitivo e irrecuperável. Caso contrário, deve ser sempre falso." },
  },
  required: ["narrative", "choices", "character", "worldState", "isGameOver"],
};

const systemInstruction = `Você é o Mestre de Jogo (Dungeon Master) de um RPG de texto de fantasia sombria. Seu papel é criar um mundo rico, imersivo e desafiador.
- **Narrativa**: Gere descrições atraentes e detalhadas de cenas, eventos e personagens. Use um tom sério e de fantasia sombria.
- **Gerenciamento de Estado**: Você DEVE atualizar a ficha do personagem do jogador (vida, inventário) e o estado do mundo (localização, tempo) com base na progressão da história e nas escolhas do jogador.
- **Escolhas**: Forneça de 2 a 4 escolhas significativas e distintas para o jogador. As escolhas devem ter consequências.
- **Fim de Jogo**: Apenas defina 'isGameOver' como verdadeiro se o personagem morrer ou a história chegar a um fim definitivo. Um simples contratempo não é um fim de jogo.
- **Formato da Resposta**: Você DEVE responder no formato JSON fornecido, aderindo estritamente ao esquema. Não produza nenhum texto fora da estrutura JSON.`;

/**
 * Função auxiliar para chamar a API Gemini e processar a resposta.
 * @param prompt O prompt a ser enviado para o modelo.
 * @param temperature A temperatura a ser usada para a geração.
 * @returns A resposta JSON parseada.
 */
const _generateGameContent = async (prompt: string, temperature: number): Promise<GameTurnResponse> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
      console.error("Resposta JSON inválida da IA:", jsonText);
      throw new Error("Recebida uma resposta mal formatada do narrador de IA.");
    }
    return JSON.parse(jsonText) as GameTurnResponse;
  } catch (error) {
    console.error("Erro na comunicação com a API Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("JSON")) {
         throw new Error("O narrador se confundiu em suas próprias palavras. Tente novamente.");
    }
    throw new Error("A voz do narrador desaparece na estática. Por favor, verifique sua conexão ou tente novamente.");
  }
};


export const createInitialState = async (
  characterName: string,
  characterRace: string,
  characterClass: string
): Promise<GameTurnResponse> => {
  const prompt = `Crie o estado inicial para uma nova aventura de RPG de fantasia sombria.
  O nome do personagem é ${characterName}. Ele(a) é um(a) ${characterRace} ${characterClass}.
  - Defina atributos iniciais apropriados para a classe (ex: um Guerreiro deve ter alta força e vida). A vida máxima deve ser em torno de 100.
  - Dê a ele(a) um inventário inicial (1-2 itens simples).
  - Crie um cenário inicial envolvente. O personagem deve estar em um local específico e intrigante.
  - Forneça uma narrativa curta para ambientar a cena.
  - Ofereça de 2 a 4 escolhas iniciais.
  - Certifique-se de que isGameOver seja falso.
  - Responda com o objeto JSON completo para o turno inicial.`;
  
  return _generateGameContent(prompt, 0.8);
};

export const getNextTurn = async (
  character: Character,
  worldState: WorldState,
  gameLog: GameLogEntry[],
  playerChoice: string
): Promise<GameTurnResponse> => {
  const prompt = `O jogador, ${character.name}, o(a) ${character.race} ${character.class}, escolheu a ação: "${playerChoice}".
  
  Estado Atual do Personagem: ${JSON.stringify(character, null, 2)}
  Estado Atual do Mundo: ${JSON.stringify(worldState, null, 2)}
  Eventos Anteriores (últimos 3 turnos): ${JSON.stringify(gameLog.slice(-6), null, 2)}
  
  Com base na escolha do jogador e no estado atual, gere o próximo turno da história.
  - Escreva uma narrativa descrevendo o resultado da ação.
  - Atualize o estado do personagem e do mundo de acordo.
  - Forneça novas escolhas para o jogador.
  - Adira estritamente ao esquema JSON.`;

  return _generateGameContent(prompt, 0.7);
};
