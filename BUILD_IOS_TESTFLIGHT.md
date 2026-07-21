# Build iOS & Đẩy Lên TestFlight

## Các Bước Chính

### 1. Cài Đặt Dependencies

```bash
cd mobile-app

yarn install
npx pod-install
```

### 2. Build Archive (Xcode)

1. Mở `ios/mirroto.xcworkspace` bằng Xcode
2. Chọn **Product → Archive**

### 3. Upload Lên TestFlight

**Cách 1: Transporter (Khuyến nghị)**

- Download **Transporter** từ App Store
- Login Apple Developer account
- Kéo file IPA vào > Click **Deliver**

**Cách 2: Xcode Organizer**

- Xcode > **Window** > **Organizer**
- Tab **Archives** > Chọn archive > **Distribute App** > **App Store Connect** > **Upload**

---

## Vòng Lặp Khi Gặp Lỗi

```
yarn install & npx pod-install → Lỗi? → Sửa → Lặp lại
          ↓
Product → Archive → Lỗi? → Sửa → Lặp lại
          ↓
     Upload TestFlight
```

### Lỗi Thường Gặp & Cách Fix

| Lỗi                     | Cách Fix                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Pod install failed      | `cd ios && pod deintegrate && pod install --repo-update`     |
| Pod sandbox không match | Kiểm tra `IPHONEOS_DEPLOYMENT_TARGET` trong Podfile = '15.1' |
| Code signing lỗi        | Tạo lại Certificate & Provisioning Profile                   |
| Archive failed          | Xcode: **Product → Clean Build Folder** (Cmd+Shift+K)        |

---

**Cập nhật**: Tháng 3/2026
