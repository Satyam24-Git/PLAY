import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const FontFamily = {
  regular: Platform.select({ ios: 'SF Pro Text', android: 'System', default: 'System' }),
  medium: Platform.select({ ios: 'SF Pro Text', android: 'System', default: 'System' }),
  semibold: Platform.select({ ios: 'SF Pro Display', android: 'System', default: 'System' }),
  bold: Platform.select({ ios: 'SF Pro Display', android: 'System', default: 'System' }),
};

export const Typography = StyleSheet.create({
  displayLarge: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
  displayMedium: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.35,
    color: Colors.textPrimary,
    fontFamily: FontFamily.semibold,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.35,
    color: Colors.textPrimary,
    fontFamily: FontFamily.semibold,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.32,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
  },
  callout: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.15,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.textTertiary,
    fontFamily: FontFamily.semibold,
  },
});
