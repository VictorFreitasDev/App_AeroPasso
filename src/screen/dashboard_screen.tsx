import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";

import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function DashboardScreen({
  navigation,
}: any) {
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
              Para onde você vai?
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => {}}
          >
            <Text style={styles.profileText}>
              ●
            </Text>
          </Pressable>
        </View>


        {/* ================================
            BUSCA DE ROTA
        ================================= */}

        <View style={styles.routeBox}>

          <Text style={styles.routeLabel}>
            PLANEJE SUA ROTA
          </Text>

          <Text style={styles.routeTitle}>
            Chegue ao aeroporto
            sem complicação.
          </Text>

          <Text style={styles.routeDescription}>
            Informe seu ponto de partida e
            encontre o melhor caminho.
          </Text>


          {/* ORIGEM */}

          <View style={styles.locationBox}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>
                ●
              </Text>
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                SAINDO DE
              </Text>

              <Text style={styles.locationPlaceholder}>
                Sua localização
              </Text>
            </View>
          </View>


          {/* DESTINO */}

          <View style={styles.locationBox}>
            <View style={styles.airportIcon}>
              <Text style={styles.airportIconText}>
                ✈
              </Text>
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                DESTINO
              </Text>

              <Text style={styles.locationPlaceholder}>
                Escolha um aeroporto
              </Text>
            </View>
          </View>


          <Pressable style={styles.routeButton}>
            <Text style={styles.routeButtonText}>
              CALCULAR ROTA
            </Text>

            <Text style={styles.routeButtonArrow}>
              →
            </Text>
          </Pressable>

        </View>


        {/* ================================
            PRÓXIMA VIAGEM
        ================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            PRÓXIMA VIAGEM
          </Text>

          <Text style={styles.sectionNumber}>
            01
          </Text>
        </View>


        <View style={styles.tripCard}>

          <View style={styles.tripTop}>
            <View>
              <Text style={styles.tripLabel}>
                DESTINO
              </Text>

              <Text style={styles.tripAirport}>
                Aeroporto
              </Text>

              <Text style={styles.tripCode}>
                AGUARDANDO DESTINO
              </Text>
            </View>

            <Text style={styles.tripPlane}>
              ✈
            </Text>
          </View>


          <View style={styles.tripLine}>
            <View style={styles.lineDot} />

            <View style={styles.line} />

            <View style={styles.lineDot} />
          </View>


          <View style={styles.tripBottom}>
            <View>
              <Text style={styles.tripInfoLabel}>
                TEMPO ESTIMADO
              </Text>

              <Text style={styles.tripInfoValue}>
                —
              </Text>
            </View>

            <View style={styles.tripRight}>
              <Text style={styles.tripInfoLabel}>
                STATUS
              </Text>

              <Text style={styles.waiting}>
                NÃO PLANEJADO
              </Text>
            </View>
          </View>

        </View>


        {/* ================================
            ACESSOS
        ================================= */}

        <Text style={styles.accessTitle}>
          ACESSOS
        </Text>


        <View style={styles.accessRow}>

          <Pressable style={styles.accessCard}>
            <Text style={styles.accessIcon}>
              ☆
            </Text>

            <Text style={styles.accessCardTitle}>
              Favoritos
            </Text>

            <Text style={styles.accessCardText}>
              Aeroportos salvos
            </Text>
          </Pressable>


          <Pressable style={styles.accessCard}>
            <Text style={styles.accessIcon}>
              ◉
            </Text>

            <Text style={styles.accessCardTitle}>
              Histórico
            </Text>

            <Text style={styles.accessCardText}>
              Rotas anteriores
            </Text>
          </Pressable>

        </View>


        {/* ================================
            DICA
        ================================= */}

        <View style={styles.tip}>

          <View style={styles.tipIcon}>
            <Text style={styles.tipIconText}>
              !
            </Text>
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Dica AeroPasso
            </Text>

            <Text style={styles.tipText}>
              Planeje sua rota antes de sair
              para evitar imprevistos no caminho.
            </Text>
          </View>

        </View>


        {/* ================================
            SAIR
        ================================= */}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            SAIR DA CONTA
          </Text>
        </Pressable>


        <Text style={styles.footer}>
          AEROPASSO • ROTAS PARA AEROPORTOS
        </Text>

      </ScrollView>
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
    paddingBottom: 35,
  },


  // ================================
  // TOPO
  // ================================

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "#10181F",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    fontSize: 16,
    color: "#22D3EE",
  },


  // ================================
  // ROTA
  // ================================

  routeBox: {
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "#10181F",
  },

  routeLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#22D3EE",
  },

  routeTitle: {
    marginTop: 8,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  routeDescription: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 17,
    color: "#6D818D",
  },


  // ================================
  // LOCALIZAÇÃO
  // ================================

  locationBox: {
    height: 63,
    marginTop: 15,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "#0A1015",
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(34,211,238,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  locationIconText: {
    fontSize: 12,
    color: "#22D3EE",
  },

  airportIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(34,211,238,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  airportIconText: {
    fontSize: 14,
    color: "#22D3EE",
  },

  locationContent: {
    marginLeft: 11,
  },

  locationLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3,
    color: "#506671",
  },

  locationPlaceholder: {
    marginTop: 4,
    fontSize: 12,
    color: "#A1B2BA",
  },


  // ================================
  // BOTÃO ROTA
  // ================================

  routeButton: {
    height: 53,
    marginTop: 16,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#22D3EE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#041018",
  },

  routeButtonArrow: {
    fontSize: 20,
    color: "#041018",
  },


  // ================================
  // PRÓXIMA VIAGEM
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

  tripCard: {
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
  },

  tripTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tripLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#506671",
  },

  tripAirport: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  tripCode: {
    marginTop: 4,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#22D3EE",
  },

  tripPlane: {
    fontSize: 28,
    color: "#22D3EE",
  },

  tripLine: {
    marginVertical: 20,
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

  tripInfoValue: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  tripRight: {
    alignItems: "flex-end",
  },

  waiting: {
    marginTop: 5,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#718793",
  },


  // ================================
  // ACESSOS
  // ================================

  accessTitle: {
    marginTop: 29,
    marginBottom: 13,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#536873",
  },

  accessRow: {
    flexDirection: "row",
    gap: 12,
  },

  accessCard: {
    flex: 1,
    minHeight: 125,
    padding: 16,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
  },

  accessIcon: {
    fontSize: 21,
    color: "#22D3EE",
  },

  accessCardTitle: {
    marginTop: 15,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  accessCardText: {
    marginTop: 5,
    fontSize: 9,
    color: "#607580",
  },


  // ================================
  // DICA
  // ================================

  tip: {
    marginTop: 20,
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.12)",
    backgroundColor: "rgba(34,211,238,0.04)",
    flexDirection: "row",
  },

  tipIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "rgba(34,211,238,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  tipIconText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#22D3EE",
  },

  tipContent: {
    flex: 1,
    marginLeft: 11,
  },

  tipTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  tipText: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
    color: "#607580",
  },


  // ================================
  // SAIR
  // ================================

  logoutButton: {
    marginTop: 23,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#263943",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#718793",
  },


  // ================================
  // FOOTER
  // ================================

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: "#344851",
  },
});