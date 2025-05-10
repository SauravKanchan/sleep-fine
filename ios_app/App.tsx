import React from 'react';
import AppNavigator from './src/AppNavigator';
import '@walletconnect/react-native-compat';

import { createAppKit, defaultConfig, AppKit } from '@reown/appkit-ethers-react-native';

// 1. Get projectId from https://cloud.reown.com
const projectId = '121ab21ee37e0fb9df5dfd8dba9b4159';

// 2. Create config
const metadata = {
  name: 'AppKit RN',
  description: 'AppKit RN Example',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
  },
};

const config = defaultConfig({ metadata });

// 3. Define your chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com',
};

const westend = {
  chainId: 420420421,
  name: 'Westend',
  currency: 'WND',
  explorerUrl: 'https://westend.subscan.io',
  rpcUrl: 'https://westend-asset-hub-eth-rpc.polkadot.io',
}

const chains = [mainnet, polygon, westend];

// 4. Create modal
createAppKit({
  projectId,
  chains,
  config,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  defaultChain: westend, // Optional - defaults to the first chain in your list
});

export default function App() {
  return (
    <>
      <AppNavigator />
      <AppKit />
    </>
  );
}

// const App: React.FC = () => <AppNavigator />;

// export default App;
