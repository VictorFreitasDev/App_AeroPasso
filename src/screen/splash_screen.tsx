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

      <View style={styles.gradientBase} />

      <View style={styles.blueGlow} />

      <View style={styles.cyanGlow} />

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
          YOUR JOURNEY STARTS HERE
        </Text>
      </Animated.View>

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
        />

      </Animated.View>

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
          VIAJE DO SEU JEITO
        </Text>

      </Animated.View>

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

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050A12",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  gradientBase: {
    position: "absolute",
    width: "130%",
    height: "130%",
    backgroundColor: "#071522",
    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },

  blueGlow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "#075B91",
    opacity: 0.13,
    top: -180,
    right: -160,
  },

  cyanGlow: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "#00D5FF",
    opacity: 0.06,
    bottom: -160,
    left: -130,
  },

  lightBeam: {
    position: "absolute",
    width: 90,
    height: "150%",
    backgroundColor: "#FFFFFF",
    opacity: 0.025,
  },

  topContent: {
    position: "absolute",
    top: 65,
    flexDirection: "row",
    alignItems: "center",
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
    letterSpacing: 2.5,
    color: "#71879A",
  },

  logoArea: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#00CFFF",
    opacity: 0.07,
  },

  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },

  brandArea: {
    alignItems: "center",
    marginTop: -15,
  },

  brand: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  description: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 4,
    color: "#6E8A9E",
  },

  lineContainer: {
    position: "absolute",
    bottom: 90,
    width: 100,
    height: 1,
    backgroundColor: "#182C3B",
    overflow: "hidden",
  },

  line: {
    height: 1,
    backgroundColor: "#22D3EE",
  },

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
    color: "#3D5566",
  },

  version: {
    fontSize: 8,
    fontWeight: "600",
    color: "#3D5566",
  },

});