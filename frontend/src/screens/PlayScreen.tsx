import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from '../components/ScreenBackground';

export default function PlayScreen() {
  const { isMobile } = useResponsive();

  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      {!isMobile && <ScreenBackground />}
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={[Typography.headline, { color: isMobile ? '#FFF' : Colors.textPrimary }]}>Play</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 10 }]}>Find matches to play</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
});
