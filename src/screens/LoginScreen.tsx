import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  HStack,
  Input,
  InputField,
  Text,
} from '@gluestack-ui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getEmail, getPin } from '../storage/auth';
import * as LocalAuthentication from 'expo-local-authentication';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const [pin, setPin] = useState('');
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const email = await getEmail();
      setStoredEmail(email);
    };
    loadData();
  }, []);

  const onContinue = async () => {
    setError('');
    if (pin.length !== 4) {
      setError('Enter your 4 digit PIN');
      return;
    }
    const savedPin = await getPin();
    if (!savedPin || savedPin !== pin) {
      setError('Incorrect PIN. Try again.');
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'NewsFeed' }],
    });
  };

  const onBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Log in with biometrics',
      });
      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'NewsFeed' }],
        });
      }
    } catch {
      setError('Biometric auth failed. Use your PIN.');
    }
  };

  const renderPinInputs = () => {
    const values = [0, 1, 2, 3].map((i) => pin[i] ?? '');
    return (
      <HStack justifyContent="space-between" mt="$6" mb="$4">
        {values.map((v, index) => (
          <Box
            key={index}
            w={64}
            h={64}
            borderRadius="$lg"
            borderWidth={1}
            borderColor="$coolGray300"
            alignItems="center"
            justifyContent="center"
            bg="$coolGray50"
          >
            <Text fontSize="$2xl" fontWeight="$bold">
              {v ? '•' : ''}
            </Text>
          </Box>
        ))}
      </HStack>
    );
  };

  return (
    <Center flex={1} bg="$black" px="$6">
      <Box
        w="$full"
        maxWidth={360}
        bg="$white"
        borderRadius="$2xl"
        p="$6"
        alignItems="center"
      >
        <Heading size="xl" mb="$2">
          Welcome to Finance Digest
        </Heading>
        <Text color="$coolGray600" mb="$4">
          {storedEmail ?? 'Enter your PIN to continue'}
        </Text>

        {renderPinInputs()}

        <Input display="none">
          <InputField
            value={pin}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= 4) {
                setPin(text);
              }
            }}
            keyboardType="number-pad"
            autoFocus
          />
        </Input>

        {error ? (
          <Text color="$red500" mb="$2">
            {error}
          </Text>
        ) : null}

        <Button
          mt="$2"
          size="lg"
          borderRadius="$full"
          bg="$purple600"
          onPress={onContinue}
        >
          <ButtonText>Continue</ButtonText>
        </Button>

        <Button mt="$3" variant="outline" borderRadius="$full" onPress={onBiometric}>
          <ButtonText>Use biometrics</ButtonText>
        </Button>
      </Box>
    </Center>
  );
};

