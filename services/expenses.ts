import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export function addExpense(
  groupId: string,
  data: { title: string; amount: number; paidBy: string }
) {
  return addDoc(collection(db, 'groups', groupId, 'expenses'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
