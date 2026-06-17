import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import ScreenBackground from './ScreenBackground';

interface WebLayoutWrapperProps {
  children: React.ReactNode;
}

export default function WebLayoutWrapper({ children }: WebLayoutWrapperProps) {
  const { isMobile } = useResponsive();

  // If on mobile (or small screen), just return the app normally
  if (isMobile) {
    return <View style={styles.root}>{children}</View>;
  }

  // On large screens, show the split layout
  return (
    <View style={styles.webRoot}>
      {/* Universal Desktop Background */}
      <ScreenBackground />
      
      {/* Left Side: Mobile App Container */}
      <View style={styles.appContainer}>
        {children}
      </View>

      {/* Right Side: Promotional Content */}
      <View style={styles.promoContainer}>
        <ScrollView contentContainerStyle={styles.promoScroll} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.title1, styles.promoTitle]}>Experience Sports Like Never Before</Text>
          <Text style={[Typography.body, styles.promoSubtitle]}>
            Find venues, join communities, and organize games effortlessly. PPLAY is your ultimate companion for local sports.
          </Text>

          {/* Feature Grid */}
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="location" size={32} color={Colors.primary} />
              <Text style={styles.featureText}>Discover top-rated local venues</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={32} color={Colors.primary} />
              <Text style={styles.featureText}>Join vibrant sports communities</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="calendar" size={32} color={Colors.primary} />
              <Text style={styles.featureText}>Organize & manage events</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={32} color={Colors.primary} />
              <Text style={styles.featureText}>Compete in sponsored leagues</Text>
            </View>
          </View>

          {/* Download Buttons */}
          <View style={styles.downloadSection}>
            <Text style={[Typography.title2, styles.downloadTitle]}>Download the App Today</Text>
            <View style={styles.downloadButtons}>
              <TouchableOpacity style={styles.storeButton}>
                <Ionicons name="logo-apple" size={24} color="#FFF" style={styles.storeIcon} />
                <View>
                  <Text style={styles.storeTextSmall}>Download on the</Text>
                  <Text style={styles.storeTextBig}>App Store</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.storeButton}>
                <Ionicons name="logo-google-playstore" size={24} color="#FFF" style={styles.storeIcon} />
                <View>
                  <Text style={styles.storeTextSmall}>GET IT ON</Text>
                  <Text style={styles.storeTextBig}>Google Play</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Large Promo Image */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }} 
            style={styles.promoImage} 
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  webRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    ...(Platform.OS === 'web' && { 
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    } as any),
  },
  appContainer: {
    width: 450, // Fixed width resembling a large phone/tablet
    height: Platform.OS === 'web' ? '100vh' : '100%',
    maxHeight: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: Colors.textPrimary, // Force dark theme for the app container
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  promoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoScroll: {
    padding: 60,
    maxWidth: 900,
  },
  promoTitle: {
    fontSize: 56,
    color: '#FFF',
    marginBottom: 20,
    lineHeight: 64,
  },
  promoSubtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 60,
    lineHeight: 32,
    maxWidth: 600,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 60,
  },
  featureItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginRight: '5%',
  },
  featureText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
    flex: 1,
  },
  downloadSection: {
    marginBottom: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  downloadTitle: {
    color: '#FFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  storeIcon: {
    marginRight: 12,
  },
  storeTextSmall: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  storeTextBig: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoImage: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    opacity: 0.8,
  },
});
