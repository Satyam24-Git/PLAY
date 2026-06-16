import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Animated, Easing, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from '../components/ScreenBackground';

const SPORTS = [
  { id: 'cricket',    label: 'Cricket',    icon: '🏏' },
  { id: 'football',   label: 'Football',   icon: '⚽' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
  { id: 'badminton',  label: 'Badminton',  icon: '🏸' },
  { id: 'tennis',     label: 'Tennis',     icon: '🎾' },
  { id: 'swimming',   label: 'Swimming',   icon: '🏊' },
  { id: 'kabaddi',    label: 'Kabaddi',    icon: '🤼' },
  { id: 'hockey',     label: 'Hockey',     icon: '🏑' },
  { id: 'volleyball', label: 'Volleyball', icon: '🏐' },
  { id: 'athletics',  label: 'Athletics',  icon: '🏃' },
  { id: 'cycling',    label: 'Cycling',    icon: '🚴' },
  { id: 'boxing',     label: 'Boxing',     icon: '🥊' },
];

const STATES: Record<string, string[]> = {
  'Maharashtra':   ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Delhi':         ['New Delhi', 'Dwarka', 'Rohini', 'Saket'],
  'Karnataka':     ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
  'Tamil Nadu':    ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Gujarat':       ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Telangana':     ['Hyderabad', 'Warangal', 'Karimnagar'],
  'Rajasthan':     ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
  'West Bengal':   ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'],
  'Punjab':        ['Chandigarh', 'Ludhiana', 'Amritsar', 'Patiala'],
};

function PickerModal({ visible, title, options, selected, onSelect, onClose }: {
  visible: boolean; title: string; options: string[];
  selected: string; onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={ms.overlay} onPress={onClose} activeOpacity={1}>
        <View style={ms.sheet}>
          <View style={ms.handle} />
          <Text style={[Typography.headline, ms.sheetTitle]}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => <View style={ms.sep} />}
            renderItem={({ item }) => (
              <TouchableOpacity style={ms.option} onPress={() => { onSelect(item); onClose(); }}>
                <Text style={[Typography.body, item === selected && ms.optSel]}>{item}</Text>
                {item === selected && <Text style={ms.check}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function InterestsScreen({ navigation }: any) {
  const { isMobile } = useResponsive();
  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [stateModal, setStateModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSport = (id: string) => {
    setSelectedSports((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
    setErrors((e) => ({ ...e, sports: '' }));
  };

  const handleFinish = () => {
    setLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
    setTimeout(() => { setLoading(false); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); }, 1500);
  };

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim()) { setErrors({ name: 'Please enter your name.' }); return; }
    } else if (step === 1) {
      if (selectedSports.length === 0) { setErrors({ sports: 'Pick at least one sport.' }); return; }
    } else if (step === 2) {
      if (!selectedState) { setErrors({ state: 'Please select your state.' }); return; }
      if (!selectedCity) { setErrors({ city: 'Please select your city.' }); return; }
      handleFinish();
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true })
    ]).start(() => {
      setStep(s => s + 1);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true })
      ]).start();
    });
  };

  const handleBackStep = () => {
    if (step > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 20, duration: 150, useNativeDriver: true })
      ]).start(() => {
        setStep(s => s - 1);
        slideAnim.setValue(-20);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start();
      });
    } else {
      navigation.goBack();
    }
  };

  const STEP_CONFIG = [
    { title: "HELLO PLAYER", subtitle: "Who are you?" },
    { title: "Your Interests", subtitle: "What do you love to play?" },
    { title: "Location", subtitle: "Where do you play?" }
  ];


  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {!isMobile && <ScreenBackground />}
      <SafeAreaView style={styles.safe}>
      <PickerModal
        visible={stateModal} title="Select State"
        options={Object.keys(STATES)} selected={selectedState}
        onSelect={(s) => { setSelectedState(s); setSelectedCity(''); setErrors((e) => ({ ...e, state: '', city: '' })); }}
        onClose={() => setStateModal(false)}
      />
      <PickerModal
        visible={cityModal} title="Select City"
        options={selectedState ? STATES[selectedState] : []} selected={selectedCity}
        onSelect={(c) => { setSelectedCity(c); setErrors((e) => ({ ...e, city: '' })); }}
        onClose={() => setCityModal(false)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.outer, isMobile && styles.outerMobile]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.mobileTitle}>{STEP_CONFIG[step].title}</Text>
            <View style={styles.stepRowMobile}>
              <View style={[styles.step, step >= 0 && styles.stepActive]} />
              <View style={[styles.step, step >= 1 && styles.stepActive]} />
              <View style={[styles.step, step >= 2 && styles.stepActive]} />
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

              <View>
                <Text style={styles.leftTitle}>{STEP_CONFIG[step].title.replace(' ', '\n')}</Text>
                <Text style={styles.leftSubtitle}>{STEP_CONFIG[step].subtitle}</Text>
                {selectedSports.length > 0 && (
                  <View style={styles.previewChips}>
                    {selectedSports.slice(0, 5).map((id) => {
                      const s = SPORTS.find((sp) => sp.id === id);
                      return s ? (
                        <View key={id} style={styles.previewChip}>
                          <Text style={styles.previewIcon}>{s.icon}</Text>
                        </View>
                      ) : null;
                    })}
                    {selectedSports.length > 5 && (
                      <View style={styles.previewChip}>
                        <Text style={styles.previewMore}>+{selectedSports.length - 5}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.step, step >= 0 && styles.stepActive]} />
                <View style={[styles.step, step >= 1 && styles.stepActive]} />
                <View style={[styles.step, step >= 2 && styles.stepActive]} />
              </View>
            </View>
          )}

          {/* ── DIVIDER ── */}
          {!isMobile && <View style={styles.dividerV} />}

          {/* ── RIGHT / BOTTOM PANEL (scrollable) ── */}
          <ScrollView
            style={styles.rightScroll}
            contentContainerStyle={[styles.rightPanel, isMobile && styles.rightPanelMobile]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <TouchableOpacity style={styles.backBtn} onPress={handleBackStep}>
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backLabel}>Back</Text>
            </TouchableOpacity>

            <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
              <Text style={[Typography.headline, styles.formTitle]}>{STEP_CONFIG[step].title}</Text>
              <Text style={[Typography.callout, styles.formSubtitle]}>{STEP_CONFIG[step].subtitle}</Text>

              {step === 0 && (
                <View style={styles.stepContainer}>
                  <Text style={[Typography.label, styles.fieldLabel]}>Your Name</Text>
                  <View style={[styles.inputRow, nameFocused && styles.inputFocused, !!errors.name && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full name"
                      placeholderTextColor={Colors.placeholder}
                      value={name}
                      onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: '' })); }}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      autoCapitalize="words"
                      onSubmitEditing={handleNext}
                    />
                  </View>
                  {!!errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>
              )}

              {step === 1 && (
                <View style={styles.stepContainer}>
                  <Text style={[Typography.label, styles.fieldLabel]}>Sports Interests</Text>
                  <Text style={[Typography.caption, { color: Colors.textTertiary, marginBottom: 10 }]}>Select all that apply</Text>
                  <View style={styles.chipGrid}>
                    {SPORTS.map((sport) => {
                      const active = selectedSports.includes(sport.id);
                      return (
                        <TouchableOpacity
                          key={sport.id}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggleSport(sport.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.chipIcon}>{sport.icon}</Text>
                          <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{sport.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {!!errors.sports && <Text style={styles.errorText}>{errors.sports}</Text>}
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContainer}>
                  <Text style={[Typography.label, styles.fieldLabel]}>Location</Text>
                  <View style={styles.locationRow}>
                    <TouchableOpacity
                      style={[styles.picker, !!errors.state && styles.inputError]}
                      onPress={() => setStateModal(true)} activeOpacity={0.75}
                    >
                      <Text style={[styles.pickerText, !selectedState && styles.pickerPlaceholder]}>
                        {selectedState || 'State'}
                      </Text>
                      <Text style={styles.pickerArrow}>▾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.picker, !selectedState && styles.pickerDisabled, !!errors.city && styles.inputError]}
                      onPress={() => selectedState && setCityModal(true)} activeOpacity={0.75}
                    >
                      <Text style={[styles.pickerText, !selectedCity && styles.pickerPlaceholder]}>
                        {selectedCity || 'City'}
                      </Text>
                      <Text style={styles.pickerArrow}>▾</Text>
                    </TouchableOpacity>
                  </View>
                  {(!!errors.state || !!errors.city) && (
                    <Text style={styles.errorText}>{errors.state || errors.city}</Text>
                  )}
                </View>
              )}
            </Animated.View>

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginTop: 24 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.btnLoading]}
                onPress={handleNext} activeOpacity={0.85} disabled={loading}
              >
                <Text style={styles.primaryBtnText}>{step === 2 ? (loading ? 'Setting up…' : "Let's Play  →") : 'Next  →'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.52)' },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  outer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  outerMobile: { justifyContent: 'flex-end', padding: 0, alignItems: 'stretch' },

  card: {
    flexDirection: 'row',
    width: '100%', maxWidth: 860,
    backgroundColor: Colors.cardBackground,
    borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.40, shadowRadius: 48, elevation: 24,
    maxHeight: 580,
  },
  cardMobile: { flexDirection: 'column', maxHeight: undefined, borderRadius: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, flex: 0 },

  mobileHeader: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    minHeight: 250, // ensures the background image gets enough space to be seen
  },
  mobileHeaderTop: { gap: 4 },
  mobileTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -1, marginBottom: 16 },

  leftPanel: {
    width: 250,
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 32, paddingVertical: 36,
    justifyContent: 'space-between',
  },
  leftTop: { gap: 4 },
  logoCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: -1 },
  brand: { fontSize: 12, fontWeight: '700', color: Colors.primary, letterSpacing: 3, marginTop: 4 },
  leftTitle: { fontSize: 34, fontWeight: '800', color: '#FFF', letterSpacing: -1, lineHeight: 40, marginBottom: 10 },
  leftSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 19, flex: 1 },
  previewChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  previewChip: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  previewIcon: { fontSize: 16 },
  previewMore: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  stepRow: { flexDirection: 'row', gap: 6, marginTop: 24 },
  stepRowMobile: { flexDirection: 'row', gap: 6 },
  step: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepActive: { width: 22, backgroundColor: Colors.primary },

  dividerV: { width: 1, backgroundColor: Colors.border },

  rightScroll: { flex: 0 }, // flex: 0 on mobile so it takes only what it needs, but on desktop it's constrained by maxHeight
  rightPanel: { paddingHorizontal: 36, paddingVertical: 32 },
  rightPanelMobile: { paddingHorizontal: 24, paddingVertical: 32, paddingBottom: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  backIcon: { fontSize: 17, color: Colors.textSecondary },
  backLabel: { fontSize: 14, color: Colors.textSecondary },
  formTitle: { marginBottom: 4, color: Colors.textPrimary },
  formSubtitle: { color: Colors.textSecondary, marginBottom: 18 },

  stepContainer: { flex: 1, paddingBottom: 20 },
  fieldLabel: { marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, height: 48,
  },
  inputFocused: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.error },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, letterSpacing: -0.2 },
  errorText: { marginTop: 6, fontSize: 12, color: Colors.error },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 50, backgroundColor: Colors.inputBackground,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primaryBorder },
  chipIcon: { fontSize: 13 },
  chipLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  chipLabelActive: { color: Colors.primary, fontWeight: '700' },

  locationRow: { flexDirection: 'row', gap: 10 },
  picker: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, height: 48,
  },
  pickerDisabled: { opacity: 0.4 },
  pickerText: { fontSize: 14, color: Colors.textPrimary },
  pickerPlaceholder: { color: Colors.placeholder },
  pickerArrow: { fontSize: 12, color: Colors.textTertiary },

  primaryBtn: { width: '100%', height: 50, backgroundColor: Colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnLoading: { opacity: 0.7 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#000', letterSpacing: -0.2 },
});

const ms = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.cardBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 40, maxHeight: '60%' },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { paddingHorizontal: 24, marginBottom: 8 },
  sep: { height: 1, backgroundColor: Colors.border, marginHorizontal: 24 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 24 },
  optSel: { color: Colors.primary, fontWeight: '600' },
  check: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
});
