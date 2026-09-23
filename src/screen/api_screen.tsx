import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";

export default function ApiScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ================================
            TOPO
        ================================= */}

        <View style={styles.topBar}>
          <View>
            <Text style={styles.smallText}>
              AEROPASSO
            </Text>

            <Text style={styles.greeting}>
              API
            </Text>
          </View>
        </View>

        {/* ================================
            CONTEÚDO
            (a preencher)
        ================================= */}

      </ScrollView>

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
          <Pressable style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate("API")}>
            <Feather name="server" size={22} color="#22D3EE" />

            <Text style={styles.activeNavText}>
              API
            </Text>

            <View style={styles.activeIndicator} />
          </Pressable>

          {/* SAIR */}
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("Sair")}>
            <Feather name="log-out" size={22} color="#71828D" />

            <Text style={styles.navText}>
              SAIR
            </Text>
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
    paddingHorizontal: 21,
    paddingTop: 25,
    paddingBottom: 125,
  },

  // ================================
  // TOPO
  // ================================

  topBar: {
    marginBottom: 30,
  },

  smallText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#22D3EE",
  },

  greeting: {
    marginTop: 7,
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
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
