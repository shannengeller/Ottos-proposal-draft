
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData, formatAsCSV, downloadCSV, appendToGoogleSheet } from '@/utils/formatters';
import { Database, Download, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface CSVExportProps {
  proposalData: ProposalData | null;
}

const CSVExport: React.FC<CSVExportProps> = ({ proposalData }) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    // Try to get saved webhook URL from localStorage
    const saved = localStorage.getItem('googleSheetsWebhook');
    return saved || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  
  if (!proposalData) {
    return null;
  }
  
  const handleExportCSV = () => {
    const csvData = formatAsCSV(proposalData);
    const filename = `proposal_${proposalData.clientName.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.csv`;
    
    downloadCSV(csvData, filename);
    
    toast({
      title: "CSV Exported",
      description: "Your proposal data has been exported as a CSV file."
    });
  };

  const handleSendToGoogleSheets = async () => {
    if (webhookUrl) {
      // Save to localStorage
      localStorage.setItem('googleSheetsWebhook', webhookUrl);
    }
    
    setIsLoading(true);
    
    const result = await appendToGoogleSheet(proposalData, webhookUrl);
    
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
          Data Export
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export this proposal data as a CSV file that can be imported into Google Sheets or other spreadsheet applications.
            </p>
            <Button onClick={handleExportCSV} className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download as CSV
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-4">Google Sheets Integration</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook">Google Sheets Webhook URL</Label>
                  <Input
                    id="webhook"
                    type="text"
                    placeholder="Paste your webhook URL here"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    To automatically add data to Google Sheets, create a webhook using Google Apps Script or Zapier.
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVExport;
