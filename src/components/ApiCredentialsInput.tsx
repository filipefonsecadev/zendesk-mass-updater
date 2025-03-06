
import React from "react";
import { cn } from "@/lib/utils";

interface ApiCredentialsInputProps {
  subdomain: string;
  setSubdomain: (value: string) => void;
  apiToken: string;
  setApiToken: (value: string) => void;
}

const ApiCredentialsInput: React.FC<ApiCredentialsInputProps> = ({
  subdomain,
  setSubdomain,
  apiToken,
  setApiToken,
}) => {
  return (
    <div className="p-3 bg-white border border-border rounded-xl animate-fade-in">
      <div className="flex flex-col space-y-3">
        <div>
          <label htmlFor="subdomain" className="form-label">
            Zendesk Subdomain
          </label>
          <input
            id="subdomain"
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            className="w-full input-field"
            placeholder="company"
            aria-describedby="subdomain-hint"
          />
          <p id="subdomain-hint" className="text-xs text-muted-foreground mt-1 ml-1">
            Enter just the subdomain part (e.g., "company" from company.zendesk.com)
          </p>
        </div>
        
        <div>
          <label htmlFor="api-token" className="form-label">
            API Token
          </label>
          <div className="relative">
            <input
              id="api-token"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full input-field pr-10"
              placeholder="Enter your Zendesk API token"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {apiToken ? "●●●●●●" : ""}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-1">
            Your API token will not be stored permanently
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiCredentialsInput;
