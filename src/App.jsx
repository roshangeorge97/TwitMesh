import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { configureChains } from 'wagmi';
import { mainnet } from 'wagmi';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import Searchbar from './Searchbar';
import { polygonMumbai } from 'viem/chains';

const { chains, publicClient } = configureChains(
  [mainnet,polygonMumbai],
  [
    alchemyProvider({ apiKey: '--yChBti3EP4TIzrMOrihZmPgul4AnXs'}),
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Twitter',
  projectId: '98c922d1415c5fc1e092d1b6afdfaa85',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Searchbar />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App
