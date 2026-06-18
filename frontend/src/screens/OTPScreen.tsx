import React, { useState, useRef, useEffect } from 'react';
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

import { setSession } from '../utils/auth';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPScreen({ navigation, route }: any) {
  const { isMobile } = useResponsive();
  const email: string = route?.params?.email ?? 'your email';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError('Please enter the complete 6-digit code.'); triggerShake(); return; }
    setLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
    
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: code })
      });
      
      if (!response.ok) {
        throw new Error('Invalid or expired OTP');
      }
      
      const data = await response.json();
      if (data.user && data.user.id) {
        setSession(data.user.id, data.user.email);
      }
      
      setLoading(false);
      navigation.navigate('Interests', { email });
    } catch (err) {
      setLoading(false);
      setError('Invalid code. Please try again.');
      triggerShake();
    }
  };

  const handleResend = () => {
    setSeconds(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
  };

  const filled = otp.filter(Boolean).length;
  const boxSize = isMobile ? { width: 42, height: 50 } : { width: 46, height: 54 };

  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {!isMobile && <ScreenBackground />}

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={[styles.outer, isMobile && styles.outerMobile]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {isMobile && (
              <View style={[styles.mobileHeader, { position: 'relative', overflow: 'hidden' }]}>
                <View style={StyleSheet.absoluteFill}>
                  <ScreenBackground />
                </View>
                <View style={styles.mobileHeaderTop}>
                  <View style={styles.logoCircle}><Text style={styles.logoText}>P</Text></View>
                  <Text style={[styles.brand, { color: '#FFF' }]}>PPLAY</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={styles.mobileTitle}>Enter OTP</Text>
                <View style={styles.stepRowMobile}>
                  <View style={styles.step} /><View style={[styles.step, styles.stepActive]} /><View style={styles.step} />
                </View>
              </View>
            )}

            <View style={[styles.card, isMobile && styles.cardMobile]}>

              {!isMobile && (
                <View style={styles.leftPanel}>
                  <View style={styles.leftTop}>
                    <View style={styles.logoCircle}><Text style={styles.logoText}>P</Text></View>
                    <Text style={styles.brand}>PPLAY</Text>
                  </View>
                  <Text style={styles.leftTitle}>Check your{'\n'}email.</Text>
                  <Text style={styles.leftSubtitle}>We sent a 6-digit code to{'\n'}<Text style={{ color: Colors.primary }}>{email}</Text></Text>
                  <View style={styles.stepRow}>
                    <View style={styles.step} /><View style={[styles.step, styles.stepActive]} /><View style={styles.step} />
                  </View>
                </View>
              )}

              {!isMobile && <View style={styles.dividerV} />}

              <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.backIcon}>←</Text><Text style={styles.backLabel}>Back</Text>
                </TouchableOpacity>
                <Text style={[Typography.headline, styles.formTitle]}>Enter OTP</Text>
                <Text style={[Typography.callout, styles.formSubtitle]}>
                  {isMobile ? `Code sent to ${email}` : '6-digit code · expires in 10 minutes'}
                </Text>

                <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
                  {otp.map((digit, i) => (
                    <View key={i} style={[styles.otpBox, boxSize, digit ? styles.otpBoxFilled : {}, !!error && styles.otpBoxError]}>
                      <TextInput
                        ref={(r) => { inputRefs.current[i] = r; }}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(t) => handleChange(t, i)}
                        onKeyPress={(e) => handleKeyPress(e, i)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        caretHidden
                      />
                    </View>
                  ))}
                </Animated.View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${(filled / OTP_LENGTH) * 100}%` as any }]} />
                </View>
                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginTop: 8 }}>
                  <TouchableOpacity style={[styles.primaryBtn, loading && styles.btnLoading]} onPress={handleVerify} activeOpacity={0.85} disabled={loading}>
                    <Text style={styles.primaryBtnText}>{loading ? 'Verifying…' : 'Verify Code  →'}</Text>
                  </TouchableOpacity>
                </Animated.View>

                <View style={styles.resendRow}>
                  <Text style={{ fontSize: 13, color: Colors.textTertiary }}>Didn't receive it? </Text>
                  {seconds > 0
                    ? <Text style={styles.resendTimer}>Resend in {seconds}s</Text>
                    : <TouchableOpacity onPress={handleResend}><Text style={styles.resendAction}>Resend</Text></TouchableOpacity>
                  }
                </View>
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
  bgImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.52)' },
  safe: { flex: 1 },
  flex: { flex: 1 },
  outer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  outerMobile: { justifyContent: 'flex-end', padding: 0, alignItems: 'stretch' },
  card: {
    flexDirection: 'row', width: '100%', maxWidth: 780,
    backgroundColor: Colors.cardBackground, borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.40, shadowRadius: 48, elevation: 24, minHeight: 420,
  },
  cardMobile: { flexDirection: 'column', minHeight: 0, borderRadius: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 20 },
  mobileHeader: { flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 },
  mobileHeaderTop: { gap: 4 },
  mobileTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -1, marginBottom: 16 },
  leftPanel: { flex: 1, minWidth: 220, backgroundColor: Colors.textPrimary, paddingHorizontal: 36, paddingVertical: 40, justifyContent: 'space-between' },
  leftTop: { gap: 4 },
  logoCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: -1 },
  brand: { fontSize: 12, fontWeight: '700', color: Colors.primary, letterSpacing: 3, marginTop: 4 },
  leftTitle: { fontSize: 36, fontWeight: '800', color: '#FFF', letterSpacing: -1, lineHeight: 42, marginBottom: 10 },
  leftSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 19, flex: 1 },
  stepRow: { flexDirection: 'row', gap: 6, marginTop: 32 },
  stepRowMobile: { flexDirection: 'row', gap: 6 },
  step: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepActive: { width: 22, backgroundColor: Colors.primary },
  dividerV: { width: 1, backgroundColor: Colors.border },
  rightPanel: { flex: 1, paddingHorizontal: 40, paddingVertical: 36, justifyContent: 'center' },
  rightPanelMobile: { paddingHorizontal: 24, paddingVertical: 36 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backIcon: { fontSize: 17, color: Colors.textSecondary },
  backLabel: { fontSize: 14, color: Colors.textSecondary },
  formTitle: { marginBottom: 4, color: Colors.textPrimary },
  formSubtitle: { color: Colors.textSecondary, marginBottom: 20 },
  otpRow: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  otpBox: { borderRadius: 12, backgroundColor: Colors.inputBackground, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  otpBoxError: { borderColor: Colors.error },
  otpInput: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', width: '100%', height: '100%', padding: 0 },
  progressTrack: { width: '100%', height: 2, backgroundColor: Colors.border, borderRadius: 1, marginBottom: 12 },
  progressBar: { height: 2, backgroundColor: Colors.primary, borderRadius: 1 },
  errorText: { fontSize: 12, color: Colors.error, marginBottom: 8 },
  primaryBtn: { width: '100%', height: 50, backgroundColor: Colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  btnLoading: { opacity: 0.7 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#000', letterSpacing: -0.2 },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendTimer: { fontSize: 13, color: Colors.textTertiary, fontWeight: '500' },
  resendAction: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
});
