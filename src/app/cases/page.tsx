'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { caseService } from '@/lib/firebase/services/caseService';
import { CaseCore } from '@/types/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext'; // To get user for potential filtering or actions

export default function CaseListPage() {
  const { user } = useAuth(); // Get current user if needed for context
  const [cases, setCases] = useState<(CaseCore & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) { // Ensure user is available before fetching, ProtectedRoute should handle this too
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // TODO: Add pagination and filtering options if needed
        const response = await caseService.listCases({}); // Empty params for now
        if (response.success && response.cases) {
          setCases(response.cases);
        } else {
          setError(response.message || 'Failed to load cases.');
        }
      } catch (err: any) {
        console.error('Error fetching cases:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user]); // Re-fetch if user changes, though ProtectedRoute should manage access

  const handleRowClick = (caseId: string) => {
    router.push(`/cases/${caseId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">Loading cases...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Case List</CardTitle>
                <CardDescription>Browse and manage your cases.</CardDescription>
              </div>
              <Link href="/cases/new" passHref>
                <Button>Create New Case</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-center text-red-700 bg-red-100 border border-red-400 rounded">
                <p>Error: {error}</p>
              </div>
            )}
            {cases.length === 0 && !error && (
              <p className="text-center text-gray-500">No cases found. Get started by creating a new case.</p>
            )}
            {cases.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Name</TableHead>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Module Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow 
                      key={caseItem.id} 
                      onClick={() => handleRowClick(caseItem.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">{caseItem.caseName}</TableCell>
                      <TableCell>{caseItem.caseNumber || 'N/A'}</TableCell>
                      <TableCell>{caseItem.moduleType}</TableCell>
                      <TableCell>{caseItem.status}</TableCell>
                      <TableCell>{caseItem.priority || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/cases/${caseItem.id}/edit`); }}> 
                          {/* Placeholder for edit, actual edit page not in this task yet */}
                          View/Edit 
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {/* Optional: Add pagination controls in CardFooter if implementing pagination */}
          {/* <CardFooter>
            <p>Pagination controls here...</p>
          </CardFooter> */}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
