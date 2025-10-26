# Medical Blockchain API with Gemini AI

A comprehensive Express.js REST API for managing medical patient data with Firestore database and Gemini AI integration.

## Features

- ✅ RESTful API design
- ✅ Express.js framework
- ✅ **Firestore database integration**
- ✅ **Gemini AI medical analysis**
- ✅ **Blockchain-style data hashing (SHA-256)**
- ✅ **Medical reports management (user_id + report)**
- ✅ CORS enabled
- ✅ Environment variables support
- ✅ Error handling
- ✅ AI-powered medical insights

## Prerequisites

- Node.js (v14 or higher)
- Firebase account (for Firestore)
- Gemini API key (already configured)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Download service account key
   - Save it as `serviceAccountKey.json` in the root directory
   - Update `config/firebase.js` with your credentials

3. Environment variables:
   - Gemini API key is already configured in `.env`
   - Adjust PORT if needed (default is 3000)

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Root
- `GET /` - API information

### Medical Reports (Primary Feature)
- `GET /api/reports` - Get all medical reports
- `GET /api/reports/user/:user_id` - Get reports by user ID
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create new medical report
- `POST /api/reports/:id/analyze` - Analyze report with Gemini AI
- `POST /api/reports/ai/query` - Ask Gemini AI a medical question
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Example Requests

### Create a medical report:
```bash
POST http://localhost:3000/api/reports
Content-Type: application/json

{
  "user_id": "patient123",
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
    "visit_date": "2025-10-25"
  }
}
```

### Get reports for a user:
```bash
GET http://localhost:3000/api/reports/user/patient123
```

### Analyze report with Gemini AI:
```bash
POST http://localhost:3000/api/reports/report123/analyze
```

### Ask Gemini AI a medical question:
```bash
POST http://localhost:3000/api/reports/ai/query
Content-Type: application/json

{
  "prompt": "What are the common symptoms of Type 2 Diabetes?"
}
```

See `API_DOCUMENTATION.md` for complete API documentation.

## Project Structure

```
├── server.js                    # Main application file
├── config/
│   ├── firebase.js             # Firestore configuration
│   └── gemini.js               # Gemini AI configuration
├── routes/
│   ├── reports.js              # Medical reports routes (PRIMARY)
│   ├── users.js                # Users routes
│   └── items.js                # Items routes (legacy)
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (Gemini API key)
├── serviceAccountKey.json      # Firebase credentials (not committed)
├── README.md                   # This file
└── API_DOCUMENTATION.md        # Complete API documentation
```

## Technologies Used

- Node.js
- Express.js
- **Firebase Admin SDK (Firestore)**
- **Google Gemini AI (@google/generative-ai)**
- CORS
- dotenv
- body-parser
- nodemon (dev dependency)

## Database Schema

### Medical Reports Collection (`medical_reports`)

```javascript
{
  id: "auto-generated-id",
  user_id: "patient123",           // Patient/User identifier
  report: {                         // Flexible medical data object
    patient_name: "string",
    age: "number",
    diagnosis: "string",
    medications: ["array"],
    // ... any medical data fields
  },
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp",
  blockchain_hash: "SHA-256 hash",  // Blockchain-style verification
  ai_analysis: "string (optional)",
  analyzed_at: "ISO timestamp (optional)"
}
```

## Features Explained

### 1. Firestore Database
- Stores medical reports with user_id and report data
- NoSQL document-based storage
- Scalable and real-time
- Automatic indexing and queries

### 2. Gemini AI Integration
- Analyzes medical reports
- Provides health insights
- Answers medical questions
- AI-powered recommendations

### 3. Blockchain-Style Hashing
- Each report gets a SHA-256 hash
- Ensures data integrity
- Simulates blockchain verification
- Tamper-evident records

## Security Notes

- ⚠️ Never commit `.env` or `serviceAccountKey.json`
- ⚠️ Implement authentication for production
- ⚠️ Add rate limiting for AI queries
- ⚠️ Use HTTPS in production
- ⚠️ Validate and sanitize all inputs

## Next Steps

1. Add user authentication (JWT, OAuth)
2. Implement role-based access control
3. Add file upload for medical documents
4. Integrate actual blockchain (Ethereum, Hyperledger)
5. Add patient consent management
6. Implement audit logs
7. Add data encryption at rest

## Support

For complete API documentation, see `API_DOCUMENTATION.md`
