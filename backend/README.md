# MediLocker Backend API# MediLocker Backend API# Medical Blockchain API with Gemini AI



A secure, blockchain-powered medical records management API with AI analysis capabilities using Google Gemini AI and Polygon blockchain.



## 🚀 FeaturesA secure, blockchain-powered medical records management API with AI analysis capabilities using Google Gemini AI and Polygon blockchain.A comprehensive Express.js REST API for managing medical patient data with Firestore database and Gemini AI integration.



- 🔐 **End-to-end encryption** for medical reports

- ⛓️ **Blockchain verification** on Polygon network

- 🤖 **AI-powered analysis** using Google Gemini AI## 🚀 Features## Features

- 💊 **Medication compatibility checking** across patient history

- 🔥 **Firebase/Firestore** database for secure storage

- 📄 **PDF report analysis** with text extraction

- 🏥 **RESTful API** with comprehensive endpoints- 🔐 **End-to-end encryption** for medical reports- ✅ RESTful API design



## 📋 Prerequisites- ⛓️ **Blockchain verification** on Polygon network- ✅ Express.js framework



- Node.js (v18 or higher)- 🤖 **AI-powered analysis** using Google Gemini AI- ✅ **Firestore database integration**

- npm or yarn

- Firebase account with Firestore enabled- 💊 **Medication compatibility checking** across patient history- ✅ **Gemini AI medical analysis**

- Google Gemini API key

- Polygon wallet with private key (for blockchain features)- 🔥 **Firebase/Firestore** database for secure storage- ✅ **Blockchain-style data hashing (SHA-256)**

- Python 3.x (optional, for utilities)

- 📄 **PDF report analysis** with text extraction- ✅ **Medical reports management (user_id + report)**

## 🛠️ Installation

- 🏥 **RESTful API** with comprehensive endpoints- ✅ CORS enabled

1. **Navigate to the backend directory:**

   ```bash- ✅ Environment variables support

   cd backend

   ```## 📋 Prerequisites- ✅ Error handling



2. **Install dependencies:**- ✅ AI-powered medical insights

   ```bash

   npm install- Node.js (v18 or higher)

   ```

- npm or yarn## Prerequisites

3. **Set up environment variables:**

   ```bash- Firebase account with Firestore enabled

   cp .env.example .env

   ```- Google Gemini API key- Node.js (v14 or higher)



4. **Edit `.env` file with your credentials:**- Polygon wallet with private key (for blockchain features)- Firebase account (for Firestore)

   ```env

   PORT=3000- Python 3.x (optional, for utilities)- Gemini API key (already configured)

   NODE_ENV=development

   GEMINI_API_KEY=your_gemini_api_key_here

   

   # Polygon Blockchain Configuration## 🛠️ Installation## Installation

   POLYGON_RPC_URL=your_polygon_rpc_url_here

   PRIVATE_KEY=your_wallet_private_key_here

   CONTRACT_ADDRESS=your_deployed_contract_address_here

   ```1. **Navigate to the backend directory:**1. Install dependencies:



5. **Set up Firebase:**   ```bash```bash

   - Go to [Firebase Console](https://console.firebase.google.com)

   - Create a new project or use an existing one   cd backendnpm install

   - Enable Firestore Database

   - Go to Project Settings → Service Accounts   ``````

   - Generate a new private key

   - Save the JSON file as `serviceAccountKey.json` in the backend directory



## 🎯 Quick Start2. **Install dependencies:**2. Configure Firebase:



### Development Mode   ```bash   - Create a Firebase project at https://console.firebase.google.com



Start the development server with auto-reload:   npm install   - Enable Firestore Database



```bash   ```   - Download service account key

npm run dev

```   - Save it as `serviceAccountKey.json` in the root directory



### Production Mode3. **Set up environment variables:**   - Update `config/firebase.js` with your credentials



Start the production server:   ```bash



```bash   cp .env.example .env3. Environment variables:

npm start

```   ```   - Gemini API key is already configured in `.env`



The API will be available at `http://localhost:3000`   - Adjust PORT if needed (default is 3000)



## 📡 API Endpoints4. **Edit `.env` file with your credentials:**



### Root Endpoint   ```env## Running the Server

- `GET /` - API information and available endpoints

   PORT=3000

### Medical Reports

- `POST /api/reports/user` - Get reports by blockchain block IDs   NODE_ENV=development### Development mode (with auto-reload):

- `GET /api/reports/:id` - Get single report by ID

- `POST /api/reports/new` - Create new encrypted report with blockchain verification   GEMINI_API_KEY=your_gemini_api_key_here```bash

- `POST /api/reports/explain` - Explain PDF report with Gemini AI

- `POST /api/reports/check-compatibility` - Check medication compatibility   npm run dev



### Users   # Polygon Blockchain Configuration```

- `GET /api/users` - Get all users (grouped by reports)

- `GET /api/users/:id` - Get user by ID with all their reports   POLYGON_RPC_URL=your_polygon_rpc_url_here

- `DELETE /api/users/:id` - Delete all reports for a user

   PRIVATE_KEY=your_wallet_private_key_here### Production mode:

## 📖 Detailed Documentation

   CONTRACT_ADDRESS=your_deployed_contract_address_here```bash

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions for blockchain and Firebase   ```npm start



## 🏗️ Project Structure```



```5. **Set up Firebase:**

backend/

├── config/   - Go to [Firebase Console](https://console.firebase.google.com)The server will start on `http://localhost:3000`

│   ├── blockchain.js       # Polygon blockchain integration

│   ├── firebase.js         # Firestore configuration   - Create a new project or use an existing one

│   └── gemini.js          # Google Gemini AI configuration

├── contracts/   - Enable Firestore Database## API Endpoints

│   └── MedicalRecords.sol # Smart contract for blockchain

├── routes/   - Go to Project Settings → Service Accounts

│   ├── reports.js         # Medical reports endpoints

│   └── users.js           # User management endpoints   - Generate a new private key### Root

├── ignition/

│   └── modules/           # Hardhat deployment scripts   - Save the JSON file as `serviceAccountKey.json` in the backend directory- `GET /` - API information

├── server.js              # Main Express server

├── package.json           # Dependencies and scripts

├── hardhat.config.js      # Hardhat configuration

├── .env.example           # Environment variables template## 🎯 Quick Start### Medical Reports (Primary Feature)

└── serviceAccountKey.json.example # Firebase credentials template

```- `GET /api/reports` - Get all medical reports



## 🔧 Configuration Files### Development Mode- `GET /api/reports/user/:user_id` - Get reports by user ID



### `.env`- `GET /api/reports/:id` - Get single report

Contains sensitive configuration:

- API keys (Gemini)Start the development server with auto-reload:- `POST /api/reports` - Create new medical report

- Blockchain private keys

- RPC URLs- `POST /api/reports/:id/analyze` - Analyze report with Gemini AI

- Contract addresses

```bash- `POST /api/reports/ai/query` - Ask Gemini AI a medical question

**⚠️ NEVER commit this file to version control!**

npm run dev- `PUT /api/reports/:id` - Update report

### `serviceAccountKey.json`

Firebase service account credentials for Firestore access.```- `DELETE /api/reports/:id` - Delete report



**⚠️ NEVER commit this file to version control!**



## 🧪 Testing### Production Mode### Users



### Test the API- `GET /api/users` - Get all users

```bash

curl http://localhost:3000Start the production server:- `GET /api/users/:id` - Get user by ID

```

- `POST /api/users` - Create new user

### List Available Gemini Models (Python utility)

```bash```bash- `PUT /api/users/:id` - Update user

python list_gemini_models.py

```npm start- `DELETE /api/users/:id` - Delete user



## 📦 Dependencies```



### Core Dependencies## Example Requests

- **express** - Web framework

- **firebase-admin** - Firebase/Firestore SDKThe API will be available at `http://localhost:3000`

- **@google/generative-ai** - Google Gemini AI SDK

- **ethers** - Ethereum/Polygon blockchain interaction### Create a medical report:

- **pdf-parse** - PDF text extraction

- **cors** - Cross-origin resource sharing## 📡 API Endpoints```bash

- **dotenv** - Environment variable management

- **body-parser** - Request body parsingPOST http://localhost:3000/api/reports



### Development Dependencies### Root EndpointContent-Type: application/json

- **nodemon** - Auto-reload development server

- **hardhat** - Smart contract development- `GET /` - API information and available endpoints

- **@nomicfoundation/hardhat-ethers** - Hardhat Ethers plugin

{

## 🔒 Security Best Practices

### Medical Reports  "user_id": "patient123",

1. **Environment Variables:**

   - Store all secrets in `.env` file- `POST /api/reports/user` - Get reports by blockchain block IDs  "report": {

   - Never commit `.env` to version control

   - Use `.env.example` as a template- `GET /api/reports/:id` - Get single report by ID    "patient_name": "John Doe",



2. **API Keys:**- `POST /api/reports/new` - Create new encrypted report with blockchain verification    "age": 45,

   - Rotate API keys regularly

   - Use different keys for development and production- `POST /api/reports/explain` - Explain PDF report with Gemini AI    "gender": "Male",

   - Monitor API usage for anomalies

- `POST /api/reports/check-compatibility` - Check medication compatibility    "diagnosis": "Type 2 Diabetes",

3. **Blockchain:**

   - Never expose private keys in code    "symptoms": ["Increased thirst", "Frequent urination", "Fatigue"],

   - Use hardware wallets for production

   - Test on testnets before mainnet### Users    "medications": ["Metformin 500mg"],



4. **Firebase:**- `GET /api/users` - Get all users (grouped by reports)    "blood_pressure": "130/85",

   - Implement proper security rules

   - Use service accounts with minimal permissions- `GET /api/users/:id` - Get user by ID with all their reports    "blood_sugar": "180 mg/dL",

   - Enable audit logging

- `DELETE /api/users/:id` - Delete all reports for a user    "doctor": "Dr. Sarah Smith",

## 🌐 Deployment

    "visit_date": "2025-10-25"

### Environment Variables for Production

## 📖 Detailed Documentation  }

Set these in your hosting platform:

}

```env

NODE_ENV=production- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples```

PORT=3000

GEMINI_API_KEY=your_production_key- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions for blockchain and Firebase

POLYGON_RPC_URL=your_production_rpc

PRIVATE_KEY=your_production_private_key### Get reports for a user:

CONTRACT_ADDRESS=your_deployed_contract

```## 🏗️ Project Structure```bash



### Deployment PlatformsGET http://localhost:3000/api/reports/user/patient123



- **Vercel/Netlify**: Serverless deployment``````

- **Railway/Render**: Container-based deployment

- **AWS/GCP/Azure**: Cloud platform deploymentbackend/

- **Docker**: Container deployment

├── config/### Analyze report with Gemini AI:

## 🐛 Troubleshooting

│   ├── blockchain.js       # Polygon blockchain integration```bash

### Server won't start

- Check if port 3000 is available│   ├── firebase.js         # Firestore configurationPOST http://localhost:3000/api/reports/report123/analyze

- Verify all environment variables are set

- Check Firebase credentials│   └── gemini.js          # Google Gemini AI configuration```



### Blockchain errors├── contracts/

- Verify private key is correct

- Check RPC URL is accessible│   └── MedicalRecords.sol # Smart contract for blockchain### Ask Gemini AI a medical question:

- Ensure contract is deployed

- Confirm wallet has sufficient funds for gas├── routes/```bash



### AI/Gemini errors│   ├── reports.js         # Medical reports endpointsPOST http://localhost:3000/api/reports/ai/query

- Verify API key is valid

- Check API quota limits│   └── users.js           # User management endpointsContent-Type: application/json

- Ensure model name is correct

├── ignition/

### Firebase errors

- Verify serviceAccountKey.json exists│   └── modules/           # Hardhat deployment scripts{

- Check Firestore security rules

- Confirm project ID is correct├── server.js              # Main Express server  "prompt": "What are the common symptoms of Type 2 Diabetes?"



## 📄 License├── package.json           # Dependencies and scripts}



ISC├── hardhat.config.js      # Hardhat configuration```



## 🤝 Contributing├── .env.example           # Environment variables template



Contributions are welcome! Please ensure:└── serviceAccountKey.json.example # Firebase credentials templateSee `API_DOCUMENTATION.md` for complete API documentation.

- No sensitive data in commits

- Follow existing code style```

- Add tests for new features

- Update documentation## Project Structure



## 📞 Support## 🔧 Configuration Files



For issues and questions:```

- Check [API Documentation](./API_DOCUMENTATION.md)

- Review [Setup Guide](./SETUP_GUIDE.md)### `.env`├── server.js                    # Main application file

- Create an issue in the repository

Contains sensitive configuration:├── config/

## 🔗 Related Resources

- API keys (Gemini)│   ├── firebase.js             # Firestore configuration

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)

- [Google Gemini AI Documentation](https://ai.google.dev/docs)- Blockchain private keys│   └── gemini.js               # Gemini AI configuration

- [Ethers.js Documentation](https://docs.ethers.org/)

- [Polygon Documentation](https://docs.polygon.technology/)- RPC URLs├── routes/

- [Hardhat Documentation](https://hardhat.org/docs)

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
