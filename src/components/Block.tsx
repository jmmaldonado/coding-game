import React from 'react';
import type { Instruction, InstructionType } from '../types/game';
import { ArrowRight, Undo2, Redo2, Repeat, Star, Square } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface BlockProps {
  instruction: Instruction;
}

export const BlockIcon = ({ type }: { type: InstructionType }) => {
  switch (type) {
    case 'MOVE_FORWARD': return <ArrowRight className="w-5 h-5" />;
    case 'TURN_LEFT': return <Undo2 className="w-5 h-5" />;
    case 'TURN_RIGHT': return <Redo2 className="w-5 h-5" />;
    case 'JUMP': return <ArrowRight className="w-5 h-5 -rotate-45" />; 
    case 'LOOP': return <Repeat className="w-5 h-5" />;
    case 'IF_STAR': return <Star className="w-5 h-5" />;
    case 'IF_WALL': return <Square className="w-5 h-5" />;
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
    case 'IF_STAR': return 'If Star';
    case 'IF_WALL': return 'If Wall';
    default: return type;
  }
};

export const getBlockColor = (type: InstructionType) => {
  if (type === 'LOOP' || type.startsWith('IF')) return 'bg-accent border-b-4 border-yellow-600 text-black';
  if (type.startsWith('TURN')) return 'bg-secondary border-b-4 border-pink-700 text-white';
  return 'bg-primary border-b-4 border-violet-700 text-white';
};

export const Block: React.FC<BlockProps> = ({ instruction }) => {
  const selectedBlockId = useGameStore(s => s.selectedBlockId);
  const activeInstructionId = useGameStore(s => s.activeInstructionId);
  const setSelectedBlockId = useGameStore(s => s.setSelectedBlockId);
  const removeInstruction = useGameStore(s => s.removeInstruction);

  const isSelected = selectedBlockId === instruction.id;
  const isActive = activeInstructionId === instruction.id;

  return (
    <motion.div
      layout
      onClick={(e) => { e.stopPropagation(); setSelectedBlockId(instruction.id); }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isSelected ? 1.05 : 1, opacity: 1 }}
      className={clsx(
        "relative rounded-xl font-bold shadow-sm select-none touch-none transition-all cursor-pointer",
        // Mobile: Compact, flexible width, no auto margin. Desktop: Full width.
        "w-auto min-w-[110px] max-w-[160px] md:w-full md:max-w-none md:min-w-0",
        getBlockColor(instruction.type),
        isActive && "ring-4 ring-green-400 z-20",
        isSelected && "ring-4 ring-white z-10"
        // mb-2 removed, handled by parent gap
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <BlockIcon type={instruction.type} />
        <span className="text-sm"><BlockLabel type={instruction.type} loopCount={instruction.loopCount} /></span>
        
        <button 
          onClick={(e) => { e.stopPropagation(); removeInstruction(instruction.id); }}
          className="ml-auto p-1 hover:bg-black/10 rounded-full"
        >
          ✕
        </button>
      </div>

      {/* Render Children if any */}
      {instruction.instructions && (
        <div className={clsx(
            "pl-2 pr-2 pb-2 bg-black/10 rounded-b-xl min-h-[40px] border-t border-black/5",
            // Mobile: Wrap children. Desktop: Stack children.
            "flex flex-wrap gap-2 md:block md:space-y-2"
        )}>
            {instruction.instructions.length === 0 && (
                <div className="w-full text-xs opacity-50 py-2 text-center">Tap here to add</div>
            )}
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