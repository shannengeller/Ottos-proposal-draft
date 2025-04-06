
import { format } from 'date-fns';

// Types for our proposal data
export interface ProposalData {
  clientName: string;
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
  const headers = ['Client Name', 'Scope of Work', 'Price Range', 'Job Duration', 'Created At'];
  const values = [
    data.clientName,
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
