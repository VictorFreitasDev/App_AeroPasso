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
  Image,
} from "react-native";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // REQUISITOS DA SENHA
  // ==========================================

  const hasSixCharacters = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // ==========================================
  // E-MAIL
  // ==========================================

  const handleEmailChange = (text: string) => {
    const value = text.replace(/\s/g, "").toLowerCase();

    setEmail(value);

    if (emailError) {
      setEmailError("");
    }
  };

  // ==========================================
  // SENHA
  // ==========================================

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (passwordError) {
      setPasswordError("");
    }
  };

  // ==========================================
  // VALIDAR E-MAIL
  // ==========================================

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

  // ==========================================
  // VALIDAR SENHA
  // ==========================================

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

  // ==========================================
  // LOGIN
  // ==========================================

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
          {/* ==================================
              TOPO
          ================================== */}

          <View style={styles.topBar}>
            <View>
              <Text style={styles.kicker}>
                AEROPASSO
              </Text>

              <View style={styles.routeIndicator}>
                <View style={styles.routeDot} />
                <View style={styles.routeLine} />
                <View style={styles.routeDotSmall} />
              </View>
            </View>

            <Text style={styles.topNumber}>
              01
            </Text>
          </View>

          {/* ==================================
              LOGO
          ================================== */}

          <View style={styles.brandBlock}>
            <Image
              source={require("../../assets/images/aeropasso.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.welcome}>
              Bem-vindo
            </Text>

            <Text style={styles.brandTitle}>
              Seu próximo destino
            </Text>
          </View>

          {/* ==================================
              FORMULÁRIO
          ================================== */}

          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardEyebrow}>
                  ACESSO
                </Text>

                <Text style={styles.title}>
                  Entrar na conta
                </Text>
              </View>

              <View style={styles.statusCircle}>
                <View style={styles.statusDot} />
              </View>
            </View>

            <Text style={styles.description}>
              Continue sua jornada pelo AeroPasso.
            </Text>

            {/* E-MAIL */}

            <View style={styles.field}>
              <Text style={styles.label}>
                E-MAIL
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  emailError
                    ? styles.inputContainerError
                    : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={validateEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor="#536A79"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  maxLength={120}
                  returnKeyType="next"
                />

                <Text style={styles.inputMark}>
                  @
                </Text>
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
                    Esqueci
                  </Text>
                </Pressable>
              </View>

              <View
                style={[
                  styles.inputContainer,
                  passwordError
                    ? styles.inputContainerError
                    : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={validatePassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#536A79"
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
                  style={styles.inputAction}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <Text style={styles.inputActionText}>
                    {showPassword ? "OCULTAR" : "VER"}
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

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <View style={styles.buttonLeft}>
                <Text style={styles.buttonIndex}>
                  01
                </Text>

                <Text style={styles.buttonText}>
                  ENTRAR
                </Text>
              </View>

              <Text style={styles.arrow}>
                ↗
              </Text>
            </Pressable>

            {/* CADASTRO */}

            <View style={styles.registerBlock}>
              <Text style={styles.registerText}>
                Ainda não faz parte da jornada?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate("Register")
                }
              >
                <Text style={styles.registerLink}>
                  Criar uma conta →
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ==================================
              RODAPÉ
          ================================== */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ROTAS PARA AEROPORTOS
            </Text>

            <View style={styles.footerLine} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// REQUISITO DA SENHA
// ==========================================

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
          styles.requirementDot,
          valid
            ? styles.requirementDotValid
            : styles.requirementDotInvalid,
        ]}
      />

      <Text
        style={[
          styles.requirementText,
          valid
            ? styles.requirementTextValid
            : null,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

// ==========================================
// ESTILOS
// ==========================================

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
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 24,
  },

  // ========================================
  // TOPO
  // ========================================

  topBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  kicker: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2.8,
    color: "#6E8A9E",
  },

  routeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22D3EE",
  },

  routeLine: {
    width: 42,
    height: 1,
    marginHorizontal: 5,
    backgroundColor: "#1B5065",
  },

  routeDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#536A79",
  },

  topNumber: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#3D5566",
  },

  // ========================================
  // MARCA
  // ========================================

  brandBlock: {
    alignItems: "center",
    marginBottom: 34,
  },

  logo: {
    width: 106,
    height: 106,
    marginBottom: 4,
  },

  welcome: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#22D3EE",
    textTransform: "uppercase",
  },

  brandTitle: {
    marginTop: 7,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  // ========================================
  // CARD
  // ========================================

  formCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#071522",
    borderWidth: 1,
    borderColor: "#122A3A",
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 22,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardEyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2.4,
    color: "#22D3EE",
    marginBottom: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.7,
  },

  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1B5065",
    alignItems: "center",
    justifyContent: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22D3EE",
  },

  description: {
    marginTop: 7,
    marginBottom: 25,
    fontSize: 12,
    lineHeight: 18,
    color: "#6E8A9E",
  },

  // ========================================
  // CAMPOS
  // ========================================

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
    letterSpacing: 2,
    color: "#6E8A9E",
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#182C3B",
    backgroundColor: "#050A12",
    paddingLeft: 14,
    paddingRight: 13,
  },

  inputContainerError: {
    borderColor: "#E45E6C",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
  },

  inputMark: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3D5566",
  },

  inputAction: {
    paddingLeft: 12,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  inputActionText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#22D3EE",
  },

  forgot: {
    marginBottom: 8,
    fontSize: 9,
    fontWeight: "800",
    color: "#22D3EE",
  },

  error: {
    marginTop: 6,
    marginLeft: 2,
    fontSize: 10,
    color: "#E45E6C",
  },

  // ========================================
  // REQUISITOS
  // ========================================

  requirements: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
    rowGap: 7,
    marginTop: 9,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
  },

  requirementDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  requirementDotInvalid: {
    backgroundColor: "#3D5566",
  },

  requirementDotValid: {
    backgroundColor: "#22D3EE",
  },

  requirementText: {
    fontSize: 8,
    color: "#3D5566",
  },

  requirementTextValid: {
    color: "#6E8A9E",
  },

  // ========================================
  // BOTÃO
  // ========================================

  button: {
    height: 57,
    borderRadius: 13,
    backgroundColor: "#22D3EE",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },

  buttonPressed: {
    opacity: 0.78,
  },

  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonIndex: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#0A1821",
    marginRight: 12,
    opacity: 0.55,
  },

  buttonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#050A12",
  },

  arrow: {
    fontSize: 24,
    fontWeight: "400",
    color: "#050A12",
  },

  // ========================================
  // CADASTRO
  // ========================================

  registerBlock: {
    marginTop: 21,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#122A3A",
    alignItems: "center",
  },

  registerText: {
    fontSize: 10,
    color: "#536A79",
  },

  registerLink: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "800",
    color: "#22D3EE",
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    alignItems: "center",
    marginTop: 27,
  },

  footerText: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 2.3,
    color: "#3D5566",
  },

  footerLine: {
    width: 45,
    height: 1,
    backgroundColor: "#22D3EE",
    marginTop: 8,
    opacity: 0.6,
  },
});