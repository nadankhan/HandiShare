import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { ItemStatus } from '@/types';

export function addItem(
  groupId: string,
  data: { name: string; category: string; ownerId: string }
) {
  return addDoc(collection(db, 'groups', groupId, 'items'), {
    ...data,
    status: 'available' as ItemStatus,
    borrowedBy: null,
    borrowedAt: null,
    createdAt: serverTimestamp(),
  });
}

export function borrowItem(groupId: string, itemId: string, borrowerUid: string) {
  return updateDoc(doc(db, 'groups', groupId, 'items', itemId), {
    status: 'borrowed' as ItemStatus,
    borrowedBy: borrowerUid,
    borrowedAt: serverTimestamp(),
  });
}

export function returnItem(groupId: string, itemId: string) {
  return updateDoc(doc(db, 'groups', groupId, 'items', itemId), {
    status: 'available' as ItemStatus,
    borrowedBy: null,
    borrowedAt: null,
  });
}
