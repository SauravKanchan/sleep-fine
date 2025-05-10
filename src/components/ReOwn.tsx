import React from 'react';
import {
  AppKit,
  AppKitButton,
} from '@reown/appkit-ethers5-react-native';
import { StyleSheet } from 'react-native';
import {FlexView, Text} from '@reown/appkit-ui-react-native';
// import {SignMessage} from './views/SignMessage';
// import {SendTransaction} from './views/SendTransaction';
// import {ReadContract} from './views/ReadContract';
// import {WriteContract} from './views/WriteContract';
// import {SignTypedDataV4} from './views/SignTypedDataV4';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    marginBottom: 40,
    fontSize: 30,
  },
});

const ReOwn = () => {
  return (
    <>
      <Text style={styles.title} variant="large-600">
        AppKit + ethers 5
      </Text>
      <FlexView style={styles.buttonContainer}>
        <AppKitButton balance="show" />
        {/* <SignMessage />
        <SendTransaction />
        <SignTypedDataV4 />
        <ReadContract />
        <WriteContract /> */}
      </FlexView>
      <AppKit />
    </>
  );
};

export default ReOwn;
