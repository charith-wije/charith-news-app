import React, { useEffect, useRef, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Heading, HStack, Text } from '@gluestack-ui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { savePin } from '../storage/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'PinEntry'>;

export const PinEntryScreen = ({ navigation }: Props) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const inputRef = useRef<RNTextInput | null>(null);

  const renderDots = (value: string) => {
    const values = [0, 1, 2, 3].map((i) => value[i] ?? '');
    return (
      <HStack justifyContent="space-between" width="60%" mt="$10">
        {values.map((v, index) => (
          <Box
            key={index}
            w={10}
            h={10}
            borderRadius="$full"
            bg={v ? '$coolGray800' : '$coolGray300'}
          />
        ))}
      </HStack>
    );
  };

  const handleCompleteEntry = async (value: string) => {
    setError('');

    if (step === 'create') {
      if (value.length !== 4) {
        setError('Choose a 4 digit PIN');
        return;
      }
      setPin(value);
      setConfirmPin('');
      setStep('confirm');
      return;
    }

    if (value.length !== 4) {
      setError('Confirm your 4 digit PIN');
      return;
    }
    if (value !== pin) {
      setError('PINs do not match');
      return;
    }

    await savePin(value);
    navigation.navigate('BiometricOptIn');
  };

  const title = step === 'create' ? 'Set a PIN' : 'Confirm your PIN';
  const subtitle =
    step === 'create'
      ? 'You can use this to log back in securely.'
      : 'Enter your PIN one more time.';

  const activeValue = step === 'create' ? pin : confirmPin;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Box flex={1} bg="$white" px="$6" pt="$4">
        <Box flexDirection="row" alignItems="center" mb="$6">
          <Text
            fontSize="$2xl"
            mr="$3"
            onPress={() => {
              navigation.goBack();
            }}
          >
            {'\u2039'}
          </Text>
        </Box>

        <Heading size="2xl" mb="$1">
          {title}
        </Heading>
        <Text color="$coolGray600" mb="$8">
          {subtitle}
        </Text>

        <Box flex={1} justifyContent="flex-start" alignItems="center">
          {renderDots(activeValue)}

          <RNTextInput
            ref={inputRef}
            value={activeValue}
            onChangeText={async (text) => {
              if (!/^\d*$/.test(text) || text.length > 4) {
                return;
              }

              if (step === 'create') {
                setPin(text);
              } else {
                setConfirmPin(text);
              }

              if (text.length === 4) {
                await handleCompleteEntry(text);
              } else {
                setError('');
              }
            }}
            keyboardType="number-pad"
            maxLength={4}
            style={{
              position: 'absolute',
              opacity: 0,
              height: 0,
              width: 0,
            }}
          />

          {error ? (
            <Text color="$red500" mt="$4">
              {error}
            </Text>
          ) : null}
        </Box>
      </Box>
    </SafeAreaView>
  );
}

