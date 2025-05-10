import React, { useState } from 'react';
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

import { AppKitButton, useAppKitAccount } from '@reown/appkit-ethers-react-native';

const presetOptions = [7, 21, 'Custom'] as const;

const SelectChallengeScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<number | 'Custom' | null>(null);
  const [customDays, setCustomDays] = useState('');

  const { isConnected, address, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();

  const getDays = (): number | null => {
    if (selectedOption === 'Custom') {
      const days = parseInt(customDays, 10);
      return isNaN(days) || days <= 0 ? null : days;
    }
    return typeof selectedOption === 'number' ? selectedOption : null;
  };

  const handleStake = () => {
    const days = getDays();
    if (!days) {
      Alert.alert('Invalid', 'Please enter a valid number of days.');
      return;
    }

    Alert.alert('Challenge Started', `You committed to ${days} days!`);
    // TODO: Trigger contract or backend logic
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <Text style={styles.title}>Select Your Challenge Duration</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Enter number of days"
          keyboardType="numeric"
          value={customDays}
          onChangeText={setCustomDays}
        />
      )}

      {!isConnected && (
        <View style={styles.walletButtonContainer}>
          <AppKitButton />
        </View>
      )}

      <TouchableOpacity
        style={[styles.stakeButton, (!getDays() || !isConnected) && styles.stakeButtonDisabled]}
        onPress={handleStake}
        disabled={!getDays() || !isConnected}
      >
        <Text style={styles.stakeButtonText}>Stake</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  optionSelected: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  walletButtonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  stakeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
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
