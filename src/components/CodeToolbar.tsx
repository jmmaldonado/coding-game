import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowUp, ArrowDown, Trash2, Play, Square, RotateCcw, Ban } from 'lucide-react';

export const CodeToolbar: React.FC = () => {
  const code = useGameStore((state) => state.code);
  const selectedBlockId = useGameStore((state) => state.selectedBlockId);
  const removeInstruction = useGameStore((state) => state.removeInstruction);
  const reorderInstructions = useGameStore((state) => state.reorderInstructions);
  const setSelectedBlockId = useGameStore((state) => state.setSelectedBlockId);
  
  // Game Controls State
  const isPlaying = useGameStore(s => s.isPlaying);
  const runGame = useGameStore(s => s.runGame);
  const stopGame = useGameStore(s => s.stopGame);
  const resetLevel = useGameStore(s => s.resetLevel);
  const setCode = useGameStore(s => s.reorderInstructions); // Hack to clear code: setCode([])

  const handleMove = (direction: 'up' | 'down') => {
    if (!selectedBlockId) return;
    
    const index = code.findIndex(i => i.id === selectedBlockId);
    if (index === -1) return;

    const newCode = [...code];
    if (direction === 'up' && index > 0) {
        [newCode[index], newCode[index - 1]] = [newCode[index - 1], newCode[index]];
        reorderInstructions(newCode);
    } else if (direction === 'down' && index < newCode.length - 1) {
        [newCode[index], newCode[index + 1]] = [newCode[index + 1], newCode[index]];
        reorderInstructions(newCode);
    }
  };

  const handleDelete = () => {
      if (selectedBlockId) {
          removeInstruction(selectedBlockId);
          setSelectedBlockId(null);
      }
  };

  // Block Controls
  if (selectedBlockId) {
    return (
        <div className="flex items-center gap-1">
            <button 
                onClick={() => handleMove('up')}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                title="Move Up"
            >
                <ArrowUp className="w-4 h-4" />
            </button>
            <button 
                onClick={() => handleMove('down')}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                title="Move Down"
            >
                <ArrowDown className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button 
                onClick={handleDelete}
                className="p-1.5 bg-red-50 border border-red-100 rounded-lg text-red-500 hover:bg-red-100 active:scale-95 transition"
                title="Remove Block"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
  }

  // Game Controls (When nothing selected)
  return (
    <div className="flex items-center gap-1">
        {!isPlaying ? (
            <button 
                onClick={runGame}
                disabled={code.length === 0}
                className="flex items-center gap-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs shadow-sm active:translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Run Code"
            >
                <Play className="w-3 h-3 fill-white" /> RUN
            </button>
        ) : (
            <button 
                onClick={stopGame}
                className="flex items-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xs shadow-sm active:translate-y-0.5 transition"
                title="Stop"
            >
                <Square className="w-3 h-3 fill-white" /> STOP
            </button>
        )}
        
        <div className="w-px h-4 bg-gray-300 mx-1" />
        
        <button 
            onClick={resetLevel}
            className="p-1.5 bg-white border border-gray-200 rounded-lg text-yellow-500 hover:bg-yellow-50 active:scale-95 transition"
            title="Reset Level"
        >
            <RotateCcw className="w-4 h-4" />
        </button>

        <button 
            onClick={() => { if(confirm("Clear all code?")) setCode([]); }}
            className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 active:scale-95 transition"
            title="Clear Code"
        >
            <Ban className="w-4 h-4" />
        </button>
    </div>
  );
};
