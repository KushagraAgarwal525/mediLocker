import express from 'express';
const router = express.Router();
import { db } from '../config/firebase.js';

// GET all users grouped by user_id from medical_reports
router.get('/', async (req, res) => {
  try {
    // Fetch all medical reports
    const reportsRef = db.collection('medical_reports');
    const snapshot = await reportsRef.get();
    
    // Group reports by user_id
    const usersMap = new Map();
    
    snapshot.forEach(doc => {
      const reportData = doc.data();
      const userId = reportData.user_id;
      
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          user_id: userId,
          medical_reports: [],
          reports_count: 0
        });
      }
      
      const user = usersMap.get(userId);
      user.medical_reports.push({
        id: doc.id,
        ...reportData
      });
      user.reports_count++;
    });
    
    // Convert map to array
    const users = Array.from(usersMap.values());
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET single user's medical reports by user_id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch all medical reports for this user
    const reportsRef = db.collection('medical_reports');
    const reportsSnapshot = await reportsRef.where('user_id', '==', id).get();
    
    if (reportsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this user'
      });
    }
    
    const reports = [];
    reportsSnapshot.forEach(reportDoc => {
      reports.push({
        id: reportDoc.id,
        ...reportDoc.data()
      });
    });
    
    res.json({
      success: true,
      data: {
        user_id: id,
        medical_reports: reports,
        reports_count: reports.length
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// POST - Not applicable (users are created through medical reports)
router.post('/', async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Users are not created separately. Create a medical report with a user_id instead.',
    hint: 'POST /api/reports/new with userId and encrypted_report'
  });
});

// PUT - Not applicable (no users collection)
router.put('/:id', async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Users are not stored separately. Update individual medical reports instead.',
    hint: 'PUT /api/reports/:reportId'
  });
});

// DELETE all reports for a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find all reports for this user
    const reportsRef = db.collection('medical_reports');
    const snapshot = await reportsRef.where('user_id', '==', id).get();
    
    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this user'
      });
    }
    
    // Delete all reports
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    res.json({
      success: true,
      message: `All reports for user ${id} deleted successfully`,
      deleted_count: snapshot.size
    });
  } catch (error) {
    console.error('Error deleting user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user reports',
      error: error.message
    });
  }
});

export default router;
