import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from '../components/ScreenBackground';

const PARTICLES = 16;
const RADIUS = 90;

const ConfettiParticle = ({ index, progress }: { index: number, progress: Animated.Value }) => {
  const angle = (index * (360 / PARTICLES)) * (Math.PI / 180);
  
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.cos(angle) * RADIUS]
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.sin(angle) * RADIUS]
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1, 0]
  });
  
  const scale = progress.interpolate({
     inputRange: [0, 0.5, 1],
     outputRange: [0.5, 1.2, 0.5]
  });

  const colors = [Colors.primary, '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF'];
  const color = colors[index % colors.length];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: index % 2 === 0 ? 5 : 2, // Mix circles and rounded squares
        backgroundColor: color,
        transform: [{ translateX }, { translateY }, { scale }],
        opacity,
      }}
    />
  );
};

export default function AllSetScreen({ navigation }: any) {
  const { isMobile } = useResponsive();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(-90)).current; // Fixed: Start at -90 deg or 0 to animate properly
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0, // Rotate to 0 degrees to be straight
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home after some delay
    const timer = setTimeout(() => {
      if (navigation) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [-90, 0],
    outputRange: ['-90deg', '0deg']
  });

  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      {!isMobile && <ScreenBackground />}
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {Array.from({ length: PARTICLES }).map((_, i) => (
                <ConfettiParticle key={i} index={i} progress={confettiAnim} />
              ))}
              <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }, { rotate: spin }] }]}>
                <Text style={styles.badgeText}>✓</Text>
              </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
              <Text style={[Typography.headline, styles.title, isMobile && styles.titleMobile]}>
                You're all set!
              </Text>
              <Text style={[Typography.callout, styles.subtitle]}>
                Welcome to PPLAY.{'\n'}Your journey starts here.
              </Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    width: '100%', maxWidth: 420,
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 28, paddingVertical: 40,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 6,
  },
  cardMobile: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  badge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 40, color: Colors.primary, fontWeight: 'bold' },
  title: {
    marginTop: 24, marginBottom: 8,
    color: Colors.textPrimary,
  },
  titleMobile: {
    color: '#FFF',
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
