# Medical Blockchain API Documentation

## Overview
AI-powered medical records management system with Firestore database and Gemini AI integration.

## Base URL
```
http://localhost:3000
```

## API Endpoints

### 1. Medical Reports

#### Get All Reports
```http
GET /api/reports
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "report123",
      "user_id": "user001",
      "report": { /* medical data */ },
      "created_at": "2025-10-25T10:00:00.000Z",
      "blockchain_hash": "abc123..."
    }
  ]
}
```

#### Get Reports by User ID
```http
GET /api/reports/user/:user_id
```

**Example:**
```http
GET /api/reports/user/user001
```

#### Get Single Report
```http
GET /api/reports/:id
```

#### Create New Report
```http
POST /api/reports
Content-Type: application/json

{
  "user_id": "user001",
  "report": {
    "patient_name": "John Doe",
    "age": 45,
    "gender": "Male",
    "diagnosis": "Type 2 Diabetes",
    "symptoms": ["Increased thirst", "Frequent urination", "Fatigue"],
    "medications": ["Metformin 500mg"],
    "blood_pressure": "130/85",
    "blood_sugar": "180 mg/dL",
    "doctor": "Dr. Sarah Smith",
    "visit_date": "2025-10-25",
    "notes": "Patient advised to monitor blood sugar levels regularly"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "id": "generated-id",
    "user_id": "user001",
    "report": { /* medical data */ },
    "created_at": "2025-10-25T10:00:00.000Z",
    "blockchain_hash": "abc123..."
  }
}
```

#### Analyze Report with Gemini AI
```http
POST /api/reports/:id/analyze
```

**Example:**
```http
POST /api/reports/report123/analyze
```

**Response:**
```json
{
  "success": true,
  "message": "Report analyzed successfully",
  "data": {
    "id": "report123",
    "analysis": "AI-generated medical analysis and insights..."
  }
}
```

#### Custom AI Query
```http
POST /api/reports/ai/query
Content-Type: application/json

{
  "prompt": "What are the common symptoms of Type 2 Diabetes?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompt": "What are the common symptoms of Type 2 Diabetes?",
    "response": "AI-generated response...",
    "timestamp": "2025-10-25T10:00:00.000Z"
  }
}
```

#### Update Report
```http
PUT /api/reports/:id
Content-Type: application/json

{
  "report": {
    "blood_sugar": "150 mg/dL",
    "notes": "Improvement noted after medication adjustment"
  }
}
```

#### Delete Report
```http
DELETE /api/reports/:id
```

### 2. Users Endpoint

#### Get All Users
```http
GET /api/users
```

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient"
}
```

## Example Usage with cURL

### Create a Medical Report:
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "patient123",
    "report": {
      "patient_name": "Jane Smith",
      "diagnosis": "Hypertension",
      "blood_pressure": "145/95",
      "medications": ["Lisinopril 10mg"]
    }
  }'
```

### Get User Reports:
```bash
curl http://localhost:3000/api/reports/user/patient123
```

### Analyze Report with AI:
```bash
curl -X POST http://localhost:3000/api/reports/report123/analyze
```

### Ask Gemini AI a Medical Question:
```bash
curl -X POST http://localhost:3000/api/reports/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What lifestyle changes help manage diabetes?"
  }'
```

## Example Usage with JavaScript (Fetch API)

```javascript
// Create a medical report
async function createReport() {
  const response = await fetch('http://localhost:3000/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: 'patient123',
      report: {
        patient_name: 'John Doe',
        diagnosis: 'Type 2 Diabetes',
        blood_sugar: '180 mg/dL'
      }
    })
  });
  
  const data = await response.json();
  console.log(data);
}

// Get reports for a user
async function getUserReports(userId) {
  const response = await fetch(`http://localhost:3000/api/reports/user/${userId}`);
  const data = await response.json();
  console.log(data);
}

// Analyze report with AI
async function analyzeReport(reportId) {
  const response = await fetch(`http://localhost:3000/api/reports/${reportId}/analyze`, {
    method: 'POST'
  });
  
  const data = await response.json();
  console.log(data);
}

// Ask AI a question
async function askAI(question) {
  const response = await fetch('http://localhost:3000/api/reports/ai/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: question
    })
  });
  
  const data = await response.json();
  console.log(data.data.response);
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "user_id and report are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Report not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error creating report",
  "error": "Detailed error message"
}
```

## Features

- ✅ Firestore database integration
- ✅ Gemini AI medical analysis
- ✅ Blockchain-style data hashing (SHA-256)
- ✅ User-based report filtering
- ✅ CRUD operations for medical reports
- ✅ AI-powered medical insights
- ✅ Timestamp tracking
- ✅ Error handling

## Security Notes

- Store Gemini API key securely in `.env` file
- Never commit `serviceAccountKey.json` to version control
- Implement authentication/authorization for production
- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting for AI queries

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Download service account key
4. Save as `serviceAccountKey.json` (don't commit!)
5. Update `config/firebase.js` to use your credentials

## Database Schema

### medical_reports Collection

```javascript
{
  id: "auto-generated-id",
  user_id: "string",
  report: {
    // Flexible medical data object
    patient_name: "string",
    diagnosis: "string",
    // ... any medical data
  },
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp",
  blockchain_hash: "SHA-256 hash",
  ai_analysis: "string (optional)",
  analyzed_at: "ISO timestamp (optional)"
}
```
