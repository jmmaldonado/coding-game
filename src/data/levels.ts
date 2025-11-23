import type { Level, TileType } from '../types/game';

const E: TileType = 'EMPTY';
const W: TileType = 'WALL';
const S: TileType = 'START';
const F: TileType = 'END'; // Flag/Finish
const ST: TileType = 'STAR';
const H: TileType = 'HOLE';
const K: TileType = 'KEY';
const D: TileType = 'DOOR';

export const levels: Level[] = [
  {
    id: 1,
    name: "Hello Codey!",
    tutorialText: "Drag the 'Move Forward' block to the workspace and press Play!",
    availableBlocks: ['MOVE_FORWARD'],
    minStars: 0,
    bestBlockCount: 1,
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
    bestBlockCount: 3,
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
    bestBlockCount: 4,
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
    bestBlockCount: 2,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, E, ST, E, F, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 5,
    name: "Jump Around",
    tutorialText: "Use Jump to hop over holes!",
    availableBlocks: ['MOVE_FORWARD', 'JUMP', 'TURN_RIGHT'],
    minStars: 1,
    bestBlockCount: 2,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W],
      [W, S, H, ST, F, W],
      [W, W, W, W, W, W],
    ]
  },
  {
    id: 6,
    name: "Zig Zag",
    tutorialText: "Use a Loop to zig-zag your way to the top!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP'],
    minStars: 0,
    bestBlockCount: 5,
    start: { x: 1, y: 5, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, E, E, F, W, W, W],
      [W, E, W, W, W, E, W],
      [W, ST, E, W, W, W, W],
      [W, W, E, E, W, W, W],
      [W, S, H, E, W, W, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 7,
    name: "The Maze",
    tutorialText: "Codey is lost! Guide him out.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'],
    minStars: 0,
    bestBlockCount: 8,
    start: { x: 1, y: 1, dir: 'DOWN' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, W, E, E, ST, W],
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
    bestBlockCount: 4,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, E, E, E, ST, W],
      [W, W, W, W, W, E, W],
      [W, F, ST, E, E, E, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 9,
    name: "Treasure Hunter",
    tutorialText: "Collect all stars! Use 'If Star' to detect them.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_RIGHT', 'JUMP', 'LOOP'],
    minStars: 1,
    bestBlockCount: 5,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, H, ST, H, F, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 10,
    name: "The Gauntlet",
    tutorialText: "The ultimate test. Jump, Loop, and Think!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'LOOP', 'IF_WALL'],
    minStars: 1,
    bestBlockCount: 12,
    start: { x: 1, y: 6, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W],
      [W, E, E, W, E, ST, E, W],
      [W, W, E, W, E, W, E, W],
      [W, E, E, E, E, W, E, W],
      [W, E, W, W, W, W, E, W],
      [W, E, W, F, W, W, E, W],
      [W, S, H, E, E, E, E, W],
      [W, W, W, W, W, W, W, W],
    ]
  },
  {
    id: 11,
    name: "Long Walk",
    tutorialText: "Use 'While Path' to keep moving until you hit a wall!",
    availableBlocks: ['MOVE_FORWARD', 'WHILE_PATH'],
    minStars: 0,
    bestBlockCount: 2, // While Path -> Move
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W, W],
      [W, S, E, E, ST, E, E, F, W],
      [W, W, W, W, W, W, W, W, W],
    ]
  },
  {
    id: 12,
    name: "Square Patrol",
    tutorialText: "Walk the perimeter using While Path and Loop.",
    availableBlocks: ['MOVE_FORWARD', 'TURN_RIGHT', 'WHILE_PATH', 'LOOP'],
    minStars: 0,
    bestBlockCount: 4,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W],
      [W, S, E, E, E, ST, W],
      [W, E, W, W, W, E, W],
      [W, E, W, W, W, E, W],
      [W, E, W, W, W, E, W],
      [W, F, E, E, E, ST, W],
      [W, W, W, W, W, W, W],
    ]
  },
  {
    id: 13,
    name: "Hole Hopper",
    tutorialText: "Be careful! While Path stops at holes too.",
    availableBlocks: ['MOVE_FORWARD', 'JUMP', 'WHILE_PATH', 'LOOP'],
    minStars: 0,
    bestBlockCount: 5,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W, W],
      [W, S, E, ST, H, E, E, F, W],
      [W, W, W, W, W, W, W, W, W],
    ]
  },
  {
    id: 14,
    name: "Spiral In",
    tutorialText: "Can you solve the spiral?",
    availableBlocks: ['MOVE_FORWARD', 'TURN_RIGHT', 'WHILE_PATH', 'LOOP'],
    minStars: 0,
    bestBlockCount: 4,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W, W],
      [W, S, ST, E, E, E, E, E, W],
      [W, W, W, W, W, W, W, ST, W],
      [W, E, E, E, E, E, W, E, W],
      [W, ST, W, W, W, E, W, E, W],
      [W, E, W, F, E, E, W, E, W],
      [W, E, W, W, W, W, W, E, W],
      [W, E, E, E, E, E, E, ST, W],
      [W, W, W, W, W, W, W, W, W],
    ]
  },
  {
    id: 15,
    name: "Codey's Masterpiece",
    tutorialText: "The final challenge. Good luck!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'LOOP', 'WHILE_PATH', 'IF_WALL', 'IF_STAR'],
    minStars: 3,
    bestBlockCount: 15,
    start: { x: 1, y: 7, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W, W],
      [W, E, ST, W, E, E, E, F, W],
      [W, E, W, W, W, W, W, E, W],
      [W, E, E, E, E, H, E, E, W],
      [W, W, H, W, W, W, W, W, W],
      [W, E, E, E, E, ST, E, E, W],
      [W, E, W, W, W, W, W, E, W],
      [W, S, ST, E, E, E, E, E, W],
      [W, W, W, W, W, W, W, W, W],
    ]
  },
  {
    id: 16,
    name: "Key Master",
    tutorialText: "Collect the key to open the door! Jump over the hole!",
    availableBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP'],
    minStars: 0,
    bestBlockCount: 5,
    start: { x: 1, y: 1, dir: 'RIGHT' },
    grid: [
      [W, W, W, W, W, W, W, W],
      [W, S, H, E, W, F, W, W],
      [W, W, K, E, D, E, W, W],
      [W, W, W, W, W, W, W, W],
    ]
  }
];
