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
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(20)).current;

  const orbOne = useRef(new Animated.Value(0)).current;
  const orbTwo = useRef(new Animated.Value(0)).current;
  const orbThree = useRef(new Animated.Value(0)).current;

  const routeProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 38,
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 900,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(contentY, {
        toValue: 0,
        duration: 900,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(routeProgress, {
        toValue: 1,
        duration: 1300,
        delay: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(orbOne, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orbOne, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),

      Animated.loop(
        Animated.sequence([
          Animated.timing(orbTwo, {
            toValue: 1,
            duration: 2800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orbTwo, {
            toValue: 0,
            duration: 2800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),

      Animated.loop(
        Animated.sequence([
          Animated.timing(orbThree, {
            toValue: 1,
            duration: 3200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orbThree, {
            toValue: 0,
            duration: 3200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 5600);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  const orbOneY = orbOne.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const orbTwoY = orbTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  const orbThreeY = orbThree.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const routeWidth = routeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/backsplash.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />

        {/* Luzes ambientais */}
        <Animated.View
          style={[
            styles.orb,
            styles.orbBlue,
            {
              transform: [{ translateY: orbOneY }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.orb,
            styles.orbViolet,
            {
              transform: [{ translateY: orbTwoY }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.orb,
            styles.orbCyan,
            {
              transform: [{ translateY: orbThreeY }],
            },
          ]}
        />

        {/* brilho central */}
        <View style={styles.centerGlow} />

        {/* topo */}
        <View style={styles.topBar}>
          <Text style={styles.topBrand}>
            AEROPASSO
          </Text>

          <Text style={styles.topMeta}>
            01
          </Text>
        </View>

        {/* conteúdo */}
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/aeropasso.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentY }],
              },
            ]}
          >
            <Text style={styles.brand}>
              AeroPasso
            </Text>

            <Text style={styles.subtitle}>
              Seu caminho começa aqui.
            </Text>

            <View style={styles.route}>
              <Animated.View
                style={[
                  styles.routeFill,
                  {
                    width: routeWidth,
                  },
                ]}
              />

              <View style={styles.routeEnd} />
            </View>
          </Animated.View>
        </View>

        {/* rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ROTAS PARA AEROPORTOS
          </Text>

          <Text style={styles.footerVersion}>
            2026
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0E",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 8, 18, 0.60)",
  },

  orb: {
    position: "absolute",
    borderRadius: 999,
  },

  orbBlue: {
    width: 210,
    height: 210,
    backgroundColor: "rgba(35, 105, 255, 0.13)",
    top: 90,
    left: -80,
  },

  orbViolet: {
    width: 260,
    height: 260,
    backgroundColor: "rgba(125, 76, 255, 0.10)",
    bottom: 80,
    right: -130,
  },

  orbCyan: {
    width: 160,
    height: 160,
    backgroundColor: "rgba(34, 211, 238, 0.10)",
    top: "42%",
    right: -80,
  },

  centerGlow: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(34, 211, 238, 0.045)",
    top: "38%",
    left: "50%",
    marginLeft: -115,
    marginTop: -115,
  },

  topBar: {
    position: "absolute",
    top: 56,
    left: 27,
    right: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topBrand: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#FFFFFF",
  },

  topMeta: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#8AA0AE",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    width: 145,
    height: 145,
    marginBottom: 10,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    alignItems: "center",
  },

  brand: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1.4,
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: "500",
    color: "#B4C7D0",
  },

  route: {
    width: 120,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
  },

  routeFill: {
    height: 2,
    backgroundColor: "#22D3EE",
  },

  routeEnd: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22D3EE",
    marginLeft: 4,
  },

  footer: {
    position: "absolute",
    left: 27,
    right: 27,
    bottom: 31,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.9,
    color: "#A0B3BC",
  },

  footerVersion: {
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#627580",
  },
});