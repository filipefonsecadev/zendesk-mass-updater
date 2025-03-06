
export interface OrganizationField {
  key: string;
  value: string | number | boolean | null;
}

export interface OrganizationUpdatePayload {
  organization: {
    name?: string;
    domain_names?: string[];
    details?: string;
    notes?: string;
    group_id?: number;
    shared_tickets?: boolean;
    shared_comments?: boolean;
    tags?: string[];
    organization_fields?: Record<string, any>;
    external_id?: string;
  };
}

export interface ZendeskApiResponse {
  organization?: {
    id: number;
    name: string;
    [key: string]: any;
  };
  error?: string;
  description?: string;
  details?: {
    message?: string;
  };
}

export interface OrganizationData {
  id: string;
  [key: string]: any;
}

export const FIELD_OPTIONS = [
  { id: "name", value: "name", label: "Name" },
  { id: "domain_names", value: "domain_names", label: "Domain Names (comma separated)" },
  { id: "details", value: "details", label: "Details" },
  { id: "notes", value: "notes", label: "Notes" },
  { id: "shared_tickets", value: "shared_tickets", label: "Shared Tickets (true/false)" },
  { id: "shared_comments", value: "shared_comments", label: "Shared Comments (true/false)" },
  { id: "tags", value: "tags", label: "Tags (comma separated)" },
  { id: "external_id", value: "external_id", label: "External ID" },
  // Custom fields examples
  { id: "department", value: "organization_fields.department", label: "Custom: Department" },
  { id: "market", value: "organization_fields.market", label: "Custom: Market" },
  { id: "region", value: "organization_fields.region", label: "Custom: Region" },
  { id: "account_type", value: "organization_fields.account_type", label: "Custom: Account Type" },
  { id: "customer_since", value: "organization_fields.customer_since", label: "Custom: Customer Since" },
  { id: "priority", value: "organization_fields.priority", label: "Custom: Priority" },
];
