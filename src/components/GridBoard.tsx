import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import type { TileType, Direction } from '../types/game';
import { Star, Flag } from 'lucide-react';
import { clsx } from 'clsx';

// const TILE_SIZE = 48; // Pixels - unused, using CSS Grid

export const GridBoard: React.FC = () => {
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const playerState = useGameStore(s => s.playerState);
  const collectedStars = useGameStore(s => s.collectedStars); // List of "x,y" strings
  
  const level = levels.find(l => l.id === currentLevelId);
  
  if (!level) return null;

  const grid = level.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="p-4 flex justify-center items-center bg-blue-50 rounded-2xl shadow-inner overflow-hidden">
        <div 
            className="relative grid gap-1 bg-blue-200 p-2 rounded-xl"
            style={{ 
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
        >
            {grid.map((row, y) => (
                row.map((tile, x) => (
                    <Tile key={`${x}-${y}`} type={tile} x={x} y={y} isCollected={collectedStars.includes(`${x},${y}`)} />
                ))
            ))}
            
            {/* Player Layer - Inside the grid container for perfect alignment */}
            <Player x={playerState.x} y={playerState.y} dir={playerState.dir} rows={rows} cols={cols} />
        </div>
    </div>
  );
};

const Tile = ({ type, x, y, isCollected }: { type: TileType, x: number, y: number, isCollected: boolean }) => {
    const isDark = (x + y) % 2 === 1;
    return (
        <div className={clsx(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center relative",
            type === 'WALL' ? "bg-slate-600 shadow-lg" : isDark ? "bg-white/40" : "bg-white/20",
            type === 'HOLE' && "bg-black rounded-full scale-75 ring-4 ring-black/20"
        )}>
            {type === 'START' && <div className="w-3 h-3 bg-green-400 rounded-full opacity-50" />}
            {type === 'END' && <Flag className="text-red-500 fill-red-500 animate-bounce-slight" />}
            {type === 'STAR' && !isCollected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <Star className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
                </motion.div>
            )}
            {type === 'WALL' && (
                <div className="w-full h-full bg-gradient-to-b from-slate-500 to-slate-700 rounded-md border-t border-white/20" />
            )}
        </div>
    );
};

const Player = ({ x, y, dir, rows, cols }: { x: number, y: number, dir: Direction, rows: number, cols: number }) => {
    // Calculate position based on grid index
    // Since the grid is rendered with gap-1 and padding, we need to match that.
    // Actually, it's easier to position absolute within the grid container, but we rendered tiles.
    // We can overlay the player on top using absolute positioning relative to the grid container.
    // BUT the grid container size varies.
    // Simplest way: Render player INSIDE the grid structure? No, it moves between cells.
    // Better: Render player as a sibling to the grid rows, but we need exact pixel coords.
    // OR: Render player in a specialized grid cell that spans everything? No.
    
    // Let's use CSS Grid for positioning the player wrapper!
    // The wrapper covers the whole grid area.
    
    // Position Logic:
    // x, y are 0-indexed.
    // We can use `transform: translate(x * size, y * size)` but we need to know the size.
    
    // Alternative: Use a separate grid purely for the player that overlays perfectly.
    
    return (
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                padding: '0.5rem', // Match p-2 (0.5rem) of grid container
                gap: '0.25rem', // Match gap-1 (0.25rem)
                width: 'max-content', // Ensure it matches the inner grid
                margin: 'auto' // Center it
            }}
        >
            <motion.div
                className="relative z-10 flex items-center justify-center"
                layout 
                initial={false}
                animate={{ 
                    gridColumnStart: x + 1,
                    gridRowStart: y + 1,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <Robot dir={dir} />
            </motion.div>
        </div>
    );
};

const Robot = ({ dir }: { dir: Direction }) => {
    const rotation = {
        'UP': 0,
        'RIGHT': 90,
        'DOWN': 180,
        'LEFT': 270
    };

    return (
        <motion.div 
            animate={{ rotate: rotation[dir] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-10 h-10 bg-white rounded-xl shadow-xl border-2 border-gray-200 flex items-center justify-center relative"
        >
            {/* Eyes */}
            <div className="absolute top-2 flex gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-black rounded-full animate-pulse delay-75" />
            </div>
            {/* Body */}
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl opacity-20 absolute inset-0" />
        </motion.div>
    );
};
