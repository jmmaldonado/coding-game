import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { levels } from './data/levels';
import { GridBoard } from './components/GridBoard';
import { CodeEditor } from './components/CodeEditor';
import { Palette } from './components/Palette';
import { CodeToolbar } from './components/CodeToolbar';
import { GameLoop } from './components/GameLoop';
import { Overlay } from './components/Overlay';
import { Menu, X, Download, Upload, Trophy, Star, Key, Book, Cat, Dog, Rabbit, Bug, Bird, Fish, Ghost, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { MONSTER_NAMES, MONSTER_COUNT } from './utils/pokemonHelpers';

function App() {
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const loadLevel = useGameStore(s => s.loadLevel);
  const unlockedLevels = useGameStore(s => s.unlockedLevels);
  const levelRecords = useGameStore(s => s.levelRecords);
  const developerMode = useGameStore(s => s.developerMode);
  const toggleDeveloperMode = useGameStore(s => s.toggleDeveloperMode);
  const exportSave = useGameStore(s => s.exportSave);
  const importSave = useGameStore(s => s.importSave);
  // const codeLength = useGameStore(s => s.code.length); // Removed, using total count
  const getInstructionCount = useGameStore(s => s.getInstructionCount);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const code = useGameStore(s => s.code); // Subscribe to code changes to trigger re-render of count
    
    const isMenuOpen = useGameStore(s => s.isMenuOpen);
  const setMenuOpen = useGameStore(s => s.setMenuOpen);
  const collectedKeys = useGameStore(s => s.collectedKeys);
  const collectedStars = useGameStore(s => s.collectedStars);
  const pokedex = useGameStore(s => s.pokedex);
  
  // Local state for Pokedex modal
  const [isPokedexOpen, setPokedexOpen] = useState(false);
  
  const currentLevel = levels.find(l => l.id === currentLevelId);
  const instructionCount = getInstructionCount();
  const keysCount = collectedKeys.length;
  const maxKeys = currentLevel?.grid.flat().filter(t => t === 'KEY').length || 0;
  
  // Calculate max stars for current level (number of 'STAR' tiles)
  const maxStars = currentLevel?.grid.flat().filter(t => t === 'STAR').length || 0;
  const starsCollectedCount = collectedStars.length;
  
  const monsterIcons = [Cat, Dog, Rabbit, Bug, Bird, Fish, Ghost, Zap];
    
    
    
      // Init Level on Mount to ensure playerState is correct
    
    
  useEffect(() => {
      loadLevel(currentLevelId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  const handleImport = () => {
      const data = prompt("Paste your save code here:");
      if (data) {
          if (importSave(data)) alert("Loaded!");
          else alert("Invalid code.");
      }
  };

  const handleExport = () => {
      const code = exportSave();
      prompt("Copy this code to save your progress:", code);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-gray-800 font-sans overflow-hidden">
      <GameLoop />
      <Overlay />

      {/* Header */}
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
            <div 
                onClick={(e) => {
                    if (e.detail === 3) {
                        toggleDeveloperMode();
                    }
                }}
                className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md cursor-pointer select-none transition-colors",
                    developerMode ? "bg-red-500" : "bg-primary"
                )}
                title="Codey's Quest"
            >
                C
            </div>
            <div>
                <h1 className="font-bold text-lg leading-tight">Codey's Quest</h1>
                <p className="text-xs text-gray-500">{currentLevel?.name}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setPokedexOpen(true)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:scale-95 transition flex items-center gap-1 font-bold text-xs"
            >
                <Book className="w-4 h-4" /> <span className="hidden sm:inline">DEX</span>
            </button>
            <button 
                onClick={() => setMenuOpen(true)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition"
            >
                <Menu />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Grid Area */}
        <div className="flex-1 bg-blue-50 flex flex-col items-center justify-center p-4 min-h-[300px] relative">
             <div className="absolute top-2 left-4 right-4 bg-white/80 backdrop-blur p-3 rounded-xl text-sm text-center text-blue-800 shadow-sm z-10 pointer-events-none">
                {currentLevel?.tutorialText}
             </div>
             <GridBoard />
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-white flex flex-col border-l border-gray-200 shadow-xl z-10 max-h-[50vh] md:max-h-full md:w-[400px] md:flex-none">
            <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-500 text-sm flex justify-between items-center h-12 gap-2 overflow-hidden">
                <div className="flex items-center gap-2 shrink-0">
                    {maxStars > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-yellow-700 shrink-0">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold font-mono">{starsCollectedCount}/{maxStars}</span>
                        </div>
                    )}
                    
                    {maxKeys > 0 && (
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-blue-700 shrink-0">
                            <Key className="w-3 h-3 sm:w-4 sm:h-4 fill-blue-500 text-blue-500" />
                            <span className="text-xs font-bold font-mono">{keysCount}/{maxKeys}</span>
                        </div>
                    )}

                    <span className="hidden sm:inline text-xs font-bold text-gray-400 uppercase tracking-wider">BLOCKS</span>
                    <span className={clsx(
                        "text-xs px-2 py-1 rounded font-mono bg-gray-200 min-w-[20px] text-center"
                    )}>
                        {instructionCount}
                    </span>
                    {levelRecords[currentLevelId] && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 font-bold ml-1 whitespace-nowrap">
                            <Trophy className="w-3 h-3" /> {levelRecords[currentLevelId]}
                        </span>
                    )}
                </div>
                <div className="shrink-0">
                    <CodeToolbar />
                </div>
            </div>
            <CodeEditor className="flex-1" />
            <Palette />
        </div>
      </main>

      {/* Level Menu Modal */}
      {isMenuOpen && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end md:justify-center md:items-center">
              <div className="bg-white w-full h-full md:w-[600px] md:h-[500px] md:rounded-3xl p-6 flex flex-col animate-slide-in md:animate-pop-in">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Levels</h2>
                      <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 overflow-y-auto p-2">
                      {levels.map(l => {
                          const isUnlocked = unlockedLevels.includes(l.id) || developerMode;
                          const record = levelRecords[l.id];
                          return (
                              <button 
                                key={l.id}
                                disabled={!isUnlocked}
                                onClick={() => { loadLevel(l.id); setMenuOpen(false); }}
                                className={clsx(
                                    "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 font-bold transition-all relative",
                                    isUnlocked 
                                        ? l.id === currentLevelId ? "bg-primary text-white ring-4 ring-primary/30" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                )}
                              >
                                  <span className="text-xl">{l.id}</span>
                                  {record !== undefined && (
                                      <div className="bg-white/50 px-2 py-0.5 rounded-full text-xs text-black/70 font-mono flex items-center gap-1">
                                          <Trophy className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {record}
                                      </div>
                                  )}
                                  {!isUnlocked && <div className="text-xs">Locked</div>}
                              </button>
                          )
                      })}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex gap-2">
                      <button onClick={handleExport} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
                          <Download className="w-4 h-4" /> Save Progress
                      </button>
                      <button onClick={handleImport} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
                          <Upload className="w-4 h-4" /> Load
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Pokedex Modal */}
      {isPokedexOpen && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
              <div className="bg-red-500 w-full h-full md:w-[600px] md:h-[500px] md:rounded-3xl p-6 flex flex-col animate-pop-in border-4 border-red-700 shadow-2xl relative">
                   <div className="flex justify-between items-center mb-6 text-white">
                      <h2 className="text-2xl font-black tracking-wider flex items-center gap-2"><Book /> POKEDEX</h2>
                      <button onClick={() => setPokedexOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><X /></button>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-inner">
                      {Array.from({ length: MONSTER_COUNT }).map((_, i) => {
                          const isCaught = pokedex.includes(i);
                          const Icon = monsterIcons[i];
                          return (
                              <div key={i} className={clsx(
                                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-2 border-2",
                                  isCaught ? "bg-white border-red-100" : "bg-gray-100 border-gray-200"
                              )}>
                                  {isCaught ? (
                                      <>
                                        <Icon className="w-10 h-10 text-purple-600" />
                                        <span className="font-bold text-sm text-gray-700">{MONSTER_NAMES[i]}</span>
                                      </>
                                  ) : (
                                      <>
                                        <div className="w-10 h-10 text-gray-300 flex items-center justify-center font-black text-2xl">?</div>
                                        <span className="font-bold text-xs text-gray-300">???</span>
                                      </>
                                  )}
                              </div>
                          );
                      })}
                  </div>
                  
                  <div className="mt-4 text-center text-white/80 font-mono text-sm">
                      CAUGHT: {pokedex.length} / {MONSTER_COUNT}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default App;