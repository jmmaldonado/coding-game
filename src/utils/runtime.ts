import type { Instruction, Level, PlayerState, TileType, Direction } from '../types/game';

export type RuntimeStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ERROR';

export interface StepResult {
  playerState: PlayerState;
  activeInstructionId: string | null;
  status: RuntimeStatus;
  collectedStars: string[]; // "x,y"
  collectedKeys: string[]; // "x,y"
  openedDoors: string[]; // "x,y"
  message?: string;
}

interface StackFrame {
  instructions: Instruction[];
  index: number;
  loopCount?: number; // If in a loop
}

export class GameRuntime {
  private stack: StackFrame[] = [];
  private level: Level;
  private playerState: PlayerState;
  private collectedStars: Set<string>;
  private collectedKeys: Set<string>;
  private openedDoors: Set<string>;
  private status: RuntimeStatus = 'RUNNING';

  constructor(code: Instruction[], level: Level, startState: PlayerState) {
    this.stack = [{ instructions: code, index: 0 }];
    this.level = level;
    this.playerState = { ...startState };
    this.collectedStars = new Set();
    this.collectedKeys = new Set();
    this.openedDoors = new Set();
  }

  public step(): StepResult {
    // Reset animation state at start of step
    this.playerState.animation = 'IDLE';

    if (this.status !== 'RUNNING') {
      return this.getResult(null);
    }

    if (this.stack.length === 0) {
      // No more instructions, did we win?
      return this.checkWinCondition(null);
    }

    const frame = this.stack[this.stack.length - 1];
    
    if (frame.index >= frame.instructions.length) {
      // End of this block list
      if (frame.loopCount !== undefined) {
        frame.loopCount--;
        if (frame.loopCount > 0) {
          // Repeat loop
          frame.index = 0;
          return this.step(); // Immediately execute first instruction of next iteration
        }
      }
      // Pop stack
      this.stack.pop();
      return this.step();
    }

    const instruction = frame.instructions[frame.index];
    frame.index++; // Point to next for next time

    // Execute instruction
    switch (instruction.type) {
      case 'MOVE_FORWARD':
        return this.handleMove(instruction.id);
      case 'TURN_LEFT':
        return this.handleTurn('LEFT', instruction.id);
      case 'TURN_RIGHT':
        return this.handleTurn('RIGHT', instruction.id);
      case 'JUMP':
        return this.handleJump(instruction.id);
      case 'LOOP':
        if (instruction.instructions && instruction.instructions.length > 0) {
          this.stack.push({
            instructions: instruction.instructions,
            index: 0,
            loopCount: instruction.loopCount || 1
          });
          return this.getResult(instruction.id); // Highlight the loop block itself briefly
        }
        break;
      case 'WHILE_PATH':
        // While path ahead is clear (not wall, not hole, not bounds)
        if (this.isPathClear()) {
           if (instruction.instructions && instruction.instructions.length > 0) {
             // We push the block to stack. 
             // IMPORTANT: A 'While' loop needs to re-evaluate the condition after the body finishes.
             // In our stack model, simple looping is handled by 'loopCount'.
             // For conditional loops, we can simulate it by pushing the body, 
             // AND THEN pushing the 'WHILE' instruction itself back onto the stack? 
             // OR, we keep the 'WHILE' instruction as the current frame and only advance index if condition fails.
             
             // Let's use the 'loopCount' mechanism but treat it differently? No.
             // Standard stack approach:
             // 1. Push body.
             // 2. When body finishes, we are back at this instruction (if we didn't increment index).
             
             // BUT my runtime increments index *before* execution switch: `frame.index++;`
             // So we need to decrement it to stay on this instruction?
             
             frame.index--; // Stay on this instruction to re-evaluate after body
             
             this.stack.push({
                 instructions: instruction.instructions,
                 index: 0
             });
           }
        } else {
            // Condition failed, we are already pointing to next (index++ happened)
            // Just continue
        }
        return this.getResult(instruction.id);
      case 'IF_STAR':
        if (this.isStandingOnStar()) {
           if (instruction.instructions && instruction.instructions.length > 0) {
            this.stack.push({ instructions: instruction.instructions, index: 0 });
           }
        }
        return this.getResult(instruction.id);
      case 'IF_WALL':
         if (this.isFacingWall()) {
           if (instruction.instructions && instruction.instructions.length > 0) {
            this.stack.push({ instructions: instruction.instructions, index: 0 });
           }
        }
        return this.getResult(instruction.id);
    }

    return this.getResult(instruction.id);
  }

  private handleMove(id: string): StepResult {
    const { x, y, dir } = this.playerState;
    const { dx, dy } = this.getDirOffsets(dir);
    const targetX = x + dx;
    const targetY = y + dy;

    const tile = this.getTile(targetX, targetY);

    if (tile === 'WALL') {
      // Bonk!
       this.playerState.animation = 'DENY';
       return this.getResult(id, 'Bonk!');
    } else if (tile === 'HOLE') {
       this.playerState = { ...this.playerState, x: targetX, y: targetY };
       this.status = 'FAILED';
       return this.getResult(id, 'Fell in a hole!');
    } else if (tile === 'DOOR') {
        // Door logic
        if (!this.openedDoors.has(`${targetX},${targetY}`)) {
             this.playerState.animation = 'DENY';
             return this.getResult(id, 'Locked! Find a key.');
        }
        // If opened, it acts like empty/floor, proceed.
    }

    // Move
    this.playerState = { ...this.playerState, x: targetX, y: targetY };
    this.checkCollections();
    
    // Check if reached end
    if (tile === 'END') {
        // But wait, execution continues? Usually you win when you land on flag.
        // Let's check win condition at the end of step?
        // Or immediately. Let's say immediately for joy.
        return this.checkWinCondition(id);
    }

    return this.getResult(id);
  }

  private handleJump(id: string): StepResult {
    const { x, y, dir } = this.playerState;
    const { dx, dy } = this.getDirOffsets(dir);
    
    const midX = x + dx;
    const midY = y + dy;
    const targetX = x + (dx * 2);
    const targetY = y + (dy * 2);
    
    const midTile = this.getTile(midX, midY);
    const targetTile = this.getTile(targetX, targetY);

    // Check obstacle (WALL or Closed DOOR)
    if (midTile === 'WALL') {
        this.playerState.animation = 'DENY';
        return this.getResult(id, "Can't jump over walls!");
    }
    if (midTile === 'DOOR' && !this.openedDoors.has(`${midX},${midY}`)) {
        this.playerState.animation = 'DENY';
        return this.getResult(id, "Can't jump over locked doors!");
    }

    if (targetTile === 'WALL') {
         this.playerState.animation = 'DENY';
         return this.getResult(id, "Can't jump into a wall!");
    }
    
    // Successful jump
    this.playerState = { ...this.playerState, x: targetX, y: targetY };
    this.checkCollections();
    
    if (targetTile === 'END') {
        return this.checkWinCondition(id);
    }
    
     if (targetTile === 'HOLE') {
       this.status = 'FAILED';
       return this.getResult(id, 'Jumped into a hole!');
    }

    return this.getResult(id);
  }

  private handleTurn(direction: 'LEFT' | 'RIGHT', id: string): StepResult {
    const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    let idx = dirs.indexOf(this.playerState.dir);
    if (direction === 'RIGHT') idx = (idx + 1) % 4;
    else idx = (idx + 3) % 4;
    this.playerState.dir = dirs[idx];
    return this.getResult(id);
  }

  private getDirOffsets(dir: Direction) {
    switch (dir) {
      case 'UP': return { dx: 0, dy: -1 };
      case 'DOWN': return { dx: 0, dy: 1 };
      case 'LEFT': return { dx: -1, dy: 0 };
      case 'RIGHT': return { dx: 1, dy: 0 };
    }
  }

  private getTile(x: number, y: number): TileType | 'BOUNDS' {
    if (y < 0 || y >= this.level.grid.length || x < 0 || x >= this.level.grid[0].length) {
      return 'BOUNDS'; // Treat as wall or separate?
    }
    return this.level.grid[y][x];
  }

  private isStandingOnStar(): boolean {
      const { x, y } = this.playerState;
      const tile = this.getTile(x, y);
      // Also check if already collected?
      // The grid is static, but we track collections.
      // Wait, if we collect it, it's gone.
      // So we need to know if it WAS a star and NOT collected.
      if (tile === 'STAR' && !this.collectedStars.has(`${x},${y}`)) {
          return true;
      }
      return false;
  }

  private isFacingWall(): boolean {
      const { x, y, dir } = this.playerState;
      const { dx, dy } = this.getDirOffsets(dir);
      const tile = this.getTile(x + dx, y + dy);
      return tile === 'WALL' || tile === 'BOUNDS';
  }

  private isPathClear(): boolean {
      const { x, y, dir } = this.playerState;
      const { dx, dy } = this.getDirOffsets(dir);
      const targetX = x + dx;
      const targetY = y + dy;
      const tile = this.getTile(targetX, targetY);
      
      // Path is clear if it's not a wall, not bounds, not hole.
      // Door? If locked, it's not clear. If open, it is.
      const isLockedDoor = tile === 'DOOR' && !this.openedDoors.has(`${targetX},${targetY}`);
      
      return tile !== 'WALL' && tile !== 'BOUNDS' && tile !== 'HOLE' && !isLockedDoor;
  }

  private checkCollections() {
      const { x, y } = this.playerState;
      const tile = this.getTile(x, y);
      if (tile === 'STAR') {
          this.collectedStars.add(`${x},${y}`);
      } else if (tile === 'KEY') {
          if (!this.collectedKeys.has(`${x},${y}`)) {
              this.collectedKeys.add(`${x},${y}`);
              // Remote Switch Logic: Collecting a key opens doors.
              // Since we don't have ID linking yet, we open ALL doors.
              for (let r = 0; r < this.level.grid.length; r++) {
                  for (let c = 0; c < this.level.grid[0].length; c++) {
                      if (this.level.grid[r][c] === 'DOOR') {
                          this.openedDoors.add(`${c},${r}`);
                      }
                  }
              }
          }
      }
  }

  private checkWinCondition(id: string | null): StepResult {
      // Check if on flag
      const { x, y } = this.playerState;
      if (this.getTile(x, y) === 'END') {
          // Check if min stars collected
          if (this.collectedStars.size >= this.level.minStars) {
              this.status = 'COMPLETED';
          } else {
              this.status = 'FAILED'; // Landed on flag without enough stars
              return this.getResult(id, `Need ${this.level.minStars} stars!`);
          }
      } else if (this.stack.length === 0 && id === null) {
          // Ran out of code and not on flag
          this.status = 'FAILED';
          return this.getResult(null, "Out of moves!");
      }
      return this.getResult(id);
  }

  private getResult(id: string | null, msg?: string): StepResult {
    return {
      playerState: { ...this.playerState },
      activeInstructionId: id,
      status: this.status,
      collectedStars: Array.from(this.collectedStars),
      collectedKeys: Array.from(this.collectedKeys),
      openedDoors: Array.from(this.openedDoors),
      message: msg
    };
  }
}
