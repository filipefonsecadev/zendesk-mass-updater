
import React from "react";
import { cn } from "@/lib/utils";

export interface FieldOption {
  id: string;
  value: string;
  label: string;
}

interface FieldSelectorProps {
  index: number;
  field: string;
  value: string;
  fieldOptions: FieldOption[];
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  index,
  field,
  value,
  fieldOptions,
  onChange,
  onRemove,
  isRemovable,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white border border-border rounded-xl animate-fade-in">
      <div className="flex-1">
        <label htmlFor={`field-${index}`} className="form-label">
          Field to update
        </label>
        <select
          id={`field-${index}`}
          value={field}
          onChange={(e) => onChange(index, e.target.value, value)}
          className="w-full input-field bg-white"
        >
          <option value="" disabled>
            Select a field
          </option>
          {fieldOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <label htmlFor={`value-${index}`} className="form-label">
          New value
        </label>
        <input
          id={`value-${index}`}
          type="text"
          value={value}
          onChange={(e) => onChange(index, field, e.target.value)}
          className="w-full input-field"
          placeholder="Enter new value"
        />
      </div>
      
      {isRemovable && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className={cn(
            "flex items-center justify-center self-end mb-0.5 w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors",
            "sm:self-end sm:mt-6"
          )}
          aria-label="Remove field"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FieldSelector;
