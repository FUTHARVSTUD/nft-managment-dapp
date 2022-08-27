import React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { providers } from "ethers";
import { Provider as WagmiProvider, defaultChains } from "wagmi";
import { AccountProvider } from "./context/AccountContext";
import { InjectedConnector } from 'wagmi/connectors/injected'

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL)

const connector = [
  new InjectedConnector({
    chains: defaultChains
  })
]


ReactDOM.render(
  <React.StrictMode>
    <WagmiProvider  provider={provider} connectors={connector}>
      <AccountProvider>
          <ChakraProvider>
            <ColorModeScript initialColorMode="light"></ColorModeScript>
            <App />
          </ChakraProvider>
      </AccountProvider>
    </WagmiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
