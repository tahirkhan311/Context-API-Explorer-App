# Context API Explorer App

A React Native + Web app demonstrating Context API for state management, authentication, product listing, and theme switching. Built with Expo and TypeScript.

## Features

✅ **Authentication**

- Login with AsyncStorage token persistence
- Platform-specific API endpoints (DummyJSON for web, reqres.in for native)
- Local mock API server for development
- Auto-logout on invalid token

✅ **Product Management**

- Fetch product list from mock API
- Server-side search and pagination
- Client-side filtering with search bar
- Pull-to-refresh
- Infinite scroll (load more on end)
- Product detail view

✅ **Global State Management**

- `AuthContext` — login, logout, token management
- `ApiContext` — product fetching, search, pagination
- `ThemeContext` — light/dark mode toggle
- `ToastProvider` — error notifications

✅ **UI/UX**

- Animated loader with fade effect
- Toast notifications for errors
- Responsive design (web + mobile)
- Header logout button

✅ **Bonus Features**

- Token stored in AsyncStorage
- Auto-login if token exists
- Logout button in header
- Client-side filtering
- Pagination support
- Animated UI components

## Tech Stack

- **React** 19.1.0
- **React Native** 0.81.5
- **Expo** ~54.0.30
- **TypeScript** ~5.9.2
- **Axios** ^1.13.2
- **React Navigation** ^7.1.26
- **AsyncStorage** ^2.2.0
- **json-server** ^0.17.4 (mock API)

## Project Structure

```
context-api-explorer/
├── src/
│   ├── components/
│   │   ├── Loader.tsx           # Animated loader with fade effect
│   │   ├── ProductCard.tsx      # Product card component
│   │   └── Toast.tsx            # Toast notification provider
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication context & provider
│   │   ├── ApiContext.tsx       # Product API context & provider
│   │   └── ThemeContext.tsx     # Theme context (light/dark)
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Stack navigator with auth guard
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Login form with platform-specific defaults
│   │   ├── ProductListScreen.tsx # Product list with search & pagination
│   │   └── ProductDetailScreen.tsx # Product detail view
│   └── services/
│       └── api.ts              # Axios instance with token interceptor
├── App.tsx                       # Root component with all providers
├── index.ts                      # App entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── server.js                     # Mock API server
├── db.json                       # Mock database
└── README.md                     # This file
```

## Installation

### Prerequisites

- Node.js 16+ & npm
- Expo CLI: `npm install -g expo-cli`

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/tahirkhan311/Context-API-Explorer-App.git
   cd context-api-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the App

### Option 1: Web (Recommended for quick testing)

**Terminal 1 — Start Mock API Server:**

```bash
npm run mock-api
```

You should see:

```
Mock API server running at http://localhost:3000
Web login: username=kminchelle, password=0lelplR
Native login: email=eve.holt@reqres.in, password=cityslicka
```

**Terminal 2 — Start Expo Web:**

```bash
npx expo start --web
```

Then open http://localhost:19006 (or the URL shown in terminal)

**Login with:**

- Username: `kminchelle`
- Password: `0lelplR`

### Option 2: Mobile (Native)

**Terminal 1 — Start Mock API Server:**

```bash
npm run mock-api
```

**Terminal 2 — Start Expo:**

```bash
npx expo start
```

Then:

- **Android**: Press `a` to open Android emulator
- **iOS**: Press `i` to open iOS simulator
- **Expo Go**: Scan QR code with your phone

**Login with:**

- Email: `eve.holt@reqres.in`
- Password: `cityslicka`

## Context Architecture

### AuthContext

Manages authentication state and login/logout operations.

```typescript
type AuthContextType = {
  token: string | null;
  initializing: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
```

**Usage:**

```tsx
const { token, login, logout, loading } = useContext(AuthContext);
```

### ApiContext

Manages product data fetching, search, and pagination.

```typescript
type ApiContextType = {
  products: Product[];
  loading: boolean;
  canLoadMore: () => boolean;
  fetchProducts: (options?: {
    reset?: boolean;
    search?: string;
  }) => Promise<void>;
  page: number;
  limit: number;
  total: number | null;
  query: string;
};
```

**Usage:**

```tsx
const { products, fetchProducts, loading, canLoadMore } =
  useContext(ApiContext);
```

### ThemeContext

Manages light/dark mode toggle.

```typescript
type ThemeContextType = {
  dark: boolean;
  setDark: (value: boolean) => void;
};
```

**Usage:**

```tsx
const { dark, setDark } = useContext(ThemeContext);
```

## API Endpoints

### Mock API Server (localhost:3000)

**POST /auth** — Authenticate

```bash
curl -X POST http://localhost:3000/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"kminchelle","password":"0lelplR"}'
```

Response:

```json
{
  "token": "mock-token-web-12345"
}
```

**GET /products** — Fetch products

```bash
curl http://localhost:3000/products?limit=10&skip=0
```

Response:

```json
[
  {
    "id": 1,
    "title": "Wireless Headphones",
    "price": 79.99,
    "thumbnail": "https://via.placeholder.com/150?text=Headphones",
    "description": "High-quality wireless headphones with noise cancellation."
  },
  ...
]
```

## Features Walkthrough

### 1. Login Flow

1. Open app on web or mobile
2. Show animated loader while checking AsyncStorage for token
3. Display login screen if no token
4. Enter credentials and tap Login
5. Mock API validates and returns token
6. Token stored in AsyncStorage
7. Navigate to Products screen

### 2. Product List

1. Auto-fetch products on screen mount
2. Search bar filters products client-side as you type
3. Press Enter to search server-side
4. Pull down to refresh
5. Scroll to bottom to load more (pagination)
6. Tap product to view details

### 3. Product Details

1. Shows product image, title, price, description
2. Back button returns to list

### 4. Logout

1. Tap "Logout" button in Products header
2. Token removed from AsyncStorage
3. Return to login screen

## Token Management

Tokens are automatically attached to API requests via axios interceptor:

```typescript
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Troubleshooting

### "Connection Refused" Error

**Cause:** Mock API server not running
**Fix:** Start the server in a separate terminal:

```bash
npm run mock-api
```

### "Invalid Credentials" Error

**Cause:** Wrong username/password
**Fix:** Use correct test credentials:

- Web: `kminchelle` / `0lelplR`
- Native: `eve.holt@reqres.in` / `cityslicka`

### "useNativeDriver is not supported" Warning

**Cause:** React Native Web doesn't support native animations
**Status:** Safe to ignore, falls back to JS animations

### "props.pointerEvents is deprecated" Warning

**Cause:** React Native Web internal deprecation
**Status:** Safe to ignore, doesn't affect functionality

## Development Notes

- Mock API server is Node.js based with custom `/auth` endpoint
- Database is stored in `db.json` (can be modified for testing)
- Axios instance in `src/services/api.ts` handles all HTTP requests
- Toast system uses React Animated API
- Navigation with React Navigation Stack navigator
- Platform detection via `Platform.OS` from React Native

## Future Enhancements

- [ ] Add native push notifications
- [ ] Persist theme preference to AsyncStorage
- [ ] Add product ratings/reviews
- [ ] Implement wishlist feature
- [ ] Add checkout flow
- [ ] User profile management
- [ ] Real backend API integration

## Scripts

```bash
npm start              # Start Expo
npm run android        # Start Android emulator
npm run ios            # Start iOS simulator
npm run web            # Start web
npm run mock-api       # Start mock API server
npm install            # Install dependencies
```

## License

MIT

## Author

Built with ❤️ for learning Context API and React Native.

---

**Questions?** Check the console for detailed error logs or refer to project comments in source files.
