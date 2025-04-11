
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData, appendToGoogleSheet } from '@/utils/formatters';
import { Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface GoogleSheetsExportProps {
  proposalData: ProposalData | null;
}

const GoogleSheetsExport: React.FC<GoogleSheetsExportProps> = ({ proposalData }) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    // Try to get saved webhook URL from localStorage, default to empty string
    const saved = localStorage.getItem('googleSheetsWebhook');
    return saved || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  
  if (!proposalData) {
    return null;
  }

  const handleSendToGoogleSheets = async () => {
    if (webhookUrl) {
      // Save to localStorage if user provided a custom URL
      localStorage.setItem('googleSheetsWebhook', webhookUrl);
    }
    
    setIsLoading(true);
    
    const result = await appendToGoogleSheet(proposalData, webhookUrl || undefined);
    
    setIsLoading(false);
    
    toast({
      title: result.success ? "Data Sent" : "Action Required",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
  };

  return (
    <Card className="w-full otto-shadow">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Google Sheets Export
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export this proposal data to your Google Sheets spreadsheet for tracking and management.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook">Google Sheets Webhook URL (Optional)</Label>
              <Input
                id="webhook"
                type="text"
                placeholder="Default URL is already configured"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                A default Google Sheets webhook is already set up. You can optionally override it with your own.
              </p>
            </div>
            <Button 
              onClick={handleSendToGoogleSheets} 
              className="w-full gap-2"
              disabled={isLoading}
            >
              <FileSpreadsheet className="h-4 w-4" />
              {isLoading ? "Sending..." : "Send to Google Sheets"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsExport;
