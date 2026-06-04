import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function SplashAnimScreen({ onFinish }: Props) {
  // ── Animated values ────────────────────────────────────────────────────────
  const logoScale   = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const heartScale  = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTransY  = useRef(new Animated.Value(20)).current;
  const taglineOp   = useRef(new Animated.Value(0)).current;
  const ring1Scale  = useRef(new Animated.Value(1)).current;
  const ring1Opacity= useRef(new Animated.Value(0.6)).current;
  const ring2Scale  = useRef(new Animated.Value(1)).current;
  const ring2Opacity= useRef(new Animated.Value(0.4)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // ── Heart pulse loop ───────────────────────────────────────────────────────
  const startHeartbeat = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.18, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1,    duration: 300, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1.10, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1,    duration: 200, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
        Animated.delay(700),
      ])
    ).start();
  };

  // ── Ripple rings ──────────────────────────────────────────────────────────
  const startRipple = () => {
    const pulse = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale,   { toValue: 2.2, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0,   duration: 1200, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale,   { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();

    pulse(ring1Scale, ring1Opacity, 0);
    pulse(ring2Scale, ring2Opacity, 600);
  };

  useEffect(() => {
    // 1. Logo entry
    Animated.spring(logoScale, {
      toValue: 1, friction: 5, tension: 80, useNativeDriver: true,
    }).start();
    Animated.timing(logoOpacity, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();

    // 2. Start heartbeat + ripple immediately
    startHeartbeat();
    startRipple();

    // 3. App name slides up
    Animated.sequence([
      Animated.delay(350),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(textTransY,  { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();

    // 4. Tagline fades in
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(taglineOp, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // 5. Fade out + callback
    Animated.sequence([
      Animated.delay(2600),
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.wrapper, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={['#1e3a8a', '#1e40af', '#0891b2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles background */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.center}>
        {/* Ripple rings */}
        <Animated.View style={[
          styles.ring,
          { transform: [{ scale: ring1Scale }], opacity: ring1Opacity },
        ]} />
        <Animated.View style={[
          styles.ring,
          { transform: [{ scale: ring2Scale }], opacity: ring2Opacity },
        ]} />

        {/* Logo circle */}
        <Animated.View style={[
          styles.logoCircle,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name="heart" size={48} color="#fff" />
          </Animated.View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[
          styles.appName,
          { opacity: textOpacity, transform: [{ translateY: textTransY }] },
        ]}>
          MediCitas
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOp }]}>
          Tu salud, siempre a tiempo
        </Animated.Text>
      </View>

      {/* Bottom loading dots */}
      <LoadingDots />
    </Animated.View>
  );
}

// ── Animated loading dots ──────────────────────────────────────────────────
function LoadingDots() {
  const dots = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1,   duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();

    dots.forEach((d, i) => animate(d, i * 200));
  }, []);

  return (
    <View style={styles.dotsRow}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bgCircle1:  {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.04)', top: -80, right: -100,
  },
  bgCircle2:  {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: 20, left: -80,
  },
  center:     { alignItems: 'center', justifyContent: 'center' },
  ring:       {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  logoCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 24,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  appName:    {
    fontSize: 40, fontWeight: '800', color: '#fff',
    letterSpacing: 1, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline:    { fontSize: 15, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5 },
  dotsRow:    {
    position: 'absolute', bottom: 60,
    flexDirection: 'row', gap: 10,
  },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.8)' },
});
