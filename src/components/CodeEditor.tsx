import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Block } from './Block';
import type { Instruction } from '../types/game';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
  const code = useGameStore((state) => state.code);
  const selectedBlockId = useGameStore((state) => state.selectedBlockId);
  const removeInstruction = useGameStore((state) => state.removeInstruction);
  const reorderInstructions = useGameStore((state) => state.reorderInstructions);
  const setSelectedBlockId = useGameStore((state) => state.setSelectedBlockId);

  const handleMove = (direction: 'up' | 'down') => {
    if (!selectedBlockId) return;
    
    // Find index of selected block
    // Note: This simple implementation only works for top-level blocks for now.
    // Nested block reordering requires more complex tree traversal updates.
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

  return (
    <div className={`flex flex-col overflow-hidden ${className}`}>
        {/* Toolbar */}
        <div className="p-2 bg-gray-50 border-b border-gray-200 flex justify-end gap-2">
            <button 
                onClick={() => handleMove('up')}
                disabled={!selectedBlockId}
                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition"
                title="Move Up"
            >
                <ArrowUp className="w-4 h-4" />
            </button>
            <button 
                onClick={() => handleMove('down')}
                disabled={!selectedBlockId}
                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition"
                title="Move Down"
            >
                <ArrowDown className="w-4 h-4" />
            </button>
            <div className="w-px bg-gray-300 mx-1" />
            <button 
                onClick={handleDelete}
                disabled={!selectedBlockId}
                className="p-2 bg-red-50 border border-red-100 rounded-lg text-red-500 disabled:opacity-30 hover:bg-red-100 active:scale-95 transition"
                title="Remove Block"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>

       <div className="flex-1 p-4 overflow-y-auto">
            {code.length === 0 && (
                <div className="w-full text-center text-gray-400 mt-10 font-medium">
                Start by adding blocks from the menu below!
                </div>
            )}
            
            <div className="flex flex-row flex-wrap content-start gap-2 md:flex-col md:flex-nowrap">
                {code.map(inst => (
                    <Block key={inst.id} instruction={inst} />
                ))}
            </div>
       </div>
    </div>
  );
};

