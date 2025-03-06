
import React from "react";
import { cn } from "@/lib/utils";

interface DataEntrySelectorProps {
  mode: "csv" | "manual";
  setMode: (mode: "csv" | "manual") => void;
}

const DataEntrySelector: React.FC<DataEntrySelectorProps> = ({
  mode,
  setMode,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-1">
      <button
        type="button"
        onClick={() => setMode("csv")}
        className={cn(
          "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 overflow-hidden group",
          mode === "csv"
            ? "bg-accent text-white shadow-lg"
            : "bg-white border border-border hover:border-accent/30"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
            mode === "csv" ? "opacity-100" : "group-hover:opacity-5"
          )}
          style={{
            background:
              mode === "csv"
                ? "linear-gradient(135deg, #F58220 0%, #FFA500 100%)"
                : "",
          }}
        />
        <svg
          className={cn(
            "w-10 h-10 mb-3 transition-transform duration-300",
            mode === "csv" ? "scale-110" : "group-hover:scale-110"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke={mode === "csv" ? "white" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2" />
          <path d="M8 17h2" />
          <path d="M14 13h2" />
          <path d="M14 17h2" />
        </svg>
        <span className="text-sm font-medium relative z-10">Importar CSV</span>
        <p
          className={cn(
            "text-xs mt-1 max-w-[150px] text-center relative z-10",
            mode === "csv" ? "text-white/90" : "text-muted-foreground"
          )}
        >
          Carregar um arquivo CSV com IDs de organização
        </p>
      </button>

      <button
        type="button"
        onClick={() => setMode("manual")}
        className={cn(
          "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 overflow-hidden group",
          mode === "manual"
            ? "bg-accent text-white shadow-lg"
            : "bg-white border border-border hover:border-accent/30"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
            mode === "manual" ? "opacity-100" : "group-hover:opacity-5"
          )}
          style={{
            background:
              mode === "manual"
                ? "linear-gradient(135deg, #F58220 0%, #FFA500 100%)"
                : "",
          }}
        />
        <svg
          className={cn(
            "w-10 h-10 mb-3 transition-transform duration-300",
            mode === "manual" ? "scale-110" : "group-hover:scale-110"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke={mode === "manual" ? "white" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          <path d="M12 10v6" />
          <path d="M9 13h6" />
        </svg>
        <span className="text-sm font-medium relative z-10">Entrada Única</span>
        <p
          className={cn(
            "text-xs mt-1 max-w-[150px] text-center relative z-10",
            mode === "manual" ? "text-white/90" : "text-muted-foreground"
          )}
        >
          Inserir um único ID de organização manualmente
        </p>
      </button>
    </div>
  );
};

export default DataEntrySelector;
