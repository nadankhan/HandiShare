import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { TaskStatus } from '@/types';

export function addTask(
  groupId: string,
  data: { title: string; description?: string; assignedTo: string | null; createdBy: string }
) {
  return addDoc(collection(db, 'groups', groupId, 'tasks'), {
    ...data,
    status: 'open' as TaskStatus,
    dueDate: null,
    createdAt: serverTimestamp(),
  });
}

export function setTaskStatus(groupId: string, taskId: string, status: TaskStatus) {
  return updateDoc(doc(db, 'groups', groupId, 'tasks', taskId), { status });
}

export function deleteTask(groupId: string, taskId: string) {
  return deleteDoc(doc(db, 'groups', groupId, 'tasks', taskId));
}
