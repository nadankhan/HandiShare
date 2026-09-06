import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-theme';
import { addExpense } from '@/services/expenses';
import { useAuthStore } from '@/store/auth-store';

export default function AddExpenseModal() {
  const colors = useAppColors();
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<string | null>(profile?.uid ?? null);
  const [saving, setSaving] = useState(false);

  const parsedAmount = Number(amount);
  const valid = title.trim().length > 0 && parsedAmount > 0 && paidBy;

  const onSubmit = async () => {
    if (!group || !valid || !paidBy) return;
    setSaving(true);
    try {
      await addExpense(group.id, { title: title.trim(), amount: parsedAmount, paidBy });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="What for?" value={title} onChangeText={setTitle} placeholder="Groceries" autoFocus />
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <AppText variant="caption" color="secondary" style={styles.label}>
          Paid by
        </AppText>
        <View style={styles.payerRow}>
          {group?.members.map((member) => {
            const active = paidBy === member.uid;
            return (
              <Pressable
                key={member.uid}
                onPress={() => setPaidBy(member.uid)}
                style={[
                  styles.payerChip,
                  { borderColor: active ? colors.primary : colors.border },
                  active && { backgroundColor: colors.primaryMuted },
                ]}
              >
                <Avatar name={member.name} size={22} />
                <AppText variant="caption" style={{ color: active ? colors.primary : colors.textSecondary }}>
                  {member.name.split(' ')[0]}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText variant="caption" color="tertiary" style={styles.hint}>
          Splits evenly across all {group?.members.length ?? 0} members.
        </AppText>

        <Button label="Add Expense" onPress={onSubmit} loading={saving} disabled={!valid} style={styles.submit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  label: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  payerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  payerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  hint: {
    marginLeft: Spacing.xs,
  },
  submit: {
    marginTop: Spacing.lg,
  },
});
