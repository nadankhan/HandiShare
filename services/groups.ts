import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { Member } from '@/types';

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createGroup(name: string, member: Member) {
  const groupRef = doc(collection(db, 'groups'));
  await setDoc(groupRef, {
    name,
    inviteCode: generateInviteCode(),
    createdBy: member.uid,
    members: [member],
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'users', member.uid), { groupId: groupRef.id });
  return groupRef.id;
}

export async function joinGroupByInviteCode(inviteCode: string, member: Member) {
  const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode.toUpperCase()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('No group found with that invite code.');
  }
  const groupDoc = snapshot.docs[0];
  await updateDoc(groupDoc.ref, { members: arrayUnion(member) });
  await updateDoc(doc(db, 'users', member.uid), { groupId: groupDoc.id });
  return groupDoc.id;
}
