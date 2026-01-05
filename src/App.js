import { useState } from "react";
import { initialGates } from "./data/gatesData";


export default function App() {
  const [gates, setGates] = useState(initialGates);
  const [activeGate, setActiveGate] = useState("Gate 1");
  const [visible, setVisible] = useState({});
const [randomIndex, setRandomIndex] = useState(null);
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100 p-4">
        {Object.keys(gates).map((gate) => (
          <button
            key={gate}
            onClick={() => setActiveGate(gate)}
            className={`block w-full mb-2 p-2 rounded ${
              activeGate === gate
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            {gate}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {/* <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{activeGate}</h1>

        {gates[activeGate].map((item, index) => (
          <div key={index} className="border p-4 mb-3 rounded">
            <p className="font-semibold">{item.word}</p>

            {visible[index] && (
              <p className="text-gray-700 mt-2">{item.meaning}</p>
            )}

            <button
              onClick={() => toggleMeaning(index)}
              className="mt-2 text-sm text-blue-600"
            >
              {visible[index] ? "Hide Meaning" : "Show Meaning"}
            </button>
          </div>
        ))}
      </div> */}
       <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{activeGate}</h1>

        <button
          onClick={generateRandomWord}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded"
        >
          Generate Random Word
        </button>

        {randomIndex !== null && (
          <div className="border-2 border-green-500 p-4 mb-6 rounded">
            <p className="font-bold text-lg">
              {gates[activeGate][randomIndex].word}
            </p>

            {visible[randomIndex] && (
              <p className="mt-2 text-gray-700">
                {gates[activeGate][randomIndex].meaning}
              </p>
            )}
             <button
              onClick={() => toggleMeaning(randomIndex)}
              className="mt-2 text-sm text-blue-600"
            >
              {visible[randomIndex] ? "Hide Meaning" : "Show Meaning"}
            </button>
          </div>
        )}

        {gates[activeGate].map((item, index) => (
          <div key={index} className="border p-4 mb-3 rounded">
            <p className="font-semibold">{item.word}</p>

            {visible[index] && (
              <p className="text-gray-700 mt-2">{item.meaning}</p>
            )}

            <button
              onClick={() => toggleMeaning(index)}
              className="mt-2 text-sm text-blue-600"
            >{visible[index] ? "Hide Meaning" : "Show Meaning"}</button>
            </div>
        ))}
      </div>
    </div>
  );
}
