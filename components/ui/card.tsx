import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

type Props = ViewProps & {
  onPress?: () => void;
  elevated?: boolean;
};

export function Card({ style, onPress, elevated, children, ...rest }: Props) {
  const colors = useAppColors();
  const cardStyle = [
    styles.card,
    {
      backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
      borderColor: colors.border,
    },
    elevated ? Shadow : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        {...(rest as any)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
});
