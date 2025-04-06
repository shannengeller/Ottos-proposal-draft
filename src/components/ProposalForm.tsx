
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ProposalData } from '@/utils/formatters';
import { FileText, Send } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (data: ProposalData) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<ProposalData, 'createdAt'>>({
    clientName: '',
    scopeOfWork: '',
    priceRange: '',
    jobDuration: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'priceRange') {
      // Handle price range formatting
      let formattedValue = value;
      
      // Split by hyphen to handle ranges
      const parts = value.split('-').map(part => part.trim());
      
      if (parts.length === 1) {
        // Single value
        const numericValue = parts[0].replace(/[^0-9]/g, '');
        
        if (numericValue === '') {
          setFormData(prev => ({ ...prev, [name]: '' }));
          return;
        }
        
        formattedValue = formatCurrency(numericValue);
      } else if (parts.length === 2) {
        // Range: format each part
        const formattedParts = parts.map(part => {
          const numericValue = part.replace(/[^0-9]/g, '');
          return numericValue ? formatCurrency(numericValue) : '';
        });
        
        // Only include non-empty parts
        formattedValue = formattedParts
          .filter(Boolean)
          .join(' - ');
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const formatCurrency = (value: string): string => {
    // Convert to number and format with commas
    const number = parseInt(value, 10);
    return `$${number.toLocaleString('en-US')}`;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.clientName || !formData.scopeOfWork || !formData.priceRange || !formData.jobDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Include the current date and submit
    onSubmit({
      ...formData,
      createdAt: new Date()
    });
    
    toast({
      title: "Proposal Created",
      description: "Your proposal has been successfully created."
    });
  };
  
  return (
    <Card className="w-full max-w-2xl otto-shadow border-t-4 border-t-primary">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          New Client Proposal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input 
              id="clientName"
              name="clientName"
              placeholder="John Smith"
              value={formData.clientName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scopeOfWork">Scope of Work</Label>
            <Textarea 
              id="scopeOfWork"
              name="scopeOfWork"
              placeholder="Brief overview of the project requirements"
              rows={5}
              value={formData.scopeOfWork}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priceRange">Price Range</Label>
            <Input 
              id="priceRange"
              name="priceRange"
              placeholder="e.g. $5,000 - $7,500"
              value={formData.priceRange}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDuration">Job Duration</Label>
            <Input 
              id="jobDuration"
              name="jobDuration"
              placeholder="e.g. 3-4 weeks"
              value={formData.jobDuration}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" />
            Create Proposal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProposalForm;
