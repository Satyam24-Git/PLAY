import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

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

const SPORTS = [
  { id: '1', name: 'Football', icon: 'football' },
  { id: '2', name: 'Basketball', icon: 'basketball' },
  { id: '3', name: 'Tennis', icon: 'tennisball' },
  { id: '4', name: 'Padel', icon: 'baseball' },
  { id: '5', name: 'Cricket', icon: 'baseball-outline' },
];

export default function PlayScreen() {
  const { isMobile } = useResponsive();

  // State for backend data
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [previousBookings, setPreviousBookings] = useState<PreviousBooking[]>([]);
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
          { id: '1', title: 'Join Local Leagues', subtitle: 'Compete and win prizes.', image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: '2', title: 'Need a team?', subtitle: 'Find players near you.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        ];

        const mockFilters: Filter[] = [
          { id: '1', label: 'Near Me', active: true },
          { id: '2', label: 'Available Now', active: false },
          { id: '3', label: 'Top Rated', active: false },
          { id: '4', label: 'Indoor', active: false },
          { id: '5', label: 'Outdoor', active: false },
        ];

        const mockPrevious: PreviousBooking[] = [
          { id: '1', venueName: 'Elite Sports Arena', date: 'Last played: 2 days ago', image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '2', venueName: 'City Hoops Center', date: 'Last played: 1 week ago', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        ];

        const mockVenues: Venue[] = [
          { id: '1', name: 'Elite Sports Arena', location: 'Downtown', rating: 4.8, image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '2', name: 'Green Field Courts', location: 'Westside', rating: 4.5, image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: '3', name: 'City Hoops Center', location: 'Uptown', rating: 4.9, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        ];

        setAds(mockAds);
        setFilters(mockFilters);
        setPreviousBookings(mockPrevious);
        setVenues(mockVenues);
      } catch (error) {
        console.error("Failed to load play screen data", error);
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
            <Text style={[Typography.headline, { color: '#FFF', fontSize: 16 }]}>New York, USA</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="bag-handle-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAvatar}>
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

  const renderSportsBar = () => (
    <View style={styles.section}>
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

  const renderFilters = () => {
    if (!filters.length) return null;
    return (
      <View style={styles.sectionSmall}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map((filter) => (
            <TouchableOpacity key={filter.id} style={[styles.filterChip, filter.active && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter.active && styles.filterTextActive]}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPreviousBookings = () => {
    if (!previousBookings.length) return null;
    return (
      <View style={styles.section}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: '#FFF' }]}>Play it again</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previousScroll}>
          {previousBookings.map((booking) => (
            <View key={booking.id} style={styles.previousCard}>
              <Image source={{ uri: booking.image }} style={styles.previousImage} />
              <View style={styles.previousInfo}>
                <Text style={[Typography.headline, { color: Colors.textPrimary, fontSize: 16 }]} numberOfLines={1}>{booking.venueName}</Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: 12 }]}>{booking.date}</Text>
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
          <Text style={[Typography.title2, styles.sectionTitle, { color: '#FFF' }]}>Available Venues</Text>
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
      <View style={[styles.root, styles.centerAll, { backgroundColor: Colors.textPrimary }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: Colors.textPrimary }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderSearchBar()}
          {renderAdvertisement()}
          {renderSportsBar()}
          {renderFilters()}
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  section: {
    marginBottom: 28,
  },
  sectionSmall: {
    marginBottom: 20,
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
    ...StyleSheet.absoluteFillObject,
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
  filtersScroll: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  filterText: {
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primaryDark,
  },
  previousScroll: {
    paddingRight: 20,
  },
  previousCard: {
    width: 220,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
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
