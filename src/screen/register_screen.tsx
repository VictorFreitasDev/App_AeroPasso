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
  // Formato: (11) 99999-9999
  // ==========================================

  const handlePhoneChange = (text: string) => {
    const numbers = text.replace(/\D/g, "");

    let formatted = numbers;

    if (numbers.length <= 2) {
      formatted = numbers;
    } else if (numbers.length <= 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(
        2,
        7
      )}-${numbers.slice(7, 11)}`;
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

    // Aqui futuramente entra sua API/Firebase.

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

          {/* ==================================
              TÍTULO
          ================================== */}

          <View style={styles.intro}>

            <Text style={styles.title}>
              Criar conta
            </Text>

            <Text style={styles.description}>
              Preencha seus dados para começar.
            </Text>

          </View>

          {/* ==================================
              FORMULÁRIO
          ================================== */}

          <View style={styles.form}>

            {/* NOME */}

            <View style={styles.field}>

              <Text style={styles.label}>
                NOME
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
                placeholder="Seu nome completo"
                placeholderTextColor="#687A88"
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
                placeholderTextColor="#687A88"
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

            {/* SENHA */}

            <View style={styles.field}>

              <Text style={styles.label}>
                SENHA
              </Text>

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
                  placeholder="Crie uma senha"
                  placeholderTextColor="#687A88"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  maxLength={64}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />

                <Pressable
                  style={styles.showPassword}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  <Text style={styles.showPasswordText}>
                    {showPassword
                      ? "Ocultar"
                      : "Mostrar"}
                  </Text>

                </Pressable>

              </View>

              {/* REQUISITOS */}

              <View style={styles.requirements}>

                <PasswordRequirement
                  valid={hasSixCharacters}
                  text="6 caracteres"
                />

                <PasswordRequirement
                  valid={hasUppercase}
                  text="1 maiúscula"
                />

                <PasswordRequirement
                  valid={hasNumber}
                  text="1 número"
                />

                <PasswordRequirement
                  valid={hasSymbol}
                  text="1 símbolo"
                />

              </View>

              {passwordError ? (
                <Text style={styles.error}>
                  {passwordError}
                </Text>
              ) : null}

            </View>

            {/* ==================================
                BOTÃO
            ================================== */}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={handleRegister}
            >

              <Text style={styles.buttonText}>
                CRIAR CONTA
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>

            </Pressable>

            {/* ==================================
                VOLTAR PARA LOGIN
            ================================== */}

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

          </View>

          {/* ==================================
              FOOTER
          ================================== */}

          <Text style={styles.footer}>
            AEROPASSO
          </Text>

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
            ? styles.requirementValid
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
    paddingHorizontal: 27,
    paddingTop: 32,
    paddingBottom: 30,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#0A1C28",
    borderWidth: 1,
    borderColor: "#1B5065",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logoText: {
    fontSize: 25,
    fontWeight: "900",
    color: "#25D5F5",
  },

  brand: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 10,
    color: "#667D8C",
  },

  // ========================================
  // INTRO
  // ========================================

  intro: {
    marginBottom: 25,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.7,
  },

  description: {
    marginTop: 6,
    fontSize: 13,
    color: "#687F8E",
  },

  // ========================================
  // FORM
  // ========================================

  form: {
    width: "100%",
  },

  field: {
    marginBottom: 17,
  },

  label: {
    marginBottom: 8,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#708594",
  },

  input: {
    width: "100%",
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#1A3442",
    backgroundColor: "#09151F",
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#FFFFFF",
  },

  passwordInput: {
    paddingRight: 78,
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  error: {
    marginTop: 6,
    marginLeft: 3,
    fontSize: 10,
    color: "#E45E6C",
  },

  // ========================================
  // SENHA
  // ========================================

  showPassword: {
    position: "absolute",
    right: 14,
    top: 0,
    height: 53,
    justifyContent: "center",
  },

  showPasswordText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#25D5F5",
  },

  requirements: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
    rowGap: 7,
    marginTop: 10,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  dotInvalid: {
    backgroundColor: "#425462",
  },

  dotValid: {
    backgroundColor: "#25D5F5",
  },

  requirementText: {
    fontSize: 9,
    color: "#536A79",
  },

  requirementValid: {
    color: "#8CA5B3",
  },

  // ========================================
  // BOTÃO
  // ========================================

  button: {
    height: 55,
    borderRadius: 13,
    backgroundColor: "#25D5F5",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 5,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#041018",
  },

  arrow: {
    marginLeft: 11,
    fontSize: 20,
    color: "#041018",
  },

  // ========================================
  // LOGIN
  // ========================================

  loginArea: {
    alignItems: "center",
    marginTop: 23,
  },

  loginText: {
    fontSize: 11,
    color: "#5F7584",
  },

  loginLink: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#25D5F5",
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    marginTop: "auto",
    paddingTop: 35,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#304653",
  },

});