# 🚀 Micro Batch + Flush Strategy

## 📖 Khái niệm

- **Buffer**: Nơi tạm giữ update socket
- **Flush**: Đẩy buffer vào store theo nhịp cố định (**300ms**)

---

## 🔄 Flow hoạt động

```
Socket nhận tick
      ↓
Bỏ vào buffer (theo symbol)
      ↓
Mỗi 300ms → flush 1 lần
      ↓
Update Zustand store 1 lần
```

---

## ✅ Không mất dữ liệu

### Ví dụ: BTC bắn 10 msg/s

Trong **300ms** có thể có **1–2 tick**.

Buffer sẽ giữ:

```typescript
buffer['BTCUSD'] = latestTick
```

> ⚡ **Chỉ giữ giá mới nhất** → Không cần render tick trung gian

---

### Symbol không có tick sẽ không bị update

Nếu **AUD/USD** không có message trong 300ms:

- ❌ Buffer không có AUD/USD
- ❌ Flush không động tới AUD/USD
- ✅ Giá giữ nguyên
- ✅ Không có "update giả"

---

## 💻 Code Strategy

### 1️⃣ Khởi tạo Buffer

```typescript
let batchedUpdates: Record<string, RT> = {}
```

### 2️⃣ Nhận tick từ Socket

```typescript
socket.on('ticker', (message) => {
  const raw = message?.data ?? message
  const symbol = raw?.symbol ?? raw?.code
  if (!symbol) return

  batchedUpdates[symbol] = {
    ...batchedUpdates[symbol],
    ...raw,
    ts: Date.now(),
  }
})
```

### 3️⃣ Flush theo clock (Throttle)

```typescript
setInterval(() => {
  if (Object.keys(batchedUpdates).length === 0) return

  const updates = batchedUpdates
  batchedUpdates = {}

  set((s) => ({
    rtBySymbol: {
      ...s.rtBySymbol,
      ...updates,
    },
  }))
}, 300)
```

---

## ⚠️ Selector Rule (BẮT BUỘC)

### 🎯 UI chỉ được subscribe đúng symbol

#### ✅ **Đúng:**

```typescript
useMarketSocketStore((s) => s.rtBySymbol[symbol]?.bid)
```

#### ❌ **Sai:**

```typescript
useMarketSocketStore((s) => s.rtBySymbol)
```

> 🚨 **Cảnh báo**: Subscribe toàn bộ `rtBySymbol` sẽ khiến toàn bộ list re-render mỗi flush!

---

## 📊 Performance Benefits

| Metric          | Trước  | Sau                 |
| --------------- | ------ | ------------------- |
| Re-renders/giây | ~10-20 | ~3 (300ms interval) |
| CPU Usage       | Cao    | Thấp                |
| UI Smoothness   | Lag    | Mượt                |

---

## 🎯 Best Practices

1. ✅ Luôn select **chính xác symbol** cần thiết
2. ✅ Sử dụng **selective subscription**
3. ✅ Tránh subscribe toàn bộ `rtBySymbol`
4. ✅ Kiểm tra `symbol` trước khi update buffer
5. ✅ Cleanup khi component unmount
