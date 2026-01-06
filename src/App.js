import { useState,useEffect } from "react";
import { initialGates } from "./data/gatesData";

export default function App() {
  const [gates, setGates] = useState(initialGates);
  const [activeGate, setActiveGate] = useState("Gate 1");
  const [visible, setVisible] = useState({});
const [randomIndex, setRandomIndex] = useState(null);
// This ensures that when you switch tabs, the UI "refreshes"
useEffect(() => {
  setRandomIndex(null);
  // Reset the visible meanings object/array
  setVisible({}); 
}, [activeGate]);
const generateRandomWord = () => {
    const words = gates[activeGate];
    const index = Math.floor(Math.random() * words.length);
    setRandomIndex(index);
    setVisible({}); // reset meanings visibility
  };

  // const [visible, setVisible] = useState({});
  const toggleMeaning = (index) => {
    setVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addNewWords = (newWords) => {
    const gateCount = Object.keys(gates).length;
    const newGate = `Gate ${gateCount + 1}`;
    setGates({ ...gates, [newGate]: newWords });
  };

  // return (
  //   <div className="flex h-screen">
  //     {/* Sidebar */}
  //     <div className="w-48 bg-gray-100 p-4">
  //       {Object.keys(gates).map((gate) => (
          
  //         <button
  //           key={gate}
  //           onClick={() => setActiveGate(gate)}
  //           className={`block w-full mb-2 p-2 rounded ${
  //             activeGate === gate
  //               ? "bg-blue-500 text-white"
  //               : "bg-white"
  //           }`}
  //         >
  //            <span>{gate}</span>
  //     <span className="ml-7 text-sm opacity-80">
  //       {gates[gate].length}
  //     </span>
  //         </button>
  //       ))}
  //     </div>

      
  //      <div className="flex-1 p-6 overflow-y-auto">
  //       <h1 className="text-2xl font-bold mb-4">{activeGate}</h1>

  //       <button
  //         onClick={generateRandomWord}
  //         className="mb-6 px-4 py-2 bg-green-600 text-white rounded"
  //       >
  //         Generate Random Word
  //       </button>

  //       {randomIndex !== null && (
  //         <div className="border-2 border-green-500 p-4 mb-6 rounded">
  //           <p className="font-bold text-lg">
  //             {gates[activeGate][randomIndex].word}
  //           </p>

  //           {visible[randomIndex] && (
  //             <p className="mt-2 text-gray-700">
  //               {gates[activeGate][randomIndex].meaning}
  //             </p>
  //           )}
  //            <button
  //             onClick={() => toggleMeaning(randomIndex)}
  //             className="mt-2 text-sm text-blue-600"
  //           >
  //             {visible[randomIndex] ? "Hide Meaning" : "Show Meaning"}
  //           </button>
  //         </div>
  //       )}

  //       {gates[activeGate].map((item, index) => (
  //         <div key={index} className="border p-4 mb-3 rounded">
  //           <p className="font-semibold">{item.word}</p>

  //           {visible[index] && (
  //             <p className="text-gray-700 mt-2">{item.meaning}</p>
  //           )}

  //           <button
  //             onClick={() => toggleMeaning(index)}
  //             className="mt-2 text-sm text-blue-600"
  //           >{visible[index] ? "Hide Meaning" : "Show Meaning"}</button>
  //           </div>
  //       ))}
  //     </div>
  //   </div>
  // );

return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950 text-gray-100">
    {/* Sidebar / Top Navigation */}
    <div className="w-full lg:w-64 bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-800 p-4 lg:sticky lg:top-0 lg:h-screen overflow-x-auto lg:overflow-y-auto">
      <h2 className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
        Categories
      </h2>
      
      {/* Scrollable container for mobile buttons */}
      <div className="flex lg:flex-col gap-2">
        {Object.keys(gates).map((gate) => (
          <button
            key={gate}
            onClick={() => setActiveGate(gate)}
            className={`flex-shrink-0 flex items-center justify-between px-4 py-2 lg:p-3 rounded-lg transition-colors min-w-fit lg:w-full ${
              activeGate === gate
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="font-medium mr-3 lg:mr-0">{gate}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeGate === gate ? "bg-blue-500" : "bg-gray-900 text-gray-500"
            }`}>
              {gates[gate].length}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{activeGate}</h1>
        <button
          onClick={generateRandomWord}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all"
        >
          Generate Random Word
        </button>
      </header>

      {/* Random Word Highlight Box */}
      {randomIndex !== null && (
        <div className="bg-green-900/10 border border-green-500/50 p-5 md:p-6 mb-8 rounded-xl">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Featured Word</span>
            <p className="font-bold text-xl md:text-2xl text-white">
              {gates[activeGate][randomIndex].word}
            </p>
            
            {visible[randomIndex] && (
              <p className="mt-3 text-gray-300 leading-relaxed text-sm md:text-base">
                {gates[activeGate][randomIndex].meaning}
              </p>
            )}
            
            <button
              onClick={() => toggleMeaning(randomIndex)}
              className="mt-4 text-sm font-semibold text-green-400 hover:text-green-300 w-fit"
            >
              {visible[randomIndex] ? "↑ Hide Meaning" : "↓ Show Meaning"}
            </button>
          </div>
        </div>
      )}

      {/* Word List - Grid layout for larger screens */}
      <div className="grid grid-cols-1 gap-4">
        {gates[activeGate].map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-900 border border-gray-800 p-4 md:p-5 rounded-xl"
          >
            <p className="font-bold text-lg text-gray-100">{item.word}</p>

            {visible[index] && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{item.meaning}</p>
              </div>
            )}

            <button
              onClick={() => toggleMeaning(index)}
              className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              {visible[index] ? "Hide Meaning" : "Show Meaning"}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
