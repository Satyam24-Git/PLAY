import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from '../components/ScreenBackground';

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
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock response data
        const mockAds: Advertisement[] = [
          { id: '1', title: 'Summer League 2026', subtitle: 'Register now and get 20% off!', image: 'https://images.unsplash.com/photo-1551280857-2b9bbe5240ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: '2', title: 'New Padel Courts', subtitle: 'Book your first game for free.', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: '3', title: 'Pro Gear Sale', subtitle: 'Up to 50% off on equipment.', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
        ];

        const mockVenues: Venue[] = [
          { id: '1', name: 'Elite Sports Arena', location: 'Downtown', rating: 4.8, image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '2', name: 'Green Field Courts', location: 'Westside', rating: 4.5, image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '3', name: 'City Hoops Center', location: 'Uptown', rating: 4.9, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '4', name: 'Padel Pro Club', location: 'Eastside', rating: 4.7, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '5', name: 'Valley Tennis', location: 'North Hills', rating: 4.6, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        ];

        const mockBookings: Booking[] = [
          { id: '1', title: '5v5 Match', time: 'Today, 6:00 PM', location: 'Elite Sports Arena - Pitch 2', image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }
        ];

        const mockStats: UserStats = { matches: 12, wins: 8, winRate: 65 };

        setAds(mockAds);
        setVenues(mockVenues);
        setBookings(mockBookings);
        setUserStats(mockStats);
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
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Current Location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[Typography.headline, { color: isMobile ? '#FFF' : Colors.textPrimary, fontSize: 16 }]}>New York, USA</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="bag-handle-outline" size={28} color={isMobile ? '#FFF' : Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAvatar}>
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
        <Text style={[Typography.title2, styles.sectionTitle, { color: isMobile ? '#FFF' : Colors.textPrimary }]}>Upcoming Bookings</Text>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[Typography.headline, { color: Colors.textPrimary, fontSize: 16 }]}>{booking.title}</Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{booking.time}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.bookingDetails}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 6 }]}>{booking.location}</Text>
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
        <Text style={[Typography.title2, styles.sectionTitle, { color: isMobile ? '#FFF' : Colors.textPrimary }]}>Your Stats</Text>
        <View style={styles.analyticsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.winRate}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSportsBar = () => (
    <View style={styles.section}>
      <Text style={[Typography.title2, styles.sectionTitle, { color: isMobile ? '#FFF' : Colors.textPrimary }]}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportsScroll}>
        {SPORTS.map((sport, index) => (
          <TouchableOpacity key={sport.id} style={[styles.sportChip, index === 0 && styles.sportChipActive]}>
            <Ionicons name={sport.icon as any} size={18} color={index === 0 ? '#FFF' : Colors.textPrimary} />
            <Text style={[styles.sportText, index === 0 && styles.sportTextActive]}>{sport.name}</Text>
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
          <Text style={[Typography.title2, styles.sectionTitle, { color: isMobile ? '#FFF' : Colors.textPrimary }]}>Popular Venues</Text>
          <TouchableOpacity onPress={() => setViewAllSection('venues')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {venues.slice(0, 3).map((venue) => (
          <TouchableOpacity key={venue.id} style={styles.venueCard}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
              <Text style={[Typography.headline, { color: Colors.textPrimary, fontSize: 16 }]}>{venue.name}</Text>
              <View style={styles.venueMetaRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>{venue.location}</Text>
                <View style={styles.dot} />
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>{venue.rating}</Text>
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
            <Text style={[Typography.title2, { color: isMobile ? '#FFF' : Colors.textPrimary, marginLeft: 8 }]}>All Venues</Text>
          </TouchableOpacity>
        </View>
        {venues.map((venue) => (
          <TouchableOpacity key={venue.id} style={styles.venueCard}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
              <Text style={[Typography.headline, { color: Colors.textPrimary, fontSize: 16 }]}>{venue.name}</Text>
              <View style={styles.venueMetaRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>{venue.location}</Text>
                <View style={styles.dot} />
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>{venue.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centerAll, isMobile && { backgroundColor: Colors.textPrimary }]}>
        {!isMobile && <ScreenBackground />}
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, isMobile && { backgroundColor: Colors.textPrimary }]}>
      {!isMobile && <ScreenBackground />}
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
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
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
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
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
