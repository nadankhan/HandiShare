import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import { Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/use-collection';
import { useAppColors } from '@/hooks/use-app-theme';
import { setTaskStatus } from '@/services/tasks';
import { useAuthStore } from '@/store/auth-store';
import type { Task } from '@/types';

export default function TasksScreen() {
  const colors = useAppColors();
  const group = useAuthStore((s) => s.group);
  const groupId = group?.id ?? '';
  const { data: tasks, loading } = useCollection<Task>(['groups', groupId, 'tasks']);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('open');

  const visible = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter]
  );

  const memberName = (uid: string | null) =>
    group?.members.find((m) => m.uid === uid)?.name ?? 'Unassigned';

  const toggle = (task: Task) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTaskStatus(groupId, task.id, task.status === 'done' ? 'open' : 'done');
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Tasks" subtitle="Synced live across your group" />
      <View style={styles.filterWrap}>
        <SegmentedTabs
          value={filter}
          onChange={setFilter}
          options={[
            { label: 'Open', value: 'open' },
            { label: 'Done', value: 'done' },
            { label: 'All', value: 'all' },
          ]}
        />
      </View>

      {!loading && visible.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="Nothing here"
          subtitle="Add a task and everyone in your group will see it instantly."
          actionLabel="Add Task"
          onAction={() => router.push('/add-task')}
        />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.taskCard}>
              <Pressable onPress={() => toggle(item)} hitSlop={8}>
                <Ionicons
                  name={item.status === 'done' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={item.status === 'done' ? colors.success : colors.textTertiary}
                />
              </Pressable>
              <View style={styles.taskBody}>
                <AppText
                  variant="bodyStrong"
                  style={item.status === 'done' ? styles.doneText : undefined}
                  color={item.status === 'done' ? 'tertiary' : 'primary'}
                >
                  {item.title}
                </AppText>
                {item.description ? (
                  <AppText variant="caption" color="secondary" numberOfLines={2}>
                    {item.description}
                  </AppText>
                ) : null}
              </View>
              <Avatar name={memberName(item.assignedTo)} size={30} />
            </Card>
          )}
        />
      )}

      <Fab onPress={() => router.push('/add-task')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterWrap: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  list: {
    padding: Spacing.xl,
    paddingTop: 0,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl * 2,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  taskBody: {
    flex: 1,
    gap: 2,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
});
