import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { levels } from './data/levels';
import { GridBoard } from './components/GridBoard';
import { CodeEditor } from './components/CodeEditor';
import { Palette } from './components/Palette';
import { Controls } from './components/Controls';
import { GameLoop } from './components/GameLoop';
import { Overlay } from './components/Overlay';
import { Menu, X, Download, Upload } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const loadLevel = useGameStore(s => s.loadLevel);
  const unlockedLevels = useGameStore(s => s.unlockedLevels);
  const exportSave = useGameStore(s => s.exportSave);
  const importSave = useGameStore(s => s.importSave);
  const codeLength = useGameStore(s => s.code.length);
  
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  const currentLevel = levels.find(l => l.id === currentLevelId);

  // Init Level on Mount to ensure playerState is correct
  useEffect(() => {
      loadLevel(currentLevelId);
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
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                C
            </div>
            <div>
                <h1 className="font-bold text-lg leading-tight">Codey's Quest</h1>
                <p className="text-xs text-gray-500">{currentLevel?.name}</p>
            </div>
        </div>
        <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition"
        >
            <Menu />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Grid Area */}
        <div className="flex-1 bg-blue-50 flex flex-col items-center justify-center p-4 min-h-[300px] relative">
             <div className="absolute top-2 left-4 right-4 bg-white/80 backdrop-blur p-3 rounded-xl text-sm text-center text-blue-800 shadow-sm z-10 pointer-events-none">
                {currentLevel?.tutorialText}
             </div>
             <GridBoard />
             <div className="absolute bottom-4 right-4 flex gap-2">
                 <Controls />
             </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-white flex flex-col border-l border-gray-200 shadow-xl z-10 max-h-[50vh] md:max-h-full md:w-[400px] md:flex-none">
            <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-500 text-sm flex justify-between items-center">
                <span>YOUR CODE</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{codeLength} blocks</span>
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
                          const isUnlocked = unlockedLevels.includes(l.id);
                          return (
                              <button 
                                key={l.id}
                                disabled={!isUnlocked}
                                onClick={() => { loadLevel(l.id); setMenuOpen(false); }}
                                className={clsx(
                                    "aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 font-bold transition-all",
                                    isUnlocked 
                                        ? l.id === currentLevelId ? "bg-primary text-white ring-4 ring-primary/30" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                )}
                              >
                                  <span className="text-xl">{l.id}</span>
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
    </div>
  );
}

export default App;