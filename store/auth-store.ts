import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { create } from 'zustand';

import { db, firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import type { Group, UserProfile } from '@/types';

type AuthState = {
  initializing: boolean;
  uid: string | null;
  profile: UserProfile | null;
  group: Group | null;
  authError: string | null;
  init: () => () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializing: true,
  uid: null,
  profile: null,
  group: null,
  authError: null,

  init: () => {
    if (!isFirebaseConfigured) {
      set({ initializing: false });
      return () => {};
    }

    let unsubProfile: (() => void) | null = null;
    let unsubGroup: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(firebaseAuth, (user) => {
      unsubProfile?.();
      unsubGroup?.();

      if (!user) {
        set({ uid: null, profile: null, group: null, initializing: false });
        return;
      }

      set({ uid: user.uid });

      unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        unsubGroup?.();
        const profile = snap.exists() ? ({ uid: user.uid, ...snap.data() } as UserProfile) : null;
        set({ profile, initializing: false });

        if (profile?.groupId) {
          unsubGroup = onSnapshot(doc(db, 'groups', profile.groupId), (groupSnap) => {
            set({
              group: groupSnap.exists()
                ? ({ id: groupSnap.id, ...groupSnap.data() } as Group)
                : null,
            });
          });
        } else {
          set({ group: null });
        }
      });
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
      unsubGroup?.();
    };
  },

  signUp: async (name, email, password) => {
    set({ authError: null });
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(doc(db, 'users', credential.user.uid), {
        name,
        email,
        groupId: null,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ authError: null });
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    }
  },

  signOut: async () => {
    await firebaseSignOut(firebaseAuth);
  },
}));
