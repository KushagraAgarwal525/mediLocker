# Setup Guide - Encrypted Reports with Polygon Blockchain

This guide will help you set up the new `/api/reports/new` endpoint that creates encrypted reports in Firebase and records them on the Polygon blockchain.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Polygon wallet with MATIC tokens (for production)
- Alchemy or Infura account (recommended for RPC access)

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Express.js (API framework)
- Firebase Admin SDK (Firestore database)
- Ethers.js (Blockchain interaction)
- Google Generative AI (Gemini AI)
- Other dependencies

## Step 2: Configure Firebase

### Option A: Using Firebase Service Account (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Save the file as `serviceAccountKey.json` in the project root
7. ⚠️ **Never commit this file to git!**

### Option B: Local Development Mode

For testing without Firebase setup, the app will use mock mode automatically.

## Step 3: Configure Environment Variables

Update your `.env` file:

```properties
# Server Configuration
PORT=3000
NODE_ENV=development

# Gemini AI (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Polygon Blockchain Configuration
# For Testnet (Mumbai - Free, recommended for testing)
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address

# For Mainnet (Production - costs real MATIC)
# POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
# PRIVATE_KEY=your_wallet_private_key_here
# CONTRACT_ADDRESS=your_deployed_contract_address

# PolygonScan API (Optional - for contract verification)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### Get Your Keys:

#### Alchemy RPC URL (Recommended)
1. Sign up at [Alchemy](https://www.alchemy.com/)
2. Create a new app
3. Select "Polygon" network
4. Choose "Mumbai" for testnet or "Mainnet" for production
5. Copy the HTTP URL

#### Private Key
1. Open MetaMask or your wallet
2. Go to Account Details → Export Private Key
3. ⚠️ **Keep this SECRET! Never share or commit to git!**

#### Contract Address
You'll get this after deploying the smart contract (Step 4)

## Step 4: Deploy Smart Contract to Polygon

### Option 1: Quick Deploy with Hardhat

1. Install Hardhat (if not already installed):
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Deploy to Mumbai testnet:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

3. Deploy to Polygon mainnet (costs MATIC):
```bash
npx hardhat run scripts/deploy.js --network polygon
```

4. Copy the deployed contract address to `.env`:
```properties
CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Option 2: Use Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `MedicalRecords.sol`
3. Copy contract from `contracts/MedicalRecords.sol`
4. Compile with Solidity 0.8.20
5. Deploy using "Injected Provider - MetaMask"
6. Switch MetaMask to Polygon Mumbai or Mainnet
7. Deploy the contract
8. Copy contract address to `.env`

### Option 3: Skip Blockchain (Development Mode)

If you don't configure blockchain, the API will:
- ✅ Still work and save data to Firestore
- ✅ Generate mock transaction hashes
- ✅ Return mock block numbers
- ⚠️ Not create real blockchain transactions

## Step 5: Get Test MATIC (Testnet Only)

For Mumbai testnet:
1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Enter your wallet address
3. Select "Mumbai" network
4. Receive free test MATIC

For Mainnet:
- You'll need to buy real MATIC from an exchange
- Transfer to your wallet

## Step 6: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ Firebase Admin initialized
✅ Blockchain initialized with wallet
Server is running on port 3000
```

## Step 7: Test the Endpoint

### Using the Test Script

```bash
node test-new-endpoint.js
```

### Using cURL

```bash
curl -X POST http://localhost:3000/api/reports/new \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "patient123",
    "encrypted_report": "U2FsdGVkX1+F3jK8YwRf..."
  }'
```

### Using PowerShell

```powershell
$body = @{
    userId = "patient123"
    encrypted_report = "U2FsdGVkX1+F3jK8YwRf..."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/reports/new" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## Verification

After successful creation, you should get:

```json
{
  "success": true,
  "message": "Report created successfully and added to blockchain",
  "data": {
    "id": "firestore_doc_id",
    "user_id": "patient123",
    "db_url": "firestore://medical_reports/doc_id",
    "created_at": "2025-10-25T10:30:00.000Z",
    "blockchain": {
      "tx_hash": "0x1234...",
      "block_number": 12345678,
      "record_id": "1"
    }
  }
}
```

### Verify on Blockchain Explorer

1. Go to [PolygonScan](https://polygonscan.com/) (or Mumbai PolygonScan for testnet)
2. Search for the transaction hash from the response
3. View transaction details
4. Confirm it was successful

### Verify in Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your project
3. Go to Firestore Database
4. Find the `medical_reports` collection
5. Look for your document ID
6. Verify the data is stored correctly

## Troubleshooting

### Error: "Cannot find module 'ethers'"
```bash
npm install ethers
```

### Error: "insufficient funds for gas"
- You need MATIC tokens in your wallet
- For testnet: Get free MATIC from faucet
- For mainnet: Buy MATIC and transfer to wallet

### Error: "invalid sender"
- Check your PRIVATE_KEY in `.env`
- Ensure it's the full private key (64 characters)
- Don't include "0x" prefix if your wallet doesn't provide it

### Error: "Firebase not initialized"
- Add `serviceAccountKey.json` file
- Or the app will use mock mode (limited functionality)

### Mock Mode (No Real Blockchain Transactions)
If you see this message:
```
⚠️ Blockchain writes disabled (no private key)
```

The endpoint will still work but won't create real blockchain transactions. To enable:
1. Add PRIVATE_KEY to `.env`
2. Deploy smart contract
3. Add CONTRACT_ADDRESS to `.env`
4. Restart server

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] `serviceAccountKey.json` is in `.gitignore`
- [ ] Private key is kept secret
- [ ] Using environment-specific keys
- [ ] Firestore security rules are configured
- [ ] API authentication is implemented (for production)
- [ ] Rate limiting is enabled
- [ ] Input validation is in place

## Production Deployment

### Recommended Setup

1. **Firebase**
   - Production Firebase project
   - Firestore security rules configured
   - Backup enabled

2. **Blockchain**
   - Deploy to Polygon Mainnet
   - Use Alchemy or Infura for reliable RPC
   - Monitor gas costs
   - Implement transaction retry logic

3. **Security**
   - Use AWS Secrets Manager or similar for keys
   - Enable HTTPS
   - Add authentication (JWT, OAuth)
   - Implement rate limiting
   - Add input sanitization
   - Enable CORS properly

4. **Monitoring**
   - Set up logging (Winston, Morgan)
   - Monitor blockchain transactions
   - Track gas usage
   - Set up alerts for failures

## Cost Estimates

### Firebase
- Firestore: Free tier includes 1GB storage, 50K reads/day
- Paid: ~$0.06 per 100K reads

### Polygon Blockchain
- Mumbai Testnet: FREE (use faucet for test MATIC)
- Mainnet: ~$0.01-0.10 per transaction (varies with gas prices)
- Typical gas cost: 50,000-100,000 gas units
- MATIC price: Variable (check current rates)

### Alchemy RPC
- Free tier: 300M compute units/month
- More than enough for most applications

## Next Steps

1. ✅ Test the endpoint locally
2. ✅ Deploy smart contract to testnet
3. ✅ Test with real blockchain transactions
4. ✅ Verify on PolygonScan
5. ✅ Implement authentication
6. ✅ Add encryption/decryption utilities
7. ✅ Deploy to production
8. ✅ Set up monitoring

## Resources

- [Ethers.js Documentation](https://docs.ethers.org/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)

## Support

For issues or questions:
- See `ENDPOINT_DOCUMENTATION.md` for API details
- See `API_DOCUMENTATION.md` for all endpoints
- Check `README.md` for project overview
- Review `QUICK_START.md` for basic usage

---

**Need Help?**
- Check the troubleshooting section above
- Review error logs in the console
- Ensure all environment variables are set correctly
- Make sure you have sufficient MATIC for gas
