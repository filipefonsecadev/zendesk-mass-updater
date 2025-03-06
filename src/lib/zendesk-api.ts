
import { OrganizationUpdatePayload, ZendeskApiResponse } from "./zendesk-types";

export interface ZendeskApiConfig {
  subdomain: string;
  apiToken: string;
  environment: "production" | "sandbox";
}

export class ZendeskApiService {
  private apiConfig: ZendeskApiConfig;

  constructor(config: ZendeskApiConfig) {
    this.apiConfig = config;
  }

  private getBaseUrl(): string {
    const { subdomain, environment } = this.apiConfig;
    return environment === "production"
      ? `https://${subdomain}.zendesk.com/api/v2`
      : `https://${subdomain}.sandbox.zendesk.com/api/v2`;
  }

  private getAuthHeader(): string {
    return `Basic ${btoa(`${this.apiConfig.subdomain}/token:${this.apiConfig.apiToken}`)}`;
  }

  async updateOrganization(
    organizationId: string,
    payload: OrganizationUpdatePayload
  ): Promise<ZendeskApiResponse> {
    try {
      const response = await fetch(
        `${this.getBaseUrl()}/organizations/${organizationId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getAuthHeader(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: errorData.error || "Failed to update organization",
          description: errorData.description || "Unknown error occurred",
          details: errorData.details || {},
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        error: "Network error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Helper method to verify API credentials
  async verifyCredentials(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/organizations.json?per_page=1`, {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const parseValue = (field: string, value: string): any => {
  // Handle specific field types
  if (field === "shared_tickets" || field === "shared_comments") {
    return value.toLowerCase() === "true";
  }
  
  if (field === "domain_names" || field === "tags") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  
  // Custom fields that are boolean
  if (field.startsWith("organization_fields.") && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
    return value.toLowerCase() === "true";
  }
  
  // Custom fields that might be numeric
  if (field.startsWith("organization_fields.") && !isNaN(Number(value))) {
    const num = Number(value);
    if (Number.isInteger(num)) {
      return num;
    }
  }
  
  return value;
};

export const buildPayload = (
  fields: { field: string; value: string }[]
): OrganizationUpdatePayload => {
  const payload: OrganizationUpdatePayload = { organization: {} };
  
  fields.forEach(({ field, value }) => {
    if (!field || !value) return;

    if (field.startsWith("organization_fields.")) {
      const customField = field.replace("organization_fields.", "");
      if (!payload.organization.organization_fields) {
        payload.organization.organization_fields = {};
      }
      payload.organization.organization_fields[customField] = parseValue(field, value);
    } else {
      (payload.organization as any)[field] = parseValue(field, value);
    }
  });
  
  return payload;
};

export const parseCSV = (csvText: string): { organizationId: string }[] => {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = lines[0].split(",").map((header) => header.trim().toLowerCase());
  const orgIdIndex = headers.findIndex((h) => 
    h === "organization_id" || h === "org_id" || h === "id"
  );

  if (orgIdIndex === -1) {
    throw new Error("CSV file must contain an 'organization_id' column");
  }

  return lines
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const organizationId = values[orgIdIndex];
      
      if (!organizationId) {
        return null;
      }

      return { organizationId };
    })
    .filter((item): item is { organizationId: string } => item !== null);
};
