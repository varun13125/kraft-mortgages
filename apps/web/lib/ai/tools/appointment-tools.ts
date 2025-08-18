import { z } from "zod";
import { MortgageTool, ToolResult, AppointmentType, ContactInfo } from "./types";

// Available appointment types
const appointmentTypes = {
  consultation: {
    duration: 30,
    description: "Initial mortgage consultation",
    preparation: [
      "Basic financial information",
      "Property details (if applicable)",
      "Questions about mortgage options"
    ]
  },
  application: {
    duration: 60,
    description: "Complete mortgage application",
    preparation: [
      "All required documents",
      "Co-applicant availability (if applicable)",
      "Banking information",
      "Employment details"
    ]
  },
  review: {
    duration: 45,
    description: "Review mortgage options and rates",
    preparation: [
      "Pre-approval letter",
      "Property listings of interest",
      "Questions about terms and conditions"
    ]
  },
  signing: {
    duration: 90,
    description: "Final document signing",
    preparation: [
      "Government ID",
      "Void cheque",
      "Proof of insurance",
      "Legal representation info"
    ]
  }
};

// Available time slots (mock data - would connect to real calendar)
interface TimeSlot {
  time: string;
  available: boolean;
}

const getAvailableSlots = (date: Date, type: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  
  // No appointments on weekends for now
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return slots;
  }
  
  // Business hours: 9 AM to 5 PM
  const startHour = 9;
  const endHour = 17;
  const duration = appointmentTypes[type as keyof typeof appointmentTypes]?.duration || 30;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Check if slot accommodates appointment duration
      const endTime = new Date(slotTime.getTime() + duration * 60000);
      if (endTime.getHours() < endHour || (endTime.getHours() === endHour && endTime.getMinutes() === 0)) {
        slots.push({
          time: slotTime.toISOString(),
          available: Math.random() > 0.3 // Mock availability
        });
      }
    }
  }
  
  return slots;
};

// Check availability tool
export const checkAvailabilityTool: MortgageTool = {
  name: "check_availability",
  description: "Check available appointment slots",
  parameters: z.object({
    appointmentType: z.enum(["consultation", "application", "review", "signing"]),
    preferredDate: z.string().optional(),
    preferredTime: z.enum(["morning", "afternoon", "evening"]).optional()
  }),
  execute: async ({ appointmentType, preferredDate, preferredTime }) => {
    const targetDate = preferredDate ? new Date(preferredDate) : new Date();
    const appointmentInfo = appointmentTypes[appointmentType as keyof typeof appointmentTypes];
    
    // Get slots for next 5 business days
    interface AvailabilityDay {
      date: string;
      slots: TimeSlot[];
    }
    const availability: AvailabilityDay[] = [];
    let currentDate = new Date(targetDate);
    let daysChecked = 0;
    
    while (availability.length < 5 && daysChecked < 14) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const slots = getAvailableSlots(currentDate, appointmentType);
        const availableSlots = slots.filter(s => s.available);
        
        // Filter by preferred time if specified
        let filteredSlots = availableSlots;
        if (preferredTime) {
          filteredSlots = availableSlots.filter(slot => {
            const hour = new Date(slot.time).getHours();
            if (preferredTime === "morning") return hour >= 9 && hour < 12;
            if (preferredTime === "afternoon") return hour >= 12 && hour < 17;
            return false; // evening not available in business hours
          });
        }
        
        if (filteredSlots.length > 0) {
          availability.push({
            date: currentDate.toISOString().split('T')[0],
            slots: filteredSlots.slice(0, 3) // Show max 3 slots per day
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      daysChecked++;
    }
    
    return {
      success: true,
      data: {
        appointmentType,
        duration: `${appointmentInfo.duration} minutes`,
        description: appointmentInfo.description,
        availability,
        nextAvailable: availability[0]?.slots[0]?.time || null,
        bookingInstructions: "Select a time slot and confirm your contact information to book"
      }
    };
  }
};

// Book appointment tool
export const bookAppointmentTool: MortgageTool = {
  name: "book_appointment",
  description: "Book a mortgage appointment",
  parameters: z.object({
    appointmentType: z.enum(["consultation", "application", "review", "signing"]),
    dateTime: z.string(),
    contact: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      notes: z.string().optional()
    })
  }),
  execute: async ({ appointmentType, dateTime, contact }) => {
    const appointmentInfo = appointmentTypes[appointmentType as keyof typeof appointmentTypes];
    const appointmentDate = new Date(dateTime);
    const endTime = new Date(appointmentDate.getTime() + appointmentInfo.duration * 60000);
    
    // Generate confirmation code
    const confirmationCode = `KM${Date.now().toString(36).toUpperCase()}`;
    
    // Format appointment details
    const appointmentDetails = {
      confirmationCode,
      type: appointmentType,
      date: appointmentDate.toLocaleDateString(),
      time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: appointmentInfo.duration,
      description: appointmentInfo.description,
      contact,
      location: "Virtual Meeting (Link will be sent via email)",
      preparation: appointmentInfo.preparation,
      reminderSet: true
    };
    
    // Calendar event details for user
    const calendarEvent = {
      title: `Kraft Mortgages - ${appointmentInfo.description}`,
      start: appointmentDate.toISOString(),
      end: endTime.toISOString(),
      description: `Appointment Type: ${appointmentInfo.description}\n` +
                  `Duration: ${appointmentInfo.duration} minutes\n` +
                  `Confirmation: ${confirmationCode}\n\n` +
                  `Please prepare:\n${appointmentInfo.preparation.join('\n')}`,
      location: "Virtual Meeting"
    };
    
    return {
      success: true,
      data: {
        success: true,
        appointment: appointmentDetails,
        calendarEvent,
        nextSteps: [
          "Confirmation email sent to " + contact.email,
          "Calendar invite will arrive shortly",
          "You'll receive a reminder 24 hours before",
          "Meeting link will be sent 1 hour before appointment"
        ],
        message: `Your ${appointmentInfo.description} has been booked for ${appointmentDetails.date} at ${appointmentDetails.time}. Confirmation code: ${confirmationCode}`
      }
    };
  }
};

// Reschedule appointment tool
export const rescheduleAppointmentTool: MortgageTool = {
  name: "reschedule_appointment",
  description: "Reschedule an existing appointment",
  parameters: z.object({
    confirmationCode: z.string(),
    newDateTime: z.string(),
    reason: z.string().optional()
  }),
  execute: async ({ confirmationCode, newDateTime, reason }) => {
    // Validate confirmation code format
    if (!confirmationCode.startsWith('KM')) {
      return {
        success: false,
        error: "Invalid confirmation code format"
      };
    }
    
    const newDate = new Date(newDateTime);
    
    return {
      success: true,
      data: {
        success: true,
        confirmationCode,
        previousAppointment: "Original appointment details",
        newAppointment: {
          date: newDate.toLocaleDateString(),
          time: newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        reason: reason || "Schedule change requested",
        message: `Your appointment has been rescheduled to ${newDate.toLocaleDateString()} at ${newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        nextSteps: [
          "Updated confirmation email sent",
          "New calendar invite will arrive shortly",
          "Previous appointment has been cancelled"
        ]
      }
    };
  }
};

// Cancel appointment tool
export const cancelAppointmentTool: MortgageTool = {
  name: "cancel_appointment",
  description: "Cancel an existing appointment",
  parameters: z.object({
    confirmationCode: z.string(),
    reason: z.string().optional()
  }),
  execute: async ({ confirmationCode, reason }) => {
    // Validate confirmation code format
    if (!confirmationCode.startsWith('KM')) {
      return {
        success: false,
        error: "Invalid confirmation code format"
      };
    }
    
    return {
      success: true,
      data: {
        success: true,
        confirmationCode,
        status: "cancelled",
        reason: reason || "Cancellation requested",
        message: "Your appointment has been cancelled successfully",
        nextSteps: [
          "Cancellation confirmation sent via email",
          "Calendar event has been removed",
          "To book a new appointment, please use our booking system"
        ]
      }
    };
  }
};

// Get appointment preparation checklist
export const appointmentPrepTool: MortgageTool = {
  name: "appointment_prep",
  description: "Get preparation checklist for appointment",
  parameters: z.object({
    appointmentType: z.enum(["consultation", "application", "review", "signing"])
  }),
  execute: async ({ appointmentType }) => {
    const appointmentInfo = appointmentTypes[appointmentType as keyof typeof appointmentTypes];
    
    const prepChecklists = {
      consultation: {
        documents: [
          "Recent pay stubs (last 2)",
          "Previous year tax return",
          "List of debts and monthly payments",
          "Down payment amount available"
        ],
        information: [
          "Employment history (2 years)",
          "Current living situation",
          "Property type and location preferences",
          "Timeline for purchase/refinance"
        ],
        questions: [
          "What mortgage amount can I qualify for?",
          "What are current interest rates?",
          "Fixed vs variable rate options?",
          "What are the closing costs?"
        ]
      },
      application: {
        documents: [
          "All income verification documents",
          "Bank statements (90 days)",
          "Government ID",
          "Purchase agreement (if applicable)",
          "Employment letter",
          "Credit bureau consent form"
        ],
        information: [
          "SIN number",
          "Previous addresses (3 years)",
          "Employment details with contacts",
          "Asset and liability details"
        ],
        questions: [
          "Processing timeline?",
          "Conditions that may apply?",
          "Rate lock period?",
          "Prepayment options?"
        ]
      },
      review: {
        documents: [
          "Pre-approval letter",
          "Property listings",
          "Updated financial documents (if changed)",
          "Questions about offers"
        ],
        information: [
          "Property addresses of interest",
          "Offer amounts considering",
          "Preferred closing dates",
          "Condition preferences"
        ],
        questions: [
          "How to structure offers?",
          "Condition timelines?",
          "Rate hold options?",
          "Multiple offer strategies?"
        ]
      },
      signing: {
        documents: [
          "Two pieces of government ID",
          "Void cheque for payments",
          "Property insurance confirmation",
          "Lawyer/notary information"
        ],
        information: [
          "Preferred payment date",
          "Insurance provider details",
          "Emergency contact",
          "Forwarding address (if moving)"
        ],
        questions: [
          "Payment schedule details?",
          "First payment date?",
          "Property tax handling?",
          "Insurance requirements?"
        ]
      }
    };
    
    const checklist = prepChecklists[appointmentType as keyof typeof prepChecklists];
    
    return {
      success: true,
      data: {
        appointmentType,
        duration: `${appointmentInfo.duration} minutes`,
        description: appointmentInfo.description,
        preparation: appointmentInfo.preparation,
        detailedChecklist: checklist,
        tips: [
          "Arrive 5 minutes early to test technology (if virtual)",
          "Have all documents ready and organized",
          "Prepare your questions in advance",
          "Bring a notepad for important information",
          "Ensure authorized signers are present"
        ],
        reminder: "You'll receive a detailed preparation email 24 hours before your appointment"
      }
    };
  }
};

export const appointmentTools = [
  checkAvailabilityTool,
  bookAppointmentTool,
  rescheduleAppointmentTool,
  cancelAppointmentTool,
  appointmentPrepTool
];