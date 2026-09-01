import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplashScreen({ navigation }: any) {
  // ==========================================
  // ANIMAÇÕES
  // ==========================================

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(60)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  const routeProgress = useRef(new Animated.Value(0)).current;

  const planeX = useRef(new Animated.Value(0)).current;
  const planeY = useRef(new Animated.Value(0)).current;

  const glowOpacity = useRef(new Animated.Value(0)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    // ==========================================
    // ENTRADA DA LOGO
    // ==========================================

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(logoTranslate, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // ==========================================
    // TEXTO
    // ==========================================

    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 700,
        useNativeDriver: true,
      }),

      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 800,
        delay: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // ==========================================
    // ROTA DO AVIÃO
    // ==========================================

    Animated.timing(routeProgress, {
      toValue: 1,
      duration: 2200,
      delay: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // ==========================================
    // MOVIMENTO DO AVIÃO
    // ==========================================

    Animated.parallel([
      Animated.timing(planeX, {
        toValue: 1,
        duration: 2200,
        delay: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(planeY, {
        toValue: -1,
        duration: 2200,
        delay: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // ==========================================
    // IR PARA LOGIN
    // ==========================================

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  // ==========================================
  // POSIÇÃO DO AVIÃO
  // ==========================================

  const airplaneTranslateX = planeX.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  const airplaneTranslateY = planeY.interpolate({
    inputRange: [-1, 0],
    outputRange: [-35, 35],
  });

  // ==========================================
  // ROTA ANIMADA
  // ==========================================

  const routeWidth = routeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <View style={styles.container}>

      {/* ======================================
          FUNDO
      ======================================= */}

      <View style={styles.backgroundTop} />
      <View style={styles.backgroundBottom} />

      {/* ======================================
          ESTRELAS / PARTÍCULAS
      ======================================= */}

      <View style={[styles.star, styles.star1]} />
      <View style={[styles.star, styles.star2]} />
      <View style={[styles.star, styles.star3]} />
      <View style={[styles.star, styles.star4]} />
      <View style={[styles.star, styles.star5]} />
      <View style={[styles.star, styles.star6]} />

      {/* ======================================
          TEXTO SUPERIOR
      ======================================= */}

      <Animated.Text
        style={[
          styles.topLabel,
          {
            opacity: textOpacity,
          },
        ]}
      >
        SUA PRÓXIMA JORNADA
      </Animated.Text>

      {/* ======================================
          ROTA
      ======================================= */}

      <View style={styles.routeContainer}>

        {/* ponto inicial */}

        <View style={styles.startPoint} />

        {/* linha */}

        <View style={styles.routeTrack}>
          <Animated.View
            style={[
              styles.routeLine,
              {
                width: routeWidth,
              },
            ]}
          />
        </View>

        {/* destino */}

        <View style={styles.destinationPoint}>
          <View style={styles.destinationInner} />
        </View>

        {/* avião */}

        <Animated.View
          style={[
            styles.airplane,
            {
              transform: [
                {
                  translateX: airplaneTranslateX,
                },
                {
                  translateY: airplaneTranslateY,
                },
                {
                  rotate: "-18deg",
                },
              ],
            },
          ]}
        >
          <Text style={styles.airplaneIcon}>✈</Text>
        </Animated.View>

      </View>

      {/* ======================================
          BRILHO ATRÁS DA LOGO
      ======================================= */}

      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
          },
        ]}
      />

      {/* ======================================
          LOGO
      ======================================= */}

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              {
                translateY: logoTranslate,
              },
              {
                scale: logoScale,
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/aeropasso.png")}
          style={styles.logo}
        />
      </Animated.View>

      {/* ======================================
          TEXTO PRINCIPAL
      ======================================= */}

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [
              {
                translateY: textTranslate,
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>
          AeroPasso
        </Text>

        <Text style={styles.subtitle}>
          Viaje. Explore. Viva.
        </Text>
      </Animated.View>

      {/* ======================================
          LOCALIZAÇÃO
      ======================================= */}

      <Animated.View
        style={[
          styles.locationContainer,
          {
            opacity: textOpacity,
          },
        ]}
      >
        <View style={styles.locationDot} />

        <Text style={styles.locationText}>
          DESTINO: O MUNDO
        </Text>
      </Animated.View>

      {/* ======================================
          RODAPÉ
      ======================================= */}

      <Text style={styles.footer}>
        PREPARANDO SUA EXPERIÊNCIA
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  // ==========================================
  // CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: "#07111F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // ==========================================
  // FUNDO
  // ==========================================

  backgroundTop: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#123B62",
    opacity: 0.18,
    top: -300,
    left: -200,
  },

  backgroundBottom: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "#006E9C",
    opacity: 0.10,
    bottom: -400,
    right: -250,
  },

  // ==========================================
  // ESTRELAS
  // ==========================================

  star: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#BDEFFF",
    opacity: 0.6,
  },

  star1: {
    top: "14%",
    left: "18%",
  },

  star2: {
    top: "24%",
    right: "20%",
    width: 2,
    height: 2,
  },

  star3: {
    top: "38%",
    left: "10%",
    width: 2,
    height: 2,
  },

  star4: {
    top: "55%",
    right: "12%",
  },

  star5: {
    top: "70%",
    left: "20%",
    width: 2,
    height: 2,
  },

  star6: {
    top: "80%",
    right: "25%",
    width: 2,
    height: 2,
  },

  // ==========================================
  // TEXTO SUPERIOR
  // ==========================================

  topLabel: {
    position: "absolute",
    top: 70,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#6FCBEA",
  },

  // ==========================================
  // ROTA
  // ==========================================

  routeContainer: {
    position: "absolute",
    top: "25%",
    width: 300,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  startPoint: {
    position: "absolute",
    left: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  destinationPoint: {
    position: "absolute",
    right: 20,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#28D7FF",
    alignItems: "center",
    justifyContent: "center",
  },

  destinationInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#28D7FF",
  },

  routeTrack: {
    width: 240,
    height: 2,
    overflow: "hidden",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#24516A",
  },

  routeLine: {
    height: 2,
    backgroundColor: "#28D7FF",
  },

  // ==========================================
  // AVIÃO
  // ==========================================

  airplane: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  airplaneIcon: {
    fontSize: 28,
    color: "#FFFFFF",
  },

  // ==========================================
  // BRILHO
  // ==========================================

  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#00CFFF",
    opacity: 0.08,
  },

  // ==========================================
  // LOGO
  // ==========================================

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },

  // ==========================================
  // TEXTOS
  // ==========================================

  textContainer: {
    alignItems: "center",
    marginTop: -10,
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 1,
    color: "#8DA7BA",
  },

  // ==========================================
  // DESTINO
  // ==========================================

  locationContainer: {
    position: "absolute",
    bottom: 105,
    flexDirection: "row",
    alignItems: "center",
  },

  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#28D7FF",
    marginRight: 8,
  },

  locationText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#6F8798",
  },

  // ==========================================
  // RODAPÉ
  // ==========================================

  footer: {
    position: "absolute",
    bottom: 35,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#435665",
  },

});
