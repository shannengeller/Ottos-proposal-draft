
import React, { useState } from 'react';
import ProposalForm from '@/components/ProposalForm';
import EmailPreview from '@/components/EmailPreview';
import CSVExport from '@/components/CSVExport';
import { ProposalData } from '@/utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Database } from 'lucide-react';

const Index = () => {
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);

  const handleProposalSubmit = (data: ProposalData) => {
    setProposalData(data);
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
            <ProposalForm onSubmit={handleProposalSubmit} />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            {proposalData ? (
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/10">
                  <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Mail className="h-4 w-4" />
                    Email Draft
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Database className="h-4 w-4" />
                    CSV Export
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-0">
                  <EmailPreview proposalData={proposalData} />
                </TabsContent>
                <TabsContent value="csv" className="mt-0">
                  <CSVExport proposalData={proposalData} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-lg border-2 border-dashed border-muted p-8">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No Proposal Data</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form to generate an email draft and CSV export
                  </p>
                </div>
              </div>
            )}
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
