
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BackgroundGradient from "@/components/BackgroundGradient";
import DataEntrySelector from "@/components/DataEntrySelector";
import CsvUploader from "@/components/CsvUploader";
import FieldSelector from "@/components/FieldSelector";
import EnvironmentSelector from "@/components/EnvironmentSelector";
import ApiCredentialsInput from "@/components/ApiCredentialsInput";
import ResultsTable from "@/components/ResultsTable";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FIELD_OPTIONS } from "@/lib/zendesk-types";
import {
  ZendeskApiService,
  buildPayload,
  parseCSV,
} from "@/lib/zendesk-api";
import { UpdateResult } from "@/components/ResultsTable";

const Index = () => {
  const { toast } = useToast();
  
  // Form state
  const [mode, setMode] = useState<"csv" | "manual">("manual");
  const [organizationId, setOrganizationId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedOrgIds, setParsedOrgIds] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState([{ field: "", value: "" }]);
  const [environment, setEnvironment] = useState<"production" | "sandbox">("sandbox");
  const [subdomain, setSubdomain] = useState("");
  const [apiToken, setApiToken] = useState("");
  
  // Results state
  const [results, setResults] = useState<UpdateResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Handle file selection and validation
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setParsedOrgIds([]);
    
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Tamanho máximo é 10MB.",
          variant: "destructive",
        });
        setSelectedFile(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const parsed = parseCSV(csvText);
          setParsedOrgIds(parsed.map(item => item.organizationId));
          
          toast({
            title: "CSV Carregado",
            description: `Encontrados ${parsed.length} IDs de organização`,
          });
        } catch (error) {
          toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Formato CSV inválido",
            variant: "destructive",
          });
          setSelectedFile(null);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add or remove field inputs
  const addField = () => {
    if (fieldValues.length < 5) {
      setFieldValues([...fieldValues, { field: "", value: "" }]);
    }
  };

  const removeField = (index: number) => {
    setFieldValues(fieldValues.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: string, value: string) => {
    const newFieldValues = [...fieldValues];
    newFieldValues[index] = { field, value };
    setFieldValues(newFieldValues);
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!subdomain.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, insira seu subdomínio Zendesk",
        variant: "destructive",
      });
      return false;
    }

    if (!apiToken.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, insira seu token de API",
        variant: "destructive",
      });
      return false;
    }

    if (mode === "manual" && !organizationId.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, insira um ID de organização",
        variant: "destructive",
      });
      return false;
    }

    if (mode === "csv" && parsedOrgIds.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, carregue um arquivo CSV válido com IDs de organização",
        variant: "destructive",
      });
      return false;
    }

    // Check if at least one field to update is filled
    const hasValidField = fieldValues.some(
      ({ field, value }) => field && value.trim()
    );
    if (!hasValidField) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, especifique pelo menos um campo para atualizar",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Process updates
  const processUpdates = async () => {
    const api = new ZendeskApiService({
      subdomain,
      apiToken,
      environment,
    });

    // Verify credentials
    try {
      const credentialsValid = await api.verifyCredentials();
      if (!credentialsValid) {
        toast({
          title: "Erro de Autenticação",
          description: "Credenciais de API ou subdomínio inválidos",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar à API Zendesk",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Build the payload from field values
    const validFieldValues = fieldValues.filter(
      ({ field, value }) => field && value.trim()
    );
    const payload = buildPayload(validFieldValues);
    
    const orgIds = mode === "csv" ? parsedOrgIds : [organizationId];
    const newResults: UpdateResult[] = [];

    // Process each organization ID
    for (let i = 0; i < orgIds.length; i++) {
      const orgId = orgIds[i];
      try {
        const response = await api.updateOrganization(orgId, payload);
        
        if (response.error) {
          newResults.push({
            id: `${orgId}-${Date.now()}`,
            organizationId: orgId,
            success: false,
            message: response.description || response.error,
          });
        } else {
          newResults.push({
            id: `${orgId}-${Date.now()}`,
            organizationId: orgId,
            success: true,
            message: "Organização atualizada com sucesso",
            fields: validFieldValues.map(({ field }) => field),
          });
        }
      } catch (error) {
        newResults.push({
          id: `${orgId}-${Date.now()}`,
          organizationId: orgId,
          success: false,
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    setResults([...newResults]);
    setIsProcessing(false);
    
    const successCount = newResults.filter(r => r.success).length;
    const failCount = newResults.filter(r => !r.success).length;
    
    toast({
      title: "Atualização Concluída",
      description: `Atualizadas ${successCount} organização(ões). Falhas: ${failCount}`,
      variant: successCount > 0 ? "default" : "destructive",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (environment === "production") {
      setShowConfirmation(true);
    } else {
      setIsProcessing(true);
      processUpdates();
    }
  };

  const confirmProductionUpdate = () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    processUpdates();
  };

  const cancelProductionUpdate = () => {
    setShowConfirmation(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const exportToCsv = () => {
    // Create CSV content
    const headers = ["ID da Organização", "Status", "Mensagem"];
    const rows = results.map(
      (result) => `${result.organizationId},${result.success ? "Sucesso" : "Falha"},"${result.message}"`
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zendesk-atualizacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação Concluída",
      description: "Resultados exportados para arquivo CSV",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-16">
      <BackgroundGradient />
      <Header />
      
      <main className="w-full max-w-3xl px-4 sm:px-6 mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="glass-panel p-6">
            <h2 className="text-md font-medium mb-4">Método de Entrada de Dados</h2>
            <DataEntrySelector mode={mode} setMode={setMode} />
            
            {mode === "csv" ? (
              <CsvUploader
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            ) : (
              <div className="mt-4 animate-fade-in">
                <label htmlFor="organization-id" className="form-label">
                  ID da Organização
                </label>
                <input
                  id="organization-id"
                  type="text"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full input-field"
                  placeholder="Digite o ID da organização"
                />
              </div>
            )}
          </section>
          
          <section className="glass-panel p-6">
            <h2 className="text-md font-medium mb-4">Campos para Atualizar</h2>
            <div className="space-y-3">
              {fieldValues.map((fieldValue, index) => (
                <FieldSelector
                  key={index}
                  index={index}
                  field={fieldValue.field}
                  value={fieldValue.value}
                  fieldOptions={FIELD_OPTIONS}
                  onChange={updateField}
                  onRemove={removeField}
                  isRemovable={index > 0}
                />
              ))}
            </div>
            
            {fieldValues.length < 5 && (
              <button
                type="button"
                onClick={addField}
                className="mt-3 w-full py-2 border border-dashed border-accent/50 rounded-lg text-sm text-accent hover:bg-accent/5 transition-colors"
              >
                <span className="flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  Adicionar Outro Campo
                </span>
              </button>
            )}
          </section>
          
          <section className="glass-panel p-6">
            <h2 className="text-md font-medium mb-4">Configuração da API</h2>
            
            <div className="space-y-4">
              <EnvironmentSelector
                environment={environment}
                setEnvironment={setEnvironment}
              />
              
              <ApiCredentialsInput
                subdomain={subdomain}
                setSubdomain={setSubdomain}
                apiToken={apiToken}
                setApiToken={setApiToken}
              />
            </div>
          </section>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFieldValues([{ field: "", value: "" }]);
                setOrganizationId("");
                setSelectedFile(null);
                setParsedOrgIds([]);
                setResults([]);
              }}
              className="btn-outline"
            >
              Limpar Formulário
            </button>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                "Atualizar Organizações"
              )}
            </button>
          </div>
        </form>
        
        {/* Results Table */}
        <ResultsTable
          results={results}
          isLoading={isProcessing}
          onExport={exportToCsv}
          onClear={clearResults}
        />
      </main>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-elevation max-w-md w-full p-6 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">
              Confirmação de Atualização em Produção
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Você está prestes a atualizar {mode === "csv" ? parsedOrgIds.length : 1} organização(ões) no ambiente de PRODUÇÃO. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelProductionUpdate}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={confirmProductionUpdate}
                className="btn-primary bg-destructive hover:bg-destructive/90"
              >
                Confirmar Atualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
