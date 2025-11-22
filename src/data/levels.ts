import type { Level, TileType } from '../types/game';

const E: TileType = 'EMPTY';
const W: TileType = 'WALL';
const S: TileType = 'START';
const F: TileType = 'END'; // Flag/Finish
const ST: TileType = 'STAR';

export const levels: Level[] = [
  {
    id: 1,
    name: "Hello Codey!",
    tutorialText: "Drag the 'Move Forward' block to the workspace and press Play!",
    availableBlocks: ['MOVE_FORWARD'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W],
      [W, S, E, F, W],
      [W, W, W, W, W],
    ]
  },
  {
    id: 2,
    name: "Turn It Up",
    tutorialText: "Codey needs to turn to reach the goal.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W],
      [W, S, E, W, W, W],
      [W, W, E, F, W, W],
      [W, W, W, W, W, W],
    ]
  },
  {
    id: 3,
    name: "Star Catcher",
    tutorialText: "Collect the star before reaching the flag!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'],
    minStars: 1,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W],
      [W, S, ST, F, W],
      [W, W, W, W, W],
    ]
  },
  {
    id: 4,
    name: "Loop de Loop",
    tutorialText: "Use a Loop block to repeat actions efficiently.",
    availableBlocks: ['MOVE_FORWARD', 'LOOP'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, E, E, E, F, W],
      [W, W, W, W, W, W, W],
    ]
  },
   {
    id: 5,
    name: "Jump Around",
    tutorialText: "Use Jump to hop over walls or holes!",
    availableBlocks: ['MOVE_FORWARD', 'JUMP', 'TURN_RIGHT'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W],
      [W, S, W, E, F, W],
      [W, W, W, W, W, W],
    ]
  },
  {
    id: 6,
    name: "Zig Zag",
    tutorialText: "Use a Loop to zig-zag your way to the top!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP'],
    minStars: 0,
    start: { x: 1, y: 5, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, E, E, F, W, W, W],
      [W, E, W, W, W, W, W],
      [W, E, E, W, W, W, W],
      [W, W, E, E, W, W, W],
      [W, S, W, E, W, W, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 7,
    name: "The Maze",
    tutorialText: "Codey is lost! Guide him out.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'DOWN' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, W, E, E, E, W],
      [W, E, W, W, W, E, W],
      [W, E, E, E, W, E, W],
      [W, W, W, E, E, E, W],
      [W, F, E, E, W, W, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 8,
    name: "Smart Robot",
    tutorialText: "Use 'If Wall' to turn automatically!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'IF_WALL', 'LOOP'],
    minStars: 0,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, E, E, E, E, W],
      [W, W, W, W, W, E, W],
      [W, F, E, E, E, E, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 9,
    name: "Treasure Hunter",
    tutorialText: "Collect all stars! Use 'If Star' to detect them.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_RIGHT', 'IF_STAR', 'LOOP'],
    minStars: 3,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, ST, ST, ST, F, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 10,
    name: "The Gauntlet",
    tutorialText: "The ultimate test. Jump, Loop, and Think!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'LOOP', 'IF_WALL'],
    minStars: 1,
    start: { x: 1, y: 6, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W],
      [W, E, E, W, E, ST, E, W],
      [W, W, E, W, E, W, E, W],
      [W, E, E, E, E, W, E, W],
      [W, E, W, W, W, W, E, W],
      [W, E, W, F, W, W, E, W],
      [W, S, W, E, E, E, E, W],
      [W, W, W, W, W, W, W, W],
    ]
  },
];
