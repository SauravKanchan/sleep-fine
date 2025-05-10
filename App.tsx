import React from 'react';
import AppNavigator from './src/AppNavigator';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = Buffer;
global.process = process;

import 'node-libs-react-native/globals';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

const App: React.FC = () => <AppNavigator />;

export default App;
