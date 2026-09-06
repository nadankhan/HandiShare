import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { addItem } from '@/services/items';
import { useAuthStore } from '@/store/auth-store';

export default function AddItemModal() {
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!group || !profile || !name.trim()) return;
    setSaving(true);
    try {
      await addItem(group.id, { name: name.trim(), category: category.trim(), ownerId: profile.uid });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Item name" value={name} onChangeText={setName} placeholder="Cordless drill" autoFocus />
        <Input label="Category (optional)" value={category} onChangeText={setCategory} placeholder="Tools" />
        <Button label="Add Item" onPress={onSubmit} loading={saving} disabled={!name.trim()} style={styles.submit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  submit: {
    marginTop: Spacing.lg,
  },
});
