import React, { useRef, useState } from "react";
import { Box, Button, ButtonText, HStack, Text } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getPin } from "../storage/auth";
import * as LocalAuthentication from "expo-local-authentication";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const PURPLE = "#5b21b6";

type Props = NativeStackScreenProps<RootStackParamList, "WelcomePin">;

export const WelcomePinScreen = ({ navigation }: Props) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  const onContinue = async () => {
    setError("");
    if (pin.length !== 4) {
      setError("Enter your 4-digit passcode");
      return;
    }
    const savedPin = await getPin();
    if (!savedPin || savedPin !== pin) {
      setError("Incorrect passcode. Try again.");
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "NewsFeed" }],
    });
  };

  const onFaceId = async () => {
    setError("");
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setError("Face ID is not available on this device.");
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
        setError("Face ID was not recognized. Enter your passcode.");
      }
    } catch {
      setError("Face ID failed. Enter your passcode.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.content}>
          <View style={styles.centeredArea}>
            <Text style={styles.welcomeTitle}>Welcome to Finance Digest</Text>
            <Text style={styles.promptText}>Enter your passcode</Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              style={styles.boxesTouchable}
            >
              <HStack justifyContent="space-between" style={styles.boxesRow}>
                {[0, 1, 2, 3].map((i) => (
                  <Box key={i} style={styles.passcodeBox}>
                    <Text style={styles.passcodeChar}>
                      {pin[i] ? "•" : "-"}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onFaceId}
              style={styles.faceIdButton}
              activeOpacity={0.7}
            >
              <Text style={styles.faceIdButtonText}>Use Face ID</Text>
            </TouchableOpacity>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={(text) => {
              setError("");
              if (/^\d*$/.test(text) && text.length <= 4) {
                setPin(text);
              }
            }}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
            style={styles.hiddenInput}
            accessibilityLabel="Passcode input"
          />

          <View style={styles.continueWrapper}>
            <Button
              size="lg"
              borderRadius="$lg"
              bg="$coolGray400"
              onPress={onContinue}
              style={styles.continueBtn}
            >
              <ButtonText color="$white">Continue</ButtonText>
            </Button>
          </View>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  content: {
    flex: 1,
  },
  centeredArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  promptText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
  },
  boxesTouchable: {
    width: "70%",
    marginTop: 32,
  },
  boxesRow: {
    width: "100%",
  },
  faceIdButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 8,
  },
  faceIdButtonText: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
    opacity: 0.95,
  },
  passcodeBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  passcodeChar: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600",
  },
  errorText: {
    color: "#f87171",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  continueWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  continueBtn: {
    width: "100%",
  },
});
