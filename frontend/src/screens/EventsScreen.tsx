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
interface SponsoredEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  prize?: string;
  participants?: number;
}

interface Tournament {
  id: string;
  title: string;
  date: string;
  image: string;
  location: string;
  entryFee: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  members: number;
  image: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  image: string;
}

const SPORTS = [
  { id: '1', name: 'Football', icon: 'football' },
  { id: '2', name: 'Basketball', icon: 'basketball' },
  { id: '3', name: 'Tennis', icon: 'tennisball' },
  { id: '4', name: 'Padel', icon: 'baseball' },
  { id: '5', name: 'Cricket', icon: 'baseball-outline' },
];

export default function EventsScreen() {
  const { isMobile } = useResponsive();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  // State for backend data
  const [sponsoredEvents, setSponsoredEvents] = useState<SponsoredEvent[]>([]);
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
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
        const mockSponsored: SponsoredEvent[] = [
          { id: '1', title: 'Summer Champions League', date: 'Jul 15 - Aug 30', image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', prize: '$10,000', participants: 32 },
          { id: '2', title: 'Downtown Hoops', date: 'Jul 20 - Jul 25', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', prize: '$5,000', participants: 16 },
        ];

        const mockCommunities: CommunityGroup[] = [
          { id: '1', name: 'Downtown Hoopers', members: 124, image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
          { id: '2', name: 'Weekend Padel', members: 89, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
          { id: '3', name: 'FC Strikers', members: 210, image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
          { id: '4', name: 'Sunrise Run Club', members: 345, image: 'https://images.unsplash.com/photo-1552674605-15c3705e9705?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        ];

        const mockEvents: EventItem[] = [
          { id: '1', title: 'Casual 5v5 Pickup', date: 'Tomorrow, 7:00 PM', location: 'Elite Sports Arena', attendees: 8, maxAttendees: 10, image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
          { id: '2', title: 'Tennis Doubles', date: 'Saturday, 9:00 AM', location: 'Valley Tennis Complex', attendees: 2, maxAttendees: 4, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
          { id: '3', title: 'Pickleball Mixer', date: 'Jul 25', location: 'Valley Court', attendees: 16, maxAttendees: 20, image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        ];

        const mockTournaments: Tournament[] = [
          { id: '1', title: 'City Basketball Cup', date: 'Aug 10', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3', location: 'Central Arena', entryFee: '$50/team' },
          { id: '2', title: 'Tennis Open', date: 'Aug 15', image: 'https://images.unsplash.com/photo-1574629810360-7efbc1921441?ixlib=rb-4.0.3', location: 'Valley Court', entryFee: '$20/player' },
        ];

        setSponsoredEvents(mockSponsored);
        setCommunities(mockCommunities);
        setEvents(mockEvents);
        setTournaments(mockTournaments);
      } catch (error) {
        console.error("Failed to load events data", error);
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
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="bag-handle-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAvatar} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInfoCard = () => (
    <View style={styles.infoCard}>
      <View style={styles.infoContent}>
        <Text style={[Typography.title2, { color: '#000', marginBottom: 8 }]}>Host Your Own Event</Text>
        <Text style={[Typography.body, { color: 'rgba(0,0,0,0.7)', marginBottom: 16 }]}>
          Can't find what you're looking for? Create an event and invite players nearby.
        </Text>
        <TouchableOpacity style={styles.infoButton}>
          <Text style={styles.infoButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <Ionicons name="trophy" size={80} color="rgba(0,0,0,0.1)" style={styles.infoIconBg} />
    </View>
  );

  const renderSponsoredCarousel = () => {
    if (!sponsoredEvents.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Sponsored Leagues</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {sponsoredEvents.map((event) => (
            <View key={event.id} style={styles.sponsoredCard}>
              <Image source={{ uri: event.image }} style={styles.sponsoredImage} />
              <View style={styles.sponsoredOverlay}>
                <View style={styles.prizeBadge}>
                  <Ionicons name="trophy" size={14} color="#000" />
                  <Text style={styles.prizeText}>{event.prize}</Text>
                </View>
                <Text style={styles.sponsoredTitle}>{event.title}</Text>
                <Text style={styles.sponsoredSubtitle}>{event.date} • {event.participants} Teams</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSportsBar = () => (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {SPORTS.map((sport, index) => (
          <TouchableOpacity key={sport.id} style={[styles.categoryChip, { backgroundColor: index === 0 ? Colors.primary : theme.cardBackground, borderColor: index === 0 ? Colors.primary : theme.border }]}>
            <Ionicons name={sport.icon as any} size={18} color={index === 0 ? '#FFF' : theme.text} />
            <Text style={[styles.sportText, { color: index === 0 ? '#FFF' : theme.text }]}>{sport.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCommunities = () => {
    if (!communities.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Popular Communities</Text>
          <TouchableOpacity onPress={() => setViewAllSection('communities')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {communities.map((community) => (
            <View key={community.id} style={styles.communityCard}>
              <Image source={{ uri: community.image }} style={styles.communityImage} />
              <Text style={[Typography.headline, styles.communityName, { color: theme.text }]} numberOfLines={1}>{community.name}</Text>
              <Text style={[Typography.caption, { color: theme.textSecondary }]}>{community.members} members</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAllCommunities = () => {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity onPress={() => setViewAllSection(null)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={[Typography.title2, { color: theme.text, marginLeft: 8 }]}>All Communities</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          {communities.map((community) => (
            <View key={community.id} style={[styles.communityCard, { marginBottom: 32, marginRight: 0, width: '30%' }]}>
              <Image source={{ uri: community.image }} style={styles.communityImage} />
              <Text style={[Typography.headline, styles.communityName, { color: theme.text }]} numberOfLines={2}>{community.name}</Text>
              <Text style={[Typography.caption, { color: theme.textSecondary }]}>{community.members} members</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTournaments = () => {
    if (!tournaments.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle, { color: theme.text }]}>Upcoming Tournaments</Text>
        </View>
        <View style={styles.listContainer}>
          {tournaments.map((tournament) => (
            <View key={tournament.id} style={[styles.tournamentCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <View style={styles.tournamentHeader}>
                <Image source={{ uri: tournament.image }} style={styles.tournamentImage} />
                <View style={styles.tournamentInfo}>
                  <Text style={[Typography.headline, { color: theme.text, fontSize: 16 }]}>{tournament.title}</Text>
                  <Text style={[Typography.caption, { color: theme.textSecondary, marginBottom: 4 }]}>{tournament.date}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                    <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: 4 }]}>{tournament.location}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.tournamentFooter, { borderTopColor: theme.border }]}>
                <View style={styles.feeContainer}>
                  <Text style={[Typography.caption, { color: theme.textSecondary }]}>Entry Fee</Text>
                  <Text style={[Typography.headline, { color: theme.text }]}>{tournament.entryFee}</Text>
                </View>
                <TouchableOpacity style={styles.registerButton}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFAB = () => (
    <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
      <Ionicons name="add" size={32} color="#000" />
    </TouchableOpacity>
  );

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
          {viewAllSection === 'communities' ? (
            renderAllCommunities()
          ) : (
            <>
              {renderInfoCard()}
              {renderSponsoredCarousel()}
              {renderSportsBar()}
              {renderCommunities()}
              {renderTournaments()}
            </>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
        {renderFAB()}
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
  section: {
    marginBottom: 32,
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
  horizontalScroll: {
    paddingRight: 20,
  },
  infoCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  infoContent: {
    flex: 1,
    zIndex: 2,
  },
  infoButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  infoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoIconBg: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
    transform: [{ rotate: '-15deg' }],
  },
  sponsoredCard: {
    width: 320,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  sponsoredImage: {
    width: '100%',
    height: '100%',
  },
  sponsoredOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  prizeBadge: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  prizeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sponsoredTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sponsoredSubtitle: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  sportText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  communityCard: {
    alignItems: 'center',
    marginRight: 24,
    width: 80,
  },
  communityImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  communityName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  listContainer: {
    gap: 16,
  },
  tournamentCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  tournamentHeader: {
    flexDirection: 'row',
  },
  tournamentImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  tournamentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeContainer: {
    alignItems: 'flex-start',
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  registerButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  joinButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Above the floating nav bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomSpacer: {
    height: 120, // Enough space for bottom tab bar and FAB
  },
});
