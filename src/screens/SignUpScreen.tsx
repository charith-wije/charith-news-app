import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  ScrollView,
  Text,
} from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { saveEmail } from "../storage/auth";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export const SignUpScreen = ({ navigation }: Props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newErrors.email && !emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const onContinue = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await saveEmail(email.trim());
      navigation.navigate("PinEntry");
    } catch (e) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Box flex={1} bg="$white">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <Box w="$full" maxWidth={360} alignSelf="center">
          <Heading size="xl" mb="$1">
            Introduce yourself
          </Heading>
          <Text mb="$4" color="$coolGray600">
            We need to know a bit about you to get you up and running.
          </Text>

          <FormControl mb="$4" isInvalid={!!errors.fullName}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Full Name*</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors((prev) => ({
                    ...prev,
                    fullName: text.trim() ? undefined : "Full name is required",
                  }));
                }}
                placeholder="Enter your full name"
              />
            </Input>
            {errors.fullName ? (
              <Text color="$red600" mt="$1">
                {errors.fullName}
              </Text>
            ) : null}
          </FormControl>

          <FormControl mb="$4" isInvalid={!!errors.email}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Email*</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => {
                    const next = { ...prev };
                    const trimmed = text.trim();
                    if (!trimmed) {
                      next.email = "Email is required";
                    } else {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      next.email = emailRegex.test(trimmed)
                        ? undefined
                        : "Enter a valid email address";
                    }
                    return next;
                  });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
              />
            </Input>
            {errors.email ? (
              <Text color="$red600" mt="$1">
                {errors.email}
              </Text>
            ) : null}
          </FormControl>

          <FormControl mb="$4" isInvalid={!!errors.password}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Password*</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({
                    ...prev,
                    password:
                      text.length >= 8
                        ? undefined
                        : "Password must be at least 8 characters",
                    confirmPassword:
                      confirmPassword && text !== confirmPassword
                        ? "Passwords do not match"
                        : prev.confirmPassword && text === confirmPassword
                        ? undefined
                        : prev.confirmPassword,
                  }));
                }}
                secureTextEntry
                placeholder="Enter your Password"
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Must be at least 8 characters.
              </FormControlHelperText>
            </FormControlHelper>
            {errors.password ? (
              <Text color="$red600" mt="$1">
                {errors.password}
              </Text>
            ) : null}
          </FormControl>

          <FormControl mb="$4" isInvalid={!!errors.confirmPassword}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Confirm Password*</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      text && text !== password
                        ? "Passwords do not match"
                        : undefined,
                  }));
                }}
                secureTextEntry
                placeholder="Confirm your Password"
              />
            </Input>
            {errors.confirmPassword ? (
              <Text color="$red600" mt="$1" mb="$2">
                {errors.confirmPassword}
              </Text>
            ) : null}
          </FormControl>

          {errors.general ? (
            <Text color="$red600" mt="$1" mb="$2">
              {errors.general}
            </Text>
          ) : null}

        </Box>
      </ScrollView>

        <Box
          px="$6"
          py="$4"
          borderTopWidth={1}
          borderColor="$coolGray200"
          bg="$white"
        >
          <Button
            size="lg"
            borderRadius="$full"
            bg="$purple600"
            isDisabled={loading}
            onPress={onContinue}
          >
            <ButtonText>{loading ? "Please wait..." : "Sign Up"}</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};
