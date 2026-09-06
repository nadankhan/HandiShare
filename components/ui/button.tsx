import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Gradients, Radius, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  fullWidth = true,
}: Props) {
  const colors = useAppColors();
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const textColor = variant === 'ghost' || variant === 'secondary' ? colors.text : '#fff';
  const content = loading ? (
    <ActivityIndicator color={textColor} />
  ) : (
    <AppText variant="bodyStrong" style={{ color: textColor }}>
      {label}
    </AppText>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={isDisabled}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            pressed && styles.pressed,
            isDisabled && styles.disabled,
          ]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyle =
    variant === 'secondary'
      ? { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border }
      : variant === 'danger'
        ? { backgroundColor: colors.danger }
        : { backgroundColor: 'transparent' };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed: p }) => [
        styles.base,
        variantStyle,
        fullWidth && styles.fullWidth,
        p && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
