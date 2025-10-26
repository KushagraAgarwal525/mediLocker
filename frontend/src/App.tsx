import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { WelcomePage } from "./components/WelcomePage";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");

  const handleConnect = (name: string) => {
    setUserName(name);
    setIsConnected(true);
  };

  return (
    <>
      {!isConnected ? (
        <LoginPage onConnect={handleConnect} />
      ) : (
        <WelcomePage userName={userName} />
      )}
    </>
  );
}
