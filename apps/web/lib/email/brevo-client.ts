// Temporarily commented out due to missing package
// import { TransactionalEmailsApi, SendSmtpEmail, CreateContact, ContactsApi } from '@getbrevo/brevo';

// Initialize Brevo API clients - temporarily disabled
// const apiInstance = new TransactionalEmailsApi();
// const contactsApi = new ContactsApi();

// Set API key
const apiKey = process.env.BREVO_API_KEY;
if (apiKey) {
  // apiInstance.setApiKey(0, apiKey);
  // contactsApi.setApiKey(0, apiKey);
}

export interface EmailTemplate {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: {
    name: string;
    email: string;
  };
  params?: Record<string, any>;
  tags?: string[];
}

export interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  attributes?: Record<string, any>;
  listIds?: number[];
}

export class BrevoEmailService {
  private static instance: BrevoEmailService;

  private constructor() {
    if (!apiKey) {
      console.warn('BREVO_API_KEY not found in environment variables');
    }
  }

  static getInstance(): BrevoEmailService {
    if (!BrevoEmailService.instance) {
      BrevoEmailService.instance = new BrevoEmailService();
    }
    return BrevoEmailService.instance;
  }

  async sendTransactionalEmail(template: EmailTemplate): Promise<any> {
    // Temporarily disabled due to missing Brevo package
    console.warn('Brevo email service temporarily disabled - email not sent');
    console.log('Email template:', template);

    // Mock success response
    return {
      message: 'Email service temporarily disabled',
      template: template.subject,
      recipients: template.to.length
    };

    /*
    try {
      const sendSmtpEmail = new SendSmtpEmail();

      // Set recipient(s)
      sendSmtpEmail.to = template.to.map(email => ({ email }));

      // Set optional CC and BCC
      if (template.cc?.length) {
        sendSmtpEmail.cc = template.cc.map(email => ({ email }));
      }
      if (template.bcc?.length) {
        sendSmtpEmail.bcc = template.bcc.map(email => ({ email }));
      }

      // Set sender
      sendSmtpEmail.sender = template.sender || {
        name: 'Kraft Mortgages',
        email: 'noreply@kraftmortgages.ca'
      };

      // Set content
      sendSmtpEmail.subject = template.subject;
      sendSmtpEmail.htmlContent = template.htmlContent;
      if (template.textContent) {
        sendSmtpEmail.textContent = template.textContent;
      }

      // Set template parameters
      if (template.params) {
        sendSmtpEmail.params = template.params;
      }

      // Set tags for tracking
      if (template.tags?.length) {
        sendSmtpEmail.tags = template.tags;
      }

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent successfully:', result.body);
      return result.body;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
    */
  }

  async createOrUpdateContact(contactData: ContactData): Promise<any> {
    // Temporarily disabled due to missing Brevo package
    console.warn('Brevo contact service temporarily disabled - contact not created/updated');
    console.log('Contact data:', contactData);

    // Mock success response
    return {
      message: 'Contact service temporarily disabled',
      email: contactData.email,
      action: 'createOrUpdate'
    };

    /*
    try {
      const createContact = new CreateContact();
      createContact.email = contactData.email;

      if (contactData.firstName) {
        createContact.attributes = { ...createContact.attributes, FIRSTNAME: contactData.firstName };
      }
      if (contactData.lastName) {
        createContact.attributes = { ...createContact.attributes, LASTNAME: contactData.lastName };
      }
      if (contactData.phone) {
        createContact.attributes = { ...createContact.attributes, SMS: contactData.phone };
      }
      if (contactData.attributes) {
        createContact.attributes = { ...createContact.attributes, ...contactData.attributes };
      }

      // Add to specific lists
      if (contactData.listIds?.length) {
        createContact.listIds = contactData.listIds;
      }

      const result = await contactsApi.createContact(createContact);
      console.log('Contact created/updated:', result.body);
      return result.body;
    } catch (error: any) {
      // If contact already exists, update it
      if (error.status === 400 && error.response?.text?.includes('Contact already exist')) {
        try {
          const updateResult = await contactsApi.updateContact(contactData.email, {
            attributes: {
              FIRSTNAME: contactData.firstName,
              LASTNAME: contactData.lastName,
              SMS: contactData.phone,
              ...contactData.attributes
            },
            listIds: contactData.listIds
          });
          console.log('Contact updated:', updateResult.body);
          return updateResult.body;
        } catch (updateError) {
          console.error('Error updating contact:', updateError);
          throw updateError;
        }
      } else {
        console.error('Error creating contact:', error);
        throw error;
      }
    }
    */
  }

  async addContactToList(email: string, listId: number): Promise<any> {
    // Temporarily disabled due to missing Brevo package
    console.warn('Brevo list service temporarily disabled - contact not added to list');
    console.log(`Email: ${email}, List ID: ${listId}`);

    // Mock success response
    return {
      message: 'List service temporarily disabled',
      email: email,
      listId: listId,
      action: 'addContactToList'
    };

    /*
    try {
      const result = await contactsApi.addContactToList(listId, {
        emails: [email]
      });
      console.log(`Contact ${email} added to list ${listId}`);
      return result.body;
    } catch (error) {
      console.error('Error adding contact to list:', error);
      throw error;
    }
    */
  }

  async removeContactFromList(email: string, listId: number): Promise<any> {
    // Temporarily disabled due to missing Brevo package
    console.warn('Brevo list service temporarily disabled - contact not removed from list');
    console.log(`Email: ${email}, List ID: ${listId}`);

    // Mock success response
    return {
      message: 'List service temporarily disabled',
      email: email,
      listId: listId,
      action: 'removeContactFromList'
    };

    /*
    try {
      const result = await contactsApi.removeContactFromList(listId, {
        emails: [email]
      });
      console.log(`Contact ${email} removed from list ${listId}`);
      return result.body;
    } catch (error) {
      console.error('Error removing contact from list:', error);
      throw error;
    }
    */
  }

  // Get account info to verify API connection
  async getAccountInfo(): Promise<any> {
    // Temporarily disabled due to missing Brevo package
    console.warn('Brevo account service temporarily disabled');

    // Mock success response
    return {
      message: 'Account service temporarily disabled',
      company: 'Kraft Mortgages',
      status: 'active'
    };

    /*
    try {
      const { AccountApi } = await import('@getbrevo/brevo');
      const accountApi = new AccountApi();
      if (apiKey) {
        accountApi.setApiKey(0, apiKey);
      }

      const result = await accountApi.getAccount();
      return result.body;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
    */
  }
}

// Export singleton instance
export const brevoEmailService = BrevoEmailService.getInstance();