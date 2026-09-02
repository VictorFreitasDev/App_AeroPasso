import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplashScreen({ navigation }: any) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.82)).current;
  const translateY = useRef(new Animated.Value(35)).current;

  const lightX = useRef(new Animated.Value(-1)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 1300,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      Animated.timing(lightX, {
        toValue: 1,
        duration: 1800,
        delay: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  const lightTranslate = lightX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-450, 450],
  });

  const animatedLineWidth = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>

      {/* BACKGROUND DO AEROPORTO */}
      <ImageBackground
        source={require("../../assets/images/backsplash.png")}
        style={styles.background}
        resizeMode="cover"
      >

        {/* Escurecimento geral para melhorar a leitura */}
        <View style={styles.darkOverlay} />

        {/* Degradê azul inspirado na identidade do AeroPasso */}
        <View style={styles.blueOverlay} />

        {/* Brilho azul */}
        <View style={styles.blueGlow} />

        {/* Feixe de luz animado */}
        <Animated.View
          style={[
            styles.lightBeam,
            {
              transform: [
                {
                  translateX: lightTranslate,
                },
                {
                  rotate: "-25deg",
                },
              ],
            },
          ]}
        />

        {/* TEXTO SUPERIOR */}
        <Animated.View
          style={[
            styles.topContent,
            {
              opacity,
            },
          ]}
        >
          <View style={styles.statusDot} />

          <Text style={styles.topText}>
            SEU CAMINHO PELO AEROPORTO
          </Text>
        </Animated.View>

        {/* LOGO */}
        <Animated.View
          style={[
            styles.logoArea,
            {
              opacity,
              transform: [
                {
                  scale,
                },
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <View style={styles.logoGlow} />

          <Image
            source={require("../../assets/images/aeropasso.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* NOME */}
        <Animated.View
          style={[
            styles.brandArea,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <Text style={styles.brand}>
            AeroPasso
          </Text>

          <Text style={styles.description}>
            ROTAS PARA AEROPORTOS
          </Text>
        </Animated.View>

        {/* LINHA ANIMADA */}
        <View style={styles.lineContainer}>
          <Animated.View
            style={[
              styles.line,
              {
                width: animatedLineWidth,
              },
            ]}
          />
        </View>

        {/* RODAPÉ */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity,
            },
          ]}
        >
          <Text style={styles.footerText}>
            AEROPASSO
          </Text>

          <Text style={styles.version}>
            01
          </Text>
        </Animated.View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#031B5B",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  /*
   * Camada escura.
   * Deixa a foto mais elegante e permite
   * que a logo apareça com mais força.
   */
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 8, 30, 0.48)",
  },

  /*
   * Azul da identidade visual do AeroPasso.
   */
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 55, 150, 0.16)",
  },

  blueGlow: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: "#00BFFF",
    opacity: 0.08,
    top: -200,
    right: -180,
  },

  lightBeam: {
    position: "absolute",
    width: 90,
    height: "150%",
    backgroundColor: "#FFFFFF",
    opacity: 0.025,
  },

  /*
   * TEXTO SUPERIOR
   */
  topContent: {
    position: "absolute",
    top: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22D3EE",
    marginRight: 9,
  },

  topText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2.2,
    color: "#D5F6FF",
  },

  /*
   * LOGO
   */
  logoArea: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#00D5FF",
    opacity: 0.13,
  },

  logo: {
    width: 250,
    height: 250,
  },

  /*
   * MARCA
   */
  brandArea: {
    alignItems: "center",
    marginTop: -15,
  },

  brand: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",

    // Pequena sombra para separar da fotografia
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },

  description: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3.2,
    color: "#B9EEFF",

    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 5,
  },

  /*
   * LINHA
   */
  lineContainer: {
    position: "absolute",
    bottom: 90,
    width: 100,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },

  line: {
    height: 1,
    backgroundColor: "#22D3EE",
  },

  /*
   * RODAPÉ
   */
  footer: {
    position: "absolute",
    bottom: 35,
    width: "82%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.65)",
  },

  version: {
    fontSize: 8,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
});