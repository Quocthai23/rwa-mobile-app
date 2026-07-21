# Theme System Documentation

## Tổng quan

Theme System trong project hỗ trợ **2 CÁCH SỬ DỤNG**:

### 1. **Tailwind CSS (NativeWind)** - Khuyến nghị cho hầu hết trường hợp

- Sử dụng `className` với Tailwind classes
- Nhanh, gọn, dễ đọc
- Tự động support Dark/Light mode (sẽ được config sau)
- **Đây là cách được dùng phổ biến nhất trong project**

### 2. **useTheme Hook** - Cho trường hợp đặc biệt

- Dùng khi cần dynamic colors/styles
- Khi cần access theme variant
- Khi tạo custom StyleSheet phức tạp

> **KHÔNG BẮT BUỘC** phải dùng `useTheme`. Bạn có thể dùng Tailwind classes hoàn toàn.

> **KHÔNG BẮT BUỘC** phải dùng `useTheme`. Bạn có thể dùng Tailwind classes hoàn toàn.

---

## CÁCH 1: Tailwind CSS (Khuyến nghị) ⭐

### Sử dụng cơ bản

```typescript
import { View, Text } from 'react-native';

const MyComponent = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold text-neutral-900">
        Hello World
      </Text>
      <Text className="text-sm text-neutral-500 mt-2">
        Subtitle
      </Text>
    </View>
  );
};
```

### Colors có sẵn trong Tailwind

#### Màu chính (Primary/Secondary/Semantic)

```typescript
// Primary (Blue)
className="bg-primary-500"      // Background: #0158FF
className="text-primary-500"    // Text color
className="border-primary-500"  // Border color

// Với các shades
className="bg-primary-50"       // Nhạt nhất
className="bg-primary-100"
className="bg-primary-200"
...
className="bg-primary-900"      // Đậm nhất

// Secondary
className="bg-secondary-500"    // #F3F4F6
className="text-secondary"      // #6B7280

// Semantic colors
className="bg-success-500"      // Green #12B76A
className="bg-error-500"        // Red #F04438
className="bg-warning-500"      // Yellow #FFCC00
className="bg-information-500"  // Blue #2563EB
```

#### Neutral/Gray colors (Quan trọng nhất)

```typescript
// Neutral scale (white → black)
className = 'bg-neutral-0'; // White #FFFFFF
className = 'bg-neutral-50'; // #F9FAFB
className = 'bg-neutral-100'; // #F3F4F6
className = 'bg-neutral-200'; // #E5E7EB
className = 'bg-neutral-300'; // #D1D5DB
className = 'bg-neutral-400'; // #9CA3AF
className = 'bg-neutral-500'; // #6B7280
className = 'bg-neutral-600'; // #4B5563
className = 'bg-neutral-700'; // #374151
className = 'bg-neutral-800'; // #1F2937
className = 'bg-neutral-900'; // #111827 (gần đen)
className = 'bg-neutral-1000'; // #030712 (đen)

// Hoặc dùng gray (tương tự)
className = 'bg-gray-100';
className = 'text-gray-700';
```

### Typography với Tailwind

#### Font sizes cơ bản

```typescript
className = 'text-xs'; // 12px
className = 'text-sm'; // 14px
className = 'text-base'; // 16px
className = 'text-lg'; // 18px
className = 'text-xl'; // 20px
className = 'text-2xl'; // 24px
className = 'text-3xl'; // 32px
className = 'text-4xl'; // 40px
```

#### Font weights

```typescript
className = 'font-thin'; // 100
className = 'font-light'; // 300
className = 'font-normal'; // 400
className = 'font-medium'; // 500
className = 'font-semibold'; // 600
className = 'font-bold'; // 700
className = 'font-extrabold'; // 800
className = 'font-black'; // 900
```

#### Text styles có sẵn (kết hợp size + weight + line-height)

```typescript
// Headings
className = 'text-h1-bold'; // 24px, bold
className = 'text-h2-semibold'; // 20px, semibold
className = 'text-h3-medium'; // 18px, medium
className = 'text-h4-regular'; // 16px, regular

// Body text
className = 'text-body-regular'; // 16px, regular
className = 'text-body-medium'; // 16px, medium
className = 'text-body-small-regular'; // 14px, regular
className = 'text-body-large-semibold'; // 18px, semibold

// Caption & Label
className = 'text-caption-regular'; // 12px, regular
className = 'text-label-medium'; // 14px, medium

// Button
className = 'text-button-semibold'; // 16px, semibold
className = 'text-button-small-medium'; // 14px, medium
```

### Layout với Tailwind

#### Flexbox

```typescript
className = 'flex flex-row'; // Row direction
className = 'flex flex-col'; // Column direction
className = 'flex-1'; // Flex: 1

// Align & Justify
className = 'items-center'; // Align items center
className = 'items-start';
className = 'items-end';
className = 'justify-center'; // Justify center
className = 'justify-between';
className = 'justify-around';

// Gap
className = 'gap-2'; // 8px
className = 'gap-4'; // 16px
className = 'gap-6'; // 24px
```

#### Spacing (Padding/Margin)

```typescript
// Padding
className = 'p-4'; // Padding all: 16px
className = 'px-4'; // Horizontal: 16px
className = 'py-2'; // Vertical: 8px
className = 'pt-4'; // Top: 16px
className = 'pb-4'; // Bottom: 16px
className = 'pl-4'; // Left: 16px
className = 'pr-4'; // Right: 16px

// Margin (tương tự)
className = 'm-4';
className = 'mx-4';
className = 'my-2';
className = 'mt-4';
className = 'mb-4';
```

#### Sizes

```typescript
className = 'w-full'; // Width 100%
className = 'h-full'; // Height 100%
className = 'w-1/2'; // Width 50%
className = 'w-screen'; // Width 100vw
className = 'h-screen'; // Height 100vh

// Cụ thể
className = 'w-[200px]'; // Width: 200px
className = 'h-[48px]'; // Height: 48px
```

#### Border

```typescript
className = 'border'; // Border 1px
className = 'border-2'; // Border 2px
className = 'border-neutral-200'; // Border color
className = 'rounded'; // Border radius 4px
className = 'rounded-md'; // 6px
className = 'rounded-lg'; // 8px
className = 'rounded-xl'; // 12px
className = 'rounded-2xl'; // 16px
className = 'rounded-full'; // Circle
```

### Ví dụ thực tế với Tailwind

```typescript
// Card component
<View className="bg-white rounded-xl p-4 border border-gray-200">
  <View className="flex-row items-center gap-3 mb-3">
    <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center">
      <Text className="text-white text-lg font-bold">A</Text>
    </View>
    <View className="flex-1">
      <Text className="text-h4-semibold text-neutral-900">John Doe</Text>
      <Text className="text-body-small-regular text-neutral-500">john@example.com</Text>
    </View>
  </View>

  <View className="flex-row justify-between mt-4">
    <View className="items-center">
      <Text className="text-h3-bold text-neutral-900">150</Text>
      <Text className="text-caption-regular text-neutral-500">Posts</Text>
    </View>
    <View className="items-center">
      <Text className="text-h3-bold text-neutral-900">2.5k</Text>
      <Text className="text-caption-regular text-neutral-500">Followers</Text>
    </View>
  </View>

  <TouchableOpacity className="mt-4 bg-primary-500 py-3 rounded-lg">
    <Text className="text-button-semibold text-white text-center">
      Follow
    </Text>
  </TouchableOpacity>
</View>

// Transaction screen header (ví dụ có sẵn)
<View className="flex-row items-center px-4 py-3 border-b border-gray-100">
  <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
    <ChevronLeft size={28} color="#111827" />
  </TouchableOpacity>
  <View className="ml-3">
    <Text className="text-lg font-semibold text-black">{symbol}</Text>
    <Text className="text-secondary">{symbol}</Text>
  </View>
</View>
```

---

## CÁCH 2: useTheme Hook (Cho trường hợp đặc biệt)

---

## CÁCH 2: useTheme Hook (Cho trường hợp đặc biệt)

### Khi nào dùng useTheme?

✅ **NÊN DÙNG khi:**

- Cần colors động (dynamic) dựa vào logic
- Cần check theme variant hiện tại (dark/light)
- Tạo StyleSheet phức tạp với nhiều điều kiện
- Component cần thay đổi style theo state

❌ **KHÔNG CẦN DÙNG khi:**

- Chỉ cần static colors/styles → Dùng Tailwind
- Layout đơn giản → Dùng Tailwind
- UI cố định không đổi → Dùng Tailwind

### Import và sử dụng

### Import và sử dụng

```typescript
import { useTheme } from '@/theme';
```

### Sử dụng trong component

```typescript
const MyComponent = () => {
  const { colors, fonts, layout, backgrounds, borders, gutters, typography } = useTheme();

  return (
    <View style={[layout.flex_1, backgrounds.gray100]}>
      <Text style={[fonts.size_16, { color: colors.neutral700 }]}>
        Hello World
      </Text>
    </View>
  );
};
```

## Những gì có thể sử dụng từ useTheme

### Lưu ý quan trọng

> Hầu hết các giá trị này đã được map vào Tailwind classes. Chỉ dùng useTheme khi thực sự cần!

### 1. **Colors** - Màu sắc tự động thay đổi theo theme

```typescript
const { colors } = useTheme();

// Các màu chính
colors.primary500; // Màu primary chính (#0158FF)
colors.secondary500; // Màu secondary (#F3F4F6)

// Màu trạng thái
colors.success500; // Màu success (#12B76A)
colors.error500; // Màu error (#F04438)
colors.warning500; // Màu warning (#FFCC00)
colors.information500; // Màu info (#2563EB)

// Màu neutral (Gray scale) - TỰ ĐỘNG thay đổi theo Dark/Light
colors.neutral0; // White trong light, tối nhất trong dark
colors.neutral50; // Nhạt nhất
colors.neutral100;
colors.neutral200;
colors.neutral300;
colors.neutral400;
colors.neutral500; // Giữa
colors.neutral600;
colors.neutral700;
colors.neutral800;
colors.neutral900;
colors.neutral1000; // Tối nhất trong light, white trong dark

// Background & Text colors (tự động thay đổi)
colors.background; // Background chính của app
colors.card; // Background của card
colors.text; // Text color chính
colors.textSecondary; // Text color phụ
colors.border; // Border color
```

**Ví dụ sử dụng:**

```typescript
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Chữ này tự động đổi màu</Text>
  <Text style={{ color: colors.textSecondary }}>Chữ phụ</Text>
</View>
```

### 2. **Fonts** - Font sizes và colors

```typescript
const { fonts } = useTheme();

// Font sizes (có sẵn styles)
fonts.size_10;
fonts.size_12;
fonts.size_14;
fonts.size_16; // Base size
fonts.size_18;
fonts.size_20;
fonts.size_24;
fonts.size_32;
fonts.size_40;
fonts.size_48;
fonts.size_64;
fonts.size_80;

// Font weights
fonts.thin;
fonts.light;
fonts.regular;
fonts.medium;
fonts.semiBold;
fonts.bold;
fonts.extraBold;
fonts.black;

// Font colors (tự động theo theme)
fonts.textPrimary; // Màu text chính
fonts.textSecondary; // Màu text phụ
fonts.textSuccess; // Màu text success
fonts.textError; // Màu text error
```

**Ví dụ:**

```typescript
<Text style={[fonts.size_16, fonts.semiBold, fonts.textPrimary]}>
  Tiêu đề
</Text>
```

### 3. **Typography** - Text styles hoàn chỉnh

```typescript
const { typography } = useTheme();

// Headings
typography.h1; // 32px, bold
typography.h2; // 24px, bold
typography.h3; // 20px, semiBold
typography.h4; // 18px, semiBold
typography.h5; // 16px, semiBold
typography.h6; // 14px, semiBold

// Body text
typography.body1; // 16px, regular
typography.body2; // 14px, regular
typography.body3; // 12px, regular

// Special styles
typography.caption; // 12px, regular
typography.overline; // 10px, uppercase
typography.button; // 16px, semiBold
typography.link; // 16px với underline
```

**Ví dụ:**

```typescript
<Text style={typography.h1}>Heading 1</Text>
<Text style={typography.body1}>Nội dung chính</Text>
<Text style={typography.caption}>Caption nhỏ</Text>
```

### 4. **Layout** - Flexbox và positioning

```typescript
const { layout } = useTheme();

// Flexbox direction
layout.row;
layout.rowReverse;
layout.col;
layout.colReverse;

// Align items
layout.itemsCenter;
layout.itemsStart;
layout.itemsEnd;
layout.itemsStretch;

// Justify content
layout.justifyCenter;
layout.justifyStart;
layout.justifyEnd;
layout.justifyBetween;
layout.justifyAround;

// Flex wrap
layout.wrap;

// Sizes
layout.flex_1;
layout.fullWidth;
layout.fullHeight;

// Positions
layout.absolute;
layout.relative;
layout.top0;
layout.bottom0;
layout.left0;
layout.right0;
layout.z1;
layout.z10;
```

**Ví dụ:**

```typescript
<View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### 5. **Backgrounds** - Background colors

```typescript
const { backgrounds } = useTheme();

backgrounds.primary
backgrounds.success
backgrounds.error
backgrounds.warning

// Gray backgrounds
backgrounds.gray50
backgrounds.gray100
backgrounds.gray200
...
backgrounds.gray900

// Special backgrounds
backgrounds.transparent
backgrounds.white
backgrounds.black
```

### 6. **Borders** - Border styles

```typescript
const { borders } = useTheme();

// Border colors
borders.primary
borders.success
borders.error
borders.gray100
borders.gray200
...

// Border radius
borders.rounded_4
borders.rounded_8
borders.rounded_12
borders.rounded_16
borders.rounded_24
borders.roundedFull

// Border widths
borders.w_1
borders.w_2
borders.w_4
```

### 7. **Gutters** - Spacing (margins & paddings)

```typescript
const { gutters } = useTheme();

// Padding all
gutters.padding_4
gutters.padding_8
gutters.padding_12
gutters.padding_16
gutters.padding_20
gutters.padding_24
gutters.padding_32

// Padding specific
gutters.paddingHorizontal_16
gutters.paddingVertical_12
gutters.paddingTop_20
gutters.paddingBottom_20
gutters.paddingLeft_16
gutters.paddingRight_16

// Margins (tương tự padding)
gutters.margin_8
gutters.marginHorizontal_16
gutters.marginVertical_12
gutters.marginTop_20
...

// Gaps
gutters.gap_4
gutters.gap_8
gutters.gap_12
gutters.gap_16
```

### 8. **Components** - Component styles được generate sẵn

```typescript
const { components } = useTheme();

// Button styles
components.buttonCircle;
components.buttonPrimary;
components.buttonOutline;

// Card styles
components.card;
components.cardShadow;

// Input styles
components.input;
components.inputBorder;
```

## Switch Theme (Đổi Dark/Light mode)

```typescript
const { changeTheme, variant } = useTheme();

// Kiểm tra theme hiện tại
console.log(variant); // 'default' hoặc 'dark'

// Đổi theme
changeTheme('dark'); // Chuyển sang Dark mode
changeTheme('default'); // Chuyển về Light mode

// Toggle theme
const toggleTheme = () => {
  changeTheme(variant === 'dark' ? 'default' : 'dark');
};
```

## So sánh 2 cách

### Tailwind CSS vs useTheme

| Tiêu chí         | Tailwind (className)    | useTheme Hook       |
| ---------------- | ----------------------- | ------------------- |
| **Độ phổ biến**  | ⭐⭐⭐⭐⭐ Rất phổ biến | ⭐⭐⭐ Ít dùng hơn  |
| **Tốc độ code**  | ⚡ Nhanh                | 🐢 Chậm hơn         |
| **Dễ đọc**       | ✅ Dễ đọc               | ❌ Dài dòng hơn     |
| **Dynamic**      | ❌ Không linh hoạt      | ✅ Linh hoạt        |
| **TypeScript**   | ⚠️ Không type-safe      | ✅ Type-safe        |
| **Khi nào dùng** | Hầu hết mọi trường hợp  | Trường hợp đặc biệt |

### Ví dụ so sánh code

**Cùng 1 UI - 2 cách viết:**

```typescript
// ⭐ CÁCH 1: TAILWIND (Khuyến nghị)
const ProfileCard = () => (
  <View className="bg-white p-4 rounded-xl border border-gray-200">
    <Text className="text-h3-semibold text-neutral-900">John Doe</Text>
    <Text className="text-body-small-regular text-neutral-500 mt-1">
      john@example.com
    </Text>
  </View>
);

// CÁCH 2: useTheme (Dài dòng hơn)
const ProfileCard = () => {
  const { colors, gutters, borders, typography } = useTheme();

  return (
    <View style={[
      { backgroundColor: colors.neutral0 },
      gutters.padding_16,
      borders.rounded_16,
      { borderWidth: 1, borderColor: colors.neutral200 }
    ]}>
      <Text style={[typography.h3, { color: colors.neutral900 }]}>
        John Doe
      </Text>
      <Text style={[
        typography.body2,
        { color: colors.neutral500 },
        gutters.marginTop_4
      ]}>
        john@example.com
      </Text>
    </View>
  );
};
```

### Khi nào dùng useTheme?

**✅ Trường hợp NÊN dùng:**

```typescript
// 1. Màu động theo state
const StatusBadge = ({ status }) => {
  const { colors } = useTheme();

  const bgColor = status === 'success'
    ? colors.success500
    : status === 'error'
    ? colors.error500
    : colors.warning500;

  return <View style={{ backgroundColor: bgColor }} />;
};

// 2. Cần check theme variant
const MyComponent = () => {
  const { variant, changeTheme } = useTheme();

  return (
    <TouchableOpacity onPress={() => changeTheme(variant === 'dark' ? 'default' : 'dark')}>
      <Text>Switch to {variant === 'dark' ? 'Light' : 'Dark'} mode</Text>
    </TouchableOpacity>
  );
};

// 3. StyleSheet phức tạp với logic
const ComplexComponent = ({ isActive, size }) => {
  const { colors, layout } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...layout.flex_1,
      backgroundColor: isActive ? colors.primary500 : colors.neutral100,
      width: size === 'large' ? 200 : 100,
      opacity: isActive ? 1 : 0.5,
    },
  });

  return <View style={styles.container} />;
};
```

**❌ Trường hợp KHÔNG CẦN dùng:**

```typescript
// ❌ KHÔNG NÊN - Dùng Tailwind thay vì useTheme
const SimpleCard = () => {
  const { colors, gutters } = useTheme();

  return (
    <View style={[
      { backgroundColor: colors.neutral0 },
      gutters.padding_16
    ]}>
      <Text style={{ color: colors.neutral900 }}>Title</Text>
    </View>
  );
};

// ✅ NÊN - Dùng Tailwind
const SimpleCard = () => (
  <View className="bg-white p-4">
    <Text className="text-neutral-900">Title</Text>
  </View>
);
```

---

## Quick Reference - Tailwind Classes thường dùng

### Colors

```
bg-primary-500        text-primary-500      border-primary-500
bg-success-500        text-success-500      border-success-500
bg-error-500          text-error-500        border-error-500
bg-warning-500        text-warning-500      border-warning-500
bg-neutral-{0-1000}   text-neutral-{0-1000} border-neutral-{0-1000}
bg-white              text-black            border-gray-200
```

### Typography

```
text-xs text-sm text-base text-lg text-xl text-2xl text-3xl
font-normal font-medium font-semibold font-bold
text-h1-bold text-h2-semibold text-body-regular text-caption-medium
```

### Layout

```
flex flex-row flex-col flex-1
items-center items-start items-end
justify-center justify-between justify-around
gap-2 gap-4 gap-6
```

### Spacing

```
p-2 p-4 p-6        px-4 py-2        pt-4 pb-4 pl-4 pr-4
m-2 m-4 m-6        mx-4 my-2        mt-4 mb-4 ml-4 mr-4
```

### Size & Border

```
w-full h-full w-1/2 h-[48px] w-[200px]
border border-2 rounded rounded-lg rounded-xl rounded-full
```

---

## Kết luận

### 🎯 Quy tắc vàng:

1. **Mặc định: Dùng Tailwind** - Nhanh, gọn, dễ maintain
2. **useTheme chỉ khi**: Cần dynamic colors, check variant, hoặc logic phức tạp
3. **Kết hợp cả 2**: Tailwind cho layout, useTheme cho logic

### 📝 Checklist trước khi code:

- [ ] Màu cố định? → Tailwind: `className="bg-primary-500"`
- [ ] Layout đơn giản? → Tailwind: `className="flex flex-row items-center"`
- [ ] Màu thay đổi theo state? → useTheme: `colors.success500`
- [ ] Cần switch theme? → useTheme: `changeTheme('dark')`

**Import đúng cách:**

```typescript
// Chỉ import khi cần
import { useTheme } from '@/theme'; // Khi dùng useTheme

// Không cần import gì khi dùng Tailwind
<View className="bg-white p-4" />
```

---

### 1. **Luôn dùng colors từ theme thay vì hardcode**

❌ **Không nên:**

```typescript
<View style={{ backgroundColor: '#F3F4F6' }}>
  <Text style={{ color: '#111827' }}>Text</Text>
</View>
```

✅ **Nên:**

```typescript
const { colors, backgrounds } = useTheme();

<View style={backgrounds.gray100}>
  <Text style={{ color: colors.neutral900 }}>Text</Text>
</View>
```

### 2. **Kết hợp styles để tái sử dụng**

```typescript
const { layout, gutters, backgrounds, borders, typography } = useTheme();

<View style={[
  layout.flex_1,
  backgrounds.white,
  gutters.padding_16,
  borders.rounded_12,
  borders.gray200,
]}>
  <Text style={typography.h3}>Title</Text>
  <Text style={typography.body1}>Content</Text>
</View>
```

### 3. **Tạo custom styles với theme**

```typescript
const MyComponent = () => {
  const { colors, layout, gutters } = useTheme();

  const customStyles = StyleSheet.create({
    container: {
      ...layout.flex_1,
      ...gutters.padding_16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
  });

  return (
    <View style={customStyles.container}>
      <Text style={customStyles.title}>Hello</Text>
    </View>
  );
};
```

### 4. **Sử dụng semantic colors cho trạng thái**

```typescript
const { colors } = useTheme();

// Success state
<Text style={{ color: colors.success500 }}>Thành công</Text>

// Error state
<Text style={{ color: colors.error500 }}>Lỗi</Text>

// Warning state
<Text style={{ color: colors.warning500 }}>Cảnh báo</Text>
```

## Navigation Theme

Theme tự động được áp dụng cho React Navigation:

```typescript
const { navigationTheme } = useTheme();

// navigationTheme đã được config sẵn cho NavigationContainer
// Bao gồm colors cho header, tab bar, background, card, etc.
```

## Example: Component hoàn chỉnh với Theme

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

const ProfileCard = () => {
  const {
    colors,
    layout,
    gutters,
    backgrounds,
    borders,
    typography
  } = useTheme();

  return (
    <View style={[
      layout.flex_1,
      backgrounds.white,
      gutters.padding_16,
      borders.rounded_16,
      { borderWidth: 1, borderColor: colors.border }
    ]}>
      {/* Header */}
      <View style={[layout.row, layout.itemsCenter, gutters.marginBottom_12]}>
        <View style={[
          {
            width: 48,
            height: 48,
            backgroundColor: colors.primary500,
            borderRadius: 24,
          },
          layout.itemsCenter,
          layout.justifyCenter
        ]}>
          <Text style={{ color: colors.neutral0, fontSize: 20 }}>A</Text>
        </View>

        <View style={[layout.flex_1, gutters.marginLeft_12]}>
          <Text style={typography.h4}>John Doe</Text>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>
            john@example.com
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[layout.row, layout.justifyBetween, gutters.marginTop_16]}>
        <View style={layout.itemsCenter}>
          <Text style={typography.h3}>150</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Posts
          </Text>
        </View>

        <View style={layout.itemsCenter}>
          <Text style={typography.h3}>2.5k</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Followers
          </Text>
        </View>

        <View style={layout.itemsCenter}>
          <Text style={typography.h3}>500</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Following
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={[
        gutters.marginTop_16,
        gutters.padding_12,
        borders.rounded_8,
        { backgroundColor: colors.primary500 }
      ]}>
        <Text style={[
          typography.button,
          { color: colors.neutral0, textAlign: 'center' }
        ]}>
          Follow
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;
```

## Tóm tắt

Với Theme System này, bạn có thể:

- ✅ Tự động support Dark/Light mode mà không cần code thêm
- ✅ Sử dụng colors, fonts, layouts được định nghĩa sẵn
- ✅ Dễ dàng maintain và scale khi cần thay đổi design
- ✅ Code sạch hơn, không hardcode màu sắc
- ✅ Consistent design system toàn ứng dụng

**Import và dùng ngay:** `import { useTheme } from '@/theme'`
