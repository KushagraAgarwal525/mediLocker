import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import routes
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Medical Blockchain API',
    version: '1.0.0',
    description: 'AI-powered medical records management with Firestore',
    endpoints: {
      users: '/api/users',
      reports: '/api/reports',
      createEncryptedReport: '/api/reports/new',
      aiQuery: '/api/reports/ai/query'
    },
    features: [
      'Firestore database integration',
      'Gemini AI medical analysis',
      'Blockchain-style data hashing',
      'Patient medical records management',
      'Polygon blockchain integration',
      'Encrypted report storage'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

export default app;
