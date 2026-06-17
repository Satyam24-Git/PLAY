import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';

export default function TermsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[Typography.title2, { color: theme.text }]}>Terms & Conditions</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.body, { color: theme.text, marginBottom: 16 }]}>
            Welcome to PPLAY. These Terms & Conditions govern your use of our mobile application and related services.
          </Text>
          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>1. Acceptance of Terms</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            By accessing or using PPLAY, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
          </Text>
          
          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>2. User Accounts</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
          </Text>
          
          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>3. Community Guidelines</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16 }]}>
            Users are expected to maintain respectful behavior towards others. Harassment, hate speech, or inappropriate conduct at games or in-app will result in account termination.
          </Text>

          <Text style={[Typography.title2, { color: theme.text, marginTop: 16, marginBottom: 8 }]}>4. Liability</Text>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 32 }]}>
            PPLAY acts as a platform to connect players. We are not liable for any injuries, damages, or disputes that may occur during organized events or games.
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
