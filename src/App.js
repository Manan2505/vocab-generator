import { useState, useEffect, useMemo } from "react";
import { initialGates } from "./data/gatesData";

export default function App() {
  const [gates] = useState(initialGates);
  const [activeGate, setActiveGate] = useState(Object.keys(initialGates)[0] || "Gate 1");
  const [visible, setVisible] = useState({});
  const [randomIndex, setRandomIndex] = useState(null); // This now stores the key of the random word
  const [searchQuery, setSearchQuery] = useState("");

  const [markedWords, setMarkedWords] = useState(() => {
    const saved = localStorage.getItem("marked_vocab_app");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("marked_vocab_app", JSON.stringify(markedWords));
  }, [markedWords]);

  // Global Search Logic
  const filteredWords = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return (gates[activeGate] || []).map((item, index) => ({
        ...item,
        originalIndex: index,
        gateSource: activeGate,
        globalKey: `${activeGate}-${index}`
      }));
    }

    const results = [];
    Object.keys(gates).forEach((gateName) => {
      gates[gateName].forEach((item, index) => {
        if (
          item.word.toLowerCase().includes(query) ||
          item.meaning.toLowerCase().includes(query)
        ) {
          results.push({
            ...item,
            originalIndex: index,
            gateSource: gateName,
            globalKey: `${gateName}-${index}`
          });
        }
      });
    });
    return results;
  }, [searchQuery, activeGate, gates]);

  // Reset random word when gate or search changes
  useEffect(() => {
    setRandomIndex(null);
  }, [activeGate, searchQuery]);

  const generateRandomWord = () => {
    if (filteredWords.length === 0) return;
    const selection = Math.floor(Math.random() * filteredWords.length);
    // Store the globalKey of the selected word
    setRandomIndex(filteredWords[selection].globalKey);
    setVisible({}); 
  };

  const toggleMeaning = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMarked = (key) => {
    setMarkedWords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Helper to find the specific word object for the Random Highlight box
  const randomWordData = filteredWords.find(w => w.globalKey === randomIndex);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-800 p-4 lg:sticky lg:top-0 lg:h-screen overflow-x-auto lg:overflow-y-auto">
        <h2 className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Categories
        </h2>
        <div className="flex lg:flex-col gap-2">
          {Object.keys(gates).map((gate) => (
            <button
              key={gate}
              onClick={() => {
                setActiveGate(gate);
                setSearchQuery("");
              }}
              className={`flex-shrink-0 flex items-center justify-between px-4 py-2 lg:p-3 rounded-lg transition-colors min-w-fit lg:w-full ${
                activeGate === gate && !searchQuery
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="font-medium mr-3 lg:mr-0">{gate}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-950 text-gray-500">
                {gates[gate].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <header className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {searchQuery ? "Global Search" : activeGate}
            </h1>
            <button
              onClick={generateRandomWord}
              className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-lg shadow-green-900/20"
            >
              Generate Random Word
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search across all categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-5 pl-12 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
          </div>
        </header>

        {/* Random Word Highlight Box */}
        {randomWordData && (
          <div className={`p-5 md:p-6 mb-8 rounded-xl border transition-all duration-300 ${
            markedWords[randomWordData.globalKey] 
              ? "bg-yellow-900/20 border-yellow-500/40" 
              : "bg-green-900/10 border-green-500/40"
          }`}>
            <div className="flex flex-col gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                markedWords[randomWordData.globalKey] ? "text-yellow-500" : "text-green-500"
              }`}>
                {randomWordData.gateSource} • Random Selection
              </span>
              <p className="font-bold text-xl md:text-3xl text-white">
                {randomWordData.word}
              </p>
              
              {visible[randomWordData.globalKey] && (
                <p className="mt-3 text-gray-300 leading-relaxed text-sm md:text-lg border-t border-white/5 pt-3">
                  {randomWordData.meaning}
                </p>
              )}
              
              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={() => toggleMeaning(randomWordData.globalKey)}
                  className={`text-sm font-bold ${
                    markedWords[randomWordData.globalKey] ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {visible[randomWordData.globalKey] ? "↑ Hide Meaning" : "↓ Show Meaning"}
                </button>
                <button 
                  onClick={() => toggleMarked(randomWordData.globalKey)}
                  className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {markedWords[randomWordData.globalKey] ? "★ Unmark" : "☆ Mark for Review"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Word List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((item) => {
              const isMarked = markedWords[item.globalKey];
              
              return (
                <div 
                  key={item.globalKey} 
                  className={`p-4 md:p-5 rounded-xl border transition-all duration-200 ${
                    isMarked ? "bg-yellow-900/10 border-yellow-600/30" : "bg-gray-900 border-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">
                        {item.gateSource}
                      </span>
                      <p className={`font-bold text-lg ${isMarked ? "text-yellow-400" : "text-gray-100"}`}>
                        {item.word}
                      </p>
                    </div>
                    <button 
                      onClick={() => toggleMarked(item.globalKey)}
                      className={`text-xl transition-all active:scale-125 ${
                        isMarked ? "text-yellow-500" : "text-gray-700 hover:text-gray-500"
                      }`}
                    >
                      {isMarked ? "★" : "☆"}
                    </button>
                  </div>

                  {visible[item.globalKey] && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        {item.meaning}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => toggleMeaning(item.globalKey)}
                    className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {visible[item.globalKey] ? "Hide Meaning" : "Show Meaning"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-gray-500 italic">
              No words found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}