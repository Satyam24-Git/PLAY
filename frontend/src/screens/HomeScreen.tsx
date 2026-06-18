import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';

// Types for backend compatibility
interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
}

interface Booking {
  id: string;
  title: string;
  time: string;
  location: string;
  image: string;
}

interface UserStats {
  matches: number;
  wins: number;
  winRate: number;
}

const SPORTS = [
  { id: '1', name: 'Football', icon: 'football' },
  { id: '2', name: 'Basketball', icon: 'basketball' },
  { id: '3', name: 'Tennis', icon: 'tennisball' },
  { id: '4', name: 'Padel', icon: 'baseball' },
  { id: '5', name: 'Cricket', icon: 'baseball-outline' },
];

export default function HomeScreen() {
  const { isMobile } = useResponsive();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  // State for backend data
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [viewAllSection, setViewAllSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate API Call
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
        
        const [venuesRes, bookingsRes, adsRes] = await Promise.all([
          fetch(`${API_URL}/api/venues`),
          fetch(`${API_URL}/api/bookings`),
          fetch(`${API_URL}/api/ads`)
        ]);

        if (venuesRes.ok) {
          const vData = await venuesRes.json();
          setVenues(vData.map((v: any) => ({
            id: v.id,
            name: v.name,
            location: v.location || 'Local Area',
            rating: v.rating || 0,
            image: v.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?auto=format&fit=crop&w=800&q=80'
          })));
        }

        if (bookingsRes.ok) {
          const bData = await bookingsRes.json();
          setBookings(bData.map((b: any) => ({
            id: b.id,
            title: 'Match Booking',
            time: new Date(b.start_time).toLocaleString(),
            location: b.venue ? b.venue.name : 'Unknown Venue',
            image: (b.venue && b.venue.image_url) ? b.venue.image_url : 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?auto=format&fit=crop&w=150&q=80'
          })));
        }

        if (adsRes.ok) {
          const aData = await adsRes.json();
          setAds(aData.map((a: any) => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle,
            image: a.image_url || 'https://images.unsplash.com/photo-1551280857-2b9bbe5240ce?auto=format&fit=crop&w=1000&q=80'
          })));
        }

        // Mock stats since there is no stats service
        setUserStats({ matches: 12, wins: 8, winRate: 65 });

      } catch (error) {
        console.error("Failed to load home screen data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.locationSelector}>
        <Ionicons name="location" size={28} color={Colors.primary} />
        <View style={styles.locationTextContainer}>
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>Current Location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]}>New York, USA</Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionIcon} onPress={() => navigation.navigate('Shop')}>
          <Ionicons name="bag-handle-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAvatar} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAdvertisement = () => {
    if (!ads.length) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adScrollContainer}>
        {ads.map((ad) => (
          <View key={ad.id} style={styles.adContainer}>
            <Image source={{ uri: ad.image }} style={styles.adImage} />
            <View style={styles.adOverlay}>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderUpcomingBookings = () => {
    if (!bookings.length) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Upcoming Bookings</Text>
        </View>
        {bookings.map((booking) => (
          <View key={booking.id} style={[styles.bookingCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.bookingHeader}>
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]}>{booking.title}</Text>
                <Text style={[Typography.caption, { color: theme.textSecondary }]}>{booking.time}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.bookingDetails, { borderTopColor: theme.border }]}>
              <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
              <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 6 }]}>{booking.location}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderUserAnalytics = () => {
    if (!userStats) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Your Stats</Text>
        </View>
        <View style={styles.analyticsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={styles.statValue}>{userStats.matches}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Matches</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={styles.statValue}>{userStats.wins}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Wins</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={styles.statValue}>{userStats.winRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Win Rate</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSportsBar = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Categories</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportsScroll}>
        {SPORTS.map((sport, index) => (
          <TouchableOpacity key={sport.id} style={[styles.sportChip, { backgroundColor: theme.cardBackground, borderColor: theme.border }, index === 0 && styles.sportChipActive]}>
            <Ionicons name={sport.icon as any} size={18} color={index === 0 ? '#FFF' : theme.text} />
            <Text style={[styles.sportText, { color: theme.text }, index === 0 && styles.sportTextActive]}>{sport.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderVenues = () => {
    if (!venues.length) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Popular Venues</Text>
          <TouchableOpacity onPress={() => setViewAllSection('venues')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {venues.slice(0, 3).map((venue) => (
          <TouchableOpacity key={venue.id} style={[styles.venueCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
              <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]}>{venue.name}</Text>
              <View style={styles.venueMetaRow}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{venue.location}</Text>
                <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{venue.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAllVenues = () => {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity onPress={() => setViewAllSection(null)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={[Typography.title2, { color: theme.text, marginLeft: 8 }]}>All Venues</Text>
          </TouchableOpacity>
        </View>
        {venues.map((venue) => (
          <TouchableOpacity key={venue.id} style={[styles.venueCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
              <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]}>{venue.name}</Text>
              <View style={styles.venueMetaRow}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{venue.location}</Text>
                <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{venue.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centerAll, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {viewAllSection === 'venues' ? (
            renderAllVenues()
          ) : (
            <>
              {renderAdvertisement()}
              {renderUpcomingBookings()}
              {renderUserAnalytics()}
              {renderSportsBar()}
              {renderVenues()}
            </>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 16,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  adScrollContainer: {
    paddingRight: 20,
    marginBottom: 28,
  },
  adContainer: {
    width: 300,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  adTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adSubtitle: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  bookingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sportsScroll: {
    paddingRight: 20,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
  },
  sportChipActive: {
    backgroundColor: Colors.primary,
  },
  sportText: {
    marginLeft: 8,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sportTextActive: {
    color: '#FFF',
  },
  venueCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    borderWidth: 1,
  },
  venueImage: {
    width: 100,
    height: 100,
  },
  venueInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  venueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
