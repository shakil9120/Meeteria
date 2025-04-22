interface SwitchSoloDuoProps {
  setSwitchMode: (mode: "solo" | "duo") => void;
  switchMode: "solo" | "duo";
}

export default function SwitchSoloDuo({
  setSwitchMode,
  switchMode,
}: SwitchSoloDuoProps) {
  return (
    <div className="flex items-center bg-gray-300 rounded-full p-1 w-48">
      <button
        className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors duration-200 ${switchMode === "solo" ? "bg-purple-600 text-white" : "text-gray-600"
          }`}
        onClick={() => setSwitchMode("solo")}
      >
        SOLO
      </button>
      <button
        className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors duration-200 ${switchMode === "duo" ? "bg-purple-600 text-white" : "text-gray-600"
          }`}
        onClick={() => setSwitchMode("duo")}
      >
        SQUAD
      </button>
    </div>
  );
}
