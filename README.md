# Landing page MICC · Hải Vân Bay

Website: <https://vinhomeshaivanbaydanang.vn> (React + Vite, API nhận lead bằng PHP trên hosting cPanel AZDIGI).

## Tài liệu

- [docs/HUONG_DAN_SERVER.md](docs/HUONG_DAN_SERVER.md): **đọc đầu tiên**. Thông tin server, cách build & đưa bản mới lên, kiểm tra, xử lý lỗi
- [docs/HUONG_DAN_VERCEL.md](docs/HUONG_DAN_VERCEL.md): bản dự phòng trên Vercel, cách tạo bot Telegram / Google Sheet riêng
- [docs/LEAD_INTEGRATION_GUIDE.md](docs/LEAD_INTEGRATION_GUIDE.md): cấu trúc Google Sheet & mã Apps Script

## Chạy trên máy

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # tạo dist/ để upload
```
