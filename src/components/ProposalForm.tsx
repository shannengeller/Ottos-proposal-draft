
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
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    scopeOfWork: '',
    lowPriceRange: '',
    highPriceRange: '',
    jobDuration: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'lowPriceRange' || name === 'highPriceRange') {
      // Handle price formatting
      const numericOnly = value.replace(/[$,]/g, '').trim();
      
      if (!numericOnly) {
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        setFormData(prev => ({ ...prev, [name]: formatCurrency(numericOnly) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const formatCurrency = (value: string): string => {
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
    if (!formData.clientName || !formData.clientEmail || !formData.scopeOfWork || !formData.lowPriceRange || !formData.jobDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Combine price ranges for the final data
    const priceRange = formData.highPriceRange 
      ? `${formData.lowPriceRange} - ${formData.highPriceRange}`
      : formData.lowPriceRange;
    
    // Include the current date and submit
    onSubmit({
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      scopeOfWork: formData.scopeOfWork,
      priceRange: priceRange,
      jobDuration: formData.jobDuration,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input 
                id="clientEmail"
                name="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={handleChange}
              />
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lowPriceRange">Minimum Price</Label>
              <Input 
                id="lowPriceRange"
                name="lowPriceRange"
                placeholder="e.g. $5,000"
                value={formData.lowPriceRange}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="highPriceRange">Maximum Price</Label>
              <Input 
                id="highPriceRange"
                name="highPriceRange"
                placeholder="e.g. $7,500 (optional)"
                value={formData.highPriceRange}
                onChange={handleChange}
              />
            </div>
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
