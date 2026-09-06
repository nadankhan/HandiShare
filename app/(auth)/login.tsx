import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Gradients, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';
import { isFirebaseConfigured } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth-store';

export default function LoginScreen() {
  const colors = useAppColors();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError((e as Error).message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <LinearGradient colors={Gradients.primary} style={styles.logo}>
              <Ionicons name="people" size={26} color="#fff" />
            </LinearGradient>
            <AppText variant="display" style={styles.brand}>
              HandiShare
            </AppText>
            <AppText variant="body" color="secondary" style={styles.tagline}>
              Share tasks, tools, and expenses with your people — live.
            </AppText>
          </View>

          {!isFirebaseConfigured ? (
            <View style={[styles.warning, { backgroundColor: colors.warningMuted }]}>
              <Ionicons name="warning" size={16} color={colors.warning} />
              <AppText variant="caption" style={{ color: colors.warning, flex: 1 }}>
                Firebase isn&apos;t configured yet. Add your project keys to a .env file (see
                .env.example) to enable sign in.
              </AppText>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />
            {error ? (
              <AppText variant="caption" color="danger">
                {error}
              </AppText>
            ) : null}
            <Button
              label="Sign In"
              onPress={onSubmit}
              loading={loading}
              disabled={!email || !password}
              style={styles.submit}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="body" color="secondary">
              New to HandiShare?
            </AppText>
            <Link href="/signup" replace>
              <AppText variant="bodyStrong" style={{ color: colors.primary }}>
                {' '}
                Create an account
              </AppText>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  brandRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brand: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 280,
  },
  warning: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'flex-start',
  },
  form: {
    gap: Spacing.md,
  },
  submit: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
