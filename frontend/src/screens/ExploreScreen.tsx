import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type TabType = 'find' | 'coaching' | 'analytics';

const SPORTS = [
  { id: '1', name: 'Football', icon: 'football' },
  { id: '2', name: 'Basketball', icon: 'basketball' },
  { id: '3', name: 'Tennis', icon: 'tennisball' },
  { id: '4', name: 'Padel', icon: 'baseball' },
  { id: '5', name: 'Cricket', icon: 'baseball-outline' },
];

const FILTERS = ['Distance < 5mi', 'Skill: Intermediate', 'Gender: Any', 'Time: Evening', 'Age: 20-30'];

export default function ExploreScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabType>('find');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data when switching tabs or mounting
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

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
        <TouchableOpacity style={styles.profileAvatar} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {(['find', 'coaching', 'analytics'] as TabType[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFindTab = () => (
    <View style={styles.tabContent}>
      {/* Sports Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {SPORTS.map((sport, index) => (
          <TouchableOpacity key={sport.id} style={[styles.sportChip, index === 0 && styles.sportChipActive]}>
            <Ionicons name={sport.icon as any} size={18} color={index === 0 ? '#000' : '#FFF'} />
            <Text style={[styles.sportText, index === 0 && styles.sportTextActive]}>{sport.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filters Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll} style={{ marginTop: 16 }}>
        {FILTERS.map((filter, index) => (
          <TouchableOpacity key={index} style={styles.filterChip}>
            <Text style={styles.filterText}>{filter}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Player Requests */}
      <View style={styles.section}>
        <Text style={[Typography.title2, { color: '#FFF', marginBottom: 16 }]}>Players Looking for Games</Text>
        
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Image source={{ uri: `https://randomuser.me/api/portraits/men/${30 + i}.jpg` }} style={styles.playerAvatar} />
              <View style={styles.playerInfo}>
                <Text style={[Typography.headline, { color: '#FFF' }]}>{['Alex', 'Jordan', 'Michael'][i]}</Text>
                <Text style={[Typography.caption, { color: Colors.primary }]}>{['Football', 'Tennis', 'Basketball'][i]} • Intermediate</Text>
              </View>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{i + 1}h ago</Text>
            </View>
            <Text style={[Typography.body, { color: 'rgba(255,255,255,0.8)', marginBottom: 16 }]}>
              Looking for 2 more players to join our weekly casual game at {['Downtown Turf', 'Valley Court', 'Elite Arena'][i]}.
            </Text>
            <View style={styles.playerActions}>
              <View style={styles.playerMeta}>
                <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>2.5 mi away</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCoachingTab = () => (
    <View style={styles.tabContent}>
      <Text style={[Typography.title2, { color: '#FFF', marginBottom: 16 }]}>Featured Coaches</Text>
      
      {[1, 2, 3].map((_, i) => (
        <View key={i} style={styles.coachCard}>
          <Image source={{ uri: `https://randomuser.me/api/portraits/women/${40 + i}.jpg` }} style={styles.coachImage} />
          <View style={styles.coachInfo}>
            <View style={styles.coachHeaderRow}>
              <Text style={[Typography.headline, { color: '#FFF', fontSize: 18 }]}>{['Sarah Jenkins', 'Elena Rodriguez', 'Marcus Johnson'][i]}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#000" />
                <Text style={styles.ratingText}>4.{9 - i}</Text>
              </View>
            </View>
            <Text style={[Typography.body, { color: Colors.primary, marginBottom: 8 }]}>{['Pro Tennis Coach', 'Football Tactician', 'Basketball Skills'][i]}</Text>
            
            <View style={styles.coachMetaRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>{['Valley Complex', 'Downtown Field', 'Elite Arena'][i]}</Text>
            </View>
            
            <View style={styles.coachFooter}>
              <Text style={[Typography.headline, { color: '#FFF' }]}>${50 + i * 15} <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: 'normal' }}>/hr</Text></Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      {/* Smartwatch Rings Mockup */}
      <View style={styles.watchContainer}>
        <Text style={[Typography.title2, { color: '#FFF', marginBottom: 24, textAlign: 'center' }]}>Today's Activity</Text>
        <View style={styles.ringsWrapper}>
          <View style={[styles.ring, styles.ringOuter]}>
            <View style={[styles.ring, styles.ringMiddle]}>
              <View style={[styles.ring, styles.ringInner]}>
                <Ionicons name="flame" size={32} color={Colors.primary} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>840</Text>
            <Text style={styles.metricLabel}>KCAL</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>124</Text>
            <Text style={styles.metricLabel}>BPM</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>2.4</Text>
            <Text style={styles.metricLabel}>HOURS</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color={Colors.primary} />
          <Text style={styles.statBoxValue}>124h</Text>
          <Text style={styles.statBoxLabel}>Total Time Played</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="map-outline" size={24} color={Colors.primary} />
          <Text style={styles.statBoxValue}>12</Text>
          <Text style={styles.statBoxLabel}>Venues Explored</Text>
        </View>
      </View>

      {/* Rewards Carousel */}
      <View style={styles.section}>
        <Text style={[Typography.title2, { color: '#FFF', marginBottom: 16 }]}>Unlock Freebies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {[
            { name: 'PPLAY Bottle', points: '1,500 pts', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
            { name: 'Pro Towel', points: '2,000 pts', image: 'https://images.unsplash.com/photo-1610935591850-9a3bf14810c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
            { name: 'Sports Bag', points: '5,000 pts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
          ].map((item, index) => (
            <View key={index} style={styles.rewardCard}>
              <Image source={{ uri: item.image }} style={styles.rewardImage} />
              <View style={styles.rewardInfo}>
                <Text style={[Typography.headline, { color: '#FFF' }]}>{item.name}</Text>
                <TouchableOpacity style={styles.redeemButton}>
                  <Text style={styles.redeemButtonText}>{item.points}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: Colors.textPrimary }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderTabs()}
          
          {loading ? (
            <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <>
              {activeTab === 'find' && renderFindTab()}
              {activeTab === 'coaching' && renderCoachingTab()}
              {activeTab === 'analytics' && renderAnalyticsTab()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#000',
  },
  tabContent: {
    flex: 1,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sportChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sportText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#FFF',
  },
  sportTextActive: {
    color: '#000',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  filterText: {
    color: '#FFF',
    fontSize: 12,
  },
  section: {
    marginTop: 32,
  },
  playerCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  connectButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  coachCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  coachImage: {
    width: 90,
    height: 110,
    borderRadius: 16,
    marginRight: 16,
  },
  coachInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  coachHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  coachMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coachFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  watchContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ringsWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  ring: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-45deg' }], // rotate to make it look like progress rings
  },
  ringOuter: {
    width: 200,
    height: 200,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: Colors.primary,
    borderBottomColor: Colors.primary,
  },
  ringMiddle: {
    width: 160,
    height: 160,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: '#32D74B', // Green
    borderBottomColor: '#32D74B',
  },
  ringInner: {
    width: 120,
    height: 120,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: '#0A84FF', // Blue
    borderBottomColor: '#0A84FF',
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBoxValue: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  statBoxLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  rewardCard: {
    width: 240,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rewardImage: {
    width: '100%',
    height: 140,
  },
  rewardInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  redeemButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  redeemButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 120, // Enough space for bottom tab bar
  },
});
