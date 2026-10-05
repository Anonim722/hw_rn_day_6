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

## Завдання 1 — `useFetch` та `OfflineNotice`

- `useEffect` створює `AbortController`, передає `signal` у `fetch(url, { signal })`, у cleanup викликає `controller.abort()` — запит скасовується при розмонтуванні, зміні `url` або повторному запиті.
- `isLoading = true` перед запитом, `false` у `finally`. Для скасованого запиту `finally` нічого не змінює, бо станом уже керує новий запит.
- `res.ok === true` → `data = await res.json()`, інакше кидаємо помилку з HTTP-статусом. `AbortError` ігнорується.
- `refetch` (`useCallback`) збільшує внутрішній лічильник `reloadKey` із залежностей ефекту, тому ефект запускається знову.
- `OfflineNotice` підписується через `NetInfo.addEventListener` і повертає `unsubscribe()`. Офлайн — це `isConnected === false || isInternetReachable === false`. Значення `null` («ще перевіряється») офлайном не вважається.

## Завдання 2 — `PostsScreen`

- Дані: `https://jsonplaceholder.typicode.com/posts?_limit=15` через `useFetch<Post[]>`.
- Локальний стан `posts` синхронізується з `data`. Видалення працює локально (`filter`).
- Первинне завантаження: центрований `ActivityIndicator` з підказкою.
- Помилка при порожньому списку: повідомлення та кнопка «Повторити спробу» → `refetch()`. Якщо пости вже є, а оновлення не вдалося, помилка показується в шапці списку.
- `FlatList`: `keyExtractor`, `RefreshControl` (`refreshing={isLoading}`, `onRefresh={refetch}`), `ListEmptyComponent`, коли всі пости видалено.
- `AppState`: попередній стан зберігається в `useRef(AppState.currentState)`. Перехід `inactive|background → active` викликає `refetch()`, cleanup — `subscription.remove()`.

## Як перевірити

1. **Pull-to-refresh** — потягніть список униз.
2. **Видалення / порожній стан** — видаліть усі картки, з'явиться `ListEmptyComponent`.
3. **AppState** — згорніть застосунок і відкрийте знову: стрічка перезавантажиться, видалені пости повернуться.
4. **Офлайн** — увімкніть режим польоту: з'явиться червоний банер. Якщо перезапустити застосунок без мережі, з'явиться екран помилки з кнопкою повтору.

## Перевірки

```bash
npx tsc --noEmit   # без помилок
npx expo-doctor    # 21/21 checks passed
```
