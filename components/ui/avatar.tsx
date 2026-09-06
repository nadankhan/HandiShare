import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from './app-text';

const PALETTES: [string, string][] = [
  ['#7C5CFC', '#22D3EE'],
  ['#FF5D6C', '#F5A623'],
  ['#2ECC71', '#22D3EE'],
  ['#F5A623', '#7C5CFC'],
  ['#22D3EE', '#7C5CFC'],
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const palette = PALETTES[hashString(name) % PALETTES.length];

  return (
    <LinearGradient
      colors={palette}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={styles.center}>
        <AppText style={{ color: '#fff', fontSize: size * 0.38, fontWeight: '700' }}>
          {initials(name || '?')}
        </AppText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
