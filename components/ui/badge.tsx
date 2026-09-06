import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const colors = useAppColors();

  const toneMap = {
    success: { bg: colors.successMuted, fg: colors.success },
    warning: { bg: colors.warningMuted, fg: colors.warning },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
    accent: { bg: colors.primaryMuted, fg: colors.accent },
    neutral: { bg: colors.surfaceElevated, fg: colors.textSecondary },
  } as const;

  const { bg, fg } = toneMap[tone];

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <AppText variant="label" style={{ color: fg, letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
});
