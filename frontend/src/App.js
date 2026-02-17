import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import Info from "./components/Info";
import { Routes, Route } from "react-router-dom";
// IMPORTACIONES PARA V0.10.11
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { mainnet, sepolia } from 'wagmi/chains'
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useConnect, useAccount } from "wagmi";

import { http, createConfig } from 'wagmi'

// Luego úsalo en configureChains
const { chains, provider, webSocketProvider } = configureChains(
  [sepolia], // <--- Usa el objeto que acabamos de crear
[
    jsonRpcProvider({
      rpc: (chain) => ({
        // USA TU URL DE ANKR AQUÍ
        http: `https://rpc.ankr.com/eth_sepolia/b53a2371834a2d6e201a277bf6d26041f17c931911cec823738b1d0370785ea5`, 
      }),
    }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

// Componente interno para poder usar los hooks
function MainContent() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Swap isConnected={isConnected} address={address} />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </div>
  );
}

// 2. App solo actúa como Provider
function App() {
  return (
    <WagmiConfig client={client}>
      <MainContent />
    </WagmiConfig>
  );
}

export default App;
