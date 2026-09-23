import React from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function SairScreen({ navigation }: any) {
  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.smallText}>
          AEROPASSO
        </Text>

        {/* ================================
            ÍCONE DE ALERTA
        ================================= */}

        <View style={styles.warningIcon}>
          <Feather name="log-out" size={26} color="#22D3EE" />
        </View>

        {/* ================================
            MENSAGEM DE CONFIRMAÇÃO
        ================================= */}

        <Text style={styles.title}>
          Deseja realmente sair{"\n"}da sua conta?
        </Text>

        <Text style={styles.subtitle}>
          Você precisará entrar novamente para acessar suas rotas e favoritos.
        </Text>

        {/* ================================
            AÇÕES
        ================================= */}

        <Pressable style={styles.confirmButton} onPress={handleLogout}>
          <Text style={styles.confirmButtonText}>
            SIM, SAIR DA CONTA
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>
            CANCELAR
          </Text>
        </Pressable>
      </View>

      {/* ==================================================
          HOTBAR DE NAVEGAÇÃO — ESTÉTICA
      ================================================== */}

      <View style={styles.hotbarContainer}>
        <View style={styles.hotbar}>

          {/* HOME */}
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("Dashboard")}>
            <Feather name="home" size={22} color="#71828D" />

            <Text style={styles.navText}>
              Home
            </Text>
          </Pressable>

          {/* ROTAS */}
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("Rotas")}>
            <Feather name="map" size={22} color="#71828D" />

            <Text style={styles.navText}>
              Rotas
            </Text>
          </Pressable>

          {/* API */}
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("API")}>
            <Feather name="server" size={22} color="#71828D" />

            <Text style={styles.navText}>
              API
            </Text>
          </Pressable>

          {/* SAIR */}
          <Pressable style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate("Sair")}>
            <Feather name="log-out" size={22} color="#22D3EE" />

            <Text style={styles.activeNavText}>
              SAIR
            </Text>

            <View style={styles.activeIndicator} />
          </Pressable>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0E",
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 125,
    alignItems: "center",
    justifyContent: "center",
  },

  smallText: {
    position: "absolute",
    top: 25,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#22D3EE",
  },

  warningIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.15)",
    backgroundColor: "rgba(34,211,238,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 28,
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 34,
    fontSize: 11,
    lineHeight: 16,
    color: "#607580",
    textAlign: "center",
  },

  confirmButton: {
    width: "100%",
    height: 53,
    borderRadius: 15,
    backgroundColor: "#22D3EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  confirmButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#041018",
  },

  cancelButton: {
    width: "100%",
    height: 53,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#263943",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#718793",
  },

  // ================================
  // HOTBAR
  // ================================

  hotbarContainer: {
    position: "absolute",
    left: 17,
    right: 17,
    bottom: 12,
  },

  hotbar: {
    height: 75,
    borderRadius: 24,
    backgroundColor: "rgba(12, 18, 25, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 18,

    elevation: 12,
  },

  navItem: {
    height: 69,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  activeNavItem: {
    backgroundColor: "rgba(34,211,238,0.055)",
    borderRadius: 18,
    marginVertical: 5,
  },

  navText: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "700",
    color: "#71828D",
  },

  activeNavText: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
    color: "#22D3EE",
  },

  activeIndicator: {
    position: "absolute",
    bottom: 4,
    width: 20,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#22D3EE",
  },
});
