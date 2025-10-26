import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Polygon network configuration
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Smart contract ABI for medical records (must match deployed contract)
const CONTRACT_ABI = [
  "function addMedicalRecord(string userId, string dbUrl, uint256 timestamp) public returns (uint256)",
  "function getMedicalRecord(uint256 recordId) public view returns (string, string, uint256)",
  "event MedicalRecordAdded(uint256 indexed recordId, string userId, string dbUrl, uint256 timestamp, address indexed creator)"
];

// Contract address (you'll need to deploy your own contract)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

let provider;
let wallet;
let contract;

// Initialize blockchain connection
function initializeBlockchain() {
  try {
    // Connect to Polygon network
    provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    
    if (PRIVATE_KEY) {
      wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
      console.log('✅ Blockchain initialized with wallet');
    } else {
      console.log('⚠️ No private key found, blockchain writes disabled');
      // Read-only mode
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing blockchain:', error.message);
    return false;
  }
}

// Create a new block on Polygon network
async function createBlock(userId, dbUrl, timestamp) {
  try {
    if (!wallet) {
      console.log('⚠️ Blockchain writes disabled (no private key)');
      // Return mock transaction for development
      return {
        success: true,
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000),
        message: 'Mock transaction (configure PRIVATE_KEY for real transactions)',
        userId,
        dbUrl,
        timestamp
      };
    }

    // Convert timestamp to Unix timestamp if it's a Date object
    const unixTimestamp = timestamp instanceof Date ? 
      Math.floor(timestamp.getTime() / 1000) : 
      Math.floor(new Date(timestamp).getTime() / 1000);

    console.log(`Creating blockchain record for user: ${userId}`);
    
    // Send transaction to smart contract
    const tx = await contract.addMedicalRecord(userId, dbUrl, unixTimestamp);
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    console.log('Transaction hash:', receipt.hash);
    console.log('Contract address:', CONTRACT_ADDRESS);
    
    // Method 1: Try to get recordId from event logs
    console.log('Receipt logs count:', receipt.logs.length);
    
    let recordId = null;
    
    // Parse all logs to find the MedicalRecordAdded event
    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      console.log(`\nLog ${i}:`, {
        address: log.address,
        contractAddress: CONTRACT_ADDRESS,
        addressMatch: log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase(),
        topics: log.topics,
        data: log.data
      });
      
      // Only parse logs from our contract
      if (log.address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
        console.log(`⚠️ Skipping log ${i}: not from our contract`);
        continue;
      }
      
      try {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        console.log('✅ Successfully parsed log:', parsedLog.name);
        console.log('Event args:', parsedLog.args);
        
        if (parsedLog.name === 'MedicalRecordAdded') {
          // Try different ways to access recordId
          if (parsedLog.args.recordId !== undefined) {
            recordId = parsedLog.args.recordId.toString();
          } else if (parsedLog.args[0] !== undefined) {
            recordId = parsedLog.args[0].toString();
          }
          console.log('✅ Extracted recordId from event:', recordId);
          break;
        }
      } catch (e) {
        console.log(`⚠️ Could not parse log ${i}:`, e.message);
        // This log is not from our contract, skip it
        continue;
      }
    }
    
    // Method 2: If event parsing failed, query the blockchain using transaction hash
    if (!recordId) {
      console.warn('⚠️ MedicalRecordAdded event not found in logs, trying to query transaction details...');
      try {
        const provider = contract.runner.provider;
        const txReceipt = await provider.getTransactionReceipt(receipt.hash);
        
        if (txReceipt && txReceipt.logs.length > 0) {
          console.log('Found transaction receipt with', txReceipt.logs.length, 'logs');
          
          // Try to parse each log
          for (const log of txReceipt.logs) {
            try {
              const parsedLog = contract.interface.parseLog({
                topics: log.topics,
                data: log.data
              });
              
              if (parsedLog.name === 'MedicalRecordAdded') {
                recordId = parsedLog.args.recordId.toString();
                console.log('✅ Extracted recordId from queried transaction:', recordId);
                break;
              }
            } catch (e) {
              continue;
            }
          }
        }
      } catch (error) {
        console.error('Error querying transaction:', error.message);
      }
    }
    
    if (!recordId) {
      console.error('❌ Failed to extract recordId from transaction', receipt.hash);
    }
    
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      recordId,
      gasUsed: receipt.gasUsed.toString(),
      userId,
      dbUrl,
      timestamp: unixTimestamp
    };
    
  } catch (error) {
    console.error('Error creating blockchain record:', error);
    
    // Return mock data on error for development
    return {
      success: false,
      error: error.message,
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockNumber: Math.floor(Math.random() * 1000000),
      message: 'Mock transaction (error occurred)',
      userId,
      dbUrl,
      timestamp
    };
  }
}

// Get blockchain record by ID
async function getBlockchainRecord(recordId) {
  try {
    const record = await contract.getMedicalRecord(recordId);
    return {
      userId: record[0],
      dbUrl: record[1],
      timestamp: new Date(Number(record[2]) * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching blockchain record:', error);
    throw error;
  }
}

// Get current block number
async function getCurrentBlockNumber() {
  try {
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  } catch (error) {
    console.error('Error getting block number:', error);
    return null;
  }
}

// Initialize on module load
initializeBlockchain();

export {
  createBlock,
  getBlockchainRecord,
  getCurrentBlockNumber,
  initializeBlockchain
};
