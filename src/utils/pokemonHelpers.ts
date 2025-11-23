export const MONSTER_COUNT = 8;

export const getMonsterType = (x: number, y: number): number => {
    return (x * 3 + y * 7) % MONSTER_COUNT;
};

export const MONSTER_NAMES = [
    "Meowth", // Cat
    "Growlithe", // Dog
    "Bunnelby", // Rabbit
    "Caterpie", // Bug
    "Pidgey", // Bird
    "Magikarp", // Fish
    "Gastly", // Ghost
    "Pikachu" // Zap
];
