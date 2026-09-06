import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/use-app-theme';

type Props = ViewProps & { edges?: Edge[] };

export function Screen({ style, edges = ['top', 'left', 'right'], ...rest }: Props) {
  const colors = useAppColors();
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <StatusBar style="light" />
      <View style={[styles.flex, style]} {...rest} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
