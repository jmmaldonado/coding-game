import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import type { TileType, Direction } from '../types/game';
import { Key, Lock, DoorOpen, Trees, Waves, Cat, Dog, Rabbit, Bug, Bird, Fish, Ghost, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { getMonsterType } from '../utils/pokemonHelpers';

// const TILE_SIZE = 48; // Pixels - unused, using CSS Grid

export const GridBoard: React.FC = () => {
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const playerState = useGameStore(s => s.playerState);
  const collectedStars = useGameStore(s => s.collectedStars); // List of "x,y" strings
  const collectedKeys = useGameStore(s => s.collectedKeys);
  const openedDoors = useGameStore(s => s.openedDoors);
  
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
                    <Tile 
                        key={`${x}-${y}`} 
                        type={tile} 
                        x={x} 
                        y={y} 
                        isCollected={collectedStars.includes(`${x},${y}`) || collectedKeys.includes(`${x},${y}`)} 
                        isOpen={openedDoors.includes(`${x},${y}`)}
                    />
                ))
            ))}
            
            {/* Player Layer - Inside the grid container for perfect alignment */}
            <Player x={playerState.x} y={playerState.y} dir={playerState.dir} animation={playerState.animation} rows={rows} cols={cols} />
        </div>
    </div>
  );
};

const Tile = ({ type, x, y, isCollected, isOpen }: { type: TileType, x: number, y: number, isCollected: boolean, isOpen?: boolean }) => {
    const isDark = (x + y) % 2 === 1;
    
    // Deterministic monster choice
    const monsters = [Cat, Dog, Rabbit, Bug, Bird, Fish, Ghost, Zap];
    const MonIcon = monsters[getMonsterType(x, y)];
    
    // Door style
    if (type === 'DOOR') {
         return (
             <div className={clsx(
                "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded flex items-center justify-center relative transition-all duration-700",
                isOpen ? "bg-emerald-100/50 ring-2 ring-emerald-200" : "bg-orange-800 shadow-md border-t-2 border-orange-600"
             )}>
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div 
                            key="open"
                            initial={{ scale: 0.5, opacity: 0, rotateY: 90 }} 
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                             <DoorOpen className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="closed"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-200/80" />
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
         );
    }
    
    return (
        <div className={clsx(
            "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded flex items-center justify-center relative overflow-hidden",
            type === 'WALL' ? "bg-emerald-600 shadow-sm" : type === 'HOLE' ? "bg-blue-400/30" : isDark ? "bg-white/40" : "bg-white/20",
            type === 'HOLE' && "rounded-full scale-90 ring-4 ring-blue-300/50"
        )}>
            {type === 'START' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full opacity-50" />}
            
            {type === 'END' && (
                <div className="relative w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
                     {/* Pokeball Graphic */}
                     <div className="absolute inset-0 bg-red-500 rounded-t-full h-[50%] top-0 z-10" />
                     <div className="absolute inset-0 bg-white rounded-b-full h-[50%] bottom-0 border-t-2 border-slate-800 z-10" />
                     <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full border-2 border-slate-800 z-20" />
                     <div className="absolute inset-0 rounded-full border-2 border-slate-800 z-20 pointer-events-none" />
                </div>
            )}

            {type === 'STAR' && (
                <AnimatePresence>
                    {!isCollected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, transition: { duration: 0.2 } }}
                        >
                            <MonIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 fill-purple-200 drop-shadow-md" />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
            
             {type === 'KEY' && (
                <AnimatePresence>
                    {!isCollected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, transition: { duration: 0.2 } }}
                        >
                            <Key className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 fill-blue-500 drop-shadow-md" />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
            
            {type === 'WALL' && (
                <div className="text-emerald-800/40">
                    <Trees className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
            )}
            
            {type === 'HOLE' && (
                 <div className="text-blue-500/50 animate-pulse">
                    <Waves className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
            )}
        </div>
    );
};

const Player = ({ x, y, dir, animation, rows, cols }: { x: number, y: number, dir: Direction, animation?: 'IDLE' | 'DENY', rows: number, cols: number }) => {
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
                <Robot dir={dir} animation={animation} />
            </motion.div>
        </div>
    );
};

const Robot = ({ dir, animation }: { dir: Direction, animation?: 'IDLE' | 'DENY' }) => {
    const rotationMap: Record<Direction, number> = React.useMemo(() => ({
        'UP': 0,
        'RIGHT': 90,
        'DOWN': 180,
        'LEFT': 270
    }), []);

    const [rotationState, setRotationState] = React.useState(rotationMap[dir]);

    React.useEffect(() => {
        const targetBase = rotationMap[dir];
        const normalize = (angle: number) => ((angle % 360) + 360) % 360;
        
        setRotationState(currentRotation => {
             const currentNormalized = normalize(currentRotation);
             let delta = targetBase - currentNormalized;
             if (delta > 180) delta -= 360;
             if (delta < -180) delta += 360;
             return currentRotation + delta;
        });
    }, [dir, rotationMap]);

    return (
        <motion.div 
            animate={{ 
                rotate: rotationState,
                x: animation === 'DENY' ? [0, -5, 5, -5, 5, 0] : 0
            }}
            transition={{ 
                rotate: { duration: 0.5, ease: "easeInOut" },
                x: { duration: 0.4, ease: "easeInOut" }
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center relative z-20"
        >
            {/* Ears */}
            <div className="absolute -top-1 sm:-top-2 left-0 w-2 h-3 sm:w-2.5 sm:h-4 bg-yellow-400 rounded-t-full border border-yellow-600 -rotate-12 z-0" />
            <div className="absolute -top-1 sm:-top-2 right-0 w-2 h-3 sm:w-2.5 sm:h-4 bg-yellow-400 rounded-t-full border border-yellow-600 rotate-12 z-0" />
            
            {/* Body */}
            <div className="w-full h-full bg-yellow-400 rounded-lg shadow-md border-2 border-yellow-600 flex items-center justify-center relative z-10 overflow-hidden">
                {/* Cheeks */}
                <div className="absolute top-1/2 left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full opacity-80" />
                <div className="absolute top-1/2 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full opacity-80" />

                {/* Eyes */}
                <div className="absolute top-1.5 sm:top-2 flex gap-1 sm:gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                </div>
                
                {/* Nose/Mouth */}
                 <div className="absolute top-3 sm:top-4 w-1 h-0.5 bg-black/50 rounded-full" />
            </div>
            
            {/* Tail (Simple) */}
            <div className="absolute -bottom-1 -left-1 w-2 h-4 sm:w-3 sm:h-6 bg-yellow-500 border border-yellow-700 -rotate-45 -z-10 skew-x-12" />
        </motion.div>
    );
};

