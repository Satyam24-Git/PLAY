import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

// Types for backend compatibility
interface SponsoredEvent {
  id: string;
  title: string;
  date: string;
  image: string;
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

  // State for backend data
  const [sponsoredEvents, setSponsoredEvents] = useState<SponsoredEvent[]>([]);
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
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
          { id: '1', title: 'City Marathon 2026', date: 'Oct 12 • Downtown', image: 'https://images.unsplash.com/photo-1552674605-15c3705e9705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: '2', title: 'Nike 3v3 Tournament', date: 'Nov 5 • Eastside', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
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
          { id: '3', title: 'Basketball Scrimmage', date: 'Sunday, 5:00 PM', location: 'City Hoops Center', attendees: 6, maxAttendees: 10, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        ];

        setSponsoredEvents(mockSponsored);
        setCommunities(mockCommunities);
        setEvents(mockEvents);
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
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: '#FFF' }]}>Events Near You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {sponsoredEvents.map((event) => (
            <View key={event.id} style={styles.sponsoredCard}>
              <Image source={{ uri: event.image }} style={styles.sponsoredImage} />
              <View style={styles.sponsoredOverlay}>
                <View style={styles.sponsoredBadge}>
                  <Text style={styles.sponsoredBadgeText}>Sponsored</Text>
                </View>
                <View>
                  <Text style={styles.sponsoredTitle}>{event.title}</Text>
                  <Text style={styles.sponsoredDate}>{event.date}</Text>
                </View>
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
          <TouchableOpacity key={sport.id} style={[styles.sportChip, index === 0 && styles.sportChipActive]}>
            <Ionicons name={sport.icon as any} size={18} color={index === 0 ? '#FFF' : Colors.textPrimary} />
            <Text style={[styles.sportText, index === 0 && styles.sportTextActive]}>{sport.name}</Text>
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
          <Text style={[Typography.title2, styles.sectionTitle, { color: '#FFF' }]}>Popular Communities</Text>
          <TouchableOpacity onPress={() => setViewAllSection('communities')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {communities.map((community) => (
            <View key={community.id} style={styles.communityCard}>
              <Image source={{ uri: community.image }} style={styles.communityImage} />
              <Text style={[Typography.headline, styles.communityName, { color: '#FFF' }]} numberOfLines={1}>{community.name}</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{community.members} members</Text>
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
            <Text style={[Typography.title2, { color: '#FFF', marginLeft: 8 }]}>All Communities</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          {communities.map((community) => (
            <View key={community.id} style={[styles.communityCard, { marginBottom: 32, marginRight: 0, width: '30%' }]}>
              <Image source={{ uri: community.image }} style={styles.communityImage} />
              <Text style={[Typography.headline, styles.communityName, { color: '#FFF' }]} numberOfLines={2}>{community.name}</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{community.members} members</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderEventList = () => {
    if (!events.length) return null;
    return (
      <View style={styles.sectionHeader}>
        <Text style={[Typography.title2, styles.sectionTitle, { color: '#FFF' }]}>Upcoming Events</Text>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <View style={styles.eventHeaderRow}>
                <Text style={[Typography.headline, { color: Colors.textPrimary, flex: 1, fontSize: 16 }]} numberOfLines={1}>{event.title}</Text>
              </View>
              <View style={styles.eventDetailsRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 6 }]}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailsRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 6 }]} numberOfLines={1}>{event.location}</Text>
              </View>
              <View style={styles.eventFooterRow}>
                <View style={styles.attendeesContainer}>
                  <Ionicons name="people" size={16} color={Colors.primary} />
                  <Text style={[Typography.caption, { color: Colors.textPrimary, marginLeft: 6, fontWeight: 'bold' }]}>
                    {event.attendees}/{event.maxAttendees} joined
                  </Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
          {viewAllSection === 'communities' ? (
            renderAllCommunities()
          ) : (
            <>
              {renderInfoCard()}
              {renderSponsoredCarousel()}
              {renderSportsBar()}
              {renderCommunities()}
              {renderEventList()}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  sponsoredBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sponsoredBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sponsoredTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sponsoredDate: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
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
  eventCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 140,
  },
  eventInfo: {
    padding: 16,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
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
