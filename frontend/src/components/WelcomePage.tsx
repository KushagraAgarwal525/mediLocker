import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FileText, Activity, Sparkles, Plus, Upload, X, AlertTriangle } from "lucide-react";
import cryptoLib from "../lib/crypto";
import { config } from "../lib/config";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WelcomePageProps {
  userName: string;
}

interface MedicalRecord {
  id: number;
  serverId?: string; // backend Firestore document id
  blockId?: string; // blockchain record id
  reportLink: string;
  reportDate: string; // Date of the report
  fileName?: string;
  fileData?: string; // Base64 encoded file data (legacy/local)
  fileType?: string; // MIME type
}

const STORAGE_KEY = 'medical_records';
const BLOCK_IDS_KEY = 'blockchain_block_ids';

export function WelcomePage({ userName }: WelcomePageProps) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportDate, setReportDate] = useState("");
  
  // Compatibility check states
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [compatibilityWarning, setCompatibilityWarning] = useState<{ status: number; message: string } | null>(null);
  const [showCompatibilityDialog, setShowCompatibilityDialog] = useState(false);
  const [pendingUploadData, setPendingUploadData] = useState<{
    encryptedPayload: any;
    userId: string;
  } | null>(null);

  // Load medical records from blockchain on mount
  useEffect(() => {
    const loadReportsFromBlockchain = async () => {
      try {
        // Get stored blockIds
        const blockIdsJson = localStorage.getItem(BLOCK_IDS_KEY);
        if (!blockIdsJson) {
          setMedicalRecords([]);
          return;
        }

        const blockIds = JSON.parse(blockIdsJson);
        if (!Array.isArray(blockIds) || blockIds.length === 0) {
          setMedicalRecords([]);
          return;
        }

        console.log('Loading reports for blockIds:', blockIds);
        
        // Fetch reports from backend using blockIds
        const resp = await fetch(config.endpoints.reports.getByUser, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blockIds })
        });

        const json = await resp.json();
        if (!json.success || !json.data) {
          console.error('Failed to fetch reports from blockchain', json);
          setMedicalRecords([]);
          return;
        }

        console.log('Fetched reports:', json.data);

        // Map blockchain data to MedicalRecord format
        const records: MedicalRecord[] = json.data.map((item: any, index: number) => ({
          id: index + 1,
          serverId: item.id,
          blockId: item.blockId,
          reportLink: item.db_url || item.dbUrl || `/reports/${item.id}`,
          reportDate: item.created_at || new Date().toISOString(),
          fileName: `Report ${index + 1}`,
          fileType: 'application/pdf'
        }));

        setMedicalRecords(records);
      } catch (error) {
        console.error('Error loading reports from blockchain:', error);
        setMedicalRecords([]);
      }
    };

    loadReportsFromBlockchain();
  }, [userName]);

  const handleViewReport = (record: MedicalRecord) => {
    // If this record was uploaded to the server, fetch encrypted payload and decrypt
    if (record.serverId) {
      (async () => {
        try {
          const resp = await fetch(config.endpoints.reports.getById(record.serverId));
          const json = await resp.json();
          if (!json.success || !json.data) {
            alert('Unable to fetch report from server');
            return;
          }

          let encrypted = json.data.encrypted_data || json.data.encrypted_report || json.data.encryptedData;
          if (!encrypted) {
            alert('No encrypted data found for this report');
            return;
          }

          // Parse JSON string if needed (Firestore stores it as string to avoid nested entity errors)
          if (typeof encrypted === 'string') {
            encrypted = JSON.parse(encrypted);
          }

          // Get private key for this user
          const userId = userName; // NOTE: using userName as unique user id (wallet address)
          const { privateKey } = await cryptoLib.ensureKeyPairForUser(userId);

          const plain = await cryptoLib.decryptWithPrivateKey(privateKey, encrypted);

          const mime = encrypted.fileType || record.fileType || 'application/octet-stream';
          const blob = new Blob([plain], { type: mime });
          const url = URL.createObjectURL(blob);
          const newWindow = window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          if (!newWindow) alert('Please allow pop-ups to view the report');
        } catch (err) {
          console.error('Error fetching/decrypting report:', err);
          alert('Error fetching or decrypting the report');
        }
      })();
      return;
    }

    // Fallback to legacy local base64 data
    if (record.fileData && record.fileType) {
      try {
        const byteCharacters = atob(record.fileData.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: record.fileType });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
        if (!newWindow) alert('Please allow pop-ups to view the report');
      } catch (error) {
        console.error('Error opening file:', error);
        alert('Error opening the report file');
      }
    } else {
      alert(`No file is available for this record.\n\nReport Link: ${record.reportLink}\n\nThe original file data may not have been stored.`);
    }
  };

  const handleExplain = async (recordId: number) => {
    const record = medicalRecords.find(r => r.id === recordId);
    if (!record) {
      alert('Record not found');
      return;
    }

    // Expand this row and show loading
    setExpandedRecordId(recordId);
    setIsAnalyzing(true);
    setExplanation('Analyzing your medical report with AI... This may take a moment.');

    try {
      let pdfBase64: string | null = null;
      let mimeType = 'application/pdf';

      // If this record was uploaded to the server, fetch and decrypt it
      if (record.serverId) {
        const resp = await fetch(config.endpoints.reports.getById(record.serverId));
        const json = await resp.json();
        
        if (!json.success || !json.data) {
          setExplanation('Unable to fetch report from server');
          setIsAnalyzing(false);
          return;
        }

        let encrypted = json.data.encrypted_data || json.data.encrypted_report || json.data.encryptedData;
        if (!encrypted) {
          setExplanation('No encrypted data found for this report');
          setIsAnalyzing(false);
          return;
        }

        // Parse JSON string if needed
        if (typeof encrypted === 'string') {
          encrypted = JSON.parse(encrypted);
        }

        // Get private key for this user
        const userId = userName;
        const { privateKey } = await cryptoLib.ensureKeyPairForUser(userId);

        // Decrypt the file
        const plainData = await cryptoLib.decryptWithPrivateKey(privateKey, encrypted);
        
        // Convert ArrayBuffer to base64
        const bytes = new Uint8Array(plainData);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        pdfBase64 = btoa(binary);
        mimeType = encrypted.fileType || record.fileType || 'application/pdf';
        
      } else if (record.fileData) {
        // Legacy local base64 data
        pdfBase64 = record.fileData.split(',')[1];
        mimeType = record.fileType || 'application/pdf';
      } else {
        setExplanation('No file data available for this report');
        setIsAnalyzing(false);
        return;
      }

      if (!pdfBase64) {
        setExplanation('Unable to extract file data');
        setIsAnalyzing(false);
        return;
      }

      // Send to Gemini API for explanation
      console.log('Sending to Gemini AI for analysis...');
      const explainResp = await fetch(config.endpoints.reports.explain, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          base64Data: pdfBase64,
          mimeType: mimeType
        })
      });

      const explainJson = await explainResp.json();
      
      if (!explainJson.success) {
        setExplanation('Error getting AI explanation: ' + (explainJson.message || 'Unknown error'));
        setIsAnalyzing(false);
        return;
      }

      // Display the explanation
      setExplanation(explainJson.data.explanation);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error('Error explaining report:', err);
      setExplanation('Error analyzing the report. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleAddNewReport = () => {
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !reportDate) {
      alert("Please select a file and enter a report date");
      return;
    }

    try {
      setIsCheckingCompatibility(true);
      
      // Read file as ArrayBuffer for encryption
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as ArrayBuffer);
        r.onerror = () => reject(new Error('Failed reading file'));
        r.readAsArrayBuffer(selectedFile);
      });

      const userId = userName; // assuming userName is unique user identifier
      const { publicKey } = await cryptoLib.ensureKeyPairForUser(userId);

      // Encrypt data (hybrid): returns { encryptedKey, iv, ciphertext }
      const encryptedPayload = await cryptoLib.encryptWithPublicKey(publicKey, arrayBuffer);
      // Attach metadata
      (encryptedPayload as any).fileName = selectedFile.name;
      (encryptedPayload as any).fileType = selectedFile.type;
      (encryptedPayload as any).reportDate = reportDate;

      // Convert file to base64 for AI analysis
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          // Extract base64 data (remove data:*/*;base64, prefix)
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        r.onerror = () => reject(new Error('Failed reading file for AI analysis'));
        r.readAsDataURL(selectedFile);
      });

      // Get existing blockIds for compatibility check
      const blockIdsJson = localStorage.getItem(BLOCK_IDS_KEY);
      const blockIds = blockIdsJson ? JSON.parse(blockIdsJson) : [];

      console.log('Checking medication compatibility...');
      console.log(`Found ${blockIds.length} existing reports to check against`);
      
      // Fetch and decrypt existing reports, then send to backend for text extraction
      let existingReportsBase64 = [];
      if (blockIds.length > 0) {
        try {
          // Fetch existing reports from backend
          const existingResp = await fetch(config.endpoints.reports.getByUser, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blockIds })
          });
          
          const existingJson = await existingResp.json();
          
          if (existingJson.success && existingJson.data) {
            console.log(`Decrypting ${existingJson.data.length} existing reports...`);
            
            // Decrypt each existing report and convert to base64
            for (const report of existingJson.data) {
              try {
                let encrypted = report.encrypted_data || report.encrypted_report || report.encryptedData;
                if (!encrypted) continue;
                
                // Parse JSON string if needed
                if (typeof encrypted === 'string') {
                  encrypted = JSON.parse(encrypted);
                }
                
                // Decrypt the report
                const { privateKey } = await cryptoLib.ensureKeyPairForUser(userId);
                const plainData = await cryptoLib.decryptWithPrivateKey(privateKey, encrypted);
                
                // Convert to base64
                const bytes = new Uint8Array(plainData);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const reportBase64 = btoa(binary);
                
                existingReportsBase64.push({
                  base64Data: reportBase64,
                  mimeType: encrypted.fileType || 'application/pdf',
                  reportDate: report.created_at || report.reportDate,
                  blockId: report.blockId
                });
                
                console.log(`✅ Decrypted existing report ${report.blockId}`);
              } catch (err) {
                console.warn(`Could not decrypt report ${report.blockId}:`, err.message);
              }
            }
          }
        } catch (err) {
          console.warn('Could not fetch existing reports:', err.message);
          // Continue with compatibility check anyway
        }
      }
      
      // Check medication compatibility with AI
      // Backend will extract text from existing reports to save tokens
      const compatibilityResp = await fetch(config.endpoints.reports.checkCompatibility, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newReportBase64: fileBase64,
          newReportMimeType: selectedFile.type,
          existingReportsBase64: existingReportsBase64
        })
      });

      const compatibilityJson = await compatibilityResp.json();
      setIsCheckingCompatibility(false);

      if (!compatibilityJson.success) {
        console.error('Compatibility check failed', compatibilityJson);
        alert('Failed to check medication compatibility. Proceeding with upload...');
        // Continue with upload anyway
        await performUpload(encryptedPayload, userId);
        return;
      }

      const compatibilityResult = compatibilityJson.data;
      console.log('Compatibility result:', compatibilityResult);

      // If status is 1, show warning dialog
      if (compatibilityResult.status === 1) {
        setCompatibilityWarning(compatibilityResult);
        setPendingUploadData({ encryptedPayload, userId });
        setShowCompatibilityDialog(true);
      } else {
        // Status is 0, safe to upload directly
        await performUpload(encryptedPayload, userId);
      }

    } catch (err) {
      console.error('Error processing report:', err);
      setIsCheckingCompatibility(false);
      alert('Error processing the report. See console for details.');
    }
  };

  // Separate function to perform the actual upload
  const performUpload = async (encryptedPayload: any, userId: string) => {
    try {
      // POST to backend
      console.log(encryptedPayload);
      const resp = await fetch(config.endpoints.reports.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, encrypted_report: encryptedPayload })
      });
      const json = await resp.json();
      if (!json.success) {
        console.error('Server error creating report', json);
        alert('Failed to upload report to server');
        return;
      }

      const serverId = json.data?.id;
      const blockId = json.data?.blockchain?.record_id;

      // Store blockId in localStorage (only if we have a valid recordId, not tx_hash!)
      if (blockId && typeof blockId === 'string' && !blockId.startsWith('0x')) {
        const existingBlockIds = JSON.parse(localStorage.getItem(BLOCK_IDS_KEY) || '[]');
        existingBlockIds.push(blockId);
        localStorage.setItem(BLOCK_IDS_KEY, JSON.stringify(existingBlockIds));
        console.log('✅ Stored blockId (record ID):', blockId);
        console.log('All blockIds:', existingBlockIds);
        
        // Verify it was saved
        const verifyStored = localStorage.getItem(BLOCK_IDS_KEY);
        console.log('Verified localStorage value:', verifyStored);
      } else if (json.data?.blockchain?.tx_hash) {
        console.warn('⚠️ Received tx_hash instead of record_id. Event parsing may have failed.');
        console.warn('tx_hash:', json.data.blockchain.tx_hash);
        console.warn('This report will not be loadable until backend event parsing is fixed.');
      } else {
        console.error('❌ No valid blockId (record_id) received from backend');
      }

      const newRecord: MedicalRecord = {
        id: Math.max(0, ...medicalRecords.map(r => r.id)) + 1,
        serverId: serverId,
        blockId: blockId,
        reportLink: json.data?.db_url || `/reports/${serverId}`,
        reportDate: encryptedPayload.reportDate,
        fileName: encryptedPayload.fileName,
        fileType: encryptedPayload.fileType
      };

      setMedicalRecords([newRecord, ...medicalRecords]);

      alert(`Report uploaded successfully!\n\nFile: ${encryptedPayload.fileName}\nDate: ${new Date(encryptedPayload.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);

      setSelectedFile(null);
      setReportDate("");
      setIsDialogOpen(false);
      setPendingUploadData(null);
      setCompatibilityWarning(null);
    } catch (err) {
      console.error('Error uploading file', err);
      alert('Error uploading the report. See console for details.');
    }
  };

  // Handle confirmation from compatibility warning dialog
  const handleConfirmUpload = async () => {
    setShowCompatibilityDialog(false);
    if (pendingUploadData) {
      await performUpload(pendingUploadData.encryptedPayload, pendingUploadData.userId);
    }
  };

  // Handle cancel from compatibility warning dialog
  const handleCancelUpload = () => {
    setShowCompatibilityDialog(false);
    setPendingUploadData(null);
    setCompatibilityWarning(null);
    alert('Upload cancelled. Please review the report with your healthcare provider.');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50" />
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-white text-3xl">Welcome, {userName}!</h1>
              <p className="text-gray-400">Your medical records are ready to view</p>
            </div>
          </div>
        </div>

        {/* Medical Records Table */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white text-2xl mb-2">Medical Records</h2>
                <p className="text-gray-400">View your admission history and reports</p>
              </div>
              <Button
                onClick={handleAddNewReport}
                className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6 py-3 transition-all duration-300 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Report
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">Report Date</TableHead>
                  <TableHead className="text-gray-300">Report</TableHead>
                  <TableHead className="text-gray-300">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicalRecords.map((record) => (
                  <>
                    <TableRow 
                      key={record.id} 
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-white">
                        {new Date(record.reportDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewReport(record)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleExplain(record.id)}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-blue-600/20"
                          disabled={expandedRecordId === record.id && isAnalyzing}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {expandedRecordId === record.id && isAnalyzing ? 'Analyzing...' : 'Explain'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable explanation row */}
                    {expandedRecordId === record.id && (
                      <TableRow key={`${record.id}-explanation`} className="border-b border-white/10">
                        <TableCell colSpan={3} className="p-0 overflow-hidden">
                          <div className="relative bg-gray-950 border-t-2 border-purple-500/50 w-full">
                            {/* Close button - fixed at top right */}
                            <button
                              onClick={() => setExpandedRecordId(null)}
                              className="sticky top-0 float-right mr-3 mt-3 z-20 p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                              aria-label="Close"
                            >
                              <X className="h-5 w-5 text-white" />
                            </button>

                            <div className="p-6 max-h-[600px] overflow-y-auto overflow-x-hidden w-full clear-both">
                              <div className="w-full max-w-full">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-500/30">
                                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shrink-0">
                                    <Sparkles className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold text-white break-words">
                                      AI Medical Report Analysis
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1 break-words">
                                      {isAnalyzing ? 'Our AI is carefully analyzing your medical report...' : 'Comprehensive AI-powered explanation of your medical report'}
                                    </p>
                                  </div>
                                </div>

                                {isAnalyzing ? (
                                  <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                    <div className="relative">
                                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-6 w-6 text-purple-600 animate-pulse" />
                                      </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                      <p className="text-lg font-semibold text-gray-300">Analyzing your medical report</p>
                                      <p className="text-sm text-gray-400">This may take up to 30 seconds...</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full max-w-full">
                                    <style>{`
                                      .explanation-markdown * {
                                        color: inherit !important;
                                      }
                                      .explanation-markdown {
                                        word-wrap: break-word;
                                        overflow-wrap: break-word;
                                      }
                                    `}</style>
                                    <div className="explanation-markdown text-gray-300">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-4 mt-6 pb-2 border-b-2 border-purple-500 break-words" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-100 mb-3 mt-5 flex items-center gap-2 break-words flex-wrap" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-200 mb-2 mt-4 break-words" {...props} />,
                                        p: ({node, ...props}) => <p className="text-gray-300 mb-3 leading-relaxed break-words" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-gray-300 break-words" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-gray-300 break-words" {...props} />,
                                        li: ({node, ...props}) => <li className="ml-2 pl-2 break-words text-gray-300" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-white break-words" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-purple-400 break-words" {...props} />,
                                        code: ({node, ...props}) => <code className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm font-mono break-all inline-block max-w-full" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4 break-words" {...props} />,
                                        a: ({node, ...props}) => <a className="text-blue-400 hover:underline break-all" {...props} />,
                                        table: ({node, ...props}) => <div className="overflow-x-auto w-full"><table className="w-full text-gray-300" {...props} /></div>,
                                      }}
                                    >
                                      {explanation}
                                    </ReactMarkdown>
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-wrap justify-between items-center gap-3 pt-4 mt-6 border-t border-purple-500/30">
                                  <p className="text-xs text-gray-400 flex items-center gap-1 break-words">
                                    <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
                                    Powered by Gemini 2.5 Flash AI
                                  </p>
                                  <Button
                                    onClick={() => {
                                      navigator.clipboard.writeText(explanation);
                                      alert('Explanation copied to clipboard!');
                                    }}
                                    variant="outline"
                                    className="border-purple-400 bg-purple-500/20 text-white hover:bg-purple-500/30 hover:border-purple-300 shrink-0"
                                    disabled={isAnalyzing}
                                  >
                                    Copy Text
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add New Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/20 backdrop-blur-xl text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Add New Medical Report</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a new medical report file and enter the report date.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitReport} className="space-y-6 mt-4">
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-white">Report File</Label>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
                
                {!selectedFile ? (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500/50 transition-all duration-300 bg-white/5 hover:bg-white/10"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload report</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between w-full p-4 border border-green-500/30 rounded-xl bg-green-500/10">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-white">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Report Date */}
            <div className="space-y-2">
              <Label htmlFor="report-date" className="text-white">Report Date</Label>
              <Input
                id="report-date"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-white/5 border-white/20 text-white focus:border-green-500/50"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCheckingCompatibility}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingCompatibility ? 'Checking Safety...' : 'Upload Report'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Medication Compatibility Warning Dialog */}
      <AlertDialog open={showCompatibilityDialog} onOpenChange={setShowCompatibilityDialog}>
        <AlertDialogContent className="bg-black/95 border-2 border-white rounded-2xl backdrop-blur-xl text-white sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-400 text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Medication Safety Warning
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4">
                <style>{`
                  .warning-markdown * {
                    color: inherit !important;
                  }
                  .warning-markdown {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                  }
                `}</style>
                <div className="warning-markdown text-gray-300">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 pb-2 border-b-2 border-orange-500 break-words" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-100 mb-3 mt-5 flex items-center gap-2 break-words flex-wrap" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4 break-words" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-300 mb-3 leading-relaxed break-words" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-gray-300 break-words" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-gray-300 break-words" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2 pl-2 break-words text-gray-300" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-orange-300 break-words" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-orange-400 break-words" {...props} />,
                      code: ({node, ...props}) => <code className="bg-orange-900/30 text-orange-300 px-2 py-1 rounded text-sm font-mono break-all inline-block max-w-full" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-400 my-4 break-words" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-400 hover:underline break-all" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto w-full"><table className="w-full text-gray-300" {...props} /></div>,
                    }}
                  >
                    {compatibilityWarning?.message || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel 
              onClick={handleCancelUpload}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-xl"
            >
              Cancel Upload
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmUpload}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-orange-500/30"
            >
              Upload Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
