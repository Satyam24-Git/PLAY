import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

// Expo web bundles images and exposes them as plain URL strings via require()
// We import both explicitly and cast to any to avoid TS type mismatch
const BG_DESKTOP = require('../../assets/360_F_1943594256_V6mFOWZLY1KKGvyFqfcENo962kKu8JAt.webp');
const BG_MOBILE  = require('../../assets/WhatsApp Image 2026-06-16 at 20.19.32.jpeg');

/** Safely resolves a require()'d asset to a URL string for web CSS */
function resolveUri(mod: any): string {
  if (typeof mod === 'string') return mod;
  if (typeof mod === 'number') {
    // On native this is an asset ID — not used on web, but guard anyway
    return '';
  }
  // Expo web wraps the asset: { default: '/static/media/...', uri: '...', ... }
  return mod?.default ?? mod?.uri ?? mod?.src ?? '';
}

export default function ScreenBackground({ overlayOpacity = 0.52 }: { overlayOpacity?: number }) {
  const { isMobile } = useResponsive();
  const source = isMobile ? BG_MOBILE : BG_DESKTOP;

  if (Platform.OS === 'web') {
    const uri = resolveUri(source);

    return (
      <>
        <View
          // @ts-ignore — RN Web supports these CSS props via style
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundImage: uri ? `url("${uri}")` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: isMobile ? 'bottom center' : 'center',
                backgroundRepeat: 'no-repeat',
                // Fallback colour while image loads
                backgroundColor: '#0d2e0d',
              },
            ]}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
          ]}
        />
      </>
    );
  }

  // Native (iOS / Android)
  return (
    <>
      <Image
        source={source}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
        ]}
      />
    </>
  );
}
