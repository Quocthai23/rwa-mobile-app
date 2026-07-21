# Rules

1. Làm việc với date: Sử dụng thư viện nhẹ (ví dụ: dayjs) để xử lý ngày tháng đơn giản, chính xác và gọn gàng hơn. Tránh xử lý thủ công.
2. Constants và tham số: Tách ra file riêng để dễ dàng tái sử dụng và quản lý.
3. Clean code:
    - Không viết hàm thừa (viết ra nhưng không dùng).
    - Loại bỏ các comment ngắn vô nghĩa, không cần thiết.
4. Architecture: Sử dụng object mapper để chuyển đổi dữ liệu, giúp việc mở rộng sau này tốt hơn.
5. Third-party APIs:
    - Kiểm tra kỹ các vấn đề như Captcha, CORS (ví dụ: tradingeconomics).
    - Định nghĩa Type rõ ràng cho response của API, tuyệt đối không dùng `any`.
