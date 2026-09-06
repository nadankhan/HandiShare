/**
 * HandiShare design system — dark-mode-first.
 * A single dark palette drives the whole app; Colors.light exists only so
 * platform APIs that ask for a light/dark pair (e.g. useThemeColor) still work.
 */

import { Platform } from 'react-native';

const tintColorDark = '#7C5CFC';
const tintColorLight = '#5B3FD9';

const dark = {
  text: '#F5F5F9',
  textSecondary: '#A6A6B5',
  textTertiary: '#6E6E7E',
  background: '#0A0A0F',
  surface: '#15151F',
  surfaceElevated: '#1D1D2A',
  border: '#27273A',
  tint: tintColorDark,
  primary: '#7C5CFC',
  primaryMuted: '#2A1F5C',
  accent: '#22D3EE',
  success: '#2ECC71',
  successMuted: '#123A26',
  warning: '#F5A623',
  warningMuted: '#3A2A0E',
  danger: '#FF5D6C',
  dangerMuted: '#3A1420',
  icon: '#A6A6B5',
  tabIconDefault: '#6E6E7E',
  tabIconSelected: tintColorDark,
};

export const Colors = {
  light: {
    text: '#151521',
    textSecondary: '#5B5B6B',
    textTertiary: '#8A8A99',
    background: '#F5F5FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E4E4EF',
    tint: tintColorLight,
    primary: tintColorLight,
    primaryMuted: '#EDE8FF',
    accent: '#0891B2',
    success: '#1D9A56',
    successMuted: '#E2F6EB',
    warning: '#B9720A',
    warningMuted: '#FBEDD8',
    danger: '#D93A48',
    dangerMuted: '#FBE4E6',
    icon: '#5B5B6B',
    tabIconDefault: '#8A8A99',
    tabIconSelected: tintColorLight,
  },
  dark,
};

export const Gradients = {
  primary: ['#7C5CFC', '#22D3EE'] as const,
  warm: ['#FF5D6C', '#F5A623'] as const,
  surface: ['#1D1D2A', '#15151F'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const Typography = {
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38 },
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
  subtitle: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '700' as const, lineHeight: 14 },
};

export const Shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  default: {
    elevation: 6,
  },
});

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
