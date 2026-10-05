import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PostCardProps } from '../types/post';

function PostCardComponent({ post, onDelete }: PostCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>
      <Text style={styles.body} numberOfLines={3}>
        {post.body}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          #{post.id} · автор {post.userId}
        </Text>
        <Pressable
          onPress={() => onDelete(post.id)}
          accessibilityRole="button"
          accessibilityLabel={`Видалити пост ${post.id}`}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        >
          {({ pressed }) => (
            <Text style={[styles.deleteText, pressed && styles.deleteTextPressed]}>
              🗑 Видалити
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export const PostCard = memo(PostCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  deleteButtonPressed: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    transform: [{ scale: 0.96 }],
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  deleteTextPressed: {
    color: '#FFFFFF',
  },
});
