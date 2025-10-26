import "@nomicfoundation/hardhat-ethers";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import dotenv from 'dotenv';
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    // Polygon Mainnet (costs real MATIC)
    polygon: {
      type: "http",
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137
    },
    // Polygon Amoy Testnet (FREE - recommended for testing)
    amoy: {
      type: "http",
      url: process.env.POLYGON_RPC_URL || "https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002
    },
    // Mumbai (deprecated, use Amoy instead)
    mumbai: {
      type: "http",
      url: process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  plugins: [hardhatIgnitionViemPlugin],
};
