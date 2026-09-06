import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  const colors = useAppColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="caption" color="secondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
            color: colors.text,
          },
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    marginLeft: Spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 15,
  },
  error: {
    marginLeft: Spacing.xs,
  },
});
