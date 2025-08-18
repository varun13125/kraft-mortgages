// Make HubSpot client optional to prevent build errors if package not installed
let Client: any;
try {
  const hubspotApi = require("@hubspot/api-client");
  Client = hubspotApi.Client;
} catch (error) {
  console.warn("@hubspot/api-client not installed. HubSpot integration disabled.");
  // Mock Client for development
  Client = class MockClient {
    constructor() {
      console.warn("Using mock HubSpot client");
    }
  };
}

export interface HubSpotConfig {
  apiKey?: string;
  accessToken?: string;
}

class HubSpotClient {
  private static instance: HubSpotClient;
  private client: Client | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): HubSpotClient {
    if (!HubSpotClient.instance) {
      HubSpotClient.instance = new HubSpotClient();
    }
    return HubSpotClient.instance;
  }

  initialize(config: HubSpotConfig) {
    if (this.isInitialized) {
      console.warn("HubSpot client already initialized");
      return;
    }

    const apiKey = config.apiKey || process.env.HUBSPOT_API_KEY;
    const accessToken = config.accessToken || process.env.HUBSPOT_ACCESS_TOKEN;

    if (!apiKey && !accessToken) {
      throw new Error("HubSpot API key or access token is required");
    }

    this.client = new Client({
      accessToken: accessToken || undefined,
      apiKey: apiKey || undefined,
    });

    this.isInitialized = true;
  }

  getClient(): Client {
    if (!this.client || !this.isInitialized) {
      // Auto-initialize with environment variables
      this.initialize({});
    }
    return this.client!;
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.crm.contacts.basicApi.getPage();
      return true;
    } catch (error) {
      console.error("HubSpot connection test failed:", error);
      return false;
    }
  }

  // Helper method to handle rate limiting
  async withRateLimit<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        if (error.response?.status === 429 && i < retries - 1) {
          // Rate limited, wait and retry
          const retryAfter = error.response.headers["retry-after"] || delay;
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  }

  // Helper to format properties for HubSpot
  formatProperties(properties: Record<string, any>): Record<string, any> {
    const formatted: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      if (value !== null && value !== undefined) {
        // Convert dates to timestamps
        if (value instanceof Date) {
          formatted[key] = value.toISOString();
        } 
        // Convert booleans to strings
        else if (typeof value === "boolean") {
          formatted[key] = value.toString();
        }
        // Convert numbers to strings
        else if (typeof value === "number") {
          formatted[key] = value.toString();
        }
        // Keep strings as is
        else {
          formatted[key] = value;
        }
      }
    }
    
    return formatted;
  }

  // Search for duplicates
  async searchDuplicates(email: string, phone?: string): Promise<any[]> {
    const client = this.getClient();
    const filters: any[] = [];

    if (email) {
      filters.push({
        propertyName: "email",
        operator: "EQ",
        value: email
      });
    }

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      filters.push({
        propertyName: "phone",
        operator: "CONTAINS",
        value: cleanPhone
      });
    }

    if (filters.length === 0) return [];

    try {
      const response = await this.withRateLimit(() =>
        client.crm.contacts.searchApi.doSearch({
          filterGroups: [{
            filters
          }],
          limit: 10,
          properties: ["email", "phone", "firstname", "lastname"]
        })
      );

      return response.results || [];
    } catch (error) {
      console.error("Error searching for duplicates:", error);
      return [];
    }
  }
}

export const hubspotClient = HubSpotClient.getInstance();