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

  // ==========================================
  // REQUISITOS DA SENHA
  // ==========================================

  const hasSixCharacters = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // ==========================================
  // NOME
  // ==========================================

  const handleNameChange = (text: string) => {
    setName(text);

    if (nameError) {
      setNameError("");
    }
  };

  // ==========================================
  // CELULAR
  // ==========================================

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
      )}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }

    setPhone(formatted);

    if (phoneError) {
      setPhoneError("");
    }
  };

  // ==========================================
  // E-MAIL
  // ==========================================

  const handleEmailChange = (text: string) => {
    const value = text
      .replace(/\s/g, "")
      .toLowerCase();

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
  // VALIDAR NOME
  // ==========================================

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

  // ==========================================
  // VALIDAR CELULAR
  // ==========================================

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
  // CADASTRAR
  // ==========================================

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
              HEADER
          ================================== */}

          <View style={styles.topBar}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.backArrow}>
                ←
              </Text>

              <Text style={styles.backText}>
                LOGIN
              </Text>
            </Pressable>

            <Text style={styles.step}>
              02 / 02
            </Text>
          </View>

          {/* ==================================
              PROGRESSO
          ================================== */}

          <View style={styles.progress}>
            <View style={styles.progressActive} />
            <View style={styles.progressActive} />
          </View>

          {/* ==================================
              MARCA
          ================================== */}

          <View style={styles.brandBlock}>
            <Image
              source={require("../../assets/images/aeropasso.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.kicker}>
              PRIMEIRO PASSO
            </Text>

            <Text style={styles.title}>
              Vamos preparar
              {"\n"}sua jornada.
            </Text>

            <Text style={styles.description}>
              Crie sua conta para encontrar
              rotas e chegar ao seu destino.
            </Text>
          </View>

          {/* ==================================
              FORMULÁRIO
          ================================== */}

          <View style={styles.formCard}>
            {/* NOME */}

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  01 / NOME
                </Text>
              </View>

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
                placeholder="Seu nome completo"
                placeholderTextColor="#536A79"
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
                02 / CELULAR
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
                placeholderTextColor="#536A79"
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

            {/* E-MAIL */}

            <View style={styles.field}>
              <Text style={styles.label}>
                03 / E-MAIL
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
                placeholderTextColor="#536A79"
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
                  04 / SENHA
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
                  styles.passwordInput,
                  passwordError
                    ? styles.inputError
                    : null,
                ]}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={validatePassword}
                placeholder="Crie uma senha"
                placeholderTextColor="#536A79"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                maxLength={64}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

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
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                FINALIZAR CADASTRO
              </Text>

              <Text style={styles.buttonArrow}>
                →
              </Text>
            </Pressable>

            {/* LOGIN */}

            <View style={styles.loginBlock}>
              <Text style={styles.loginText}>
                Já possui uma conta?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate("Login")
                }
              >
                <Text style={styles.loginLink}>
                  Voltar para login
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ==================================
              FOOTER
          ================================== */}

          <View style={styles.footer}>
            <Text style={styles.footerCode}>
              AEROPASSO / 2026
            </Text>

            <View style={styles.footerRoute}>
              <View style={styles.footerDot} />
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>
                DESTINO
              </Text>
            </View>
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
    paddingTop: 22,
    paddingBottom: 25,
  },

  // ========================================
  // TOPO
  // ========================================

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  backArrow: {
    fontSize: 18,
    color: "#22D3EE",
    marginRight: 8,
  },

  backText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#6E8A9E",
  },

  step: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#3D5566",
  },

  // ========================================
  // PROGRESSO
  // ========================================

  progress: {
    flexDirection: "row",
    gap: 5,
    marginTop: 17,
  },

  progressActive: {
    flex: 1,
    height: 2,
    backgroundColor: "#22D3EE",
  },

  // ========================================
  // MARCA
  // ========================================

  brandBlock: {
    marginTop: 28,
    marginBottom: 27,
  },

  logo: {
    width: 62,
    height: 62,
    marginBottom: 12,
  },

  kicker: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2.3,
    color: "#22D3EE",
  },

  title: {
    marginTop: 8,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  description: {
    marginTop: 11,
    maxWidth: 320,
    fontSize: 12,
    lineHeight: 18,
    color: "#6E8A9E",
  },

  // ========================================
  // CARD / FORM
  // ========================================

  formCard: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#1B5065",
    paddingTop: 20,
  },

  field: {
    marginBottom: 17,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.7,
    color: "#6E8A9E",
  },

  input: {
    width: "100%",
    height: 51,
    borderWidth: 1,
    borderColor: "#182C3B",
    borderRadius: 11,
    backgroundColor: "#071522",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#FFFFFF",
  },

  passwordInput: {
    paddingRight: 90,
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  showPassword: {
    marginBottom: 8,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.3,
    color: "#22D3EE",
  },

  error: {
    marginTop: 6,
    marginLeft: 2,
    fontSize: 9,
    color: "#E45E6C",
  },

  // ========================================
  // REQUISITOS
  // ========================================

  requirements: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 13,
    rowGap: 7,
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
    backgroundColor: "#3D5566",
  },

  dotValid: {
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
    height: 56,
    borderRadius: 12,
    backgroundColor: "#22D3EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    marginTop: 4,
  },

  buttonPressed: {
    opacity: 0.78,
  },

  buttonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#050A12",
  },

  buttonArrow: {
    fontSize: 23,
    color: "#050A12",
  },

  // ========================================
  // LOGIN
  // ========================================

  loginBlock: {
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    fontSize: 10,
    color: "#536A79",
  },

  loginLink: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "800",
    color: "#22D3EE",
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    marginTop: 28,
    alignItems: "center",
  },

  footerCode: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#3D5566",
  },

  footerRoute: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22D3EE",
  },

  footerLine: {
    width: 35,
    height: 1,
    marginHorizontal: 6,
    backgroundColor: "#1B5065",
  },

  footerText: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#3D5566",
  },
});