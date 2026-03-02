import React, { useEffect, useRef } from "react";
import { Center, Spinner, Text } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import * as LocalAuthentication from "expo-local-authentication";

type Props = NativeStackScreenProps<RootStackParamList, "BiometricLogin">;

export const BiometricLoginScreen = ({ navigation }: Props) => {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const tryBiometric = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          navigation.replace("WelcomePin");
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Sign in to Finance Digest",
        });

        if (result.success) {
          navigation.reset({
            index: 0,
            routes: [{ name: "NewsFeed" }],
          });
        } else {
          navigation.replace("WelcomePin");
        }
      } catch {
        navigation.replace("WelcomePin");
      }
    };

    tryBiometric();
  }, [navigation]);

  return (
    <Center flex={1} bg="$purple600">
      <Spinner color="$white" size="large" />
      <Text color="$white" mt="$4" fontSize="$sm">
        Checking biometrics...
      </Text>
    </Center>
  );
};
