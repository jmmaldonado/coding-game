import React from 'react';
import type { Instruction, InstructionType } from '../types/game';
import { ArrowRight, Undo2, Redo2, Repeat, Star, Square, Footprints } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface BlockProps {
  instruction: Instruction;
}

export const BlockIcon = ({ type }: { type: InstructionType }) => {
  switch (type) {
    case 'MOVE_FORWARD': return <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />;
    case 'TURN_LEFT': return <Undo2 className="w-4 h-4 md:w-5 md:h-5" />;
    case 'TURN_RIGHT': return <Redo2 className="w-4 h-4 md:w-5 md:h-5" />;
    case 'JUMP': return <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -rotate-45" />; 
    case 'LOOP': return <Repeat className="w-4 h-4 md:w-5 md:h-5" />;
    case 'WHILE_PATH': return <Footprints className="w-4 h-4 md:w-5 md:h-5" />;
    case 'IF_STAR': return <Star className="w-4 h-4 md:w-5 md:h-5" />;
    case 'IF_WALL': return <Square className="w-4 h-4 md:w-5 md:h-5" />;
    default: return null;
  }
};

export const BlockLabel = ({ type, loopCount }: { type: InstructionType, loopCount?: number }) => {
  switch (type) {
    case 'MOVE_FORWARD': return 'Move';
    case 'TURN_LEFT': return 'Left';
    case 'TURN_RIGHT': return 'Right';
    case 'JUMP': return 'Jump';
    case 'LOOP': return `Loop ${loopCount}x`;
    case 'WHILE_PATH': return 'While Path';
    case 'IF_STAR': return 'If Star';
    case 'IF_WALL': return 'If Wall';
    default: return type;
  }
};

export const getBlockColor = (type: InstructionType) => {
  if (type === 'LOOP' || type === 'WHILE_PATH' || type.startsWith('IF')) return 'bg-accent border-b-4 border-yellow-600 text-black';
  if (type.startsWith('TURN')) return 'bg-secondary border-b-4 border-pink-700 text-white';
  return 'bg-primary border-b-4 border-violet-700 text-white';
};

export const Block: React.FC<BlockProps> = ({ instruction }) => {
  const selectedBlockId = useGameStore(s => s.selectedBlockId);
  const activeInstructionId = useGameStore(s => s.activeInstructionId);
  const setSelectedBlockId = useGameStore(s => s.setSelectedBlockId);
  const updateInstruction = useGameStore(s => s.updateInstruction);
  // const removeInstruction = useGameStore(s => s.removeInstruction); // Removed for drag-to-delete (future)

  const isSelected = selectedBlockId === instruction.id;
  const isActive = activeInstructionId === instruction.id;
  
  const handleLoopChange = (delta: number) => {
      if (instruction.type !== 'LOOP' || typeof instruction.loopCount !== 'number') return;
      const newCount = Math.max(2, Math.min(9, instruction.loopCount + delta)); // Limit 2-9
      updateInstruction(instruction.id, { loopCount: newCount });
  };

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
        if (isSelected) {
          setSelectedBlockId(null);
        } else {
          setSelectedBlockId(instruction.id);
        }
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isSelected ? 1.05 : 1, opacity: 1 }}
      className={clsx(
        "relative rounded-xl font-bold shadow-sm select-none touch-none transition-all cursor-pointer",
        // Mobile: Smaller (text-xs), compact. Desktop: Full width.
        "w-auto min-w-[90px] max-w-[140px] md:w-full md:max-w-none md:min-w-0",
        getBlockColor(instruction.type),
        isActive && "ring-4 ring-green-400 z-20",
        isSelected && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-white z-10"
      )}
    >
      <div className="flex items-center gap-2 p-2 md:p-3">
        <BlockIcon type={instruction.type} />
        
        {instruction.type === 'LOOP' ? (
             <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm">Loop</span>
                <div className="flex items-center bg-black/20 rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => handleLoopChange(-1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-xs active:scale-90 transition"
                    >-</button>
                    <span className="mx-1 text-xs font-mono min-w-[12px] text-center">{instruction.loopCount}</span>
                     <button 
                        onClick={() => handleLoopChange(1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-xs active:scale-90 transition"
                    >+</button>
                </div>
             </div>
        ) : (
            <span className="text-xs md:text-sm"><BlockLabel type={instruction.type} loopCount={instruction.loopCount} /></span>
        )}
      </div>

      {/* Render Children if any */}
      {instruction.instructions && (
        <div className={clsx(
            "pl-2 pr-2 pb-2 bg-black/10 rounded-b-xl min-h-[40px] border-t border-black/5",
            "flex flex-wrap gap-2 md:block md:space-y-2"
        )}>
            {instruction.instructions.length === 0 && (
                <div className="w-full text-[10px] md:text-xs opacity-50 py-1 text-center">Add blocks</div>
            )}
            
            {/* Note: Nested reordering is complex. For now, we render children as static blocks recursively. 
                Making them reorderable requires a recursive Reorder.Group which we haven't set up here.
                We display them, but reordering might be limited to top level for this iteration unless we refactor.
            */}
             {instruction.instructions.map(child => (
                <Block 
                    key={child.id} 
                    instruction={child} 
                />
            ))}
        </div>
      )}
    </motion.div>
  );
};