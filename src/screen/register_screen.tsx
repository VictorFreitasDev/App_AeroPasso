import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
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

  // Mensagem exibida dentro da tela
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | ""
  >("");

  const [carregando, setCarregando] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  // ========================================
  // VALIDAÇÕES
  // ========================================

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

    if (numbers.length < 10) {
      setPhoneError("Digite um celular válido.");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError("Digite seu e-mail.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
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

    if (password.length < 6) {
      setPasswordError(
        "A senha deve ter pelo menos 6 caracteres."
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  // ========================================
  // ALTERAÇÃO DOS CAMPOS
  // ========================================

  const handleNameChange = (value: string) => {
    setName(value);

    if (nameError) {
      setNameError("");
    }

    setMensagem("");
    setTipoMensagem("");
  };

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    let formatted = numbers;

    if (numbers.length <= 11) {
      if (numbers.length > 2) {
        formatted =
          `(${numbers.slice(0, 2)}) ` +
          numbers.slice(2);
      }

      if (numbers.length > 7) {
        formatted =
          `(${numbers.slice(0, 2)}) ` +
          numbers.slice(2, 7) +
          "-" +
          numbers.slice(7);
      }
    }

    setPhone(formatted);

    if (phoneError) {
      setPhoneError("");
    }

    setMensagem("");
    setTipoMensagem("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (emailError) {
      setEmailError("");
    }

    setMensagem("");
    setTipoMensagem("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError("");
    }

    setMensagem("");
    setTipoMensagem("");
  };

  // ========================================
  // CADASTRO
  // ========================================

  const handleRegister = async () => {
    if (carregando) {
      return;
    }

    setMensagem("");
    setTipoMensagem("");

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

      // Mensagem de sucesso dentro da tela
      setTipoMensagem("sucesso");

      setMensagem(
        "Conta criada com sucesso! Você será levado para o login."
      );

      // Depois de mostrar a mensagem, vai para o Login
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
      } else if (
        error?.code === "auth/invalid-email"
      ) {
        mensagemErro = "E-mail inválido.";
      } else if (
        error?.code === "auth/weak-password"
      ) {
        mensagemErro =
          "A senha informada é muito fraca.";
      } else if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        mensagemErro =
          "Sem conexão com o Firebase. Verifique sua internet.";
      }

      setTipoMensagem("erro");
      setMensagem(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  // ========================================
  // ANIMAÇÃO DO BOTÃO
  // ========================================

  const pressRegister = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    handleRegister();
  };

  // ========================================
  // TELA
  // ========================================

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* VOLTAR */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Voltar
          </Text>
        </Pressable>

        {/* TÍTULO */}
        <Text style={styles.title}>
          Criar conta
        </Text>

        <Text style={styles.subtitle}>
          Cadastre-se para começar sua jornada.
        </Text>

        {/* NOME */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            NOME
          </Text>

          <TextInput
            style={[
              styles.input,
              nameError ? styles.inputError : null,
            ]}
            placeholder="Digite seu nome"
            placeholderTextColor="#718793"
            value={name}
            onChangeText={handleNameChange}
            autoCapitalize="words"
          />

          {nameError ? (
            <Text style={styles.errorText}>
              {nameError}
            </Text>
          ) : null}
        </View>

        {/* CELULAR */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            CELULAR
          </Text>

          <TextInput
            style={[
              styles.input,
              phoneError ? styles.inputError : null,
            ]}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#718793"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={15}
          />

          {phoneError ? (
            <Text style={styles.errorText}>
              {phoneError}
            </Text>
          ) : null}
        </View>

        {/* E-MAIL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            E-MAIL
          </Text>

          <TextInput
            style={[
              styles.input,
              emailError ? styles.inputError : null,
            ]}
            placeholder="seu@email.com"
            placeholderTextColor="#718793"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {emailError ? (
            <Text style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}
        </View>

        {/* SENHA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            SENHA
          </Text>

          <View
            style={[
              styles.passwordContainer,
              passwordError
                ? styles.inputError
                : null,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#718793"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Text style={styles.showPassword}>
                {showPassword
                  ? "Ocultar"
                  : "Mostrar"}
              </Text>
            </Pressable>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>
              {passwordError}
            </Text>
          ) : null}
        </View>

        {/* MENSAGEM DE CADASTRO */}

        {mensagem ? (
          <View
            style={[
              styles.mensagem,
              tipoMensagem === "sucesso"
                ? styles.mensagemSucesso
                : styles.mensagemErro,
            ]}
          >
            <Text style={styles.mensagemIcone}>
              {tipoMensagem === "sucesso"
                ? "✓"
                : "!"}
            </Text>

            <Text style={styles.mensagemTexto}>
              {mensagem}
            </Text>
          </View>
        ) : null}

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
            ) : null}
          </Pressable>
        </Animated.View>

        {/* LOGIN */}

        <View style={styles.loginContainer}>
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
    </SafeAreaView>
  );
}

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0E",
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
  },

  backButton: {
    marginBottom: 30,
  },

  backText: {
    color: "#22D3EE",
    fontSize: 14,
    fontWeight: "700",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    fontSize: 14,
    color: "#718793",
  },

  inputContainer: {
    marginBottom: 17,
  },

  label: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#718793",
  },

  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(16,24,31,0.82)",
    color: "#FFFFFF",
    fontSize: 14,
  },

  inputError: {
    borderColor: "#E45E6C",
  },

  errorText: {
    marginTop: 6,
    fontSize: 11,
    color: "#E45E6C",
  },

  passwordContainer: {
    height: 52,
    paddingLeft: 16,
    paddingRight: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(16,24,31,0.82)",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },

  showPassword: {
    color: "#22D3EE",
    fontSize: 11,
    fontWeight: "800",
  },

  // ========================================
  // MENSAGEM
  // ========================================

  mensagem: {
    minHeight: 52,
    marginBottom: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  mensagemSucesso: {
    backgroundColor:
      "rgba(34,197,94,0.10)",
    borderColor:
      "rgba(34,197,94,0.45)",
  },

  mensagemErro: {
    backgroundColor:
      "rgba(228,94,108,0.10)",
    borderColor:
      "rgba(228,94,108,0.45)",
  },

  mensagemIcone: {
    width: 24,
    height: 24,
    marginRight: 9,
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  mensagemTexto: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ========================================
  // BOTÃO
  // ========================================

  button: {
    height: 55,
    borderRadius: 16,
    backgroundColor: "#22D3EE",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "800",
    color: "#041018",
  },

  // ========================================
  // LOGIN
  // ========================================

  loginContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    fontSize: 13,
    color: "#718793",
  },

  loginLink: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "800",
    color: "#22D3EE",
  },
});