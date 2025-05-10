import React from 'react';
import AppNavigator from './src/AppNavigator';
import { siweConfig } from './src/services/siweConfig';
import Clipboard from '@react-native-clipboard/clipboard';
import { AuthProvider } from '@reown/appkit-auth-ethers-react-native';

import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
} from '@reown/appkit-ethers5-react-native';

// 1. Get projectId at https://cloud.reown.com
const projectId = '121ab21ee37e0fb9df5dfd8dba9b4159';

// 2. Create config
const metadata = {
  name: 'W3M ethers5',
  description: 'AppKit with Ethers v5',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'rn-w3m-ethers5-sample://',
  },
};

const auth = new AuthProvider({ projectId, metadata });

const config = defaultConfig({
  metadata,
  extraConnectors: [auth],
});

// 3. Define your chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.llamarpc.com',
};

const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com',
};

const chains = [mainnet, polygon];

const clipboardClient = {
  setString: async (value: string) => {
    Clipboard.setString(value);
  },
};

const customWallets = [
  {
    id: 'rn-wallet',
    name: 'RN Wallet',
    image_url:
      'https://github.com/reown-com/reown-docs/blob/main/static/assets/home/walletkitLogo.png?raw=true',
    mobile_link: 'rn-web3wallet://',
  },
];

// 3. Create modal
createAppKit({
  projectId,
  chains,
  config,
  siweConfig,
  customWallets,
  clipboardClient,
  enableAnalytics: true,
  features: {
    swaps: true,
  },
});

const App: React.FC = () => <AppNavigator />;

export default App;
