import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

// Default start configuration
const DEFAULT_LEVEL_ID = 1;
const getDefaultState = (levelId: number) => {
    const level = levels.find(l => l.id === levelId) || levels[0];
    return {
        currentLevelId: level.id,
        playerState: { ...level.start }
    };
};

const defaults = getDefaultState(DEFAULT_LEVEL_ID);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevelId: defaults.currentLevelId,
      unlockedLevels: [1],
      stars: 0,
      
      code: [],
      isPlaying: false,
      isPaused: false,
      executionSpeed: 800, // ms per tick - Slower for clearer steps
      
      playerState: defaults.playerState,
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

      tick: () => {},

      unlockAllLevels: () => set({ unlockedLevels: levels.map(l => l.id) }),

      exportSave: () => {
        const { unlockedLevels, stars, currentLevelId } = get();
        return btoa(JSON.stringify({ unlockedLevels, stars, currentLevelId }));
      },

      importSave: (data) => {
        try {
          const parsed = JSON.parse(atob(data));
          if (parsed.unlockedLevels && typeof parsed.stars === 'number') {
            const newState: Partial<GameState> = { 
                unlockedLevels: parsed.unlockedLevels, 
                stars: parsed.stars
            };
            if (parsed.currentLevelId) {
                const level = levels.find(l => l.id === parsed.currentLevelId);
                if (level) {
                    newState.currentLevelId = parsed.currentLevelId;
                    newState.playerState = { ...level.start }; // Ensure player is at start of imported level
                }
            }
            set(newState);
            return true;
          }
        } catch (e) {}
        return false;
      }
    }),
    {
      name: 'codeys-quest-storage',
      partialize: (state) => ({
        unlockedLevels: state.unlockedLevels,
        stars: state.stars,
        currentLevelId: state.currentLevelId,
        // We persist playerState so that on reload the player isn't briefly in the wrong spot (Level 1 default) 
        // before App.tsx useEffect runs.
        playerState: state.playerState 
      }),
    }
  )
);
