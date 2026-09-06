import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';

function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

/** Subscribes to a Firestore subcollection in real time and normalizes timestamp fields to millis. */
export function useCollection<T extends { id: string }>(
  path: string[],
  constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || path.some((segment) => !segment)) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, path[0], ...path.slice(1)), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((docSnap) => {
          const raw = docSnap.data();
          const normalized: Record<string, unknown> = { ...raw, id: docSnap.id };
          for (const key of Object.keys(raw)) {
            const millis = toMillis(raw[key]);
            if (millis !== null) normalized[key] = millis;
          }
          return normalized as unknown as T;
        });
        setData(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.join('/')]);

  return { data, loading };
}
