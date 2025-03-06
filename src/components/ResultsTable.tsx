
import React from "react";
import { cn } from "@/lib/utils";

export interface UpdateResult {
  id: string;
  organizationId: string;
  success: boolean;
  message: string;
  fields?: string[];
}

interface ResultsTableProps {
  results: UpdateResult[];
  isLoading: boolean;
  onExport?: () => void;
  onClear: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  isLoading,
  onExport,
  onClear,
}) => {
  if (results.length === 0 && !isLoading) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Update Results</h3>
        <div className="flex space-x-2">
          {onExport && results.length > 0 && (
            <button
              type="button"
              onClick={onExport}
              className="btn-outline text-sm py-1.5"
            >
              <span className="flex items-center">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </span>
            </button>
          )}
          {results.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="btn-ghost text-sm py-1.5"
            >
              <span className="flex items-center">
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
                  <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
                Clear Results
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">
              Processing your request...
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Organization ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">
                    {result.organizationId}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        result.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {result.success ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {result.message}
                    {result.fields && result.fields.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {result.fields.map((field) => (
                          <span
                            key={field}
                            className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
