# Global Modal System

## 📖 Tổng quan

Global Modal System cho phép hiển thị bottom sheet modal từ bất kỳ đâu trong ứng dụng mà không cần truyền props qua nhiều component hoặc quản lý state phức tạp.

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────┐
│           App.tsx                   │
│  ┌─────────────────────────────┐   │
│  │      GlobalModal            │   │
│  │  (Listen to store changes)  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         ↕️
┌─────────────────────────────────────┐
│    globalModalStore (Zustand)       │
│  - isVisible: boolean               │
│  - config: ModalConfig              │
│  - show()                           │
│  - close()                          │
└─────────────────────────────────────┘
         ↕️
┌─────────────────────────────────────┐
│  useGlobalModal Hook                │
│  - showModal()                      │
│  - closeModal()                     │
└─────────────────────────────────────┘
         ↕️
┌─────────────────────────────────────┐
│    Any Component/Screen             │
└─────────────────────────────────────┘
```

## 🚀 Cách sử dụng

### 1. Sử dụng trong Component (Khuyến nghị)

```tsx
import { useGlobalModal } from '@/hooks/useGlobalModal'
import { Text, TouchableOpacity, View } from 'react-native'

export default function MyScreen() {
  const { showModal, closeModal } = useGlobalModal()

  const handleShowModal = () => {
    showModal({
      content: (
        <View className='p-4'>
          <Text className='text-lg font-bold mb-4'>My Modal Title</Text>
          <Text className='mb-4'>Modal content goes here</Text>

          <TouchableOpacity
            className='bg-blue-500 p-3 rounded-lg'
            onPress={closeModal}>
            <Text className='text-white text-center'>Close</Text>
          </TouchableOpacity>
        </View>
      ),
      snapPoints: ['50%'],
      onClose: () => {
        console.log('Modal was closed')
      },
    })
  }

  return (
    <TouchableOpacity onPress={handleShowModal}>
      <Text>Open Modal</Text>
    </TouchableOpacity>
  )
}
```

### 2. Sử dụng trực tiếp từ Store (Outside React Component)

```tsx
import { useGlobalModalStore } from '@/store/globalModalStore'
import { Text, View } from 'react-native'

// Trong service, util, hoặc event handler
function someUtilityFunction() {
  useGlobalModalStore.getState().show({
    content: (
      <View className='p-4'>
        <Text>Modal from utility function</Text>
      </View>
    ),
    snapPoints: ['40%'],
  })
}

// Đóng modal
function closeModalFromAnywhere() {
  useGlobalModalStore.getState().close()
}
```

## ⚙️ Configuration Options

```typescript
type ShowModalParams = {
  // Nội dung của modal (required)
  content: React.ReactNode

  // Chiều cao modal - mảng các snap points
  // Default: ['60%']
  snapPoints?: (number | string)[]

  // Thời gian animation (ms)
  // Default: 250
  animationDuration?: number

  // Độ mờ của backdrop (0-1)
  // Default: 0.5
  backdropOpacity?: number

  // Cho phép kéo xuống để đóng
  // Default: true
  enablePanDownToClose?: boolean

  // Callback khi modal đóng
  onClose?: () => void
}
```

## 📝 Ví dụ

### Modal đơn giản

```tsx
showModal({
  content: <MyComponent />,
  snapPoints: ['40%'],
})
```

### Modal toàn màn hình

```tsx
showModal({
  content: <FullScreenContent />,
  snapPoints: ['90%'],
})
```

### Modal với nhiều snap points

```tsx
showModal({
  content: <ScrollableContent />,
  snapPoints: ['40%', '70%', '90%'],
})
```

### Modal không cho đóng bằng cách kéo

```tsx
showModal({
  content: (
    <View className='p-4'>
      <Text>Must close with button</Text>
      <TouchableOpacity onPress={closeModal}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  ),
  enablePanDownToClose: false,
})
```

### Modal với callback

```tsx
showModal({
  content: <FormComponent />,
  snapPoints: ['80%'],
  onClose: () => {
    console.log('Modal closed')
    // Cleanup logic
    // Refresh data
  },
})
```

### Modal với animation custom

```tsx
showModal({
  content: <AnimatedContent />,
  snapPoints: ['60%'],
  animationDuration: 500,
  backdropOpacity: 0.8,
})
```

## 🎯 Use Cases

### 1. Confirmation Dialog

```tsx
const showConfirmation = () => {
  showModal({
    content: (
      <View className='p-6'>
        <Text className='text-xl font-bold mb-4'>Confirm Action</Text>
        <Text className='mb-6'>Are you sure you want to delete this item?</Text>

        <View className='flex-row gap-3'>
          <TouchableOpacity
            className='flex-1 bg-gray-200 p-3 rounded-lg'
            onPress={closeModal}>
            <Text className='text-center'>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-1 bg-red-500 p-3 rounded-lg'
            onPress={() => {
              handleDelete()
              closeModal()
            }}>
            <Text className='text-white text-center'>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    snapPoints: ['35%'],
  })
}
```

### 2. Form Input

```tsx
const showEditForm = (item: Item) => {
  showModal({
    content: (
      <View className='p-4 flex-1'>
        <Text className='text-xl font-bold mb-4'>Edit Item</Text>
        <TextInput
          className='border p-3 rounded mb-4'
          defaultValue={item.name}
        />
        <TouchableOpacity
          className='bg-blue-500 p-3 rounded'
          onPress={() => {
            // Save logic
            closeModal()
          }}>
          <Text className='text-white text-center'>Save</Text>
        </TouchableOpacity>
      </View>
    ),
    snapPoints: ['70%'],
  })
}
```

### 3. Selection List

```tsx
const showOptions = () => {
  const options = ['Option 1', 'Option 2', 'Option 3']

  showModal({
    content: (
      <View className='p-4'>
        <Text className='text-lg font-bold mb-4'>Select Option</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            className='p-4 border-b'
            onPress={() => {
              handleSelect(option)
              closeModal()
            }}>
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    snapPoints: ['50%'],
  })
}
```

### 4. Success/Error Notification

```tsx
const showSuccess = (message: string) => {
  showModal({
    content: (
      <View className='p-6 items-center'>
        <View className='w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4'>
          <Text className='text-white text-2xl'>✓</Text>
        </View>
        <Text className='text-xl font-bold mb-2'>Success!</Text>
        <Text className='text-center mb-6'>{message}</Text>
        <TouchableOpacity
          className='bg-green-500 px-8 py-3 rounded-lg'
          onPress={closeModal}>
          <Text className='text-white'>OK</Text>
        </TouchableOpacity>
      </View>
    ),
    snapPoints: ['40%'],
  })
}
```

## ✅ Best Practices

### ✓ DO

1. **Sử dụng hook trong component**

   ```tsx
   const { showModal, closeModal } = useGlobalModal()
   ```

2. **Cleanup khi modal đóng**

   ```tsx
   showModal({
     content: <MyComponent />,
     onClose: () => {
       // Reset form
       // Clear temp data
     },
   })
   ```

3. **Responsive snap points**

   ```tsx
   snapPoints: ['40%', '70%'] // Cho phép expand
   ```

4. **Clear call-to-action**
   ```tsx
   // Luôn có nút Close rõ ràng
   <TouchableOpacity onPress={closeModal}>
     <Text>Close</Text>
   </TouchableOpacity>
   ```

### ✗ DON'T

1. **Không stack nhiều modal**

   ```tsx
   // ❌ Tránh
   showModal({ content: <Modal1 /> })
   showModal({ content: <Modal2 /> }) // Override modal1
   ```

2. **Không để modal không có cách đóng**

   ```tsx
   // ❌ Tránh
   showModal({
     content: <NoCloseButton />,
     enablePanDownToClose: false, // Không có cách đóng!
   })
   ```

3. **Không abuse global modal cho mọi thứ**
   ```tsx
   // ❌ Tránh - Dùng local modal thay vì
   // Cho content phức tạp, có nhiều state
   ```

## 🔧 Troubleshooting

### Modal không hiện

**Nguyên nhân:** GlobalModal chưa được thêm vào App.tsx

**Giải pháp:**

```tsx
// App.tsx
import GlobalModal from './components/atoms/GlobalModal'

function App() {
  return (
    <>
      <ApplicationNavigator />
      <GlobalModal /> {/* ← Đảm bảo có dòng này */}
    </>
  )
}
```

### Modal bị lag khi mở

**Nguyên nhân:** Content phức tạp, render chậm

**Giải pháp:**

- Sử dụng `React.memo` cho content
- Lazy load content nếu có thể
- Giảm `animationDuration`

### Modal không đóng được

**Nguyên nhân:** `enablePanDownToClose: false` và không có nút đóng

**Giải pháp:**

```tsx
// Luôn cung cấp cách đóng
showModal({
  content: (
    <View>
      <TouchableOpacity onPress={closeModal}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  ),
})
```

## 🎨 Styling Tips

### Custom Backdrop

```tsx
backdropOpacity: 0.7 // Dark backdrop
backdropOpacity: 0.3 // Light backdrop
```

### Animation Speed

```tsx
animationDuration: 150 // Fast
animationDuration: 250 // Normal (default)
animationDuration: 400 // Slow
```

### Responsive Heights

```tsx
// Mobile
snapPoints: ['50%']

// Tablet
snapPoints: ['40%']

// Content-based
snapPoints: [300] // Fixed height
```

## 📊 So sánh với các giải pháp khác

| Feature       | Global Modal | React Navigation Modal | Local State Modal |
| ------------- | ------------ | ---------------------- | ----------------- |
| Easy to use   | ✅ Very Easy | ⚠️ Medium              | ⚠️ Medium         |
| From anywhere | ✅ Yes       | ❌ No                  | ❌ No             |
| Performance   | ✅ Good      | ✅ Good                | ✅ Good           |
| Type safety   | ✅ Yes       | ✅ Yes                 | ✅ Yes            |
| Stacking      | ❌ No        | ✅ Yes                 | ✅ Yes            |
| Best for      | Quick modals | Navigation             | Complex UI        |

## 🔄 Migration Guide

### Từ Local Modal

**Trước:**

```tsx
const [visible, setVisible] = useState(false)

<Modal visible={visible} onClose={() => setVisible(false)}>
  <Content />
</Modal>
```

**Sau:**

```tsx
const { showModal } = useGlobalModal()

showModal({
  content: <Content />,
  onClose: () => {
    /* cleanup */
  },
})
```

### Từ React Navigation Modal

**Trước:**

```tsx
navigation.navigate('MyModal')
```

**Sau:**

```tsx
showModal({
  content: <MyModalScreen />,
})
```

## 📚 API Reference

### useGlobalModal()

```typescript
function useGlobalModal(): {
  showModal: (params: ShowModalParams) => void
  closeModal: () => void
}
```

### useGlobalModalStore

```typescript
type GlobalModalStore = {
  isVisible: boolean
  config: ModalConfig | null
  show: (config: ModalConfig) => void
  close: () => void
}
```

## 🎯 Kết luận

Global Modal System là giải pháp tối ưu cho:

- ✅ Confirmation dialogs
- ✅ Quick forms
- ✅ Selection lists
- ✅ Notifications
- ✅ Simple content

Không nên dùng cho:

- ❌ Complex multi-step flows (dùng navigation)
- ❌ Nested modals (dùng local modal)
- ❌ Full-screen forms (dùng screen)

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Maintainer:** Development Team
