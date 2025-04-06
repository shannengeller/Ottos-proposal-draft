
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
      // Handle price range formatting with dash or hyphen
      const inputValue = value;
      
      // Check if input contains a separator for range
      if (inputValue.includes('-')) {
        // Handle as a range
        const parts = inputValue.split('-').map(part => part.trim());
        
        // Format each part separately
        const formattedParts = parts.map(part => {
          // Only process parts that aren't already formatted or empty
          if (!part) return '';
          
          // Remove existing formatting ($ and commas)
          const numericOnly = part.replace(/[$,]/g, '').trim();
          
          // If no numeric value (just symbols), return empty
          if (!numericOnly || !/\d/.test(numericOnly)) return '';
          
          // Format the numeric value
          return formatCurrency(numericOnly);
        });
        
        // Join the formatted parts
        setFormData(prev => ({
          ...prev,
          [name]: formattedParts.join(' - ').replace(/\s+-\s+$/, '')  // Remove trailing dash if second part is empty
        }));
      } else {
        // Handle as a single value
        // Remove existing formatting ($ and commas)
        const numericOnly = inputValue.replace(/[$,]/g, '').trim();
        
        if (!numericOnly) {
          setFormData(prev => ({ ...prev, [name]: '' }));
        } else {
          // Format the single value
          setFormData(prev => ({ ...prev, [name]: formatCurrency(numericOnly) }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const formatCurrency = (value: string): string => {
    // Convert to number and format with commas
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Parse as number and format
    const number = parseInt(numericValue, 10);
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
