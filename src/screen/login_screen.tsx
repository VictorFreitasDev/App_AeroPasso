import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const hasSixCharacters = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleEmailChange = (text: string) => {
    const value = text
      .replace(/\s/g, "")
      .toLowerCase();

    setEmail(value);

    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (passwordError) {
      setPasswordError("");
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Digite seu e-mail.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError("Digite um e-mail válido.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Digite sua senha.");
      return false;
    }

    if (!hasSixCharacters) {
      setPasswordError(
        "Sua senha ainda não atende aos requisitos."
      );
      return false;
    }

    if (!hasUppercase) {
      setPasswordError(
        "Adicione pelo menos uma letra maiúscula."
      );
      return false;
    }

    if (!hasNumber) {
      setPasswordError(
        "Adicione pelo menos um número."
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleLogin = () => {
    const validEmail = validateEmail();
    const validPassword = validatePassword();

    if (!validEmail || !validPassword) {
      return;
    }

    console.log("Login realizado:", {
      email,
      password,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.header}>

            <View style={styles.logo}>
              <Text style={styles.logoText}>
                A
              </Text>
            </View>

            <Text style={styles.brand}>
              AeroPasso
            </Text>

            <Text style={styles.subtitle}>
              Sua jornada começa aqui
            </Text>

          </View>

          <View style={styles.form}>

            <Text style={styles.title}>
              Entrar
            </Text>

            <Text style={styles.description}>
              Acesse sua conta para continuar.
            </Text>

            <View style={styles.field}>

              <Text style={styles.label}>
                E-MAIL
              </Text>

              <TextInput
                style={[
                  styles.input,
                  emailError
                    ? styles.inputError
                    : null,
                ]}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={validateEmail}
                placeholder="seu@email.com"
                placeholderTextColor="#687A88"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                maxLength={120}
                returnKeyType="next"
              />

              {emailError ? (
                <Text style={styles.error}>
                  {emailError}
                </Text>
              ) : null}

            </View>

            <View style={styles.field}>

              <View style={styles.labelRow}>

                <Text style={styles.label}>
                  SENHA
                </Text>

                <Pressable
                  onPress={() =>
                    console.log(
                      "Recuperar senha"
                    )
                  }
                >
                  <Text style={styles.forgot}>
                    Esqueci a senha
                  </Text>
                </Pressable>

              </View>

              <View>

                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    passwordError
                      ? styles.inputError
                      : null,
                  ]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={validatePassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#687A88"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  maxLength={64}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  style={styles.showPassword}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  <Text style={styles.showPasswordText}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Text>

                </Pressable>

              </View>

              <View style={styles.requirements}>

                <PasswordRequirement
                  valid={hasSixCharacters}
                  text="6 caracteres"
                />

                <PasswordRequirement
                  valid={hasUppercase}
                  text="1 letra maiúscula"
                />

                <PasswordRequirement
                  valid={hasNumber}
                  text="1 número"
                />

              </View>

              {passwordError ? (
                <Text style={styles.error}>
                  {passwordError}
                </Text>
              ) : null}

            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={handleLogin}
            >

              <Text style={styles.buttonText}>
                ENTRAR
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>

            </Pressable>

            <View style={styles.register}>

              <Text style={styles.registerText}>
                Ainda não tem uma conta?
              </Text>

              <Pressable
                onPress={() =>
                  console.log("Criar conta")
                }
              >

                <Text style={styles.registerLink}>
                  Criar conta
                </Text>

              </Pressable>

            </View>

          </View>

          <Text style={styles.footer}>
            AEROPASSO
          </Text>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <View style={styles.requirement}>

      <View
        style={[
          styles.dot,
          valid
            ? styles.dotValid
            : styles.dotInvalid,
        ]}
      />

      <Text
        style={[
          styles.requirementText,
          valid
            ? styles.requirementValid
            : null,
        ]}
      >
        {text}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 27,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 52,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#0A1C28",
    borderWidth: 1,
    borderColor: "#1B5065",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  logoText: {
    fontSize: 27,
    fontWeight: "900",
    color: "#25D5F5",
  },

  brand: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 11,
    color: "#667D8C",
  },

  form: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.7,
  },

  description: {
    marginTop: 7,
    marginBottom: 31,
    fontSize: 13,
    color: "#687F8E",
  },

  field: {
    marginBottom: 22,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  label: {
    marginBottom: 9,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#708594",
  },

  input: {
    width: "100%",
    height: 56,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#1A3442",
    backgroundColor: "#09151F",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FFFFFF",
  },

  passwordInput: {
    paddingRight: 80,
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  showPassword: {
    position: "absolute",
    right: 15,
    top: 0,
    height: 56,
    justifyContent: "center",
  },

  showPasswordText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#25D5F5",
  },

  forgot: {
    fontSize: 10,
    fontWeight: "600",
    color: "#25D5F5",
  },

  error: {
    marginTop: 7,
    marginLeft: 3,
    fontSize: 10,
    color: "#E45E6C",
  },

  requirements: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 11,
    columnGap: 15,
    rowGap: 7,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  dotInvalid: {
    backgroundColor: "#425462",
  },

  dotValid: {
    backgroundColor: "#25D5F5",
  },

  requirementText: {
    fontSize: 10,
    color: "#536A79",
  },

  requirementValid: {
    color: "#8CA5B3",
  },

  button: {
    height: 56,
    borderRadius: 13,
    backgroundColor: "#25D5F5",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 4,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#041018",
  },

  arrow: {
    marginLeft: 12,
    fontSize: 20,
    color: "#041018",
  },

  register: {
    alignItems: "center",
    marginTop: 27,
  },

  registerText: {
    fontSize: 11,
    color: "#5F7584",
  },

  registerLink: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 45,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#304653",
  },

});