import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const colors = useAppColors();

  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && { backgroundColor: colors.primary }]}
          >
            <AppText
              variant="caption"
              style={{ color: active ? '#fff' : colors.textSecondary, fontWeight: '700' }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
});
