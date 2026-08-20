# FitTrack – Demo 60 phút

Ứng dụng theo dõi tập luyện thể hình (mobile-first), giao diện **tiếng Việt**.

## Tính năng demo

- Bottom tab: Home / Routines / Log / Stats / Profile
- Bắt đầu buổi tập (tự do hoặc từ routine)
- Ghi weight / reps / sets, đánh dấu hoàn thành
- Tính total volume realtime
- Lưu buổi tập vào `localStorage`
- Xem lịch sử + chi tiết buổi tập
- 3 routine mẫu: Push Day, Pull Day, Leg Day
- Streak đơn giản trên Home

## Chạy local

```bash
npm install
# hoặc
pnpm install

npm run dev
```

Mở http://localhost:3000 (ưu tiên xem trên mobile / DevTools mobile).

## Stack

- TanStack Start (React 19 + Vite)
- Tailwind CSS v4
- Lucide React
- localStorage (demo) → sau này chuyển PostgreSQL khi deploy Render

## Cấu trúc dữ liệu

Xem `src/lib/storage.ts` – thiết kế gần với schema database thật để dễ migrate.

## Deploy sau này

1. Push lên GitHub
2. Kết nối Render (hoặc Railway / Fly.io / Vercel)
3. Thay localStorage bằng PostgreSQL khi cần

## Lộ trình đã hoàn thành (60 phút)

1. Khung app + Bottom Tab
2. Home + nút Bắt đầu tập
3. Active Workout – nhập set
4. Hoàn thành + lưu localStorage
5. Màn Log + chi tiết
6. Routines mẫu + polish + git commit
