
import { format } from 'date-fns';

// Types for our proposal data
export interface ProposalData {
  clientName: string;
  clientEmail: string;
  scopeOfWork: string;
  priceRange: string;
  jobDuration: string;
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

This is an early assessment based on our discussion. I would be happy to schedule a follow-up meeting to discuss the details further and provide a more comprehensive proposal.

Best regards,
Erich
Otto's Contracting
erich@ottoscontracting.com
  `;
}

// Format the proposal data as CSV
export function formatAsCSV(data: ProposalData): string {
  const headers = ['Client Name', 'Client Email', 'Scope of Work', 'Price Range', 'Job Duration', 'Created At'];
  const values = [
    data.clientName,
    data.clientEmail,
    `"${data.scopeOfWork.replace(/"/g, '""')}"`, // Escape quotes in CSV
    data.priceRange,
    data.jobDuration,
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
export function appendToGoogleSheet(data: ProposalData): void {
  // Google Sheet URL
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1aDO3XFc3hhJ0RdFXdrzNwvnD7jtLelGBHKAS4bNNlt0/edit?usp=sharing";
  
  // Format the URL for opening with pre-filled data using the form functionality
  // Create a shareable link that pre-fills a form that appends to the spreadsheet
  const formattedDate = format(data.createdAt, 'yyyy-MM-dd');
  
  // Use window.open to navigate to the Google Sheet
  window.open(sheetUrl, '_blank');
  
  // Display info in console about the sheet connection
  console.log("Connecting to Google Sheet:", sheetUrl);
  console.log("To add data to the sheet, you'll need to connect the sheet with a Google Form, or use Google Apps Script.");
  console.log("Data that would be sent:", {
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    scopeOfWork: data.scopeOfWork,
    priceRange: data.priceRange,
    jobDuration: data.jobDuration,
    date: formattedDate
  });
}
