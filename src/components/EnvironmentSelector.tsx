
import React from "react";
import { cn } from "@/lib/utils";

interface EnvironmentSelectorProps {
  environment: "production" | "sandbox";
  setEnvironment: (env: "production" | "sandbox") => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environment,
  setEnvironment,
}) => {
  return (
    <div className="p-3 bg-white border border-border rounded-xl animate-fade-in">
      <label className="form-label mb-2">Selecione o Ambiente</label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={cn(
            "flex items-center justify-center py-2 px-4 rounded-lg font-medium text-sm transition-all",
            environment === "sandbox"
              ? "bg-accent text-white shadow-md"
              : "bg-white border border-border hover:border-accent/30"
          )}
          onClick={() => setEnvironment("sandbox")}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          Homologação
        </button>
        
        <button
          type="button"
          className={cn(
            "flex items-center justify-center py-2 px-4 rounded-lg font-medium text-sm transition-all",
            environment === "production"
              ? "bg-accent text-white shadow-md"
              : "bg-white border border-border hover:border-accent/30"
          )}
          onClick={() => setEnvironment("production")}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          Produção
        </button>
      </div>
      {environment === "production" && (
        <div className="mt-3 text-xs text-destructive bg-destructive/5 p-2 rounded-md border border-destructive/20">
          Atenção: Você está selecionando o ambiente de Produção. As alterações afetarão dados reais.
        </div>
      )}
    </div>
  );
};

export default EnvironmentSelector;
