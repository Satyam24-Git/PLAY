import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[Typography.title2, { color: theme.text }]}>Privacy Policy</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.body, { color: theme.text, marginBottom: 16 }]}>
            At PPLAY, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared.
          </Text>

          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>1. Information We Collect</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            We collect information you provide directly to us, such as your name, email address, profile photo, and sports preferences. We also collect location data to help you find nearby venues and games.
          </Text>
          
          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>2. How We Use Your Information</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            We use your information to provide, maintain, and improve our services, facilitate matchmaking with other players, and communicate with you about updates and community events.
          </Text>
          
          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>3. Sharing of Information</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            Your public profile (name, photo, interests) is visible to other players. We do not sell your personal information to third parties. We may share information with service providers who assist in operating our app.
          </Text>

          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>4. Data Security</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 32 }]}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
