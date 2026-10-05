import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { OfflineNotice } from '../components/OfflineNotice';
import { PostCard } from '../components/PostCard';
import { useFetch } from '../hooks/useFetch';
import type { Post } from '../types/post';

const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=15';

export default function PostsScreen() {
  const { data, isLoading, error, refetch } = useFetch<Post[]>(API_URL);
  const [posts, setPosts] = useState<Post[]>([]);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Синхронізуємо локальний стан з даними сервера після успішного завантаження
  useEffect(() => {
    if (data) setPosts(data);
  }, [data]);

  // Автооновлення при поверненні застосунку з background/inactive у active
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (/inactive|background/.test(appState.current) && nextAppState === 'active') {
        refetch();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refetch]);

  const handleDelete = useCallback((id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }, []);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <PostCard post={item} onDelete={handleDelete} />,
    [handleDelete],
  );

  const isEmpty = posts.length === 0;

  let content: ReactNode;

  if (isLoading && isEmpty) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.hint}>Завантажуємо публікації…</Text>
      </View>
    );
  } else if (error && isEmpty) {
    content = (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Не вдалося завантажити стрічку</Text>
        <Text style={styles.hint}>{error}</Text>
        <Pressable
          onPress={refetch}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryText}>Повторити спробу</Text>
        </Pressable>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, isEmpty && styles.listContentEmpty]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Стрічка публікацій</Text>
            <Text style={styles.headerSubtitle}>
              {posts.length} {pluralizePosts(posts.length)} · потягніть униз, щоб оновити
            </Text>
            {error ? <Text style={styles.inlineError}>⚠️ {error}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Публікацій немає</Text>
            <Text style={styles.hint}>Усі пости видалено. Потягніть униз, щоб завантажити знову.</Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <OfflineNotice />
      {content}
    </View>
  );
}

function pluralizePosts(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'публікація';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'публікації';
  return 'публікацій';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  retryButtonPressed: {
    backgroundColor: '#1D4ED8',
    transform: [{ scale: 0.97 }],
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  inlineError: {
    marginTop: 8,
    fontSize: 13,
    color: '#DC2626',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
});
