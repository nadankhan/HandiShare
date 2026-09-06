import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const colors = useAppColors();
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const signOut = useAuthStore((s) => s.signOut);
  const [copied, setCopied] = useState(false);

  const copyInviteCode = async () => {
    if (!group) return;
    await Clipboard.setStringAsync(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar name={profile?.name ?? ''} size={72} />
          <AppText variant="title" style={styles.name}>
            {profile?.name}
          </AppText>
          <AppText variant="body" color="secondary">
            {profile?.email}
          </AppText>
        </View>

        <Card style={styles.groupCard}>
          <View style={styles.groupRow}>
            <View>
              <AppText variant="caption" color="secondary">
                Group
              </AppText>
              <AppText variant="subtitle">{group?.name}</AppText>
            </View>
            <Ionicons name="people" size={22} color={colors.primary} />
          </View>
          <View style={[styles.inviteRow, { borderColor: colors.border }]}>
            <View>
              <AppText variant="caption" color="tertiary">
                Invite code
              </AppText>
              <AppText variant="bodyStrong" style={styles.inviteCode}>
                {group?.inviteCode}
              </AppText>
            </View>
            <Button
              label={copied ? 'Copied!' : 'Copy'}
              variant="secondary"
              fullWidth={false}
              onPress={copyInviteCode}
            />
          </View>
        </Card>

        <AppText variant="subtitle" style={styles.sectionTitle}>
          Members ({group?.members.length ?? 0})
        </AppText>
        <View style={styles.members}>
          {group?.members.map((member) => (
            <Card key={member.uid} style={styles.memberCard}>
              <Avatar name={member.name} size={36} />
              <View style={styles.memberBody}>
                <AppText variant="bodyStrong">{member.name}</AppText>
                <AppText variant="caption" color="secondary">
                  {member.email}
                </AppText>
              </View>
              {member.uid === profile?.uid && <AppText variant="caption" color="accent">You</AppText>}
            </Card>
          ))}
        </View>

        <Button
          label="Sign Out"
          variant="danger"
          style={styles.signOut}
          onPress={() =>
            Alert.alert('Sign out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive', onPress: signOut },
            ])
          }
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl * 2,
    gap: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    marginTop: Spacing.sm,
  },
  groupCard: {
    gap: Spacing.md,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  inviteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
  },
  inviteCode: {
    letterSpacing: 2,
    marginTop: 2,
  },
  sectionTitle: {
    marginTop: -Spacing.sm,
  },
  members: {
    gap: Spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  memberBody: {
    flex: 1,
    gap: 2,
  },
  signOut: {
    marginTop: Spacing.md,
  },
});
