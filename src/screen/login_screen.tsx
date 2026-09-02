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

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Bom dia"
      : hour < 18
      ? "Boa tarde"
      : "Boa noite";

  const handleEmailChange = (text: string) => {
    const value = text.replace(/\s/g, "").toLowerCase();

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

  const pressLogin = () => {
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

    handleLogin();
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
              CABEÇALHO
          ================================== */}

          <View style={styles.header}>
            <View style={styles.brandRow}>
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
          </View>

          {/* ==================================
              SAUDAÇÃO
          ================================== */}

          <View style={styles.intro}>
            <Text style={styles.greeting}>
              {greeting}
            </Text>

            <Text style={styles.title}>
              Bem-vindo de volta.
            </Text>

            <Text style={styles.description}>
              Entre para continuar sua jornada.
            </Text>
          </View>

          {/* ==================================
              FORMULÁRIO
          ================================== */}

          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>
              Entrar
            </Text>

            {/* E-MAIL */}

            <View style={styles.field}>
              <Text style={styles.label}>
                E-MAIL
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  emailError
                    ? styles.inputError
                    : null,
                ]}
              >
                <TextInput
                  style={styles.input}
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
              </View>

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
                    console.log("Recuperar senha")
                  }
                >
                  <Text style={styles.forgot}>
                    Esqueci a senha
                  </Text>
                </Pressable>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  passwordError
                    ? styles.inputError
                    : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={validatePassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#566A76"
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
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.showButton}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword ? "Ocultar" : "Ver"}
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
                onPress={pressLogin}
              >
                <Text style={styles.buttonText}>
                  ENTRAR
                </Text>

                <Text style={styles.buttonArrow}>
                  →
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* ==================================
              CADASTRO
          ================================== */}

          <View style={styles.register}>
            <Text style={styles.registerText}>
              Ainda não possui uma conta?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Register")
              }
            >
              <Text style={styles.registerLink}>
                Criar conta
              </Text>
            </Pressable>
          </View>

          {/* ==================================
              FOOTER
          ================================== */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              AEROPASSO
            </Text>

            <Text style={styles.footerVersion}>
              01
            </Text>
          </View>
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
    paddingTop: 25,
    paddingBottom: 28,
    overflow: "hidden",
  },

  lightBlue: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(35,105,255,0.055)",
    top: -110,
    right: -130,
  },

  lightViolet: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(125,76,255,0.045)",
    bottom: 80,
    left: -170,
  },

  header: {
    marginBottom: 42,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 44,
    height: 44,
    marginRight: 11,
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  brandMeta: {
    marginTop: 2,
    fontSize: 6.5,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#617581",
  },

  intro: {
    marginBottom: 27,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22D3EE",
    marginBottom: 8,
  },

  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.2,
    color: "#FFFFFF",
  },

  description: {
    marginTop: 9,
    fontSize: 12,
    color: "#70848F",
  },

  formCard: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.075)",
    backgroundColor: "rgba(16,24,31,0.84)",
    paddingHorizontal: 18,
    paddingTop: 21,
    paddingBottom: 20,
    overflow: "hidden",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 22,
  },

  field: {
    marginBottom: 20,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#748994",
  },

  forgot: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "700",
    color: "#22D3EE",
  },

  inputWrapper: {
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "rgba(5,10,18,0.72)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
  },

  showButton: {
    paddingLeft: 10,
  },

  showButtonText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#22D3EE",
  },

  error: {
    marginTop: 6,
    fontSize: 9,
    color: "#E45E6C",
  },

  requirements: {
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
    backgroundColor: "#3D505A",
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

  button: {
    height: 56,
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
    letterSpacing: 2,
    color: "#041018",
  },

  buttonArrow: {
    fontSize: 22,
    color: "#041018",
  },

  register: {
    alignItems: "center",
    marginTop: 24,
  },

  registerText: {
    fontSize: 10,
    color: "#536873",
  },

  registerLink: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: "#22D3EE",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#3A4E59",
  },

  footerVersion: {
    marginLeft: "auto",
    fontSize: 7,
    color: "#324650",
  },
});