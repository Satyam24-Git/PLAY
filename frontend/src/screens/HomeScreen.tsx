import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
          <Text style={[Typography.headline, { marginTop: 20, marginBottom: 8 }]}>
            You're all set!
          </Text>
          <Text style={[Typography.callout, { color: Colors.textSecondary, textAlign: 'center' }]}>
            Welcome to PPLAY.{'\n'}Your journey starts here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
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
  badge: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 28, color: Colors.primary },
});
