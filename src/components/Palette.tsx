import React from 'react';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { BlockIcon, BlockLabel, getBlockColor } from './Block';
import type { InstructionType } from '../types/game';
import { clsx } from 'clsx';

export const Palette: React.FC = () => {
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const addInstruction = useGameStore(s => s.addInstruction);
  const selectedBlockId = useGameStore(s => s.selectedBlockId);
  
  const level = levels.find(l => l.id === currentLevelId);
  if (!level) return null;

  const handleAdd = (type: InstructionType) => {
     addInstruction(type, selectedBlockId || undefined);
  };

  return (
    <div className="flex gap-2 overflow-x-auto p-4 bg-white border-t border-gray-200 shadow-up">
      {level.availableBlocks.map(type => (
        <button
          key={type}
          onClick={() => handleAdd(type)}
          className={clsx(
            "flex flex-col items-center justify-center min-w-[80px] flex-shrink-0 p-3 rounded-xl text-white font-bold shadow-sm active:scale-95 transition-transform",
            getBlockColor(type)
          )}
        >
          <BlockIcon type={type} />
          <span className="text-xs mt-1"><BlockLabel type={type} /></span>
        </button>
      ))}
    </div>
  );
};
