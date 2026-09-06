import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

import { AppText } from './app-text';
import { Button } from './button';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={30} color={colors.textTertiary} />
      </View>
      <AppText variant="subtitle" style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  action: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
});
