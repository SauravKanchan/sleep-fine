import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Contract, BrowserProvider } from 'ethers';
import {
  AppKitButton,
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit-ethers-react-native';
import { type Provider } from '@reown/appkit-scaffold-utils-react-native';
import contractData from '../services/contractData.json';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const presetOptions = [7, 21, 'Custom'] as const;

const SelectChallengeScreen: React.FC = () => {
  // @ts-ignore
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [selectedOption, setSelectedOption] = useState<number | 'Custom' | null>(null);
  const [customDays, setCustomDays] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('0.01');
  // @ts-ignore
  const navigation = useNavigation();
  const { isConnected } = useAppKitAccount();

  const getDays = (): number | null => {
    if (selectedOption === 'Custom') {
      const days = parseInt(customDays, 10);
      return isNaN(days) || days <= 0 ? null : days;
    }
    return typeof selectedOption === 'number' ? selectedOption : null;
  };

  const fetchBalance = async () => {
    if (isConnected && walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const rawBalance = await ethersProvider.getBalance(await signer.getAddress());
      setBalance(ethers.formatEther(rawBalance));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isConnected, walletProvider]);

  const handleStake = async () => {
    const days = getDays();
    const parsedAmount = parseFloat(stakeAmount);

    if (!days || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid', 'Please enter a valid number of days and amount.');
      return;
    }

    try {
      // @ts-ignore
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractData.address, contractData.abi, signer);
      const id = await contract.startChallenge.staticCall(days, ethers.ZeroAddress, {
        value: ethers.parseEther(stakeAmount),
      });
      await AsyncStorage.setItem('challengeId', id.toString());

      Alert.alert('Challenge Started', `You committed to ${days} days with ${stakeAmount} ETH!`);
    } catch (e) {
      console.error('Staking error:', e);
      Alert.alert('Error', 'Something went wrong during staking.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      {!isConnected ? (
        <View style={styles.centeredWalletContainer}>
          <AppKitButton />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.walletHeader}>
            <TouchableOpacity
              style={styles.navTitleContainer}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Onboarding');
              }}
            >
              <Text style={styles.navTitle}>SleepFine</Text>
            </TouchableOpacity>

            <View style={styles.walletInfo}>
              <Text style={styles.balanceText}>
                {balance ? `${parseFloat(balance).toFixed(4)} WND` : '... WND'}
              </Text>
              <AppKitButton />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Start a Challenge</Text>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Select Duration</Text>
              <View style={styles.optionsContainer}>
                {presetOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.optionButton, isSelected && styles.optionSelected]}
                      onPress={() => setSelectedOption(opt)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {typeof opt === 'number' ? `${opt} Days` : 'Custom'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedOption === 'Custom' && (
                <>
                  <Text style={styles.cardLabel}>Custom Duration (Days)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter number of days"
                    keyboardType="numeric"
                    value={customDays}
                    onChangeText={setCustomDays}
                  />
                </>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Amount to Stake (ETH)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 0.01"
                keyboardType="decimal-pad"
                value={stakeAmount}
                onChangeText={setStakeAmount}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.stakeButton,
                (!getDays() || !stakeAmount) && styles.stakeButtonDisabled,
              ]}
              onPress={handleStake}
              disabled={!getDays() || !stakeAmount}
            >
              <Text style={styles.stakeButtonText}>Stake</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  centeredWalletContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  navTitleContainer: {
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5A67D8',
    textAlign: 'center',
  },
  walletInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  balanceText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  optionSelected: {
    backgroundColor: '#5A67D8',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fefefe',
  },
  stakeButton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  stakeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  stakeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SelectChallengeScreen;
