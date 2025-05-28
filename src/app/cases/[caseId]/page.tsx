'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { caseService } from '@/lib/firebase/services/caseService';
import { CaseCore, CaseDocumentMetadata, Timestamp } from '@/types/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress'; // For upload progress

// Firebase Storage imports
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app as firebaseApp } from '@/lib/firebase/client'; // Your Firebase app instance
import { v4 as uuidv4 } from 'uuid'; // For generating unique document IDs

export default function CaseDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params.caseId as string;

  const [caseData, setCaseData] = useState<(CaseCore & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const storage = getStorage(firebaseApp);

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId || !user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await caseService.getCase({ caseId });
        if (response.success && response.caseData) {
          setCaseData(response.caseData);
        } else {
          setError(response.message || 'Failed to load case details.');
        }
      } catch (err: any) {
        console.error('Error fetching case details:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId, user]);

  const handleDeleteCase = async () => {
    if (!caseId) return;
    if (window.confirm('Are you sure you want to archive this case?')) {
      try {
        const response = await caseService.deleteCase({ caseId });
        if (response.success) {
          alert('Case archived successfully!');
          router.push('/cases');
        } else {
          alert(`Error: ${response.message || 'Failed to archive case.'}`);
          setError(response.message || 'Failed to archive case.');
        }
      } catch (err: any) {
        console.error('Error deleting case:', err);
        alert(`Error: ${err.message || 'An unexpected error occurred.'}`);
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };
  
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setFileError(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !caseData || !user?.uid || !user?.email) {
      setFileError("No file selected or missing user/case data.");
      return;
    }
    if (!user.stsTokenManager.claims.tenantId) { // Accessing custom claim directly
        setFileError("Tenant ID not found. Cannot upload file.");
        return;
    }
    const tenantId = user.stsTokenManager.claims.tenantId;


    setIsUploading(true);
    setUploadProgress(0);
    setFileError(null);

    const uniqueDocumentId = uuidv4();
    const storagePath = `tenants/${tenantId}/cases/${caseId}/documents/${uniqueDocumentId}_${selectedFile.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        setFileError(`Upload failed: ${error.message}`);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newDocument: CaseDocumentMetadata = {
            documentId: uniqueDocumentId,
            fileName: selectedFile.name,
            storagePath: storagePath,
            uploadedAt: Timestamp.now(), // Use Firestore Timestamp
            uploaderId: user.uid,
            uploaderName: user.email, // Or displayName if available
            version: 1,
            size: selectedFile.size,
            mimeType: selectedFile.type,
          };

          const updatedDocumentVault = [...(caseData.documentVault || []), newDocument];
          const updateResponse = await caseService.updateCase({
            caseId: caseId,
            documentVault: updatedDocumentVault,
          });

          if (updateResponse.success) {
            alert('File uploaded and case updated successfully!');
            setCaseData(prev => prev ? { ...prev, documentVault: updatedDocumentVault } : null);
            setSelectedFile(null);
          } else {
            setFileError(updateResponse.message || 'Failed to update case with new document.');
          }
        } catch (err: any) {
          console.error('Error updating case with document:', err);
          setFileError(`Error updating case: ${err.message}`);
        } finally {
          setIsUploading(false);
        }
      }
    );
  };


  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">Loading case details...</div>
      </ProtectedRoute>
    );
  }
  if (error) {
     return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-center">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={() => router.push('/cases')} className="mt-4">Go to Case List</Button>
        </div>
      </ProtectedRoute>
    );
  }
  if (!caseData) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-center">
            <p>Case not found.</p>
            <Button onClick={() => router.push('/cases')} className="mt-4">Go to Case List</Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{caseData.caseName}</CardTitle>
                <CardDescription>Case ID: {caseData.id} {caseData.caseNumber && `| Case Number: ${caseData.caseNumber}`}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => alert('Edit functionality not implemented yet.') /* router.push(`/cases/${caseId}/edit`) */}>
                  Edit Case
                </Button>
                <Button variant="destructive" onClick={handleDeleteCase}>
                  Archive Case
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Status:</strong> {caseData.status}</p>
            <p><strong>Module Type:</strong> {caseData.moduleType}</p>
            <p><strong>Priority:</strong> {caseData.priority || 'N/A'}</p>
            <p><strong>Description:</strong> {caseData.description || 'No description provided.'}</p>
            <p><strong>Created At:</strong> {new Date(caseData.createdAt.seconds * 1000).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(caseData.updatedAt.seconds * 1000).toLocaleString()}</p>
            
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Assigned Users:</h3>
              {caseData.assignedUsers && caseData.assignedUsers.length > 0 ? (
                <ul className="list-disc list-inside">
                  {caseData.assignedUsers.map(uid => <li key={uid}>{uid}</li> /* Replace with actual user names if available */)}
                </ul>
              ) : <p>No users assigned.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Parties Section - Placeholder */}
        <Card>
          <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
          <CardContent>
            {caseData.parties && caseData.parties.length > 0 ? (
                <ul className="list-disc list-inside">
                    {caseData.parties.map(party => <li key={party.partyId}>{party.name} ({party.roleInCase})</li>)}
                </ul>
            ) : <p>No parties listed for this case.</p>}
          </CardContent>
        </Card>

        {/* Timeline Section - Placeholder */}
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent>
             {caseData.timeline && caseData.timeline.length > 0 ? (
                <ul className="space-y-2">
                    {caseData.timeline.map((event, index) => (
                        <li key={index} className="text-sm">
                            <strong>{new Date(event.timestamp.seconds * 1000).toLocaleString()}:</strong> {event.action} by {event.userName}
                            {typeof event.details === 'string' && <p className="pl-4 text-xs text-gray-600">{event.details}</p>}
                        </li>
                    ))}
                </ul>
            ) : <p>No timeline events recorded.</p>}
          </CardContent>
        </Card>
        
        {/* Document Upload and List Section */}
        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload New Document</Label>
                <Input id="file-upload" type="file" onChange={handleFileSelect} className="mt-1" />
              </div>
              {selectedFile && (
                <Button onClick={handleFileUpload} disabled={isUploading} className="mt-2">
                  {isUploading ? `Uploading (${uploadProgress.toFixed(0)}%)...` : `Upload ${selectedFile.name}`}
                </Button>
              )}
              {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
              {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Uploaded Documents:</h4>
              {caseData.documentVault && caseData.documentVault.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {caseData.documentVault.map((doc) => (
                    <li key={doc.documentId}>
                      <a 
                        href="#" // Ideally, this would be a download link (requires another function or direct GCS link if public)
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                const docRef = ref(storage, doc.storagePath);
                                const url = await getDownloadURL(docRef);
                                window.open(url, '_blank');
                            } catch (error) {
                                console.error("Error getting download URL:", error);
                                alert("Could not get download URL for this file.");
                            }
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {doc.fileName}
                      </a>
                      <span className="text-xs text-gray-500 ml-2">({(doc.size || 0 / 1024).toFixed(2)} KB) - Uploaded: {new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents uploaded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Section - Placeholder */}
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent>
            {caseData.notes && caseData.notes.length > 0 ? (
                 <ul className="space-y-2">
                    {caseData.notes.map(note => (
                        <li key={note.noteId} className="p-2 border rounded">
                            <p className="text-sm">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">By: {note.createdBy} on {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : <p>No notes for this case.</p>}
          </CardContent>
        </Card>

      </div>
    </ProtectedRoute>
  );
}
