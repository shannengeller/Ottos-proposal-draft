
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

// Format the proposal data as CSV
export function formatAsCSV(data: ProposalData): string {
  const headers = ['Client Name', 'Client Email', 'Scope of Work', 'Price Range', 'Job Duration', 'Additional Notes', 'Created At'];
  const values = [
    data.clientName,
    data.clientEmail,
    `"${data.scopeOfWork.replace(/"/g, '""')}"`, // Escape quotes in CSV
    data.priceRange,
    data.jobDuration,
    `"${data.meetingNotes ? data.meetingNotes.replace(/"/g, '""') : ''}"`, // Escape quotes in CSV
    format(data.createdAt, 'yyyy-MM-dd HH:mm:ss')
  ];

  return `${headers.join(',')}\n${values.join(',')}`;
}

// Download data as a CSV file
export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Google Sheets integration
export async function appendToGoogleSheet(data: ProposalData, sheetUrl?: string): Promise<{ success: boolean; message: string }> {
  // If no webhook URL is provided, just open the sheet
  if (!sheetUrl) {
    // Google Sheet URL
    const defaultSheetUrl = "https://docs.google.com/spreadsheets/d/1aDO3XFc3hhJ0RdFXdrzNwvnD7jtLelGBHKAS4bNNlt0/edit?usp=sharing";
    
    // Use window.open to navigate to the Google Sheet
    window.open(defaultSheetUrl, '_blank');
    
    return {
      success: false,
      message: "Please configure a Google Sheets webhook URL to automatically add data"
    };
  }
  
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
    
    // Send the data to the webhook URL
    const response = await fetch(sheetUrl, {
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
      message: "Data sent to Google Sheets webhook"
    };
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    return {
      success: false,
      message: `Failed to send data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

