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
} from "react-native";

import { userService } from "./services/userService";

export default function RegisterScreen({
  navigation,
}: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | ""
  >("");

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const hasSixCharacters = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const passwordIsValid =
    hasSixCharacters &&
    hasUppercase &&
    hasNumber &&
    hasSymbol;

  const validateName = () => {
    const value = name.trim();

    if (!value) {
      setNameError("Digite seu nome.");
      return false;
    }

    if (value.length < 3) {
      setNameError("Digite pelo menos 3 caracteres.");
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

    if (
      numbers.length !== 10 &&
      numbers.length !== 11
    ) {
      setPhoneError("Digite um celular válido.");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const validateEmail = () => {
    const value = email.trim();

    if (!value) {
      setEmailError("Digite seu e-mail.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(value)) {
      setEmailError("Digite um e-mail válido.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Digite uma senha.");
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

  const clearMessage = () => {
    setMensagem("");
    setTipoMensagem("");
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (nameError) {
      setNameError("");
    }

    clearMessage();
  };

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    let formatted = numbers;

    if (numbers.length > 0) {
      formatted = `(${numbers.slice(0, 2)}`;

      if (numbers.length >= 2) {
        formatted += ") ";
      }

      if (numbers.length <= 6) {
        formatted += numbers.slice(2);
      } else if (numbers.length <= 10) {
        formatted +=
          numbers.slice(2, 6) +
          "-" +
          numbers.slice(6);
      } else {
        formatted +=
          numbers.slice(2, 7) +
          "-" +
          numbers.slice(7, 11);
      }
    }

    setPhone(formatted);

    if (phoneError) {
      setPhoneError("");
    }

    clearMessage();
  };

  const handleEmailChange = (value: string) => {
    const emailFormatado = value
      .replace(/\s/g, "")
      .toLowerCase();

    setEmail(emailFormatado);

    if (emailError) {
      setEmailError("");
    }

    clearMessage();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError("");
    }

    clearMessage();
  };

  const handleRegister = async () => {
    if (carregando) {
      return;
    }

    clearMessage();

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

    setCarregando(true);

    try {
      await userService.cadastrarUsuario(
        name.trim(),
        phone.trim(),
        email.trim(),
        password
      );

      setTipoMensagem("sucesso");

      setMensagem(
        "Conta criada com sucesso! Redirecionando para o login..."
      );

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 1500);
    } catch (error: any) {
      console.log(
        "Erro ao cadastrar usuário:",
        error
      );

      let mensagemErro =
        "Não foi possível realizar o cadastro.";

      if (
        error?.code ===
        "auth/email-already-in-use"
      ) {
        mensagemErro =
          "Este e-mail já está cadastrado.";

        setEmailError(
          "Este e-mail já está cadastrado."
        );
      } else if (
        error?.code === "auth/invalid-email"
      ) {
        mensagemErro =
          "O e-mail informado é inválido.";

        setEmailError(
          "O e-mail informado é inválido."
        );
      } else if (
        error?.code === "auth/weak-password"
      ) {
        mensagemErro =
          "A senha informada é muito fraca.";

        setPasswordError(
          "A senha informada é muito fraca."
        );
      } else if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        mensagemErro =
          "Sem conexão. Verifique sua internet.";
      }

      setTipoMensagem("erro");
      setMensagem(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  const pressRegister = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 70,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
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
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={12}
            >
              <Text style={styles.backText}>
                ← Voltar
              </Text>
            </Pressable>

            <Text style={styles.title}>
              Criar conta
            </Text>

            <Text style={styles.subtitle}>
              Preencha seus dados para começar.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.cardTitle}>
                Seus dados
              </Text>

              <Text style={styles.stepText}>
                01
              </Text>
            </View>

            <View style={styles.inputContainer}>
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
                placeholder="Digite seu nome"
                placeholderTextColor="#566A76"
                value={name}
                onChangeText={handleNameChange}
                onBlur={validateName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current?.focus()
                }
              />

              {nameError ? (
                <Text style={styles.errorText}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
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
                placeholder="(00) 00000-0000"
                placeholderTextColor="#566A76"
                value={phone}
                onChangeText={handlePhoneChange}
                onBlur={validatePhone}
                keyboardType="phone-pad"
                maxLength={15}
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current?.focus()
                }
              />

              {phoneError ? (
                <Text style={styles.errorText}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                E-MAIL
              </Text>

              <TextInput
                ref={emailInputRef}
                style={[
                  styles.input,
                  emailError
                    ? styles.inputError
                    : null,
                ]}
                placeholder="seu@email.com"
                placeholderTextColor="#566A76"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                maxLength={120}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current?.focus()
                }
              />

              {emailError ? (
                <Text style={styles.emailErrorText}>
                  {emailError}
                </Text>
              ) : email.length > 0 &&
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
                  email
                ) ? (
                <Text style={styles.validText}>
                  ✓ E-mail válido
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  SENHA
                </Text>

                <Text style={styles.passwordHint}>
                  Mantenha sua senha segura
                </Text>
              </View>

              <View
                style={[
                  styles.passwordContainer,
                  passwordError
                    ? styles.inputError
                    : null,
                ]}
              >
                <TextInput
                  ref={passwordInputRef}
                  style={styles.passwordInput}
                  placeholder="Crie uma senha"
                  placeholderTextColor="#566A76"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={validatePassword}
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
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={styles.showButton}
                  hitSlop={10}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword
                      ? "Ocultar"
                      : "Mostrar"}
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
                <Text style={styles.errorText}>
                  {passwordError}
                </Text>
              ) : null}

              {password.length > 0 &&
              passwordIsValid ? (
                <Text style={styles.validText}>
                  ✓ Senha segura
                </Text>
              ) : null}
            </View>

            {mensagem ? (
              <View
                style={[
                  styles.mensagem,
                  tipoMensagem === "sucesso"
                    ? styles.mensagemSucesso
                    : styles.mensagemErro,
                ]}
              >
                <View
                  style={styles.mensagemIconeContainer}
                >
                  <Text
                    style={styles.mensagemIcone}
                  >
                    {tipoMensagem === "sucesso"
                      ? "✓"
                      : "!"}
                  </Text>
                </View>

                <Text style={styles.mensagemTexto}>
                  {mensagem}
                </Text>
              </View>
            ) : null}

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
                style={[
                  styles.button,
                  carregando
                    ? styles.buttonDisabled
                    : null,
                ]}
                onPress={pressRegister}
                disabled={carregando}
              >
                <Text style={styles.buttonText}>
                  {carregando
                    ? "CRIANDO CONTA..."
                    : "CRIAR CONTA"}
                </Text>

                {!carregando ? (
                  <Text style={styles.buttonArrow}>
                    →
                  </Text>
                ) : (
                  <Text style={styles.loadingDots}>
                    •••
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já possui uma conta?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Login")
              }
              hitSlop={10}
            >
              <Text style={styles.loginLink}>
                Entrar
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              AEROPASSO
            </Text>

            <View style={styles.footerLine} />

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
    backgroundColor: "#080B0D",
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 26,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 24,
  },

  backText: {
    color: "#22D3EE",
    fontSize: 13,
    fontWeight: "800",
  },

  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#718793",
  },

  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(16,24,31,0.9)",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 19,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  stepText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#22D3EE",
  },

  inputContainer: {
    marginBottom: 19,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    marginBottom: 8,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: "#718793",
  },

  passwordHint: {
    marginBottom: 8,
    fontSize: 8,
    color: "#425762",
  },

  input: {
    height: 53,
    paddingHorizontal: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "rgba(5,10,18,0.7)",
    color: "#FFFFFF",
    fontSize: 14,
    outlineStyle: "none" as any,
  },

  inputError: {
    borderColor: "#E45E6C",
    backgroundColor: "rgba(228,94,108,0.035)",
  },

  passwordContainer: {
    height: 53,
    paddingLeft: 15,
    paddingRight: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "rgba(5,10,18,0.7)",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 14,
    outlineStyle: "none" as any,
  },

  showButton: {
    paddingVertical: 8,
    paddingLeft: 10,
  },

  showButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#22D3EE",
  },

  errorText: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 14,
    color: "#E45E6C",
  },

  emailErrorText: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    color: "#E45E6C",
  },

  validText: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    color: "#4ADE80",
  },

  requirements: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 13,
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
    backgroundColor: "#354852",
  },

  dotValid: {
    backgroundColor: "#22D3EE",
  },

  requirementText: {
    fontSize: 8,
    color: "#526771",
  },

  requirementValid: {
    color: "#91A5AE",
  },

  mensagem: {
    minHeight: 52,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  mensagemSucesso: {
    backgroundColor: "rgba(34,197,94,0.08)",
    borderColor: "rgba(34,197,94,0.35)",
  },

  mensagemErro: {
    backgroundColor: "rgba(228,94,108,0.08)",
    borderColor: "rgba(228,94,108,0.35)",
  },

  mensagemIconeContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  mensagemIcone: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  mensagemTexto: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "600",
    color: "#FFFFFF",
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

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#041018",
  },

  buttonArrow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#041018",
  },

  loadingDots: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#041018",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    fontSize: 11,
    color: "#536873",
  },

  loginLink: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "900",
    color: "#22D3EE",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#344851",
  },

  footerLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  footerVersion: {
    fontSize: 7,
    color: "#344851",
  },
});