import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Button, ButtonText, Heading, Icon, Text } from '@gluestack-ui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { setBiometricPreferred } from '../storage/auth';
import { ScanFace } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';

type Props = NativeStackScreenProps<RootStackParamList, 'BiometricOptIn'>;

export const BiometricOptInScreen = ({ navigation }: Props) => {
  const goToNewsFeed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'NewsFeed' }],
    });
  };

  const onEnable = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        goToNewsFeed();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Face ID',
      });
      if (result.success) {
        await setBiometricPreferred(true);
      }
    } finally {
      goToNewsFeed();
    }
  };

  const onSkip = async () => {
    await setBiometricPreferred(false);
    goToNewsFeed();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Box flex={1} bg="$white" px="$6">
        <Box flex={1} justifyContent="center" alignItems="center">
          <Box
            w={96}
            h={96}
            borderRadius="$2xl"
            bg="$coolGray100"
            alignItems="center"
            justifyContent="center"
            mb="$8"
          >
            <Icon as={ScanFace} size="xl" color="$coolGray500" />
          </Box>

          <Heading size="2xl" mb="$2" textAlign="center">
            Login with a Look
          </Heading>
          <Text color="$coolGray600" textAlign="center" px="$4">
            Use face ID instead of a password next time you login.
          </Text>
        </Box>

        <Box w="$full" mb="$6">
          <Button
            size="lg"
            borderRadius="$full"
            bg="$purple600"
            mb="$3"
            onPress={onEnable}
          >
            <ButtonText>Enable Face ID</ButtonText>
          </Button>

          <Button
            size="lg"
            borderRadius="$full"
            variant="outline"
            borderColor="$coolGray300"
            onPress={onSkip}
          >
            <ButtonText color="$coolGray800">Not now</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

