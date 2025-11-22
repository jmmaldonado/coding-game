import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { RefreshCcw, ArrowRight, Trophy, Menu } from 'lucide-react';
import { clsx } from 'clsx';

export const Overlay: React.FC = () => {
  const gameStatus = useGameStore(s => s.gameStatus);
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const error = useGameStore(s => s.error);
  const getInstructionCount = useGameStore(s => s.getInstructionCount);
  
  const loadLevel = useGameStore(s => s.loadLevel);
  const resetLevel = useGameStore(s => s.resetLevel);
  const setMenuOpen = useGameStore(s => s.setMenuOpen);
  
  const isLastLevel = currentLevelId === levels.length;
  const currentLevel = levels.find(l => l.id === currentLevelId);
  
  const instructionCount = getInstructionCount();
  const par = currentLevel?.bestBlockCount || 999;
  
  let starsEarned = 1;
  if (instructionCount <= par) starsEarned = 3;
  else if (instructionCount <= par + 2) starsEarned = 2;

  React.useEffect(() => {
      if (gameStatus === 'WON') {
          // Unlock next level
          const nextId = currentLevelId + 1;
           useGameStore.setState(state => {
               const updates: any = {};
               if (!state.unlockedLevels.includes(nextId) && levels.find(l => l.id === nextId)) {
                   updates.unlockedLevels = [...state.unlockedLevels, nextId];
               }
               // Add stars to total? (Simplified logic: just add 1 per win for now to avoid complex per-level tracking refactor)
               // updates.stars = state.stars + starsEarned; 
               return updates;
           });
      }
  }, [gameStatus, currentLevelId]);

  if (gameStatus === 'IDLE' || gameStatus === 'RUNNING') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center"
        >
            {gameStatus === 'WON' ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2 mb-2">
                        {[1, 2, 3].map(i => (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: i * 0.2, type: "spring" }}
                            >
                                <Trophy 
                                    className={clsx(
                                        "w-12 h-12",
                                        i <= starsEarned ? "text-yellow-400 fill-yellow-400 drop-shadow-lg" : "text-gray-200"
                                    )} 
                                />
                            </motion.div>
                        ))}
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-800">Level Complete!</h2>
                    <div className="bg-gray-50 rounded-xl p-4 w-full">
                        <p className="text-gray-500 text-sm mb-1">Blocks Used</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {instructionCount} <span className="text-gray-400 text-base">/ {par}</span>
                        </p>
                        {starsEarned === 3 && (
                            <p className="text-green-500 font-bold text-sm mt-1">Perfect Score! 🌟</p>
                        )}
                    </div>
                    
                    {isLastLevel ? (
                         <>
                            <p className="text-gray-500">You are a coding master! You've finished all levels.</p>
                            <button 
                                onClick={() => { useGameStore.setState({ gameStatus: 'IDLE' }); setMenuOpen(true); }}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-violet-600 transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Menu /> Level Menu
                            </button>
                         </>
                    ) : (
                        <button 
                            onClick={() => loadLevel(currentLevelId + 1)}
                            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-600 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            Next Level <ArrowRight />
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">😅</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Oops!</h2>
                    <p className="text-gray-500">{error}</p>
                    
                    <button 
                        onClick={resetLevel}
                        className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-600 transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <RefreshCcw /> Try Again
                    </button>
                </div>
            )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
