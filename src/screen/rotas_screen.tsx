import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { RotaIndoorModel as RotaIndoor } from "./models/RotaIndoorModel";
import { auth, database } from "../services/firebaseConfig";
import { ref, set, onValue, remove, push, get, update } from "firebase/database";

// ==================================================
// BASE DE DADOS "ESTÁTICA" DO AEROPORTO
// Cada local tem uma posição em metros dentro do seu
// terminal (uma linha imaginária de referência), usada
// só para estimar distância/tempo entre dois pontos.
// ==================================================

type LocalReferencia = {
  id: string;
  nome: string;
  terminal: string;
  posicao: number; // metros a partir da entrada do terminal
};

const TERMINAIS = ["Terminal 1", "Terminal 2", "Terminal 3"];

const LOCAIS: LocalReferencia[] = [
  // Terminal 1 — Doméstico
  { id: "t1-estacionamento", nome: "Estacionamento", terminal: "Terminal 1", posicao: 0 },
  { id: "t1-checkin-a", nome: "Check-in Balcão A", terminal: "Terminal 1", posicao: 60 },
  { id: "t1-checkin-b", nome: "Check-in Balcão B", terminal: "Terminal 1", posicao: 100 },
  { id: "t1-seguranca", nome: "Raio-X / Segurança", terminal: "Terminal 1", posicao: 180 },
  { id: "t1-praca", nome: "Praça de Alimentação", terminal: "Terminal 1", posicao: 300 },
  { id: "t1-vip", nome: "Sala VIP", terminal: "Terminal 1", posicao: 340 },
  { id: "t1-portao-1-5", nome: "Portões 1 a 5", terminal: "Terminal 1", posicao: 460 },
  { id: "t1-portao-6-10", nome: "Portões 6 a 10", terminal: "Terminal 1", posicao: 700 },
  { id: "t1-desembarque", nome: "Desembarque", terminal: "Terminal 1", posicao: 220 },

  // Terminal 2 — Doméstico
  { id: "t2-estacionamento", nome: "Estacionamento", terminal: "Terminal 2", posicao: 0 },
  { id: "t2-checkin", nome: "Check-in Central", terminal: "Terminal 2", posicao: 70 },
  { id: "t2-seguranca", nome: "Raio-X / Segurança", terminal: "Terminal 2", posicao: 150 },
  { id: "t2-praca", nome: "Praça de Alimentação", terminal: "Terminal 2", posicao: 260 },
  { id: "t2-portao-11-15", nome: "Portões 11 a 15", terminal: "Terminal 2", posicao: 420 },
  { id: "t2-portao-16-20", nome: "Portões 16 a 20", terminal: "Terminal 2", posicao: 640 },
  { id: "t2-desembarque", nome: "Desembarque", terminal: "Terminal 2", posicao: 190 },

  // Terminal 3 — Internacional
  { id: "t3-estacionamento", nome: "Estacionamento", terminal: "Terminal 3", posicao: 0 },
  { id: "t3-checkin", nome: "Check-in Internacional", terminal: "Terminal 3", posicao: 80 },
  { id: "t3-imigracao", nome: "Imigração", terminal: "Terminal 3", posicao: 200 },
  { id: "t3-duty-free", nome: "Duty Free", terminal: "Terminal 3", posicao: 320 },
  { id: "t3-portao-21-25", nome: "Portões 21 a 25", terminal: "Terminal 3", posicao: 520 },
  { id: "t3-desembarque", nome: "Desembarque Internacional", terminal: "Terminal 3", posicao: 260 },
];

// Velocidade média de deslocamento (m/s) por modo escolhido
const VELOCIDADES: Record<string, number> = {
  "A pé": 1.2,
  "Esteira Rolante": 1.8,
  "Carrinho de Apoio": 3.2,
};

const MODOS_DESLOCAMENTO = Object.keys(VELOCIDADES);

function calcularTempoEstimado(
  origem: LocalReferencia | null,
  destino: LocalReferencia | null,
  modo: string
) {
  if (!origem || !destino || !modo) return null;

  const distanciaMetros = Math.abs(origem.posicao - destino.posicao);
  const velocidade = VELOCIDADES[modo] ?? VELOCIDADES["A pé"];
  const tempoMin = Math.max(1, Math.round(distanciaMetros / velocidade / 60));

  return { distanciaMetros, tempoMin };
}

// Regex: nome da rota só aceita letras (com acento), números,
// espaços e pontuação básica — evita colar lixo/caracteres inválidos.
const REGEX_NOME_ROTA = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-\/,.]{3,60}$/;

// ==================================================
// COMPONENTE DE SELEÇÃO (dropdown em Modal)
// ==================================================

type Opcao = { id: string; label: string; sublabel?: string };

function SeletorCampo({
  label,
  placeholder,
  valorExibido,
  opcoes,
  onSelecionar,
  disabled,
  erro,
}: {
  label: string;
  placeholder: string;
  valorExibido: string | null;
  opcoes: Opcao[];
  onSelecionar: (id: string) => void;
  disabled?: boolean;
  erro?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>

      <Pressable
        style={[
          styles.selectorBox,
          disabled && styles.selectorBoxDisabled,
          erro ? styles.campoComErro : null,
        ]}
        onPress={() => !disabled && setAberto(true)}
      >
        <Text
          style={valorExibido ? styles.selectorText : styles.selectorPlaceholder}
        >
          {valorExibido || placeholder}
        </Text>

        <Feather
          name="chevron-down"
          size={16}
          color={disabled ? "#344851" : "#71828D"}
        />
      </Pressable>

      {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

      <Modal visible={aberto} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setAberto(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>

              <Pressable hitSlop={10} onPress={() => setAberto(false)}>
                <Feather name="x" size={18} color="#71828D" />
              </Pressable>
            </View>

            <FlatList
              data={opcoes}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 360 }}
              ItemSeparatorComponent={() => <View style={styles.optionSeparator} />}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.optionItem}
                  onPress={() => {
                    onSelecionar(item.id);
                    setAberto(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>

                  {item.sublabel ? (
                    <Text style={styles.optionSubtext}>{item.sublabel}</Text>
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// ==================================================
// TELA PRINCIPAL
// ==================================================

export default function RotasScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [terminal, setTerminal] = useState<string | null>(null);
  const [origemId, setOrigemId] = useState<string | null>(null);
  const [destinoId, setDestinoId] = useState<string | null>(null);
  const [modo, setModo] = useState<string | null>(null);
  const [rotaEmEdicaoId, setRotaEmEdicaoId] = useState<string | null>(null);
  const [rotaParaExcluir, setRotaParaExcluir] = useState<RotaIndoor | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const [rotas, setRotas] = useState<RotaIndoor[]>([]);

  const [erros, setErros] = useState<{
    nome?: string;
    terminal?: string;
    origem?: string;
    destino?: string;
    modo?: string;
  }>({});

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setRotas([]);
      return;
    }

    const rotasRef = ref(database, `usuarios/${userId}/rotas`);
    
    const unsubscribe = onValue(rotasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const rotasList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })).reverse();
        setRotas(rotasList);
      } else {
        setRotas([]);
      }
    }, (error) => {
      console.error("Erro ao carregar rotas do Firebase:", error);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const locaisDoTerminal = useMemo(
    () => LOCAIS.filter((l) => l.terminal === terminal),
    [terminal]
  );

  const origemLocal = useMemo(
    () => locaisDoTerminal.find((l) => l.id === origemId) || null,
    [locaisDoTerminal, origemId]
  );

  const destinoLocal = useMemo(
    () => locaisDoTerminal.find((l) => l.id === destinoId) || null,
    [locaisDoTerminal, destinoId]
  );

  const estimativa = useMemo(
    () => calcularTempoEstimado(origemLocal, destinoLocal, modo || ""),
    [origemLocal, destinoLocal, modo]
  );

  // Filtra caracteres inválidos enquanto o usuário digita e
  // some com o erro assim que o texto volta a ficar válido
  const handleNomeChange = (texto: string) => {
    const filtrado = texto.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-\/,.]/g, "");
    setNome(filtrado);
    if (erros.nome) setErros((prev) => ({ ...prev, nome: undefined }));
  };

  const handleSelecionarTerminal = (id: string) => {
    setTerminal(id);
    setOrigemId(null);
    setDestinoId(null);
    setErros((prev) => ({ ...prev, terminal: undefined, origem: undefined, destino: undefined }));
  };

  const handleSelecionarOrigem = (id: string) => {
    setOrigemId(id);
    setErros((prev) => ({ ...prev, origem: undefined, destino: undefined }));
  };

  const handleSelecionarDestino = (id: string) => {
    setDestinoId(id);
    setErros((prev) => ({ ...prev, origem: undefined, destino: undefined }));
  };

  const handleSelecionarModo = (id: string) => {
    setModo(id);
    setErros((prev) => ({ ...prev, modo: undefined }));
  };

  const limparCampos = () => {
    setNome("");
    setTerminal(null);
    setOrigemId(null);
    setDestinoId(null);
    setModo(null);
    setErros({});
    setRotaEmEdicaoId(null);
  };

  const handleIniciarEdicao = (rota: RotaIndoor) => {
    setRotaEmEdicaoId(rota.id);
    setNome(rota.nome);
    setTerminal(rota.terminal);

    const orig = LOCAIS.find(
      (l) => l.nome === rota.origemNome && l.terminal === rota.terminal
    );
    const dest = LOCAIS.find(
      (l) => l.nome === rota.destinoNome && l.terminal === rota.terminal
    );

    setOrigemId(orig ? orig.id : null);
    setDestinoId(dest ? dest.id : null);
    setModo(rota.modoDeslocamento);
    setErros({});

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleCancelarEdicao = () => {
    setRotaEmEdicaoId(null);
    limparCampos();
  };

  const handleSalvar = async () => {
    const nomeLimpo = nome.trim();
    const novosErros: typeof erros = {};

    if (!REGEX_NOME_ROTA.test(nomeLimpo)) {
      novosErros.nome =
        "Use de 3 a 60 caracteres: apenas letras, números e pontuação simples (- / , .).";
    }

    if (!terminal) {
      novosErros.terminal = "Selecione o terminal da rota.";
    }

    if (!origemLocal) {
      novosErros.origem = "Selecione a origem da rota.";
    }

    if (!destinoLocal) {
      novosErros.destino = "Selecione o destino da rota.";
    } else if (origemLocal && origemLocal.id === destinoLocal.id) {
      novosErros.destino = "Origem e destino não podem ser o mesmo local.";
    }

    if (!modo) {
      novosErros.modo = "Selecione o modo de deslocamento.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    const resultado = calcularTempoEstimado(origemLocal, destinoLocal, modo as string);
    if (!resultado || !origemLocal || !destinoLocal || !terminal || !modo) return;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("Erro: Usuário não está logado!");
      return;
    }

    if (rotaEmEdicaoId) {
      // ==========================================
      // UPDATE — ATUALIZAR ROTA EXISTENTE
      // ==========================================
      const rotaRef = ref(database, `usuarios/${userId}/rotas/${rotaEmEdicaoId}`);
      const dadosAtualizados = {
        nome: nomeLimpo,
        terminal,
        origemNome: origemLocal.nome,
        destinoNome: destinoLocal.nome,
        modoDeslocamento: modo,
        distanciaMetros: resultado.distanciaMetros,
        tempoEstimadoMin: resultado.tempoMin,
        atualizadoEm: new Date().toISOString(),
      };

      update(rotaRef, dadosAtualizados)
        .then(() => limparCampos())
        .catch((err) => alert("Erro ao atualizar rota: " + err.message));
    } else {
      // ==========================================
      // CREATE — CADASTRAR NOVA ROTA
      // ==========================================
      const userEmail = auth.currentUser?.email || "";
      let userName = auth.currentUser?.displayName;

      if (!userName) {
        try {
          const userSnap = await get(ref(database, `usuarios/${userId}/nome`));
          if (userSnap.exists() && userSnap.val()) {
            userName = userSnap.val();
          }
        } catch (e) {
          // ignora se não encontrar
        }
      }

      if (!userName) {
        userName = userEmail ? userEmail.split("@")[0] : "Usuário";
      }

      const novaRota = {
        nome: nomeLimpo,
        terminal,
        origemNome: origemLocal.nome,
        destinoNome: destinoLocal.nome,
        modoDeslocamento: modo,
        distanciaMetros: resultado.distanciaMetros,
        tempoEstimadoMin: resultado.tempoMin,
        criadoEm: new Date().toISOString(),
        criadoPor: userName,
        usuarioEmail: userEmail,
        usuarioId: userId,
      };

      const rotasRef = ref(database, `usuarios/${userId}/rotas`);
      const novaRotaRef = push(rotasRef);
      
      set(novaRotaRef, novaRota)
        .then(() => limparCampos())
        .catch((err) => alert("Erro ao salvar rota: " + err.message));
    }
  };

  const handleAbrirConfirmacaoExclusao = (rota: RotaIndoor) => {
    setRotaParaExcluir(rota);
  };

  const handleConfirmarExclusao = () => {
    if (!rotaParaExcluir) return;

    const userId = auth.currentUser?.uid;
    if (!userId) return;

    if (rotaEmEdicaoId === rotaParaExcluir.id) {
      handleCancelarEdicao();
    }

    const rotaRef = ref(database, `usuarios/${userId}/rotas/${rotaParaExcluir.id}`);
    remove(rotaRef)
      .catch((err) => console.error("Erro ao excluir rota:", err))
      .finally(() => {
        setRotaParaExcluir(null);
      });
  };

  const handleCancelarExclusao = () => {
    setRotaParaExcluir(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* ================================
            TOPO
        ================================= */}

        <View style={styles.topBar}>
          <View>
            <Text style={styles.smallText}>AEROPASSO</Text>

            <Text style={styles.greeting}>Rotas Indoor</Text>
          </View>
        </View>

        {/* ================================
            FORMULÁRIO — NOVA ROTA / EDITAR
        ================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {rotaEmEdicaoId ? "EDITAR ROTA SELECIONADA" : "CADASTRAR NOVA ROTA"}
          </Text>

          <Text style={styles.sectionNumber}>01</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>NOME DA ROTA</Text>

          <TextInput
            style={[styles.input, erros.nome ? styles.campoComErro : null]}
            placeholder="Ex: Check-in ao Portão 12"
            placeholderTextColor="#506671"
            value={nome}
            onChangeText={handleNomeChange}
            maxLength={60}
          />
          {erros.nome ? <Text style={styles.erroText}>{erros.nome}</Text> : null}

          <SeletorCampo
            label="TERMINAL"
            placeholder="Selecione o terminal"
            valorExibido={terminal}
            opcoes={TERMINAIS.map((t) => ({ id: t, label: t }))}
            onSelecionar={handleSelecionarTerminal}
            erro={erros.terminal}
          />

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <SeletorCampo
                label="ORIGEM"
                placeholder={terminal ? "Selecione a origem" : "Escolha o terminal antes"}
                valorExibido={origemLocal?.nome ?? null}
                disabled={!terminal}
                opcoes={locaisDoTerminal.map((l) => ({ id: l.id, label: l.nome }))}
                onSelecionar={handleSelecionarOrigem}
                erro={erros.origem}
              />
            </View>

            <View style={styles.inputHalf}>
              <SeletorCampo
                label="DESTINO"
                placeholder={terminal ? "Selecione o destino" : "Escolha o terminal antes"}
                valorExibido={destinoLocal?.nome ?? null}
                disabled={!terminal}
                opcoes={locaisDoTerminal
                  .filter((l) => l.id !== origemId)
                  .map((l) => ({ id: l.id, label: l.nome }))}
                onSelecionar={handleSelecionarDestino}
                erro={erros.destino}
              />
            </View>
          </View>

          <SeletorCampo
            label="MODO DE DESLOCAMENTO"
            placeholder="Como o passageiro vai se deslocar?"
            valorExibido={modo}
            opcoes={MODOS_DESLOCAMENTO.map((m) => ({
              id: m,
              label: m,
              sublabel: `~${VELOCIDADES[m].toFixed(1)} m/s`,
            }))}
            onSelecionar={handleSelecionarModo}
            erro={erros.modo}
          />

          <Text style={styles.inputLabel}>TEMPO ESTIMADO (AUTOMÁTICO)</Text>

          <View style={styles.infoCard}>
            {estimativa ? (
              <>
                <View style={styles.infoRow}>
                  <Feather name="clock" size={14} color="#22D3EE" />

                  <Text style={styles.infoValue}>
                    {estimativa.tempoMin} min a pé estimados
                  </Text>
                </View>

                <Text style={styles.infoSublabel}>
                  ≈ {estimativa.distanciaMetros} m entre os pontos, no modo "{modo}"
                </Text>
              </>
            ) : (
              <Text style={styles.emptyText}>
                Selecione terminal, origem, destino e modo de deslocamento para
                calcular o tempo automaticamente
              </Text>
            )}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>
              {rotaEmEdicaoId ? "SALVAR ALTERAÇÕES" : "CADASTRAR ROTA"}
            </Text>

            <Feather
              name={rotaEmEdicaoId ? "check-circle" : "plus-circle"}
              size={18}
              color="#041018"
            />
          </Pressable>

          {rotaEmEdicaoId ? (
            <Pressable
              style={styles.cancelEditButton}
              onPress={handleCancelarEdicao}
            >
              <Text style={styles.cancelEditButtonText}>CANCELAR EDIÇÃO</Text>
              <Feather name="x-circle" size={16} color="#71828D" />
            </Pressable>
          ) : null}
        </View>

        {/* ================================
            LISTA DE ROTAS CADASTRADAS
        ================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ROTAS CADASTRADAS</Text>

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
                  <Text style={styles.tripLabel}>{rota.terminal}</Text>

                  <Text style={styles.routeCardTitle}>{rota.nome}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <Pressable hitSlop={10} onPress={() => handleIniciarEdicao(rota)}>
                    <Feather
                      name="edit-2"
                      size={18}
                      color={rotaEmEdicaoId === rota.id ? "#22D3EE" : "#71828D"}
                    />
                  </Pressable>

                  <Pressable hitSlop={10} onPress={() => handleAbrirConfirmacaoExclusao(rota)}>
                    <Feather name="trash-2" size={18} color="#71828D" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.tripLine}>
                <View style={styles.lineDot} />

                <View style={styles.line} />

                <View style={styles.lineDot} />
              </View>

              <View style={styles.tripBottom}>
                <View>
                  <Text style={styles.tripInfoLabel}>ORIGEM</Text>

                  <Text style={styles.routeCardValue}>{rota.origemNome}</Text>
                </View>

                <View style={styles.tripRight}>
                  <Text style={styles.tripInfoLabel}>DESTINO</Text>

                  <Text style={styles.routeCardValue}>{rota.destinoNome}</Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <Feather name="clock" size={12} color="#22D3EE" />

                <Text style={styles.timeText}>
                  {rota.tempoEstimadoMin} min · {rota.distanciaMetros} m ·{" "}
                  {rota.modoDeslocamento}
                </Text>
              </View>

              {rota.criadoPor ? (
                <View style={[styles.timeRow, { marginTop: 4 }]}>
                  <Feather name="user" size={12} color="#71828D" />
                  <Text style={[styles.timeText, { color: "#71828D" }]}>
                    Cadastrado por: {rota.criadoPor}
                  </Text>
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* ==================================================
          MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (SEM ALERT)
      ================================================== */}
      <Modal
        visible={!!rotaParaExcluir}
        transparent
        animationType="fade"
        onRequestClose={handleCancelarExclusao}
      >
        <Pressable
          style={styles.confirmModalOverlay}
          onPress={handleCancelarExclusao}
        >
          <Pressable
            style={styles.confirmModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.confirmWarningIcon}>
              <Feather name="trash-2" size={26} color="#F87171" />
            </View>

            <Text style={styles.confirmModalTitle}>
              Deseja excluir esta rota?
            </Text>

            <Text style={styles.confirmModalSubtitle}>
              {rotaParaExcluir
                ? `A rota "${rotaParaExcluir.nome}" (${rotaParaExcluir.terminal}) será apagada permanentemente.`
                : "Esta rota será apagada permanentemente."}
            </Text>

            <Pressable
              style={styles.confirmDeleteButton}
              onPress={handleConfirmarExclusao}
            >
              <Text style={styles.confirmDeleteButtonText}>
                SIM, EXCLUIR ROTA
              </Text>
            </Pressable>

            <Pressable
              style={styles.confirmCancelButton}
              onPress={handleCancelarExclusao}
            >
              <Text style={styles.confirmCancelButtonText}>
                CANCELAR
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ==================================================
          HOTBAR DE NAVEGAÇÃO
      ================================================== */}

      <View style={styles.hotbarContainer}>
        <View style={styles.hotbar}>
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("Dashboard")}>
            <Feather name="home" size={22} color="#71828D" />
            <Text style={styles.navText}>Home</Text>
          </Pressable>

          <Pressable
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate("Rotas")}
          >
            <Feather name="map" size={22} color="#22D3EE" />
            <Text style={styles.activeNavText}>Rotas</Text>
            <View style={styles.activeIndicator} />
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate("API")}>
            <Feather name="server" size={22} color="#71828D" />
            <Text style={styles.navText}>API</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate("Sair")}>
            <Feather name="log-out" size={22} color="#71828D" />
            <Text style={styles.navText}>SAIR</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0E" },

  content: { paddingHorizontal: 21, paddingTop: 25, paddingBottom: 125 },

  topBar: { marginBottom: 30 },

  smallText: { fontSize: 8, fontWeight: "900", letterSpacing: 2, color: "#22D3EE" },

  greeting: { marginTop: 7, fontSize: 27, fontWeight: "800", color: "#FFFFFF" },

  sectionHeader: {
    marginTop: 31,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: { fontSize: 8, fontWeight: "900", letterSpacing: 2, color: "#536873" },

  sectionNumber: { fontSize: 8, fontWeight: "900", color: "#344851" },

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

  inputRow: { flexDirection: "row", gap: 12 },

  inputHalf: { flex: 1 },

  // ================================
  // SELETOR (dropdown)
  // ================================

  selectorBox: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "#0A1015",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectorBoxDisabled: {
    opacity: 0.5,
  },

  campoComErro: {
    borderColor: "#F87171",
  },

  erroText: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    color: "#F87171",
  },

  selectorText: { fontSize: 13, color: "#FFFFFF" },

  selectorPlaceholder: { fontSize: 13, color: "#506671" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#10181F",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 19,
    paddingTop: 18,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#71828D",
  },

  optionSeparator: { height: 1, backgroundColor: "rgba(255,255,255,0.06)" },

  optionItem: { paddingVertical: 14 },

  optionText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },

  optionSubtext: { marginTop: 3, fontSize: 11, color: "#536873" },

  // ================================
  // CARD DE ESTIMATIVA AUTOMÁTICA
  // ================================

  infoCard: {
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#20343F",
    backgroundColor: "#0A1015",
  },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 7 },

  infoValue: { fontSize: 13, fontWeight: "800", color: "#FFFFFF" },

  infoSublabel: { marginTop: 6, fontSize: 10, color: "#536873" },

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

  saveButtonText: { fontSize: 9, fontWeight: "900", letterSpacing: 1.5, color: "#041018" },

  cancelEditButton: {
    height: 46,
    marginTop: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cancelEditButtonText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#71828D",
  },

  emptyCard: {
    padding: 22,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
    alignItems: "center",
    gap: 8,
  },

  emptyText: { fontSize: 11, color: "#536873", textAlign: "center" },

  routeCard: {
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#10181F",
    marginBottom: 12,
  },

  routeCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },

  tripLabel: { fontSize: 7, fontWeight: "900", letterSpacing: 1.5, color: "#22D3EE" },

  routeCardTitle: { marginTop: 5, fontSize: 16, fontWeight: "800", color: "#FFFFFF" },

  tripLine: { marginVertical: 18, flexDirection: "row", alignItems: "center" },

  lineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22D3EE" },

  line: { flex: 1, height: 1, marginHorizontal: 8, backgroundColor: "#263943" },

  tripBottom: { flexDirection: "row", justifyContent: "space-between" },

  tripInfoLabel: { fontSize: 7, fontWeight: "900", letterSpacing: 1.2, color: "#506671" },

  routeCardValue: { marginTop: 5, fontSize: 13, fontWeight: "800", color: "#FFFFFF" },

  tripRight: { alignItems: "flex-end" },

  timeRow: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 6 },

  timeText: { fontSize: 9, fontWeight: "700", color: "#718793" },

  hotbarContainer: { position: "absolute", left: 17, right: 17, bottom: 12 },

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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 12,
  },

  navItem: { height: 69, flex: 1, alignItems: "center", justifyContent: "center", position: "relative" },

  activeNavItem: { backgroundColor: "rgba(34,211,238,0.055)", borderRadius: 18, marginVertical: 5 },

  navText: { marginTop: 5, fontSize: 9, fontWeight: "700", color: "#71828D" },

  activeNavText: { marginTop: 5, fontSize: 9, fontWeight: "800", color: "#22D3EE" },

  activeIndicator: { position: "absolute", bottom: 4, width: 20, height: 2, borderRadius: 2, backgroundColor: "#22D3EE" },

  // ================================
  // MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
  // ================================

  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  confirmModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#10181F",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },

  confirmWarningIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.2)",
    backgroundColor: "rgba(248, 113, 113, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  confirmModalSubtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 12,
    lineHeight: 18,
    color: "#71828D",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  confirmDeleteButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  confirmDeleteButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#FFFFFF",
  },

  confirmCancelButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#263943",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmCancelButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#718793",
  },
});