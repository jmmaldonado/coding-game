import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="p-2 sm:p-4 flex justify-center items-center bg-blue-50 rounded-2xl shadow-inner w-full h-full overflow-auto">
        <div 
            className="relative grid gap-0.5 sm:gap-1 bg-blue-200 p-1 sm:p-2 rounded-xl shrink-0"
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
            "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded flex items-center justify-center relative",
            type === 'WALL' ? "bg-slate-600 shadow-sm" : isDark ? "bg-white/40" : "bg-white/20",
            type === 'HOLE' && "bg-black rounded-full scale-75 ring-2 ring-black/20"
        )}>
            {type === 'START' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full opacity-50" />}
            {type === 'END' && <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500 animate-bounce-slight" />}
            {type === 'STAR' && (
                <AnimatePresence>
                    {!isCollected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, transition: { delay: 0.3, duration: 0.2 } }}
                        >
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
            {type === 'WALL' && (
                <div className="w-full h-full bg-gradient-to-b from-slate-500 to-slate-700 rounded border-t border-white/20" />
            )}
        </div>
    );
};

const Player = ({ x, y, dir, rows, cols }: { x: number, y: number, dir: Direction, rows: number, cols: number }) => {
    // ... code omitted ...
    return (
        <div 
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                padding: '0.25rem', // Match p-1 (0.25rem) or p-2 dynamically... wait. 
                // We hardcoded p-1 (0.25rem) for mobile in grid container above.
                // But on sm it is p-2 (0.5rem). 
                // We need to match that responsive padding or use percentage.
                // Since inline styles don't support media queries easily, let's use a class that matches the parent's padding.
                gap: '0.125rem', // Match gap-0.5
                // Actually, let's reuse the same classes in a clever way or just accept the tiny misalignment on resize if we don't match perfect via CSS classes.
                // Best way: Apply the EXACT SAME classes to this container as the parent, but absolutely positioned.
                
                // Let's use Tailwind classes for padding/gap to match parent exactly!
            }}
            className="absolute inset-0 pointer-events-none grid gap-0.5 sm:gap-1 p-1 sm:p-2"
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
    const rotationMap: Record<Direction, number> = React.useMemo(() => ({
        'UP': 0,
        'RIGHT': 90,
        'DOWN': 180,
        'LEFT': 270
    }), []);

    // Initialize state with the mapping of the initial direction
    const [rotationState, setRotationState] = React.useState(rotationMap[dir]);

    // Update rotation when direction changes
    React.useEffect(() => {
        const targetBase = rotationMap[dir];
        const normalize = (angle: number) => ((angle % 360) + 360) % 360;
        
        setRotationState(currentRotation => {
             const currentNormalized = normalize(currentRotation);
             let delta = targetBase - currentNormalized;
             
             // Find shortest path (e.g. 270 -> 0 should be +90, not -270)
             if (delta > 180) delta -= 360;
             if (delta < -180) delta += 360;
             
             return currentRotation + delta;
        });
    }, [dir, rotationMap]);

    return (
        <motion.div 
            animate={{ rotate: rotationState }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center relative"
        >
            {/* Eyes */}
            <div className="absolute top-1 sm:top-1.5 flex gap-0.5 sm:gap-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full animate-pulse" />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full animate-pulse delay-75" />
            </div>
            {/* Body */}
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 rounded opacity-20 absolute inset-0" />
        </motion.div>
    );
};

