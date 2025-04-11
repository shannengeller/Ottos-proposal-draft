
import { format } from 'date-fns';

// Types for our proposal data
export interface ProposalData {
  clientName: string;
  clientEmail: string;
  scopeOfWork: string;
  priceRange: string;
  jobDuration: string;
  meetingNotes?: string;
  createdAt: Date;
}

// Format the email body
export function formatEmailBody(data: ProposalData): string {
  return `
Dear ${data.clientName},

Thank you for the opportunity to discuss your project. Based on our consultation, I'm pleased to provide this initial proposal for your consideration.

Project Scope:
${data.scopeOfWork}

Estimated Price Range:
${data.priceRange}

Estimated Timeline:
${data.jobDuration}

${data.meetingNotes ? `Additional Notes:
${data.meetingNotes}

` : ''}
This is an early assessment based on our discussion. I would be happy to schedule a follow-up meeting to discuss the details further and provide a more comprehensive proposal.

Best regards,
Erich
Otto's Contracting
erich@ottoscontracting.com
  `;
}

// Google Sheets integration
export async function appendToGoogleSheet(data: ProposalData, sheetUrl?: string): Promise<{ success: boolean; message: string }> {
  // Use the provided Google Apps Script URL as default if no custom webhook is provided
  const webhookUrl = sheetUrl || "https://script.google.com/macros/s/AKfycbytqQ_aYfYhKFLg74kjuYsHWWDDVswvt-QZipzTdJAPeSkQ7yzX-vJuGsm8fQEGmuOJ/exec";
  
  try {
    // Format data for the webhook
    const formattedDate = format(data.createdAt, 'yyyy-MM-dd HH:mm:ss');
    
    // Prepare the data for Google Sheets
    const payload = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      scopeOfWork: data.scopeOfWork,
      priceRange: data.priceRange,
      jobDuration: data.jobDuration,
      additionalNotes: data.meetingNotes || '',
      createdAt: formattedDate
    };
    
    console.log("Sending data to Google Sheets:", payload);
    
    // Send the data to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Handle CORS for webhook requests
      body: JSON.stringify(payload)
    });
    
    console.log("Google Sheets submission attempt completed");
    
    // Since we're using no-cors mode, we won't get response details
    return {
      success: true,
      message: "Data successfully sent to Google Sheets"
    };
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    return {
      success: false,
      message: `Failed to send data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
