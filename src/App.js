import { useState, useEffect } from "react";
import { initialGates } from "./data/gatesData";

export default function App() {
  const [gates, setGates] = useState(initialGates);
  const [activeGate, setActiveGate] = useState(Object.keys(initialGates)[0] || "Gate 1");
  const [visible, setVisible] = useState({});
  const [randomIndex, setRandomIndex] = useState(null);

  // 1. Persist marked words in LocalStorage
  const [markedWords, setMarkedWords] = useState(() => {
    const saved = localStorage.getItem("marked_vocab_app");
    return saved ? JSON.parse(saved) : {};
  });

  // Sync to local storage whenever markedWords changes
  useEffect(() => {
    localStorage.setItem("marked_vocab_app", JSON.stringify(markedWords));
  }, [markedWords]);

  // Reset UI states when switching gates
  useEffect(() => {
    setRandomIndex(null);
    setVisible({});
  }, [activeGate]);

  const generateRandomWord = () => {
    const words = gates[activeGate];
    if (!words || words.length === 0) return;
    const index = Math.floor(Math.random() * words.length);
    setRandomIndex(index);
    setVisible({}); // Optional: hide meanings when generating new word
  };

  const toggleMeaning = (index) => {
    setVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // 2. Toggle "Revisit" state with unique key (Gate + Index)
  const toggleMarked = (index) => {
    const key = `${activeGate}-${index}`;
    setMarkedWords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar / Top Navigation */}
      <div className="w-full lg:w-64 bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-800 p-4 lg:sticky lg:top-0 lg:h-screen overflow-x-auto lg:overflow-y-auto">
        <h2 className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Categories
        </h2>
        
        <div className="flex lg:flex-col gap-2">
          {Object.keys(gates).map((gate) => (
            <button
              key={gate}
              onClick={() => setActiveGate(gate)}
              className={`flex-shrink-0 flex items-center justify-between px-4 py-2 lg:p-3 rounded-lg transition-colors min-w-fit lg:w-full ${
                activeGate === gate
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="font-medium mr-3 lg:mr-0">{gate}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeGate === gate ? "bg-blue-500" : "bg-gray-950 text-gray-500"
              }`}>
                {gates[gate].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{activeGate}</h1>
          <button
            onClick={generateRandomWord}
            className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-lg shadow-green-900/20"
          >
            Generate Random Word
          </button>
        </header>

        {/* Random Word Highlight Box */}
        {randomIndex !== null && (
          <div className={`p-5 md:p-6 mb-8 rounded-xl border transition-all duration-300 ${
            markedWords[`${activeGate}-${randomIndex}`] 
              ? "bg-yellow-900/20 border-yellow-500/40" 
              : "bg-green-900/10 border-green-500/40"
          }`}>
            <div className="flex flex-col gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                markedWords[`${activeGate}-${randomIndex}`] ? "text-yellow-500" : "text-green-500"
              }`}>
                {markedWords[`${activeGate}-${randomIndex}`] ? "Marked for Review" : "Random Selection"}
              </span>
              <p className="font-bold text-xl md:text-3xl text-white">
                {gates[activeGate][randomIndex]?.word}
              </p>
              
              {visible[randomIndex] && (
                <p className="mt-3 text-gray-300 leading-relaxed text-sm md:text-lg border-t border-white/5 pt-3">
                  {gates[activeGate][randomIndex]?.meaning}
                </p>
              )}
              
              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={() => toggleMeaning(randomIndex)}
                  className={`text-sm font-bold ${
                    markedWords[`${activeGate}-${randomIndex}`] ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {visible[randomIndex] ? "↑ Hide Meaning" : "↓ Show Meaning"}
                </button>
                <button 
                  onClick={() => toggleMarked(randomIndex)}
                  className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {markedWords[`${activeGate}-${randomIndex}`] ? "★ Unmark" : "☆ Mark for Review"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Word List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {gates[activeGate].map((item, index) => {
            const isMarked = markedWords[`${activeGate}-${index}`];
            return (
              <div 
                key={index} 
                className={`p-4 md:p-5 rounded-xl border transition-all duration-200 ${
                  isMarked 
                    ? "bg-yellow-900/10 border-yellow-600/30" 
                    : "bg-gray-900 border-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className={`font-bold text-lg ${isMarked ? "text-yellow-400" : "text-gray-100"}`}>
                    {item.word}
                  </p>
                  <button 
                    onClick={() => toggleMarked(index)}
                    className={`text-xl transition-all active:scale-125 ${
                      isMarked ? "text-yellow-500" : "text-gray-700 hover:text-gray-500"
                    }`}
                  >
                    {isMarked ? "★" : "☆"}
                  </button>
                </div>

                {visible[index] && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => toggleMeaning(index)}
                  className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {visible[index] ? "Hide Meaning" : "Show Meaning"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}