
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData, formatEmailBody, appendToGoogleSheet } from '@/utils/formatters';
import { Mail, Copy, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EmailPreviewProps {
  proposalData: ProposalData | null;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ proposalData }) => {
  const { toast } = useToast();
  
  if (!proposalData) {
    return null;
  }
  
  const emailBody = formatEmailBody(proposalData);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Email text has been copied to your clipboard."
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy email text to clipboard.",
          variant: "destructive"
        });
      });
  };
  
  const openEmailClient = () => {
    const subject = encodeURIComponent(`Proposal for ${proposalData.clientName}`);
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:${proposalData.clientEmail}?subject=${subject}&body=${body}`);
  };
  
  const openGoogleSheet = () => {
    appendToGoogleSheet(proposalData);
    toast({
      title: "Google Sheet Opened",
      description: "The Google Sheet has been opened in a new tab."
    });
  };
  
  return (
    <Card className="w-full otto-shadow">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Email Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-2 text-sm text-muted-foreground">
          <span className="font-medium">To:</span> {proposalData.clientEmail}
        </div>
        <div className="rounded border bg-background p-4 whitespace-pre-wrap font-mono text-sm">
          {emailBody}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between border-t p-4 bg-muted/30">
        <Button variant="outline" onClick={copyToClipboard} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Text
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openGoogleSheet} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Open Google Sheet
          </Button>
          <Button onClick={openEmailClient} className="gap-2">
            <Mail className="h-4 w-4" />
            Open in Email Client
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmailPreview;
