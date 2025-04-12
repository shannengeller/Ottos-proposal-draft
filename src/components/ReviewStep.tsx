
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProposalData, formatEmailBody, appendToGoogleSheet } from '@/utils/formatters';
import { useToast } from '@/components/ui/use-toast';

interface ReviewStepProps {
  proposalData: ProposalData;
  onBack: () => void;
  onConfirm: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ proposalData, onBack, onConfirm }) => {
  const { toast } = useToast();
  const emailBody = formatEmailBody(proposalData);

  const handleConfirm = async () => {
    try {
      // Send to Google Sheets
      const sheetResult = await appendToGoogleSheet(proposalData);
      
      // Open email client
      const subject = encodeURIComponent(`Proposal for ${proposalData.clientName}`);
      const body = encodeURIComponent(emailBody);
      window.open(`mailto:${proposalData.clientEmail}?subject=${subject}&body=${body}`);
      
      // Show success message
      toast({
        title: "Proposal Processed",
        description: "Your proposal has been sent to email and recorded in Google Sheets."
      });
      
      // Complete the flow
      onConfirm();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue processing your proposal. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full otto-shadow">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Review Your Proposal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium">Client Information</h3>
            <p>Name: {proposalData.clientName}</p>
            <p>Email: {proposalData.clientEmail}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Project Details</h3>
            <p>Price Range: {proposalData.priceRange}</p>
            <p>Timeline: {proposalData.jobDuration}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Scope of Work</h3>
            <p className="whitespace-pre-wrap">{proposalData.scopeOfWork}</p>
          </div>
          
          {proposalData.meetingNotes && (
            <div className="space-y-1">
              <h3 className="font-medium">Additional Notes</h3>
              <p className="whitespace-pre-wrap">{proposalData.meetingNotes}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Email Preview</h3>
          <div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-sm border-l-4 border-primary/30 pl-3 py-2">
            {emailBody}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-muted/30">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Edit
        </Button>
        <Button onClick={handleConfirm} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Confirm and Process
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewStep;
