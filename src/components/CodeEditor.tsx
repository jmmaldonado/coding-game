import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Block } from './Block';

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
  const code = useGameStore((state) => state.code);
  const setSelectedBlockId = useGameStore((state) => state.setSelectedBlockId);

  return (
    <div 
        className={`flex flex-col overflow-hidden ${className}`} 
        onClick={() => setSelectedBlockId(null)}
    >
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

