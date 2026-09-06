import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import { Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';
import { createGroup, joinGroupByInviteCode } from '@/services/groups';
import { useAuthStore } from '@/store/auth-store';

export default function OnboardingScreen() {
  const colors = useAppColors();
  const profile = useAuthStore((s) => s.profile);
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!profile) return;
    setError(null);
    setLoading(true);
    const member = { uid: profile.uid, name: profile.name, email: profile.email };
    try {
      if (mode === 'create') {
        await createGroup(groupName.trim(), member);
      } else {
        await joinGroupByInviteCode(inviteCode.trim(), member);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name="people-circle" size={36} color={colors.primary} />
        </View>
        <AppText variant="display" style={styles.title}>
          {`Hey ${profile?.name?.split(' ')[0] ?? ''}, let's get set up`}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Start a new group for your household or team, or join one with an invite code.
        </AppText>

        <SegmentedTabs
          value={mode}
          onChange={setMode}
          options={[
            { label: 'Create Group', value: 'create' },
            { label: 'Join Group', value: 'join' },
          ]}
        />

        <View style={styles.form}>
          {mode === 'create' ? (
            <Input
              label="Group name"
              value={groupName}
              onChangeText={setGroupName}
              placeholder="The Rivera House"
            />
          ) : (
            <Input
              label="Invite code"
              value={inviteCode}
              onChangeText={(v) => setInviteCode(v.toUpperCase())}
              placeholder="ABC123"
              autoCapitalize="characters"
              maxLength={6}
            />
          )}
          {error ? (
            <AppText variant="caption" color="danger">
              {error}
            </AppText>
          ) : null}
          <Button
            label={mode === 'create' ? 'Create Group' : 'Join Group'}
            onPress={onSubmit}
            loading={loading}
            disabled={mode === 'create' ? !groupName.trim() : inviteCode.trim().length < 4}
            style={styles.submit}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.sm,
  },
  subtitle: {
    marginTop: -Spacing.sm,
  },
  form: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  submit: {
    marginTop: Spacing.sm,
  },
});
