# React Native Day 6 — Робота з мережею, стан з'єднання та життєвий цикл застосунку

Expo SDK 57 · React Native 0.86 · TypeScript (strict) · @react-native-community/netinfo 12.

## Запуск

```bash
npm install
npx expo start        # Expo Go: відскануйте QR-код
npx expo start --web  # React Native Web preview
```

## Структура

```text
App.tsx                         SafeAreaProvider → PostsScreen
src/
├── types/post.ts               інтерфейси Post, PostCardProps
├── hooks/useFetch.ts           Завдання 1: useFetch<T>(url): FetchState<T> з AbortController
├── components/
│   ├── OfflineNotice.tsx       Завдання 1: NetInfo.addEventListener → червоний банер / null
│   └── PostCard.tsx            Завдання 2: title (2 рядки, bold), body (3 рядки), Pressable «Видалити»
└── screens/PostsScreen.tsx     Завдання 2: ActivityIndicator / ErrorState / FlatList + RefreshControl,
                                AppState → refetch()
```

## Перевірки

```bash
npx tsc --noEmit   # без помилок
npx expo-doctor    # 21/21 checks passed
```
