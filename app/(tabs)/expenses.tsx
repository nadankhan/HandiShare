import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/use-collection';
import { useAppColors } from '@/hooks/use-app-theme';
import { computeBalances } from '@/lib/balances';
import { useAuthStore } from '@/store/auth-store';
import type { Expense } from '@/types';

export default function ExpensesScreen() {
  const colors = useAppColors();
  const group = useAuthStore((s) => s.group);
  const groupId = group?.id ?? '';
  const { data: expenses, loading } = useCollection<Expense>(['groups', groupId, 'expenses']);

  const memberName = (uid: string) => group?.members.find((m) => m.uid === uid)?.name ?? 'Someone';

  const balances = useMemo(
    () => computeBalances(expenses, group?.members ?? []),
    [expenses, group?.members]
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Expenses" subtitle="Split equally, settled live" />

      {group && group.members.length > 0 ? (
        <View style={styles.balancesRow}>
          {group.members.map((member) => {
            const balance = balances[member.uid] ?? 0;
            return (
              <Card key={member.uid} style={styles.balanceCard}>
                <Avatar name={member.name} size={32} />
                <AppText variant="caption" color="secondary" numberOfLines={1} style={styles.balanceName}>
                  {member.name.split(' ')[0]}
                </AppText>
                <AppText
                  variant="bodyStrong"
                  style={{ color: balance >= 0 ? colors.success : colors.danger }}
                >
                  {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(0)}
                </AppText>
              </Card>
            );
          })}
        </View>
      ) : null}

      {!loading && expenses.length === 0 ? (
        <EmptyState
          icon="wallet-outline"
          title="No expenses yet"
          subtitle="Add a shared cost and it'll split evenly across the group automatically."
          actionLabel="Add Expense"
          onAction={() => router.push('/add-expense')}
        />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.expenseCard}>
              <Avatar name={memberName(item.paidBy)} size={36} />
              <View style={styles.expenseBody}>
                <AppText variant="bodyStrong">{item.title}</AppText>
                <AppText variant="caption" color="secondary">
                  Paid by {memberName(item.paidBy)}
                </AppText>
              </View>
              <AppText variant="bodyStrong">${item.amount.toFixed(2)}</AppText>
            </Card>
          )}
        />
      )}

      <Fab onPress={() => router.push('/add-expense')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  balancesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  balanceCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
  },
  balanceName: {
    marginTop: 2,
  },
  list: {
    padding: Spacing.xl,
    paddingTop: 0,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl * 2,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  expenseBody: {
    flex: 1,
    gap: 2,
  },
});
