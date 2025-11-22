export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type TileType = 'EMPTY' | 'WALL' | 'START' | 'END' | 'STAR' | 'HOLE';

export type InstructionType = 
  | 'MOVE_FORWARD' 
  | 'TURN_LEFT' 
  | 'TURN_RIGHT' 
  | 'JUMP' 
  | 'LOOP' 
  | 'WHILE_PATH' // New: While path ahead is clear
  | 'IF_STAR' // Conditional: if on star
  | 'IF_WALL'; // Conditional: if facing wall

export interface Instruction {
  id: string;
  type: InstructionType;
  loopCount?: number;
  instructions?: Instruction[]; // For nested blocks like Loop or If
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerState extends Position {
  dir: Direction;
}

export interface Level {
  id: number;
  name: string;
  grid: TileType[][]; // 2D grid: row, col
  start: PlayerState;
  availableBlocks: InstructionType[];
  minStars: number;
  bestBlockCount: number; // Par score for blocks used
  tutorialText?: string;
}
