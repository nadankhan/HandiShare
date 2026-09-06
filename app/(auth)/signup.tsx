import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';

export default function SignupScreen() {
  const colors = useAppColors();
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
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
          <View style={styles.header}>
            <AppText variant="display">Create account</AppText>
            <AppText variant="body" color="secondary" style={styles.subtitle}>
              Join or start a group once you&apos;re signed up.
            </AppText>
          </View>

          <View style={styles.form}>
            <Input label="Name" value={name} onChangeText={setName} placeholder="Alex Rivera" />
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
              placeholder="At least 6 characters"
            />
            {error ? (
              <AppText variant="caption" color="danger">
                {error}
              </AppText>
            ) : null}
            <Button
              label="Create Account"
              onPress={onSubmit}
              loading={loading}
              disabled={!name || !email || password.length < 6}
              style={styles.submit}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="body" color="secondary">
              Already have an account?
            </AppText>
            <Link href="/login" replace>
              <AppText variant="bodyStrong" style={{ color: colors.primary }}>
                {' '}
                Sign in
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
  header: {
    gap: Spacing.xs,
  },
  subtitle: {
    marginTop: Spacing.xs,
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
