import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  const hasSixCharacters = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const handleNameChange = (text: string) => {
    setName(text);

    if (nameError) {
      setNameError("");
    }
  };

  const handlePhoneChange = (text: string) => {
    const numbers = text.replace(/\D/g, "");

    let formatted = numbers;

    if (numbers.length <= 2) {
      formatted = numbers;
    } else if (numbers.length <= 7) {
      formatted = `(${numbers.slice(
        0,
        2
      )}) ${numbers.slice(2)}`;
    } else {
      formatted = `(${numbers.slice(
        0,
        2
      )}) ${numbers.slice(
        2,
        7
      )}-${numbers.slice(7, 11)}`;
    }

    setPhone(formatted);

    if (phoneError) {
      setPhoneError("");
    }
  };

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

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Digite seu nome.");
      return false;
    }

    if (name.trim().length < 3) {
      setNameError("Digite seu nome completo.");
      return false;
    }

    setNameError("");
    return true;
  };

  const validatePhone = () => {
    const numbers = phone.replace(/\D/g, "");

    if (!numbers) {
      setPhoneError("Digite seu celular.");
      return false;
    }

    if (numbers.length !== 11) {
      setPhoneError("Digite um celular válido.");
      return false;
    }

    setPhoneError("");
    return true;
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
        "A senha precisa ter pelo menos 6 caracteres."
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

    if (!hasSymbol) {
      setPasswordError(
        "Adicione pelo menos um símbolo."
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleRegister = () => {
    const validName = validateName();
    const validPhone = validatePhone();
    const validEmail = validateEmail();
    const validPassword = validatePassword();

    if (
      !validName ||
      !validPhone ||
      !validEmail ||
      !validPassword
    ) {
      return;
    }

    console.log("Cadastro:", {
      name,
      phone,
      email,
      password,
    });
  };

  const pressRegister = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.97,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    handleRegister();
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
          {/* Luzes discretas */}

          <View style={styles.lightBlue} />
          <View style={styles.lightViolet} />

          {/* ==================================
              TOPO
          ================================== */}

          <View style={styles.topBar}>
            <Pressable
              style={styles.backButton}
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.backArrow}>
                ←
              </Text>

              <Text style={styles.backText}>
                VOLTAR
              </Text>
            </Pressable>

            <Text style={styles.step}>
              01
            </Text>
          </View>

          {/* ==================================
              MARCA
          ================================== */}

          <View style={styles.header}>
            <Image
              source={require("../../assets/images/aeropasso.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View>
              <Text style={styles.brand}>
                AeroPasso
              </Text>

              <Text style={styles.brandMeta}>
                ROTAS PARA AEROPORTOS
              </Text>
            </View>
          </View>

          {/* ==================================
              INTRO
          ================================== */}

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>
              CRIAR CONTA
            </Text>

            <Text style={styles.title}>
              Comece sua jornada.
            </Text>

            <Text style={styles.description}>
              Preencha seus dados para criar sua conta.
            </Text>
          </View>

          {/* ==================================
              FORMULÁRIO
          ================================== */}

          <View style={styles.formCard}>
            {/* NOME */}

            <View style={styles.field}>
              <Text style={styles.label}>
                NOME COMPLETO
              </Text>

              <TextInput
                style={[
                  styles.input,
                  nameError
                    ? styles.inputError
                    : null,
                ]}
                value={name}
                onChangeText={handleNameChange}
                onBlur={validateName}
                placeholder="Seu nome"
                placeholderTextColor="#566A76"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                maxLength={100}
                returnKeyType="next"
              />

              {nameError ? (
                <Text style={styles.error}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            {/* CELULAR */}

            <View style={styles.field}>
              <Text style={styles.label}>
                CELULAR
              </Text>

              <TextInput
                style={[
                  styles.input,
                  phoneError
                    ? styles.inputError
                    : null,
                ]}
                value={phone}
                onChangeText={handlePhoneChange}
                onBlur={validatePhone}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#566A76"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                maxLength={15}
                returnKeyType="next"
              />

              {phoneError ? (
                <Text style={styles.error}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

            {/* EMAIL */}

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
                placeholderTextColor="#566A76"
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

            {/* SENHA */}

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  SENHA
                </Text>

                <Pressable
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <Text style={styles.showPassword}>
                    {showPassword
                      ? "OCULTAR"
                      : "MOSTRAR"}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                style={[
                  styles.input,
                  passwordError
                    ? styles.inputError
                    : null,
                ]}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={validatePassword}
                placeholder="Crie sua senha"
                placeholderTextColor="#566A76"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                maxLength={64}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <View style={styles.passwordInfo}>
                <PasswordRequirement
                  valid={hasSixCharacters}
                  text="6 caracteres"
                />

                <PasswordRequirement
                  valid={hasUppercase}
                  text="Maiúscula"
                />

                <PasswordRequirement
                  valid={hasNumber}
                  text="Número"
                />

                <PasswordRequirement
                  valid={hasSymbol}
                  text="Símbolo"
                />
              </View>

              {passwordError ? (
                <Text style={styles.error}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {/* BOTÃO */}

            <Animated.View
              style={{
                transform: [
                  {
                    scale: buttonScale,
                  },
                ],
              }}
            >
              <Pressable
                style={styles.button}
                onPress={pressRegister}
              >
                <Text style={styles.buttonText}>
                  CRIAR CONTA
                </Text>

                <Text style={styles.buttonArrow}>
                  →
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* LOGIN */}

          <View style={styles.loginArea}>
            <Text style={styles.loginText}>
              Já possui uma conta?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.loginLink}>
                Entrar
              </Text>
            </Pressable>
          </View>

          {/* FOOTER */}

          <Text style={styles.footer}>
            AEROPASSO • 2026
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
    backgroundColor: "#0D0D0E",
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 28,
    overflow: "hidden",
  },

  lightBlue: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(35,105,255,0.05)",
    top: -100,
    right: -120,
  },

  lightViolet: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(125,76,255,0.04)",
    bottom: 80,
    left: -170,
  },

  // ========================================
  // TOPO
  // ========================================

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  backArrow: {
    fontSize: 21,
    color: "#22D3EE",
    marginRight: 7,
  },

  backText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: "#6E8490",
  },

  step: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#3D515C",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    marginTop: 31,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 31,
  },

  logo: {
    width: 47,
    height: 47,
    marginRight: 11,
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  brandMeta: {
    marginTop: 3,
    fontSize: 6.5,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#617581",
  },

  // ========================================
  // INTRO
  // ========================================

  intro: {
    marginBottom: 27,
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2.2,
    color: "#22D3EE",
  },

  title: {
    marginTop: 8,
    fontSize: 34,
    lineHeight: 37,
    fontWeight: "800",
    letterSpacing: -1.1,
    color: "#FFFFFF",
  },

  description: {
    marginTop: 9,
    maxWidth: 300,
    fontSize: 12,
    lineHeight: 18,
    color: "#6D818D",
  },

  // ========================================
  // FORM
  // ========================================

  formCard: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(16,24,31,0.82)",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 19,
  },

  field: {
    marginBottom: 19,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#718793",
  },

  showPassword: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#22D3EE",
  },

  input: {
    width: "100%",
    height: 53,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "rgba(5,10,18,0.72)",
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#FFFFFF",
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  error: {
    marginTop: 6,
    fontSize: 9,
    color: "#E45E6C",
  },

  // ========================================
  // SENHA
  // ========================================

  passwordInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 13,
    rowGap: 6,
    marginTop: 9,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  dotInvalid: {
    backgroundColor: "#3B4D57",
  },

  dotValid: {
    backgroundColor: "#22D3EE",
  },

  requirementText: {
    fontSize: 7.5,
    color: "#506671",
  },

  requirementValid: {
    color: "#8399A4",
  },

  // ========================================
  // BOTÃO
  // ========================================

  button: {
    height: 57,
    borderRadius: 17,
    backgroundColor: "#22D3EE",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.9,
    color: "#041018",
  },

  buttonArrow: {
    fontSize: 22,
    color: "#041018",
  },

  // ========================================
  // LOGIN
  // ========================================

  loginArea: {
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 10,
    color: "#536873",
  },

  loginLink: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: "#22D3EE",
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    marginTop: "auto",
    paddingTop: 27,
    textAlign: "center",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#344851",
  },
});