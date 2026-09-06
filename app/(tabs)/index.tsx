import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { StatCard } from '@/components/ui/stat-card';
import { Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/use-collection';
import { useAppColors } from '@/hooks/use-app-theme';
import { computeBalances } from '@/lib/balances';
import { useAuthStore } from '@/store/auth-store';
import type { Expense, Item, Task } from '@/types';

type Activity = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  text: string;
  createdAt: number;
};

export default function HomeScreen() {
  const colors = useAppColors();
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const groupId = group?.id ?? '';

  const { data: tasks } = useCollection<Task>(['groups', groupId, 'tasks']);
  const { data: items } = useCollection<Item>(['groups', groupId, 'items']);
  const { data: expenses } = useCollection<Expense>(['groups', groupId, 'expenses']);

  const memberName = (uid: string | null) =>
    group?.members.find((m) => m.uid === uid)?.name.split(' ')[0] ?? 'Someone';

  const openTasks = tasks.filter((t) => t.status === 'open');
  const borrowedItems = items.filter((i) => i.status === 'borrowed');
  const balances = useMemo(
    () => computeBalances(expenses, group?.members ?? []),
    [expenses, group?.members]
  );
  const myBalance = profile ? (balances[profile.uid] ?? 0) : 0;

  const activity = useMemo<Activity[]>(() => {
    const fromTasks: Activity[] = tasks.slice(0, 8).map((t) => ({
      id: `task-${t.id}`,
      icon: t.status === 'done' ? 'checkmark-circle' : 'ellipse-outline',
      tint: t.status === 'done' ? colors.success : colors.primary,
      text: `${memberName(t.createdBy)} added task "${t.title}"`,
      createdAt: t.createdAt,
    }));
    const fromItems: Activity[] = items.slice(0, 8).map((i) => ({
      id: `item-${i.id}`,
      icon: i.status === 'borrowed' ? 'arrow-redo' : 'cube-outline',
      tint: colors.accent,
      text:
        i.status === 'borrowed'
          ? `${memberName(i.borrowedBy)} borrowed "${i.name}"`
          : `${memberName(i.ownerId)} added item "${i.name}"`,
      createdAt: i.borrowedAt ?? i.createdAt,
    }));
    const fromExpenses: Activity[] = expenses.slice(0, 8).map((e) => ({
      id: `expense-${e.id}`,
      icon: 'wallet-outline',
      tint: colors.warning,
      text: `${memberName(e.paidBy)} paid $${e.amount.toFixed(2)} for "${e.title}"`,
      createdAt: e.createdAt,
    }));

    return [...fromTasks, ...fromItems, ...fromExpenses]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, items, expenses, group?.members]);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <AppText variant="body" color="secondary">
              Welcome back
            </AppText>
            <AppText variant="display">{profile?.name?.split(' ')[0] ?? 'there'} 👋</AppText>
            <AppText variant="caption" color="tertiary" style={styles.groupLabel}>
              {group?.name}
            </AppText>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Avatar name={profile?.name ?? ''} size={48} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="checkmark-done" label="Open tasks" value={String(openTasks.length)} tint={colors.primary} />
          <StatCard icon="cube" label="Borrowed" value={String(borrowedItems.length)} tint={colors.accent} />
          <StatCard
            icon="wallet"
            label="Your balance"
            value={`${myBalance >= 0 ? '+' : '-'}$${Math.abs(myBalance).toFixed(0)}`}
            tint={myBalance >= 0 ? colors.success : colors.danger}
          />
        </View>

        <View style={styles.quickActions}>
          <QuickAction icon="add-circle" label="Add Task" onPress={() => router.push('/add-task')} />
          <QuickAction icon="albums" label="Add Item" onPress={() => router.push('/add-item')} />
          <QuickAction icon="cash" label="Add Expense" onPress={() => router.push('/add-expense')} />
        </View>

        <AppText variant="subtitle" style={styles.sectionTitle}>
          Recent activity
        </AppText>

        {activity.length === 0 ? (
          <EmptyState
            icon="pulse-outline"
            title="No activity yet"
            subtitle="Add a task, item, or expense to see it here in real time."
          />
        ) : (
          <View style={styles.activityList}>
            {activity.map((entry) => (
              <Card key={entry.id} style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: `${entry.tint}22` }]}>
                  <Ionicons name={entry.icon} size={16} color={entry.tint} />
                </View>
                <AppText variant="body" style={styles.activityText}>
                  {entry.text}
                </AppText>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const colors = useAppColors();
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <View style={[styles.quickActionIcon, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl * 2,
    gap: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupLabel: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    marginTop: -Spacing.sm,
  },
  activityList: {
    gap: Spacing.sm,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    flex: 1,
  },
});
