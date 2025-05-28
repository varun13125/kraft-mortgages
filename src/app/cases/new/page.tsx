'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { caseService } from '@/lib/firebase/services/caseService';
import { CaseCore } from '@/types/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming shadcn/ui has Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming shadcn/ui has Select
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // To get current user for createdBy

// Define a more specific type for the form data, based on CaseCore
type CreateCaseFormData = Pick<
  CaseCore,
  'caseName' | 'caseNumber' | 'moduleType' | 'status' | 'description' | 'priority'
>;

export default function CreateCasePage() {
  const { user } = useAuth(); // For createdBy, assignedUsers
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCaseFormData>({
    caseName: '',
    caseNumber: '',
    moduleType: 'general', // Default to 'general'
    status: 'Open', // Default status
    description: '',
    priority: 'Medium', // Default priority
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof CreateCaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const caseDataForApi = {
        ...formData,
        // Fields like assignedUsers can be pre-filled or set based on further UI logic
        assignedUsers: [user.uid], // Assign to current user by default
      };
      
      const response = await caseService.createCase(caseDataForApi);
      if (response.success && response.caseId) {
        alert('Case created successfully!'); // Replace with sonner/toast if available
        router.push(`/cases/${response.caseId}`); // Redirect to the new case's detail page
      } else {
        setError(response.message || 'Failed to create case.');
        alert(`Error: ${response.message || 'Failed to create case.'}`);
      }
    } catch (err: any) {
      console.error('Error creating case:', err);
      setError(err.message || 'An unexpected error occurred.');
      alert(`Error: ${err.message || 'An unexpected error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Case</CardTitle>
            <CardDescription>Fill in the details below to create a new case.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="caseName">Case Name <span className="text-red-500">*</span></Label>
                <Input
                  id="caseName"
                  name="caseName"
                  required
                  value={formData.caseName}
                  onChange={handleChange}
                  placeholder="e.g., Smith vs. Department of Justice"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caseNumber">Case Number (Optional)</Label>
                <Input
                  id="caseNumber"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  placeholder="e.g., CIV-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleType">Module Type <span className="text-red-500">*</span></Label>
                <Select
                  name="moduleType"
                  value={formData.moduleType}
                  onValueChange={(value) => handleSelectChange('moduleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select module type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    {/* Add other module types as they become available */}
                    {/* <SelectItem value="foreclosure">Foreclosure</SelectItem> */}
                    {/* <SelectItem value="immigration">Immigration</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value as CaseCore['status'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                 <Select
                  name="priority"
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value as CaseCore['priority'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief overview of the case..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-3 text-center text-red-700 bg-red-100 border border-red-400 rounded">
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Case...' : 'Create Case'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
