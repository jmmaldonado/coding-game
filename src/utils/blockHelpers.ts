import type { InstructionType } from '../types/game';

export const getBlockColor = (type: InstructionType) => {
  if (type === 'LOOP' || type === 'WHILE_PATH' || type.startsWith('IF')) return 'bg-accent border-b-4 border-yellow-600 text-black';
  if (type.startsWith('TURN')) return 'bg-secondary border-b-4 border-pink-700 text-white';
  return 'bg-primary border-b-4 border-violet-700 text-white';
};
