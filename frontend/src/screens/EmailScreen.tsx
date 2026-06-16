import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Easing, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from '../components/ScreenBackground';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen({ navigation }: any) {
  const { isMobile } = useResponsive();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (!EMAIL_REGEX.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
    setTimeout(() => { setLoading(false); navigation.navigate('OTP', { email }); }, 1200);
  };

  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {!isMobile && <ScreenBackground />}

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[styles.outer, isMobile && styles.outerMobile]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isMobile && (
              <View style={[styles.mobileHeader, { position: 'relative', overflow: 'hidden' }]}>
                <View style={StyleSheet.absoluteFill}>
                  <ScreenBackground />
                </View>
                <View style={styles.mobileHeaderTop}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>P</Text>
                  </View>
                  <Text style={[styles.brand, { color: '#FFF' }]}>PPLAY</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={styles.mobileTitle}>Hello, Athlete.</Text>
                <View style={styles.stepRowMobile}>
                  <View style={[styles.step, styles.stepActive]} />
                  <View style={styles.step} />
                  <View style={styles.step} />
                </View>
              </View>
            )}

            <View style={[styles.card, isMobile && styles.cardMobile]}>

              {/* ── LEFT / TOP PANEL (DESKTOP ONLY) ── */}
              {!isMobile && (
                <View style={styles.leftPanel}>
                  <View style={styles.leftTop}>
                    <View style={styles.logoCircle}>
                      <Text style={styles.logoText}>P</Text>
                    </View>
                    <Text style={styles.brand}>PPLAY</Text>
                  </View>
                  <Text style={styles.leftTitle}>Hello,{'\n'}Athlete.</Text>
                  <Text style={styles.leftSubtitle}>Your sports community{'\n'}starts here.</Text>
                  <View style={styles.stepRow}>
                    <View style={[styles.step, styles.stepActive]} />
                    <View style={styles.step} />
                    <View style={styles.step} />
                  </View>
                </View>
              )}

              {/* ── DIVIDER ── */}
              {!isMobile && <View style={styles.dividerV} />}

              {/* ── RIGHT / BOTTOM PANEL ── */}
              <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
                <Text style={[Typography.headline, styles.formTitle]}>Sign in</Text>
                <Text style={[Typography.callout, styles.formSubtitle]}>
                  Enter your email to receive OTP verification.
                </Text>

                <Text style={[Typography.label, styles.fieldLabel]}>Email Address</Text>
                <View style={[styles.inputRow, focused && styles.inputFocused, !!error && styles.inputError]}>
                  <Text style={styles.inputIcon}>✉</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor={Colors.placeholder}
                    value={email}
                    onChangeText={(t) => { setEmail(t); setError(''); }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                  />
                </View>
                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginTop: 20 }}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, loading && styles.btnLoading]}
                    onPress={handleSend} activeOpacity={0.85} disabled={loading}
                  >
                    <Text style={styles.primaryBtnText}>
                      {loading ? 'Sending…' : 'Send OTP Verification  →'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}} activeOpacity={0.7}>
                  <Text style={styles.secondaryBtnText}>Back to Login</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  safe: { flex: 1 },
  flex: { flex: 1 },
  // Desktop: flexGrow+justifyContent centers the card vertically
  outer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  // Mobile: card acts as a bottom sheet over the background
  outerMobile: { justifyContent: 'flex-end', padding: 0, alignItems: 'stretch' },

  card: {
    flexDirection: 'row',
    width: '100%', maxWidth: 780,
    backgroundColor: Colors.cardBackground,
    borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.40, shadowRadius: 48, elevation: 24,
    minHeight: 420,
  },
  cardMobile: { 
    flexDirection: 'column', 
    minHeight: 0, 
    borderRadius: 0, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32,
    paddingBottom: 20, // Extra padding for safe area
  },

  mobileHeader: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  mobileHeaderTop: { gap: 4 },
  mobileTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -1, marginBottom: 16 },

  leftPanel: {
    flex: 1, minWidth: 220,
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 36, paddingVertical: 40,
    justifyContent: 'space-between',
  },
  leftTop: { gap: 4 },
  logoCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: -1 },
  brand: { fontSize: 12, fontWeight: '700', color: Colors.primary, letterSpacing: 3, marginTop: 4 },
  leftTitle: { fontSize: 38, fontWeight: '800', color: '#FFF', letterSpacing: -1, lineHeight: 44, marginBottom: 10 },
  leftSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 19, flex: 1 },
  stepRow: { flexDirection: 'row', gap: 6, marginTop: 32 },
  stepRowMobile: { flexDirection: 'row', gap: 6 },
  step: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepActive: { width: 22, backgroundColor: Colors.primary },

  dividerV: { width: 1, backgroundColor: Colors.border },

  rightPanel: { flex: 1, paddingHorizontal: 40, paddingVertical: 44, justifyContent: 'center' },
  rightPanelMobile: { paddingHorizontal: 24, paddingVertical: 36 },
  formTitle: { marginBottom: 4, color: Colors.textPrimary },
  formSubtitle: { color: Colors.textSecondary, lineHeight: 20, marginBottom: 24 },
  fieldLabel: { marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
  },
  inputFocused: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.error },
  inputIcon: { fontSize: 15, marginRight: 9, color: Colors.textTertiary },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, letterSpacing: -0.2 },
  errorText: { marginTop: 6, fontSize: 12, color: Colors.error },
  primaryBtn: {
    width: '100%', height: 50, backgroundColor: Colors.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  btnLoading: { opacity: 0.7 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#000', letterSpacing: -0.2 },
  secondaryBtn: {
    width: '100%', height: 50, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});
