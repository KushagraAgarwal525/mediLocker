import { useState } from "react";
import { Button } from "./ui/button";
import { Wallet, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onConnect: (userName: string) => void;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function LoginPage({ onConnect }: LoginPageProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError("");

      // Check if MetaMask or other Web3 wallet is installed
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            // Format address as username (first 6 and last 4 characters)
            const userName = `${address.slice(0, 6)}...${address.slice(-4)}`;
            onConnect(userName);
          }
        } catch (err: any) {
          if (err.code === 4001) {
            setError("Connection request rejected. Please try again.");
          } else {
            setError("Failed to connect wallet. Please try again.");
          }
          setIsConnecting(false);
        }
      } else {
        setError("No Web3 wallet detected. Please install MetaMask or another Web3 wallet to continue.");
        setIsConnecting(false);
      }
    } catch (error: any) {
      console.error("Error connecting:", error);
      setError(error?.message || "Failed to connect. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Wallet className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          
          {/* Text */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-white text-3xl">Welcome Back</h1>
            <p className="text-gray-400">
              Connect your wallet to access your account
            </p>
          </div>
          
          {/* Button */}
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? "Connecting..." : "Connect to Web3Auth"}
          </Button>

          {/* Error/Info Message */}
          {error && (
            <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
              error.includes("demo mode") 
                ? "bg-blue-500/10 border border-blue-500/20" 
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                error.includes("demo mode") ? "text-blue-400" : "text-red-400"
              }`} />
              <p className={`text-sm ${
                error.includes("demo mode") ? "text-blue-400" : "text-red-400"
              }`}>{error}</p>
            </div>
          )}
          
          {/* Bottom accent */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <p className="text-gray-500 text-sm">Secure Authentication</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* Info */}
          <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-gray-400 text-xs text-center">
              Connect using MetaMask or another Web3 wallet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
