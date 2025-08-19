import { hubspotClient } from "./client";

export interface ContactData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  province?: string;
  source?: string;
  leadScore?: number;
  consentToContact?: boolean;
  consentToMarketing?: boolean;
  calculatorType?: string;
  calculationData?: any;
  notes?: string;
}

export interface ContactProperties {
  [key: string]: string;
}

class HubSpotContacts {
  private static instance: HubSpotContacts;

  private constructor() {}

  static getInstance(): HubSpotContacts {
    if (!HubSpotContacts.instance) {
      HubSpotContacts.instance = new HubSpotContacts();
    }
    return HubSpotContacts.instance;
  }

  /**
   * Create a new contact in HubSpot
   */
  async createContact(data: ContactData): Promise<any> {
    const client = hubspotClient.getClient();
    
    // Check for existing contacts first
    const existingContacts = await hubspotClient.searchDuplicates(data.email, data.phone);
    
    if (existingContacts.length > 0) {
      console.log("Existing contact found, updating instead");
      return this.updateContact(existingContacts[0].id, data);
    }

    const properties = this.mapToHubSpotProperties(data);
    
    try {
      const response = await hubspotClient.withRateLimit(() =>
        client.crm.contacts.basicApi.create({
          properties: hubspotClient.formatProperties(properties)
        })
      );

      console.log("Contact created in HubSpot:", (response as any).id);
      return response;
    } catch (error: any) {
      console.error("Error creating HubSpot contact:", error);
      
      // If it's a duplicate email error, try to find and update
      if (error.message?.includes("CONTACT_EXISTS")) {
        const contacts = await this.searchByEmail(data.email);
        if (contacts.length > 0) {
          return this.updateContact(contacts[0].id, data);
        }
      }
      
      throw error;
    }
  }

  /**
   * Update an existing contact
   */
  async updateContact(contactId: string, data: Partial<ContactData>): Promise<any> {
    const client = hubspotClient.getClient();
    const properties = this.mapToHubSpotProperties(data);

    try {
      const response = await hubspotClient.withRateLimit(() =>
        client.crm.contacts.basicApi.update(contactId, {
          properties: hubspotClient.formatProperties(properties)
        })
      );

      console.log("Contact updated in HubSpot:", contactId);
      return response;
    } catch (error) {
      console.error("Error updating HubSpot contact:", error);
      throw error;
    }
  }

  /**
   * Search contacts by email
   */
  async searchByEmail(email: string): Promise<any[]> {
    const client = hubspotClient.getClient();

    try {
      const response = await hubspotClient.withRateLimit(() =>
        client.crm.contacts.searchApi.doSearch({
          filterGroups: [{
            filters: [{
              propertyName: "email",
              operator: "EQ",
              value: email
            }]
          }],
          limit: 10
        })
      );

      return (response as any).results || [];
    } catch (error) {
      console.error("Error searching contacts by email:", error);
      return [];
    }
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: string): Promise<any> {
    const client = hubspotClient.getClient();

    try {
      const response = await hubspotClient.withRateLimit(() =>
        client.crm.contacts.basicApi.getById(contactId)
      );

      return response;
    } catch (error) {
      console.error("Error getting HubSpot contact:", error);
      throw error;
    }
  }

  /**
   * Add note to contact
   */
  async addNote(contactId: string, note: string): Promise<any> {
    const client = hubspotClient.getClient();

    try {
      const response = await hubspotClient.withRateLimit(() =>
        client.crm.objects.notes.basicApi.create({
          properties: {
            hs_note_body: note,
            hs_timestamp: Date.now().toString()
          },
          associations: [
            {
              to: { id: contactId },
              types: [
                {
                  associationCategory: "HUBSPOT_DEFINED",
                  associationTypeId: 202
                }
              ]
            }
          ]
        })
      );

      return response;
    } catch (error) {
      console.error("Error adding note to contact:", error);
      throw error;
    }
  }

  /**
   * Map contact data to HubSpot properties
   */
  private mapToHubSpotProperties(data: Partial<ContactData>): ContactProperties {
    const properties: ContactProperties = {};

    // Standard HubSpot properties
    if (data.email) properties.email = data.email;
    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.phone) properties.phone = data.phone;

    // Custom properties (need to be created in HubSpot first)
    if (data.province) properties.province = data.province;
    if (data.source) properties.lead_source = data.source;
    if (data.leadScore) properties.lead_score = data.leadScore.toString();
    if (data.consentToContact !== undefined) {
      properties.consent_to_contact = data.consentToContact.toString();
    }
    if (data.consentToMarketing !== undefined) {
      properties.consent_to_marketing = data.consentToMarketing.toString();
    }
    if (data.calculatorType) properties.calculator_type = data.calculatorType;
    if (data.notes) properties.notes_last_contacted = data.notes;

    // Add calculation data as JSON string if present
    if (data.calculationData) {
      try {
        properties.calculation_data = JSON.stringify(data.calculationData);
      } catch (error) {
        console.warn("Failed to serialize calculation data");
      }
    }

    // Add timestamp
    properties.last_activity_date = new Date().toISOString();
    properties.lifecyclestage = "lead";

    return properties;
  }

  /**
   * Create or update contact (upsert)
   */
  async upsertContact(data: ContactData): Promise<any> {
    try {
      // First try to create
      return await this.createContact(data);
    } catch (error: any) {
      // If creation fails due to duplicate, try to update
      if (error.message?.includes("CONTACT_EXISTS") || error.message?.includes("duplicate")) {
        const contacts = await this.searchByEmail(data.email);
        if (contacts.length > 0) {
          return await this.updateContact(contacts[0].id, data);
        }
      }
      throw error;
    }
  }

  /**
   * Bulk create/update contacts
   */
  async bulkUpsert(contacts: ContactData[]): Promise<any[]> {
    const results = [];
    
    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);
      const batchPromises = batch.map(contact => 
        this.upsertContact(contact).catch(error => {
          console.error(`Failed to upsert contact ${contact.email}:`, error);
          return null;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < contacts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results.filter(result => result !== null);
  }
}

export const hubspotContacts = HubSpotContacts.getInstance();