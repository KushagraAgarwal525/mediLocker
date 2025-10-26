# MediLocker Backend API

A secure, blockchain-powered medical records management API with AI analysis capabilities using Google Gemini AI and Polygon blockchain.

## 🚀 Features

- 🔐 **End-to-end encryption** for medical reports
- ⛓️ **Blockchain verification** on Polygon network
- 🤖 **AI-powered analysis** using Google Gemini AI
- 💊 **Medication compatibility checking** across patient history
- 🔥 **Firebase/Firestore** database for secure storage
- 📄 **PDF report analysis** with text extraction
- 🏥 **RESTful API** with comprehensive endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account with Firestore enabled
- Google Gemini API key
- Polygon wallet with private key (for blockchain features)
- Python 3.x (optional, for utilities)

## 🛠️ Installation

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your credentials:**

   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Polygon Blockchain Configuration
   POLYGON_RPC_URL=your_polygon_rpc_url_here
   PRIVATE_KEY=your_wallet_private_key_here
   CONTRACT_ADDRESS=your_deployed_contract_address_here
   ```

5. **Set up Firebase:**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use an existing one
   - Enable Firestore Database
   - Go to Project Settings → Service Accounts
   - Generate a new private key
   - Save the JSON file as `serviceAccountKey.json` in the backend directory

## 🎯 Quick Start

### Development Mode

Start the development server with auto-reload:

```bash
npm run dev
```

### Production Mode

Start the production server:

```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Root Endpoint

- `GET /` - API information and available endpoints

### Medical Reports

- `POST /api/reports/user` - Get reports by blockchain block IDs
- `GET /api/reports/:id` - Get single report by ID
- `POST /api/reports/new` - Create new encrypted report with blockchain verification
- `POST /api/reports/explain` - Explain PDF report with Gemini AI
- `POST /api/reports/check-compatibility` - Check medication compatibility

### Users

- `GET /api/users` - Get all users (grouped by reports)
- `GET /api/users/:id` - Get user by ID with all their reports
- `DELETE /api/users/:id` - Delete all reports for a user

## 📖 Detailed Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions for blockchain and Firebase

## 🏗️ Project Structure

```
backend/
├── config/
│   ├── blockchain.js       # Polygon blockchain integration
│   ├── firebase.js         # Firestore configuration
│   └── gemini.js          # Google Gemini AI configuration
├── contracts/
│   └── MedicalRecords.sol # Smart contract for blockchain
├── routes/
│   ├── reports.js         # Medical reports endpoints
│   └── users.js           # User management endpoints
├── ignition/
│   └── modules/           # Hardhat deployment scripts
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── hardhat.config.js      # Hardhat configuration
├── .env.example           # Environment variables template
└── serviceAccountKey.json.example # Firebase credentials template
```

## 🔧 Configuration Files

### `.env`

Contains sensitive configuration:
- API keys (Gemini)
- Blockchain private keys
- RPC URLs
- Contract addresses

**⚠️ NEVER commit this file to version control!**

### `serviceAccountKey.json`

Firebase service account credentials for Firestore access.

**⚠️ NEVER commit this file to version control!**

## 🧪 Testing

### Test the API

```bash
curl http://localhost:3000
```

### List Available Gemini Models (Python utility)

```bash
python list_gemini_models.py
```

## 📦 Dependencies

### Core Dependencies

- **express** - Web framework
- **firebase-admin** - Firebase/Firestore SDK
- **@google/generative-ai** - Google Gemini AI SDK
- **ethers** - Ethereum/Polygon blockchain interaction
- **pdf-parse** - PDF text extraction
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **body-parser** - Request body parsing

### Development Dependencies

- **nodemon** - Auto-reload development server
- **hardhat** - Smart contract development
- **@nomicfoundation/hardhat-ethers** - Hardhat Ethers plugin

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Store all secrets in `.env` file
   - Never commit `.env` to version control
   - Use `.env.example` as a template

2. **API Keys:**
   - Rotate API keys regularly
   - Use different keys for development and production
   - Monitor API usage for anomalies

3. **Blockchain:**
   - Never expose private keys in code
   - Use hardware wallets for production
   - Test on testnets before mainnet

4. **Firebase:**
   - Implement proper security rules
   - Use service accounts with minimal permissions
   - Enable audit logging

## 🌐 Deployment

### Environment Variables for Production

Set these in your hosting platform:

```env
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_production_key
POLYGON_RPC_URL=your_production_rpc
PRIVATE_KEY=your_production_private_key
CONTRACT_ADDRESS=your_deployed_contract
```

### Deployment Platforms

- **Vercel/Netlify**: Serverless deployment
- **Railway/Render**: Container-based deployment
- **AWS/GCP/Azure**: Cloud platform deployment
- **Docker**: Container deployment

## 🐛 Troubleshooting

### Server won't start

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
