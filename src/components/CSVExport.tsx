
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData, formatAsCSV, downloadCSV } from '@/utils/formatters';
import { Database, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface CSVExportProps {
  proposalData: ProposalData | null;
}

const CSVExport: React.FC<CSVExportProps> = ({ proposalData }) => {
  const { toast } = useToast();
  
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

  return (
    <Card className="w-full otto-shadow">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Google Sheets Export
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-6">
          Export this proposal data as a CSV file that can be imported into Google Sheets or other spreadsheet applications.
        </p>
        <Button onClick={handleExportCSV} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download as CSV
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVExport;
