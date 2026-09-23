import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";

// ==================================================
// TIPO DA ROTA INDOOR
// 5 atributos: nome, terminal, origem, destino e
// tempo estimado a pé dentro do aeroporto.
// ==================================================

type RotaIndoor = {
  id: string;
  nome: string;
  terminal: string;
  origem: string;
  destino: string;
  tempoEstimado: string;
};

export default function RotasScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [terminal, setTerminal] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [tempoEstimado, setTempoEstimado] = useState("");

  const [rotas, setRotas] = useState<RotaIndoor[]>([]);

  const limparCampos = () => {
    setNome("");
    setTerminal("");
    setOrigem("");
    setDestino("");
    setTempoEstimado("");
  };

  const handleSalvar = () => {
    if (!nome.trim() || !origem.trim() || !destino.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha ao menos o nome, a origem e o destino da rota."
      );
      return;
    }

    const novaRota: RotaIndoor = {
      id: Date.now().toString(),
      nome: nome.trim(),
      terminal: terminal.trim() || "—",
      origem: origem.trim(),
      destino: destino.trim(),
      tempoEstimado: tempoEstimado.trim() || "—",
    };

    setRotas((prev) => [novaRota, ...prev]);
    limparCampos();
  };

  const handleRemover = (id: string) => {
    setRotas((prev) => prev.filter((rota) => rota.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              Rotas Indoor
            </Text>
          </View>
        </View>

        {/* ================================
            FORMULÁRIO — NOVA ROTA
        ================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            CADASTRAR NOVA ROTA
          </Text>

          <Text style={styles.sectionNumber}>
            01
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>
            NOME DA ROTA
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Check-in ao Portão 12"
            placeholderTextColor="#506671"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.inputLabel}>
            TERMINAL
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Terminal 2"
            placeholderTextColor="#506671"
            value={terminal}
            onChangeText={setTerminal}
          />

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>
                ORIGEM
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Balcão A"
                placeholderTextColor="#506671"
                value={origem}
                onChangeText={setOrigem}
              />
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>
                DESTINO
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Portão 25"
                placeholderTextColor="#506671"
                value={destino}
                onChangeText={setDestino}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>
            TEMPO ESTIMADO (MIN)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 12"
            placeholderTextColor="#506671"
            keyboardType="numeric"
            value={tempoEstimado}
            onChangeText={setTempoEstimado}
          />

          <Pressable style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>
              SALVAR ROTA
            </Text>

            <Feather name="plus-circle" size={18} color="#041018" />
          </Pressable>
        </View>

        {/* ================================
            LISTA DE ROTAS CADASTRADAS
        ================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ROTAS CADASTRADAS
          </Text>

          <Text style={styles.sectionNumber}>
            {String(rotas.length).padStart(2, "0")}
          </Text>
        </View>

        {rotas.length === 0 ? (
          <View style={styles.emptyCard}>
            <Feather name="map-pin" size={18} color="#344851" />

            <Text style={styles.emptyText}>
              Nenhuma rota indoor cadastrada ainda
            </Text>
          </View>
        ) : (
          rotas.map((rota) => (
            <View key={rota.id} style={styles.routeCard}>
              <View style={styles.routeCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tripLabel}>
                    {rota.terminal}
                  </Text>

                  <Text style={styles.routeCardTitle}>
                    {rota.nome}
                  </Text>
                </View>

                <Pressable
                  hitSlop={10}
                  onPress={() => handleRemover(rota.id)}
                >
                  <Feather name="trash-2" size={18} color="#71828D" />
                </Pressable>
              </View>

              <View style={styles.tripLine}>
                <View style={styles.lineDot} />

                <View style={styles.line} />

                <View style={styles.lineDot} />
              </View>

              <View style={styles.tripBottom}>
                <View>
                  <Text style={styles.tripInfoLabel}>
                    ORIGEM
                  </Text>

                  <Text style={styles.routeCardValue}>
                    {rota.origem}
                  </Text>
                </View>

                <View style={styles.tripRight}>
                  <Text style={styles.tripInfoLabel}>
                    DESTINO
                  </Text>

                  <Text style={styles.routeCardValue}>
                    {rota.destino}
                  </Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <Feather name="clock" size={12} color="#22D3EE" />

                <Text style={styles.timeText}>
                  {rota.tempoEstimado} min estimados a pé
                </Text>
              </View>
            </View>
          ))
        )}
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
          <Pressable style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate("Rotas")}>
            <Feather name="map" size={22} color="#22D3EE" />

            <Text style={styles.activeNavText}>
              Rotas
            </Text>

            <View style={styles.activeIndicator} />
          </Pressable>

          {/* API */}
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("API")}>
            <Feather name="server" size={22} color="#71828D" />

            <Text style={styles.navText}>
              API
            </Text>
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
  // SECTION HEADER
  // ================================

  sectionHeader: {
    marginTop: 31,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#536873",
  },

  sectionNumber: {
    fontSize: 8,
    fontWeight: "900",
    color: "#344851",
  },

  // ================================
  // FORMULÁRIO
  // ================================

  formCard: {
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
  },

  inputLabel: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3,
    color: "#506671",
  },

  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "#0A1015",
    fontSize: 13,
    color: "#FFFFFF",
  },

  inputRow: {
    flexDirection: "row",
    gap: 12,
  },

  inputHalf: {
    flex: 1,
  },

  saveButton: {
    height: 53,
    marginTop: 22,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#22D3EE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#041018",
  },

  // ================================
  // ESTADO VAZIO
  // ================================

  emptyCard: {
    padding: 22,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
    alignItems: "center",
    gap: 8,
  },

  emptyText: {
    fontSize: 11,
    color: "#536873",
    textAlign: "center",
  },

  // ================================
  // CARD DE ROTA (reaproveita padrão do tripCard)
  // ================================

  routeCard: {
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
    marginBottom: 12,
  },

  routeCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  tripLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#22D3EE",
  },

  routeCardTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  tripLine: {
    marginVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  lineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22D3EE",
  },

  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
    backgroundColor: "#263943",
  },

  tripBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tripInfoLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#506671",
  },

  routeCardValue: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  tripRight: {
    alignItems: "flex-end",
  },

  timeRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  timeText: {
    fontSize: 9,
    fontWeight: "700",
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
