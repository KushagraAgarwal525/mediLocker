# MediLocker - Medical Records Management System

A secure, blockchain-powered medical records management system with AI analysis capabilities.

## Project Structure

```
medi_locker/
├── backend/          # Express.js API server
│   ├── config/       # Configuration files
│   ├── contracts/    # Smart contracts
│   ├── routes/       # API routes
│   └── server.js     # Main server file
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   └── lib/
│   └── vite.config.ts
└── README.md
```

## Features

- 🔐 End-to-end encryption for medical reports
- ⛓️ Blockchain verification on Polygon network
- 🤖 AI-powered medical report analysis using Gemini AI
- 💊 Medication compatibility checking
- 🔥 Firebase/Firestore database
- 🎨 Modern React UI with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key
- Polygon wallet (for blockchain features)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. Add your `serviceAccountKey.json` from Firebase

5. Start the server:
   ```bash
   npm run dev
   ```

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

See [frontend/README.md](frontend/README.md) for more details.

## Security Notes

⚠️ **IMPORTANT**: Never commit the following files:
- `backend/.env` - Contains API keys and secrets
- `backend/serviceAccountKey.json` - Firebase credentials
- Any files with real API keys or private keys

These are already included in `.gitignore`.

## Documentation

- [Backend API Documentation](backend/API_DOCUMENTATION.md)
- [Setup Guide](backend/SETUP_GUIDE.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Technology Stack

### Backend
- Express.js
- Firebase Admin SDK
- Google Gemini AI
- Ethers.js (Polygon blockchain)
- Hardhat (Smart contracts)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Web Crypto API

## License

ISC

## Contributing

Please ensure all sensitive information is in `.env` files and never committed to the repository.
