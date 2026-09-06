import type { Expense, Member } from '@/types';

/** Every expense splits equally across all group members. Returns net balance per uid (positive = owed to them). */
export function computeBalances(expenses: Expense[], members: Member[]) {
  const balances: Record<string, number> = {};
  for (const member of members) balances[member.uid] = 0;
  if (members.length === 0) return balances;

  for (const expense of expenses) {
    const share = expense.amount / members.length;
    for (const member of members) {
      balances[member.uid] = (balances[member.uid] ?? 0) - share;
    }
    balances[expense.paidBy] = (balances[expense.paidBy] ?? 0) + expense.amount;
  }

  return balances;
}
