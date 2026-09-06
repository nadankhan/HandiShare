import { StyleSheet, Text, type TextProps } from 'react-native';

import { useAppColors } from '@/hooks/use-app-theme';
import { Typography } from '@/constants/theme';

type Variant = keyof typeof Typography;

type Props = TextProps & {
  variant?: Variant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger';
};

export function AppText({ variant = 'body', color = 'primary', style, ...rest }: Props) {
  const colors = useAppColors();

  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  } as const;

  return (
    <Text style={[styles.base, Typography[variant], { color: colorMap[color] }, style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: undefined,
  },
});
