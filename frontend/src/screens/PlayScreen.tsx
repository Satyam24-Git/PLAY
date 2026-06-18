import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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

interface Filter {
  id: string;
  label: string;
  active?: boolean;
}

interface PreviousBooking {
  id: string;
  venueName: string;
  date: string;
  image: string;
}

interface Match {
  id: string;
  title: string;
  sport: string;
  time: string;
  location: string;
  playersNeeded: number;
  playersJoined: number;
  players: number;
  maxPlayers: number;
  level: string;
  organizer: string;
  organizerAvatar: string;
}

const SPORTS = [
  { id: '1', name: 'Football', icon: 'football' },
  { id: '2', name: 'Basketball', icon: 'basketball' },
  { id: '3', name: 'Tennis', icon: 'tennisball' },
  { id: '4', name: 'Padel', icon: 'baseball' },
  { id: '5', name: 'Cricket', icon: 'baseball-outline' },
];

export default function PlayScreen() {
  const { isMobile } = useResponsive();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  // State for backend data
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [previousBookings, setPreviousBookings] = useState<PreviousBooking[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

      // Fetch Matches
      const matchesRes = await fetch(`${API_URL}/api/matches`);
      let fetchedMatches: Match[] = [];
      if (matchesRes.ok) {
        const mData = await matchesRes.json();
        fetchedMatches = mData.map((m: any) => ({
          id: m.id,
          title: `${m.sport_type} Session`,
          sport: m.sport_type,
          time: new Date(m.date).toLocaleString(),
          location: m.venue?.name || 'Local Venue',
          playersNeeded: m.max_players - m.current_players,
          playersJoined: m.current_players,
          players: m.current_players,
          maxPlayers: m.max_players,
          level: 'Any Level',
          organizer: m.creator?.full_name || 'Player',
          organizerAvatar: m.creator?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'
        }));
      }

      // Fetch Venues
      const venuesRes = await fetch(`${API_URL}/api/venues`);
      let fetchedVenues: Venue[] = [];
      if (venuesRes.ok) {
        const vData = await venuesRes.json();
        fetchedVenues = vData.map((v: any) => ({
          id: v.id,
          name: v.name,
          location: v.location || 'Unknown',
          rating: v.rating || 5.0,
          image: v.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }));
      }

      // Fetch Ads
      const adsRes = await fetch(`${API_URL}/api/ads`);
      let fetchedAds: Advertisement[] = [];
      if (adsRes.ok) {
        const aData = await adsRes.json();
        fetchedAds = aData.map((a: any) => ({
          id: a.id,
          title: a.title,
          subtitle: a.subtitle,
          image: a.image_url || 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }));
      }

      const mockFilters: Filter[] = [
        { id: '1', label: 'Near Me', active: true },
        { id: '2', label: 'Available Now', active: false },
        { id: '3', label: 'Top Rated', active: false },
        { id: '4', label: 'Indoor', active: false },
        { id: '5', label: 'Outdoor', active: false },
      ];

      const mockPrevious: PreviousBooking[] = [
        { id: '1', venueName: 'Elite Sports Arena', date: 'Last played: 2 days ago', image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      ];

      setAds(fetchedAds);
      setFilters(mockFilters);
      setPreviousBookings(mockPrevious);
      setVenues(fetchedVenues);
      setMatches(fetchedMatches);
    } catch (error) {
      console.error("Failed to load play screen data", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadInitialData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
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

  const renderSearchBar = () => (
    <TouchableOpacity style={styles.searchContainer} activeOpacity={0.8}>
      <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
      <Text style={styles.searchPlaceholder}>Search for sports, venues, or players...</Text>
    </TouchableOpacity>
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

  const renderMatches = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Matches</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {['All', 'Football', 'Tennis', 'Basketball', 'Padel'].map((sport, index) => (
          <TouchableOpacity key={sport} style={[styles.filterChip, { backgroundColor: index === 0 ? Colors.primary : theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.filterText, { color: index === 0 ? '#FFF' : theme.text }]}>{sport}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.matchesList}>
        {matches.map((match) => (
          <View key={match.id} style={[styles.matchCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.matchHeader}>
              <View style={styles.sportBadge}>
                <Ionicons name="football" size={12} color="#000" />
                <Text style={styles.sportBadgeText}>{match.sport}</Text>
              </View>
              <Text style={[Typography.caption, { color: theme.textSecondary }]}>{match.time}</Text>
            </View>
            <Text style={[Typography.headline, { color: theme.text, fontSize: 18, marginBottom: 8 }]}>{match.title}</Text>
            <View style={styles.matchMetaRow}>
              <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
              <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{match.location}</Text>
              <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
              <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
              <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{match.players}/{match.maxPlayers} Players</Text>
            </View>
            <View style={[styles.matchFooter, { borderTopColor: theme.border }]}>
              <View style={styles.organizerRow}>
                <Image source={{ uri: match.organizerAvatar }} style={styles.organizerAvatar} />
                <Text style={[Typography.caption, { color: theme.text, marginLeft: 8 }]}>Organized by {match.organizer}</Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPreviousBookings = () => {
    if (!previousBookings.length) return null;
    return (
      <View style={styles.section}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Play it again</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previousScroll}>
          {previousBookings.map((booking) => (
            <View key={booking.id} style={[styles.previousCard, { backgroundColor: theme.cardBackground }]}>
              <Image source={{ uri: booking.image }} style={styles.previousImage} />
              <View style={styles.previousInfo}>
                <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]} numberOfLines={1}>{booking.venueName}</Text>
                <Text style={[Typography.caption, { color: theme.textSecondary, marginBottom: 12 }]}>{booking.date}</Text>
                <TouchableOpacity style={styles.rebookButton}>
                  <Text style={styles.rebookText}>Rebook</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderVenues = () => {
    if (!venues.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Available Venues</Text>
        </View>
        {venues.map((venue) => (
          <TouchableOpacity key={venue.id} style={[styles.venueCard, { backgroundColor: theme.cardBackground }]}>
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
          }
        >
          {renderHeader()}
          {renderSearchBar()}
          {renderAdvertisement()}
          {renderMatches()}
          {renderPreviousBookings()}
          {renderVenues()}
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
    marginBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 15,
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
  adScrollContainer: {
    paddingRight: 20,
    marginBottom: 24,
  },
  adContainer: {
    width: 280,
    height: 140,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adSubtitle: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  horizontalScroll: {
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '500',
  },
  matchesList: {
    gap: 16,
  },
  matchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  previousScroll: {
    paddingRight: 20,
  },
  previousCard: {
    width: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  previousImage: {
    width: '100%',
    height: 100,
  },
  previousInfo: {
    padding: 12,
  },
  rebookButton: {
    backgroundColor: Colors.primaryMuted,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  rebookText: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  venueCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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
