# MediLocker Backend API# Medical Blockchain API with Gemini AI



A secure, blockchain-powered medical records management API with AI analysis capabilities using Google Gemini AI and Polygon blockchain.A comprehensive Express.js REST API for managing medical patient data with Firestore database and Gemini AI integration.



## 🚀 Features## Features



- 🔐 **End-to-end encryption** for medical reports- ✅ RESTful API design

- ⛓️ **Blockchain verification** on Polygon network- ✅ Express.js framework

- 🤖 **AI-powered analysis** using Google Gemini AI- ✅ **Firestore database integration**

- 💊 **Medication compatibility checking** across patient history- ✅ **Gemini AI medical analysis**

- 🔥 **Firebase/Firestore** database for secure storage- ✅ **Blockchain-style data hashing (SHA-256)**

- 📄 **PDF report analysis** with text extraction- ✅ **Medical reports management (user_id + report)**

- 🏥 **RESTful API** with comprehensive endpoints- ✅ CORS enabled

- ✅ Environment variables support

## 📋 Prerequisites- ✅ Error handling

- ✅ AI-powered medical insights

- Node.js (v18 or higher)

- npm or yarn## Prerequisites

- Firebase account with Firestore enabled

- Google Gemini API key- Node.js (v14 or higher)

- Polygon wallet with private key (for blockchain features)- Firebase account (for Firestore)

- Python 3.x (optional, for utilities)- Gemini API key (already configured)



## 🛠️ Installation## Installation



1. **Navigate to the backend directory:**1. Install dependencies:

   ```bash```bash

   cd backendnpm install

   ``````



2. **Install dependencies:**2. Configure Firebase:

   ```bash   - Create a Firebase project at https://console.firebase.google.com

   npm install   - Enable Firestore Database

   ```   - Download service account key

   - Save it as `serviceAccountKey.json` in the root directory

3. **Set up environment variables:**   - Update `config/firebase.js` with your credentials

   ```bash

   cp .env.example .env3. Environment variables:

   ```   - Gemini API key is already configured in `.env`

   - Adjust PORT if needed (default is 3000)

4. **Edit `.env` file with your credentials:**

   ```env## Running the Server

   PORT=3000

   NODE_ENV=development### Development mode (with auto-reload):

   GEMINI_API_KEY=your_gemini_api_key_here```bash

   npm run dev

   # Polygon Blockchain Configuration```

   POLYGON_RPC_URL=your_polygon_rpc_url_here

   PRIVATE_KEY=your_wallet_private_key_here### Production mode:

   CONTRACT_ADDRESS=your_deployed_contract_address_here```bash

   ```npm start

```

5. **Set up Firebase:**

   - Go to [Firebase Console](https://console.firebase.google.com)The server will start on `http://localhost:3000`

   - Create a new project or use an existing one

   - Enable Firestore Database## API Endpoints

   - Go to Project Settings → Service Accounts

   - Generate a new private key### Root

   - Save the JSON file as `serviceAccountKey.json` in the backend directory- `GET /` - API information



## 🎯 Quick Start### Medical Reports (Primary Feature)

- `GET /api/reports` - Get all medical reports

### Development Mode- `GET /api/reports/user/:user_id` - Get reports by user ID

- `GET /api/reports/:id` - Get single report

Start the development server with auto-reload:- `POST /api/reports` - Create new medical report

- `POST /api/reports/:id/analyze` - Analyze report with Gemini AI

```bash- `POST /api/reports/ai/query` - Ask Gemini AI a medical question

npm run dev- `PUT /api/reports/:id` - Update report

```- `DELETE /api/reports/:id` - Delete report



### Production Mode### Users

- `GET /api/users` - Get all users

Start the production server:- `GET /api/users/:id` - Get user by ID

- `POST /api/users` - Create new user

```bash- `PUT /api/users/:id` - Update user

npm start- `DELETE /api/users/:id` - Delete user

```

## Example Requests

The API will be available at `http://localhost:3000`

### Create a medical report:

## 📡 API Endpoints```bash

POST http://localhost:3000/api/reports

### Root EndpointContent-Type: application/json

- `GET /` - API information and available endpoints

{

### Medical Reports  "user_id": "patient123",

- `POST /api/reports/user` - Get reports by blockchain block IDs  "report": {

- `GET /api/reports/:id` - Get single report by ID    "patient_name": "John Doe",

- `POST /api/reports/new` - Create new encrypted report with blockchain verification    "age": 45,

- `POST /api/reports/explain` - Explain PDF report with Gemini AI    "gender": "Male",

- `POST /api/reports/check-compatibility` - Check medication compatibility    "diagnosis": "Type 2 Diabetes",

    "symptoms": ["Increased thirst", "Frequent urination", "Fatigue"],

### Users    "medications": ["Metformin 500mg"],

- `GET /api/users` - Get all users (grouped by reports)    "blood_pressure": "130/85",

- `GET /api/users/:id` - Get user by ID with all their reports    "blood_sugar": "180 mg/dL",

- `DELETE /api/users/:id` - Delete all reports for a user    "doctor": "Dr. Sarah Smith",

    "visit_date": "2025-10-25"

## 📖 Detailed Documentation  }

}

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples```

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions for blockchain and Firebase

### Get reports for a user:

## 🏗️ Project Structure```bash

GET http://localhost:3000/api/reports/user/patient123

``````

backend/

├── config/### Analyze report with Gemini AI:

│   ├── blockchain.js       # Polygon blockchain integration```bash

│   ├── firebase.js         # Firestore configurationPOST http://localhost:3000/api/reports/report123/analyze

│   └── gemini.js          # Google Gemini AI configuration```

├── contracts/

│   └── MedicalRecords.sol # Smart contract for blockchain### Ask Gemini AI a medical question:

├── routes/```bash

│   ├── reports.js         # Medical reports endpointsPOST http://localhost:3000/api/reports/ai/query

│   └── users.js           # User management endpointsContent-Type: application/json

├── ignition/

│   └── modules/           # Hardhat deployment scripts{

├── server.js              # Main Express server  "prompt": "What are the common symptoms of Type 2 Diabetes?"

├── package.json           # Dependencies and scripts}

├── hardhat.config.js      # Hardhat configuration```

├── .env.example           # Environment variables template

└── serviceAccountKey.json.example # Firebase credentials templateSee `API_DOCUMENTATION.md` for complete API documentation.

```

## Project Structure

## 🔧 Configuration Files

```

### `.env`├── server.js                    # Main application file

Contains sensitive configuration:├── config/

- API keys (Gemini)│   ├── firebase.js             # Firestore configuration

- Blockchain private keys│   └── gemini.js               # Gemini AI configuration

- RPC URLs├── routes/

- Contract addresses│   ├── reports.js              # Medical reports routes (PRIMARY)

│   ├── users.js                # Users routes

**⚠️ NEVER commit this file to version control!**│   └── items.js                # Items routes (legacy)

├── package.json                # Dependencies and scripts

### `serviceAccountKey.json`├── .env                        # Environment variables (Gemini API key)

Firebase service account credentials for Firestore access.├── serviceAccountKey.json      # Firebase credentials (not committed)

├── README.md                   # This file

**⚠️ NEVER commit this file to version control!**└── API_DOCUMENTATION.md        # Complete API documentation

```

## 🧪 Testing

## Technologies Used

### Test the API

```bash- Node.js

curl http://localhost:3000- Express.js

```- **Firebase Admin SDK (Firestore)**

- **Google Gemini AI (@google/generative-ai)**

### List Available Gemini Models (Python utility)- CORS

```bash- dotenv

python list_gemini_models.py- body-parser

```- nodemon (dev dependency)



## 📦 Dependencies## Database Schema



### Core Dependencies### Medical Reports Collection (`medical_reports`)

- **express** - Web framework

- **firebase-admin** - Firebase/Firestore SDK```javascript

- **@google/generative-ai** - Google Gemini AI SDK{

- **ethers** - Ethereum/Polygon blockchain interaction  id: "auto-generated-id",

- **pdf-parse** - PDF text extraction  user_id: "patient123",           // Patient/User identifier

- **cors** - Cross-origin resource sharing  report: {                         // Flexible medical data object

- **dotenv** - Environment variable management    patient_name: "string",

- **body-parser** - Request body parsing    age: "number",

    diagnosis: "string",

### Development Dependencies    medications: ["array"],

- **nodemon** - Auto-reload development server    // ... any medical data fields

- **hardhat** - Smart contract development  },

- **@nomicfoundation/hardhat-ethers** - Hardhat Ethers plugin  created_at: "ISO timestamp",

  updated_at: "ISO timestamp",

## 🔒 Security Best Practices  blockchain_hash: "SHA-256 hash",  // Blockchain-style verification

  ai_analysis: "string (optional)",

1. **Environment Variables:**  analyzed_at: "ISO timestamp (optional)"

   - Store all secrets in `.env` file}

   - Never commit `.env` to version control```

   - Use `.env.example` as a template

## Features Explained

2. **API Keys:**

   - Rotate API keys regularly### 1. Firestore Database

   - Use different keys for development and production- Stores medical reports with user_id and report data

   - Monitor API usage for anomalies- NoSQL document-based storage

- Scalable and real-time

3. **Blockchain:**- Automatic indexing and queries

   - Never expose private keys in code

   - Use hardware wallets for production### 2. Gemini AI Integration

   - Test on testnets before mainnet- Analyzes medical reports

- Provides health insights

4. **Firebase:**- Answers medical questions

   - Implement proper security rules- AI-powered recommendations

   - Use service accounts with minimal permissions

   - Enable audit logging### 3. Blockchain-Style Hashing

- Each report gets a SHA-256 hash

## 🌐 Deployment- Ensures data integrity

- Simulates blockchain verification

### Environment Variables for Production- Tamper-evident records



Set these in your hosting platform:## Security Notes



```env- ⚠️ Never commit `.env` or `serviceAccountKey.json`

NODE_ENV=production- ⚠️ Implement authentication for production

PORT=3000- ⚠️ Add rate limiting for AI queries

GEMINI_API_KEY=your_production_key- ⚠️ Use HTTPS in production

POLYGON_RPC_URL=your_production_rpc- ⚠️ Validate and sanitize all inputs

PRIVATE_KEY=your_production_private_key

CONTRACT_ADDRESS=your_deployed_contract## Next Steps

```

1. Add user authentication (JWT, OAuth)

### Deployment Platforms2. Implement role-based access control

3. Add file upload for medical documents

- **Vercel/Netlify**: Serverless deployment4. Integrate actual blockchain (Ethereum, Hyperledger)

- **Railway/Render**: Container-based deployment5. Add patient consent management

- **AWS/GCP/Azure**: Cloud platform deployment6. Implement audit logs

- **Docker**: Container deployment7. Add data encryption at rest



## 🐛 Troubleshooting## Support



### Server won't startFor complete API documentation, see `API_DOCUMENTATION.md`

- Check if port 3000 is available
- Verify all environment variables are set
- Check Firebase credentials

### Blockchain errors
- Verify private key is correct
- Check RPC URL is accessible
- Ensure contract is deployed
- Confirm wallet has sufficient funds for gas

### AI/Gemini errors
- Verify API key is valid
- Check API quota limits
- Ensure model name is correct

### Firebase errors
- Verify serviceAccountKey.json exists
- Check Firestore security rules
- Confirm project ID is correct

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please ensure:
- No sensitive data in commits
- Follow existing code style
- Add tests for new features
- Update documentation

## 📞 Support

For issues and questions:
- Check [API Documentation](./API_DOCUMENTATION.md)
- Review [Setup Guide](./SETUP_GUIDE.md)
- Create an issue in the repository

## 🔗 Related Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Hardhat Documentation](https://hardhat.org/docs)
