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
import { addTask } from '@/services/tasks';
import { useAuthStore } from '@/store/auth-store';

export default function AddTaskModal() {
  const colors = useAppColors();
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState<string | null>(profile?.uid ?? null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!group || !profile || !title.trim()) return;
    setSaving(true);
    try {
      await addTask(group.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        assignedTo: assignee,
        createdBy: profile.uid,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Take out the trash" autoFocus />
        <Input
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details..."
          multiline
          style={styles.multiline}
        />

        <AppText variant="caption" color="secondary" style={styles.label}>
          Assign to
        </AppText>
        <View style={styles.assigneeRow}>
          {group?.members.map((member) => {
            const active = assignee === member.uid;
            return (
              <Pressable
                key={member.uid}
                onPress={() => setAssignee(member.uid)}
                style={[
                  styles.assigneeChip,
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

        <Button
          label="Add Task"
          onPress={onSubmit}
          loading={saving}
          disabled={!title.trim()}
          style={styles.submit}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  assigneeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  submit: {
    marginTop: Spacing.lg,
  },
});
