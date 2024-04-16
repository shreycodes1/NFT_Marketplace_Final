import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Navbar from "./componensts/navbar";
import Footer from "./componensts/footer.tsx";
import { BrowserRouter } from "react-router-dom";

const { webSocketPublicClient, publicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: import.meta.env.VITE_Alchemy })]
);
const config = createConfig(
  getDefaultConfig({
    publicClient,
    webSocketPublicClient,
    chains: [sepolia],
    appName: "ConnectKit",
    walletConnectProjectId: import.meta.env.VITE_Wallet_Id,
    alchemyId: import.meta.env.VITE_Alchemy,
    autoConnect: true,
  })
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={config}>
        <ConnectKitProvider
          theme="midnight"
          debugMode
          customTheme={{
            "--ck-accent-color": "#4628dc",
            "--ck-accent-text-color": "#ffffff",
          }}
        >
          <Navbar />
          <App />
          <Footer />
        </ConnectKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  </React.StrictMode>
);
