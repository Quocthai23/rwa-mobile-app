# ReusableTabsPager

Component Tabs với Pager hỗ trợ swipe, animation, lazy loading và tùy chỉnh linh hoạt.

## Features

- ✅ **Swipe giữa các tabs** - Hỗ trợ gesture swipe mượt mà
- ✅ **Animation underline** - Gạch dưới di chuyển theo scroll
- ✅ **Lazy loading** - Chỉ render tab khi cần thiết
- ✅ **Auto-center active tab** - Tab đang active tự động scroll vào giữa
- ✅ **Tùy chỉnh màu sắc và style** - Flexible styling options
- ✅ **Right action** - Thêm button/icon ở góc phải header
- ✅ **Custom label render** - Tùy chỉnh cách hiển thị label

## Basic Usage

```tsx
import ReusableTabsPager, {
  TabItem,
} from '@/components/atoms/Pager/ReusableTabsPager'

const MyScreen = () => {
  const tabs: TabItem[] = [
    {
      key: 'tab1',
      label: 'Tab 1',
      render: (
        <View>
          <Text>Content 1</Text>
        </View>
      ),
    },
    {
      key: 'tab2',
      label: 'Tab 2',
      render: (
        <View>
          <Text>Content 2</Text>
        </View>
      ),
    },
    {
      key: 'tab3',
      label: 'Tab 3',
      render: (
        <View>
          <Text>Content 3</Text>
        </View>
      ),
    },
  ]

  return <ReusableTabsPager tabs={tabs} />
}
```

## Props

### Required Props

| Prop   | Type        | Description                                         |
| ------ | ----------- | --------------------------------------------------- |
| `tabs` | `TabItem[]` | Mảng các tab items (xem TabItem structure bên dưới) |

### Optional Props

| Prop                | Type                   | Default         | Description                                   |
| ------------------- | ---------------------- | --------------- | --------------------------------------------- |
| `defaultIndex`      | `number`               | `0`             | Index của tab mặc định khi mount              |
| `lazy`              | `boolean`              | `true`          | Bật lazy loading - chỉ render tab đã visited  |
| `placeholder`       | `ReactNode`            | Loading spinner | Hiển thị khi tab chưa được render (lazy mode) |
| `containerStyle`    | `ViewStyle`            | `{ flex: 1 }`   | Style cho container chính                     |
| `headerBorderColor` | `string`               | `'#E5E7EB'`     | Màu border dưới header                        |
| `activeColor`       | `string`               | `'#2563eb'`     | Màu text của tab active                       |
| `inactiveColor`     | `string`               | `'#4B5563'`     | Màu text của tab inactive                     |
| `underlineColor`    | `string`               | `'#2563eb'`     | Màu gạch dưới tab active                      |
| `rightAction`       | `ReactNode`            | `undefined`     | Component hiển thị bên phải header            |
| `onIndexChange`     | `(index, tab) => void` | `undefined`     | Callback khi đổi tab                          |

## TabItem Structure

```tsx
type TabItem = {
  key: string // Unique key (required)
  label: string // Text hiển thị trên tab (required)
  render: ReactNode | (() => ReactNode) // Content của tab (required)
  renderLabel?: (isActive: boolean) => ReactNode // Custom label render (optional)
}
```

## Advanced Examples

### 1. Với Right Action (Filter/Sort Button)

```tsx
const tabs = [...]; // your tabs

<ReusableTabsPager
  tabs={tabs}
  rightAction={
    <TouchableOpacity onPress={() => console.log('Filter')}>
      <Icon name="filter" size={20} color="#6B7280" />
    </TouchableOpacity>
  }
/>
```

### 2. Custom Label Render

```tsx
const tabs: TabItem[] = [
  {
    key: 'favorites',
    label: 'Favorites',
    renderLabel: (isActive) => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Star size={16} color={isActive ? '#2563eb' : '#6B7280'} />
        <Text
          style={{ color: isActive ? '#2563eb' : '#6B7280', marginLeft: 4 }}>
          Favorites
        </Text>
      </View>
    ),
    render: <FavoritesContent />,
  },
  // ... other tabs
]

;<ReusableTabsPager tabs={tabs} />
```

### 3. Với Function Render (Dynamic Content)

```tsx
const tabs: TabItem[] = [
  {
    key: 'markets',
    label: 'Markets',
    render: () => {
      // Có thể fetch data hoặc logic khác ở đây
      const data = useMarketData()
      return <MarketList data={data} />
    },
  },
  // ... other tabs
]
```

### 4. Custom Colors & Styles

```tsx
<ReusableTabsPager
  tabs={tabs}
  activeColor='#10B981'
  inactiveColor='#9CA3AF'
  underlineColor='#10B981'
  headerBorderColor='#E5E7EB'
  containerStyle={{ backgroundColor: '#F9FAFB' }}
/>
```

### 5. Disable Lazy Loading

```tsx
<ReusableTabsPager
  tabs={tabs}
  lazy={false} // Render tất cả tabs ngay từ đầu
/>
```

### 6. Custom Placeholder for Lazy Tabs

```tsx
<ReusableTabsPager
  tabs={tabs}
  lazy={true}
  placeholder={
    <View style={{ padding: 20 }}>
      <ActivityIndicator color='#2563eb' />
      <Text style={{ marginTop: 10, textAlign: 'center' }}>Đang tải...</Text>
    </View>
  }
/>
```

### 7. Track Tab Changes

```tsx
<ReusableTabsPager
  tabs={tabs}
  onIndexChange={(index, tab) => {
    console.log('Changed to:', tab.label, 'at index:', index)
    // Track analytics, update state, etc.
  }}
/>
```

### 8. Set Default Tab

```tsx
<ReusableTabsPager
  tabs={tabs}
  defaultIndex={2} // Bắt đầu ở tab thứ 3
/>
```

## Real-World Example

```tsx
import { Star, TrendingUp, Clock } from 'lucide-react-native'

const MarketScreen = () => {
  const tabs: TabItem[] = [
    {
      key: 'favorites',
      label: 'Favorites',
      renderLabel: (isActive) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Star size={16} color={isActive ? '#2563eb' : '#6B7280'} />
          <Text style={{ color: isActive ? '#2563eb' : '#6B7280' }}>
            Favorites
          </Text>
        </View>
      ),
      render: () => <FavoritesList />,
    },
    {
      key: 'trending',
      label: 'Trending',
      renderLabel: (isActive) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={16} color={isActive ? '#2563eb' : '#6B7280'} />
          <Text style={{ color: isActive ? '#2563eb' : '#6B7280' }}>
            Trending
          </Text>
        </View>
      ),
      render: () => <TrendingList />,
    },
    {
      key: 'recent',
      label: 'Recent',
      renderLabel: (isActive) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Clock size={16} color={isActive ? '#2563eb' : '#6B7280'} />
          <Text style={{ color: isActive ? '#2563eb' : '#6B7280' }}>
            Recent
          </Text>
        </View>
      ),
      render: () => <RecentList />,
    },
  ]

  const [filterMode, setFilterMode] = useState('all')

  return (
    <ReusableTabsPager
      tabs={tabs}
      defaultIndex={0}
      activeColor='#2563eb'
      inactiveColor='#6B7280'
      underlineColor='#2563eb'
      rightAction={
        <TouchableOpacity onPress={() => setFilterMode('filtered')}>
          <Icon name='filter' size={20} color='#6B7280' />
        </TouchableOpacity>
      }
      onIndexChange={(index, tab) => {
        console.log('Switched to:', tab.label)
      }}
    />
  )
}
```

## Tips & Best Practices

1. **Unique Keys**: Đảm bảo mỗi tab có `key` duy nhất
2. **Lazy Loading**: Bật `lazy={true}` cho performance tốt hơn khi có nhiều tabs
3. **Performance**: Sử dụng `React.memo()` cho tab content nếu cần
4. **Content Height**: Nội dung trong tab sẽ tự động scroll nếu vượt quá màn hình
5. **Animation**: Underline animation sử dụng native driver, rất mượt mà
6. **Initial Scroll**: Component tự động scroll header để tab active vào giữa

## Performance Optimization

```tsx
// Memoize tab content để tránh re-render không cần thiết
const FavoritesList = React.memo(() => {
  const data = useFavorites()
  return <FlatList data={data} {...props} />
})

const tabs: TabItem[] = [
  {
    key: 'favorites',
    label: 'Favorites',
    render: <FavoritesList />, // Wrapped with memo
  },
  // ... other tabs
]
```

## Notes

- Component sử dụng `Animated.FlatList` cho content pager
- Header tự động scroll để hiển thị tab active ở giữa
- Hỗ trợ RTL (Right-to-Left) layouts
- Compatible với React Native 0.60+
- TypeScript support đầy đủ
