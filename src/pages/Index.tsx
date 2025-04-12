import React, { useState } from 'react';
import ProposalForm from '@/components/ProposalForm';
import ReviewStep from '@/components/ReviewStep';
import { ProposalData } from '@/utils/formatters';
import { FileText } from 'lucide-react';

const Index = () => {
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleProposalSubmit = (data: ProposalData) => {
    setProposalData(data);
    setIsReviewing(true);
    setIsEditing(false);
  };

  const handleBackToEdit = () => {
    setIsReviewing(false);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    setIsReviewing(false);
    setIsEditing(false);
    // Keep the proposal data available for reference
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-secondary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Otto's Design & Contracting Co.</h1>
          <p className="text-sm opacity-80">Proposal Management System</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <ProposalForm onSubmit={handleProposalSubmit} initialData={isEditing ? proposalData : undefined} />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            {proposalData && isReviewing ? (
              <ReviewStep 
                proposalData={proposalData} 
                onBack={handleBackToEdit} 
                onConfirm={handleConfirm} 
              />
            ) : proposalData && !isEditing ? (
              <div className="flex flex-col space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium text-lg">Proposal Completed</h3>
                  <p className="text-green-700">Your proposal has been processed successfully!</p>
                </div>
              </div>
            ) : !isEditing ? (
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-lg border-2 border-dashed border-muted p-8">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No Proposal Data</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form to generate an email draft and export to Google Sheets
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="bg-secondary text-white py-4 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Otto's Contracting - Proposal Management System
        </div>
      </footer>
    </div>
  );
};

export default Index;
