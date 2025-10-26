import express from 'express';
const router = express.Router();
import { db } from '../config/firebase.js';
import { analyzePDFReport, checkMedicationCompatibility } from '../config/gemini.js';
import { createBlock, getBlockchainRecord } from '../config/blockchain.js';
import crypto from 'crypto';
import { createRequire } from 'module';

// Create require function for CommonJS modules
const require = createRequire(import.meta.url);

// Helper function to generate blockchain-style hash
function generateHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// POST - Get reports by blockchain block IDs
router.post('/user', async (req, res) => {
  try {
    const { blockIds } = req.body;
    
    // Validate input
    if (!blockIds || !Array.isArray(blockIds) || blockIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'blockIds array is required and must not be empty'
      });
    }
    
    console.log(`Fetching reports for blockIds:`, blockIds);
    
    const reports = [];
    const errors = [];
    
    // Fetch blockchain records and then get reports from Firestore
    for (const blockId of blockIds) {
      try {
        // Get blockchain record to retrieve the dbUrl
        const blockchainRecord = await getBlockchainRecord(blockId);
        console.log(`Blockchain record ${blockId}:`, blockchainRecord);
        
        // Parse the dbUrl to get Firestore document ID
        // Format: "firestore://medical_reports/{docId}"
        const dbUrl = blockchainRecord.dbUrl;
        const docId = dbUrl.split('/').pop();
        
        // Fetch the report from Firestore
        const reportRef = db.collection('medical_reports').doc(docId);
        const doc = await reportRef.get();
        
        if (doc.exists) {
          reports.push({
            id: doc.id,
            blockId: blockId,
            ...doc.data(),
            blockchain_timestamp: blockchainRecord.timestamp
          });
        } else {
          errors.push({
            blockId,
            dbUrl,
            error: 'Report not found in database',
            message: `Document ${docId} does not exist in Firestore`
          });
        }
        
      } catch (error) {
        console.error(`Error fetching block ${blockId}:`, error);
        errors.push({
          blockId,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      requested_blocks: blockIds.length,
      retrieved_reports: reports.length,
      data: reports,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reports',
      error: error.message
    });
  }
});

// GET single report
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reportRef = db.collection('medical_reports').doc(id);
    const doc = await reportRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
});

// POST /api/reports/check-compatibility - Check medication compatibility before upload
router.post('/check-compatibility', async (req, res) => {
  try {
    const { newReportBase64, newReportMimeType, existingReportsBase64 } = req.body;
    
    if (!newReportBase64) {
      return res.status(400).json({
        success: false,
        message: 'newReportBase64 is required'
      });
    }

    console.log('Checking medication compatibility for new report...');
    console.log('Existing reports count:', existingReportsBase64?.length || 0);
    
    // existingReportsBase64 is an array of { base64Data, mimeType, reportDate, blockId }
    // We'll extract text from each existing report to save tokens
    let existingReportsText = [];
    
    if (existingReportsBase64 && existingReportsBase64.length > 0) {
      console.log(`Extracting text from ${existingReportsBase64.length} existing reports...`);
      
      // Load pdf-parse using require (it's a CommonJS module)
      const { PDFParse } = require('pdf-parse');
      
      for (let i = 0; i < existingReportsBase64.length; i++) {
        const report = existingReportsBase64[i];
        try {
          const pdfBuffer = Buffer.from(report.base64Data, 'base64');
          
          // Create a PDFParse instance with the buffer data
          const parser = new PDFParse({ data: pdfBuffer });
          const result = await parser.getText();
          const extractedText = result.text;
          
          if (extractedText && extractedText.trim().length > 0) {
            existingReportsText.push({
              reportDate: report.reportDate,
              blockId: report.blockId,
              extractedText: extractedText.trim()
            });
            console.log(`✅ Extracted ${extractedText.length} chars from report ${report.blockId}`);
          } else {
            console.warn(`⚠️ No text extracted from report ${report.blockId}`);
          }
        } catch (err) {
          console.error(`Error extracting text from report ${report.blockId}:`, err.message);
          // Continue with other reports
        }
      }
    }
    
    // Perform AI compatibility check with extracted text
    const compatibilityResult = await checkMedicationCompatibility(
      newReportBase64,
      newReportMimeType || 'application/pdf',
      existingReportsText
    );
    
    res.json({
      success: true,
      data: compatibilityResult
    });
    
  } catch (error) {
    console.error('Error checking compatibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking medication compatibility',
      error: error.message
    });
  }
});

// POST /api/reports/new - Create new encrypted report with blockchain
router.post('/new', async (req, res) => {
  console.log(req)
  try {
    const { userId, encrypted_report } = req.body;
    console.log(userId, encrypted_report);
    
    // Validate input
    if (!userId || !encrypted_report) {
      return res.status(400).json({
        success: false,
        message: 'userId and encrypted_report are required'
      });
    }
    
    // Create timestamp
    const timestamp = new Date();
    
    // Prepare data for Firestore - stringify encrypted_report to avoid nested entity error
    const reportData = {
      user_id: userId,
      encrypted_data: JSON.stringify(encrypted_report),
      created_at: timestamp.toISOString(),
      updated_at: timestamp.toISOString(),
      blockchain_hash: generateHash({ userId, encrypted_report, timestamp })
    };
    
    // Save to Firestore
    const reportRef = await db.collection('medical_reports').add(reportData);
    const reportId = reportRef.id;
    
    // Construct database URL
    const dbUrl = `firestore://medical_reports/${reportId}`;
    
    console.log(`✅ Report saved to Firestore with ID: ${reportId}`);
    
    // Create block on Polygon network
    const blockchainResult = await createBlock(userId, dbUrl, timestamp);
    
    console.log('✅ Blockchain transaction:', blockchainResult.txHash);
    
    // Update Firestore with blockchain info
    await reportRef.update({
      blockchain_tx_hash: blockchainResult.txHash,
      blockchain_block_number: blockchainResult.blockNumber,
      blockchain_record_id: blockchainResult.recordId,
      db_url: dbUrl
    });
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Report created successfully and added to blockchain',
      data: {
        id: reportId,
        user_id: userId,
        db_url: dbUrl,
        created_at: timestamp.toISOString(),
        blockchain: {
          tx_hash: blockchainResult.txHash,
          block_number: blockchainResult.blockNumber,
          record_id: blockchainResult.recordId
        }
      }
    });
    
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message
    });
  }
});

// POST /api/reports/explain - Explain PDF report with Gemini AI
router.post('/explain', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'base64Data is required'
      });
    }

    console.log('Analyzing PDF report with Gemini AI...');
    
    const explanation = await analyzePDFReport(base64Data, mimeType || 'application/pdf');
    
    res.json({
      success: true,
      data: {
        explanation,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error explaining report:', error);
    res.status(500).json({
      success: false,
      message: 'Error explaining report with AI',
      error: error.message
    });
  }
});

export default router;
