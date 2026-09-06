import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/use-collection';
import { borrowItem, returnItem } from '@/services/items';
import { useAuthStore } from '@/store/auth-store';
import type { Item } from '@/types';

export default function ItemsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const group = useAuthStore((s) => s.group);
  const groupId = group?.id ?? '';
  const { data: items, loading } = useCollection<Item>(['groups', groupId, 'items']);

  const memberName = (uid: string | null) =>
    group?.members.find((m) => m.uid === uid)?.name ?? 'Someone';

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Items" subtitle="Lend and borrow within your group" />

      {!loading && items.length === 0 ? (
        <EmptyState
          icon="cube-outline"
          title="No items yet"
          subtitle="Add something you're happy to lend out — a drill, a ladder, a board game."
          actionLabel="Add Item"
          onAction={() => router.push('/add-item')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isMine = item.borrowedBy === profile?.uid;
            return (
              <Card style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Avatar name={memberName(item.ownerId)} size={28} />
                  <Badge
                    label={item.status}
                    tone={item.status === 'available' ? 'success' : 'warning'}
                  />
                </View>
                <AppText variant="bodyStrong" numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </AppText>
                <AppText variant="caption" color="tertiary">
                  {item.category || 'Uncategorized'}
                </AppText>
                {item.status === 'available' ? (
                  <Button
                    label="Borrow"
                    variant="secondary"
                    fullWidth
                    style={styles.itemAction}
                    onPress={() => groupId && profile && borrowItem(groupId, item.id, profile.uid)}
                  />
                ) : isMine ? (
                  <Button
                    label="Return"
                    variant="ghost"
                    fullWidth
                    style={styles.itemAction}
                    onPress={() => groupId && returnItem(groupId, item.id)}
                  />
                ) : (
                  <AppText variant="caption" color="secondary" style={styles.borrowedBy}>
                    with {memberName(item.borrowedBy)}
                  </AppText>
                )}
              </Card>
            );
          }}
        />
      )}

      <Fab onPress={() => router.push('/add-item')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.xl,
    paddingTop: 0,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl * 2,
  },
  column: {
    gap: Spacing.md,
  },
  itemCard: {
    flex: 1,
    gap: Spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  itemName: {
    marginTop: Spacing.xs,
  },
  itemAction: {
    marginTop: Spacing.sm,
  },
  borrowedBy: {
    marginTop: Spacing.sm,
  },
});
