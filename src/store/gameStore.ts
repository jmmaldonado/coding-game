import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Instruction, PlayerState, InstructionType } from '../types/game';
import { levels } from '../data/levels';

interface GameState {
  currentLevelId: number;
  unlockedLevels: number[];
  stars: number; // Total stars across game
  
  // Level State
  code: Instruction[];
  isPlaying: boolean;
  isPaused: boolean;
  executionSpeed: number;
  
  // Runtime State
  playerState: PlayerState;
  collectedStars: string[]; // IDs or coordinates 'x,y'
  gameStatus: 'IDLE' | 'RUNNING' | 'WON' | 'LOST';
  activeInstructionId: string | null;
  selectedBlockId: string | null;
  error: string | null;

  // Actions
  loadLevel: (id: number) => void;
  setPlayerState: (state: PlayerState) => void;
  setSelectedBlockId: (id: string | null) => void;
  addInstruction: (type: InstructionType, parentId?: string) => void;
  removeInstruction: (id: string) => void;
  updateInstruction: (id: string, updates: Partial<Instruction>) => void;
  reorderInstructions: (instructions: Instruction[]) => void;
  
  runGame: () => void;
  stopGame: () => void;
  resetLevel: () => void;
  tick: () => void; // Execute one step
  
  unlockAllLevels: () => void; // Cheat
  exportSave: () => string;
  importSave: (data: string) => boolean;
}

// Helper to find instruction in tree
const findInstruction = (list: Instruction[], id: string): { item: Instruction, parent: Instruction[] } | null => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return { item: list[i], parent: list };
    if (list[i].instructions) {
      const found = findInstruction(list[i].instructions!, id);
      if (found) return found;
    }
  }
  return null;
};

const INITIAL_LEVEL_ID = 1;
const initialLevel = levels.find(l => l.id === INITIAL_LEVEL_ID);
const initialPlayerState: PlayerState = initialLevel ? { ...initialLevel.start } : { x: 0, y: 0, dir: 'RIGHT' };

export const useGameStore = create<GameState>((set, get) => ({
  currentLevelId: INITIAL_LEVEL_ID,
  unlockedLevels: [1],
  stars: 0,
  
  code: [],
  isPlaying: false,
  isPaused: false,
  executionSpeed: 500, // ms per tick
  
  playerState: initialPlayerState,
  collectedStars: [],
  gameStatus: 'IDLE',
  activeInstructionId: null,
  selectedBlockId: null,
  error: null,

  loadLevel: (id) => {
    const level = levels.find(l => l.id === id);
    if (!level) return;
    set({
      currentLevelId: id,
      code: [],
      playerState: { ...level.start },
      collectedStars: [],
      gameStatus: 'IDLE',
      isPlaying: false,
      error: null,
      activeInstructionId: null,
      selectedBlockId: null
    });
  },

  setPlayerState: (state) => set({ playerState: state }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),

  addInstruction: (type, parentId) => {
    const newBlock: Instruction = {
      id: uuidv4(),
      type,
      loopCount: type === 'LOOP' ? 2 : undefined,
      instructions: (type === 'LOOP' || type === 'IF_STAR' || type === 'IF_WALL') ? [] : undefined
    };

    set((state) => {
      if (!parentId) {
        return { code: [...state.code, newBlock] };
      }
      // Deep clone to avoid mutation issues (though Immer is built-in to some Zustand patterns, we do it manually to be safe or use produce if we had it)
      // Simplistic deep clone for now:
      const newCode = JSON.parse(JSON.stringify(state.code));
      const found = findInstruction(newCode, parentId);
      if (found && found.item.instructions) {
        found.item.instructions.push(newBlock);
      }
      return { code: newCode };
    });
  },

  removeInstruction: (id) => {
    set((state) => {
      const newCode = JSON.parse(JSON.stringify(state.code));
      const found = findInstruction(newCode, id);
      if (found) {
        const idx = found.parent.findIndex(i => i.id === id);
        if (idx > -1) found.parent.splice(idx, 1);
      }
      return { code: newCode };
    });
  },

  updateInstruction: (id, updates) => {
    set((state) => {
      const newCode = JSON.parse(JSON.stringify(state.code));
      const found = findInstruction(newCode, id);
      if (found) {
        Object.assign(found.item, updates);
      }
      return { code: newCode };
    });
  },

  reorderInstructions: (instructions) => set({ code: instructions }),

  runGame: () => {
    // Reset state before running
    const level = levels.find(l => l.id === get().currentLevelId);
    if (!level) return;
    
    set({
      isPlaying: true,
      gameStatus: 'RUNNING',
      playerState: { ...level.start },
      collectedStars: [],
      error: null,
      activeInstructionId: null
    });
  },

  stopGame: () => set({ isPlaying: false, gameStatus: 'IDLE', activeInstructionId: null }),
  
  resetLevel: () => {
    const level = levels.find(l => l.id === get().currentLevelId);
    if (!level) return;
    set({
      isPlaying: false,
      gameStatus: 'IDLE',
      playerState: { ...level.start },
      collectedStars: [],
      activeInstructionId: null,
      error: null
    });
  },

  tick: () => {
    // This needs to be called by a setInterval in the UI component
    // The actual logic of "what is the next step" is complex to store in state without a pointer stack.
    // For simplicity, we might move the *execution logic* to the component or a helper that returns a generator.
    // BUT, let's try to keep state here. We need a "Program Counter" or "Call Stack".
    // This is getting too complex for a single file quickly. 
    // I will defer the tick implementation to a helper or simplify.
    // Let's assume the UI handles the "execution iterator" and calls "updatePlayer" and "markBlockActive".
  },

  unlockAllLevels: () => set({ unlockedLevels: levels.map(l => l.id) }),

  exportSave: () => {
    const { unlockedLevels, stars } = get();
    return btoa(JSON.stringify({ unlockedLevels, stars }));
  },

  importSave: (data) => {
    try {
      const parsed = JSON.parse(atob(data));
      if (parsed.unlockedLevels && typeof parsed.stars === 'number') {
        set({ unlockedLevels: parsed.unlockedLevels, stars: parsed.stars });
        return true;
      }
    } catch (e) {}
    return false;
  }
}));
