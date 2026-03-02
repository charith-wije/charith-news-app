import React, { useEffect } from "react";
import { Center, Heading } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getPin, getBiometricPreferred } from "../storage/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const decideRoute = async () => {
      const savedPin = await getPin();
      const hasRegisteredUser = !!savedPin;
      if (!hasRegisteredUser) {
        navigation.replace("SignUp");
        return;
      }
      const useBiometric = await getBiometricPreferred();
      navigation.replace(useBiometric ? "BiometricLogin" : "WelcomePin");
    };

    const timeout = setTimeout(decideRoute, 1200);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <Center flex={1} bg="$purple600">
      <Heading size="3xl" color="$white">
        FD
      </Heading>
    </Center>
  );
};
