import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Switch, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';
import { getUserId, getUserEmail } from '../utils/auth';

const INTERESTS = ['Football', 'Tennis', 'Basketball', 'Running', 'Padel', 'Cycling'];

export default function ProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [bio, setBio] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      let res = await fetch(`${API_URL}/api/profiles/${userId}`);
      
      if (res.status === 404) {
        // Create default profile
        const email = getUserEmail() || '';
        const name = email.split('@')[0] || 'Athlete';
        
        res = await fetch(`${API_URL}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, full_name: name })
        });
      }
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    const loadInitialProfile = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };
    loadInitialProfile();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, []);

  const handleGenerateBio = () => {
    setIsGeneratingBio(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setBio("Avid sports enthusiast always looking for the next challenge! Whether it's a competitive 5v5 on the turf or a casual weekend tennis match, I'm down. Catch me running at sunrise or exploring new local venues. Let's play!");
      setIsGeneratingBio(false);
    }, 1500);
  };

  const renderBasicInfo = () => (
    <View style={styles.infoSection}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.avatar} 
        />
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark" size={14} color="#000" />
        </View>
      </View>
      <Text style={[Typography.title1, styles.name, { color: theme.text }]}>{profile?.full_name || 'Loading...'}</Text>
      <Text style={[Typography.body, styles.handle, { color: theme.textSecondary }]}>@{profile?.full_name?.toLowerCase().replace(/\s+/g, '') || 'athlete'}</Text>
      
      <View style={[styles.statsRow, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>Lvl 12</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rank</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>45</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Matches</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>18</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Connections</Text>
        </View>
      </View>
    </View>
  );

  const renderBioSection = () => (
    <View style={styles.section}>
      <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Bio</Text>
      {bio ? (
        <View style={[styles.bioContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[Typography.body, { color: theme.text, opacity: 0.8, lineHeight: 24 }]}>{bio}</Text>
          <TouchableOpacity style={styles.editBioButton} onPress={() => setBio('')}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
            <Text style={styles.editBioText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.emptyBioContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[Typography.body, { color: theme.textSecondary, marginBottom: 16, textAlign: 'center' }]}>
            You haven't written a bio yet. Want some help?
          </Text>
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={handleGenerateBio}
            disabled={isGeneratingBio}
          >
            {isGeneratingBio ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.generateButtonText}>Generate AI Bio</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderInterests = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Interests</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.interestsGrid}>
        {INTERESTS.map((interest, index) => (
          <View key={index} style={[styles.interestChip, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.interestText, { color: theme.text }]}>{interest}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPhotosGallery = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Photos</Text>
        <TouchableOpacity>
          <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoGrid}>
        {[
          'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1552674605-15c3705e9705?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        ].map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.galleryImage} />
        ))}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={[styles.section, { marginBottom: 60 }]}>
      <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Settings</Text>
      
      <View style={[styles.settingsRow, { borderBottomColor: theme.border }]}>
        <View style={styles.settingsRowLeft}>
          <Ionicons name="moon-outline" size={24} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.border, true: Colors.primary }}
          thumbColor={isDarkMode ? '#000' : '#FFF'}
        />
      </View>

      <TouchableOpacity style={[styles.settingsRow, { borderBottomColor: theme.border }]} onPress={() => navigation.navigate('Terms')}>
        <View style={styles.settingsRowLeft}>
          <Ionicons name="document-text-outline" size={24} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Terms & Conditions</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.settingsRow, { borderBottomColor: theme.border }]} onPress={() => navigation.navigate('Privacy')}>
        <View style={styles.settingsRowLeft}>
          <Ionicons name="shield-checkmark-outline" size={24} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Privacy Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.settingsRow, { borderBottomWidth: 0, marginTop: 24 }]}>
        <View style={styles.settingsRowLeft}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.settingsText, { color: '#FF3B30' }]}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[Typography.title2, { color: theme.text }]}>Profile</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
          }
        >
          {renderBasicInfo()}
          {renderBioSection()}
          {renderInterests()}
          {renderPhotosGallery()}
          {renderSettings()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  name: {
    color: '#FFF',
    fontSize: 28,
    marginBottom: 4,
  },
  handle: {
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: 16,
  },
  bioContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  editBioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  editBioText: {
    color: Colors.primary,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyBioContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  generateButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  interestText: {
    color: '#FFF',
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImage: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
});
