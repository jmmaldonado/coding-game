import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { RefreshCcw, ArrowRight, Trophy, Menu } from 'lucide-react';

export const Overlay: React.FC = () => {
  const gameStatus = useGameStore(s => s.gameStatus);
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const error = useGameStore(s => s.error);
  
  const loadLevel = useGameStore(s => s.loadLevel);
  const resetLevel = useGameStore(s => s.resetLevel);
  const setMenuOpen = useGameStore(s => s.setMenuOpen);
  
  const isLastLevel = currentLevelId === levels.length; // Assuming IDs are 1..N and sorted
  
  React.useEffect(() => {
      if (gameStatus === 'WON') {
          // Unlock next level
          const nextId = currentLevelId + 1;
           useGameStore.setState(state => {
               if (!state.unlockedLevels.includes(nextId) && levels.find(l => l.id === nextId)) {
                   return { unlockedLevels: [...state.unlockedLevels, nextId] };
               }
               return {};
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
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                    </div>
                    
                    {isLastLevel ? (
                         <>
                            <h2 className="text-3xl font-black text-gray-800">Quest Completed!</h2>
                            <p className="text-gray-500">You are a coding master! You've finished all levels.</p>
                            <button 
                                onClick={() => { useGameStore.setState({ gameStatus: 'IDLE' }); setMenuOpen(true); }}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-violet-600 transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Menu /> Level Menu
                            </button>
                         </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-black text-gray-800">Level Complete!</h2>
                            <p className="text-gray-500">Great job, Codey is happy!</p>
                            
                            <button 
                                onClick={() => loadLevel(currentLevelId + 1)}
                                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-600 transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                Next Level <ArrowRight />
                            </button>
                        </>
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
