import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { AppText } from './app-text';
import { Card } from './card';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint: string;
};

export function StatCard({ icon, label, value, tint }: Props) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${tint}22` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <AppText variant="title" style={styles.value}>
        {value}
      </AppText>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: Spacing.xs,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  value: {
    marginTop: 2,
  },
});
