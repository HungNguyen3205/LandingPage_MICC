# Hướng dẫn deploy Vercel & thêm token — Landing page MICC · Hải Vân Bay

Tài liệu này dùng khi deploy website lên Vercel và khi bàn giao cho khách.
Repo đã được cấu hình sẵn (`vercel.json`, `.vercelignore`), chỉ cần thêm **biến môi trường** là chạy.

---

## 1. Website cần những biến nào?

| Tên biến | Bắt buộc | Giá trị | Ghi chú |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Có | Token bot, dạng `123456789:AAH...` | Lấy từ @BotFather |
| `TELEGRAM_CHAT_ID` | Có | ID nhóm nhận lead, dạng `-100...` hoặc `-4...` | Xem mục 5.2 |
| `GOOGLE_SHEET_WEBHOOK_URL` | Có | Link Web App Apps Script, dạng `https://script.google.com/macros/s/.../exec` | Xem mục 5.3 |
| `LEAD_SOURCE_LABEL` | Nên có | `MICC · Hải Vân Bay` | Hiện trên tiêu đề tin Telegram và cột nguồn Sheet, giúp phân biệt khi nhiều website dùng chung bot/sheet |
| `VITE_ENABLE_DEMO_MODE` | Có | `false` | `true` = form chỉ chạy thử, không gửi dữ liệu |

Giá trị hiện tại của dự án nằm trong file `.env` trên máy (không có trên GitHub). Mở file đó để copy.

> Chỉ cần **ít nhất một** kênh (Telegram hoặc Sheet) hoạt động là lead được ghi nhận.
> Nếu cả hai đều lỗi, website báo khách gọi hotline thay vì báo "thành công" giả, nên không mất lead âm thầm.

---

## 2. Cách A — Làm trên giao diện web Vercel (khuyên dùng)

### 2.1. Tạo project
0. Đảm bảo code mới nhất đã được **push lên GitHub** (Vercel build từ GitHub, không lấy file trên máy).
1. Vào <https://vercel.com/new>, đăng nhập.
2. Ở mục **Import Git Repository**, chọn repo `LandingPage_MICC` (nếu chưa thấy: **Adjust GitHub App Permissions** → cho phép repo này).
3. Màn hình cấu hình: **để nguyên mặc định**. Framework `Vite`, build `npm run build`, output `dist` đã được khai báo trong `vercel.json`.
4. Mở mục **Environment Variables** ngay trên màn hình này và thêm 5 biến ở bảng mục 1 (xem 2.2).
5. Bấm **Deploy**.

### 2.2. Thêm / sửa token (Settings → Environment Variables)
1. Vào project → **Settings** → **Environment Variables**.
2. Với mỗi biến:
   - **Key**: tên biến (ví dụ `TELEGRAM_BOT_TOKEN`), gõ đúng chữ hoa.
   - **Value**: dán giá trị, không có dấu ngoặc kép, không có khoảng trắng thừa.
   - **Environments**: tick **Production** và **Preview**.
   - Bật **Sensitive** cho `TELEGRAM_BOT_TOKEN` và `GOOGLE_SHEET_WEBHOOK_URL`. Sau khi lưu sẽ không ai xem lại được giá trị, chỉ ghi đè.
3. Bấm **Save**.

### 2.3. Bắt buộc: Redeploy sau khi thêm/sửa biến
Biến mới **không tự áp dụng** cho bản đang chạy.
**Deployments** → bản mới nhất → nút **⋯** → **Redeploy** → bỏ tick *Use existing Build Cache* → **Redeploy**.

---

## 3. Cách B — Dùng Vercel CLI (cho người quen dòng lệnh)

```bash
npm i -g vercel          # nếu máy chưa có
vercel login
vercel link              # chọn team, tạo project mới tên landingpage-micc

# Thêm từng biến cho Production (lặp lại với "preview" thay cho "production" nếu cần).
# CLI mặc định lưu dạng Sensitive (không xem lại được), riêng biến không bí mật dùng --no-sensitive.
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
vercel env add GOOGLE_SHEET_WEBHOOK_URL production
vercel env add LEAD_SOURCE_LABEL production --no-sensitive
vercel env add VITE_ENABLE_DEMO_MODE production --no-sensitive   # nhập: false

vercel env ls            # kiểm tra đã đủ 5 biến
vercel --prod            # deploy bản chính thức
```

Mỗi lệnh `env add` sẽ hỏi giá trị. Dán vào rồi Enter.

---

## 4. Kiểm tra sau khi deploy (bắt buộc trước khi bàn giao)

| # | Việc cần làm | Kết quả đúng |
|---|---|---|
| 1 | Mở website trên điện thoại, điền form với tên `TEST - <tên bạn>` | Hiện thông báo đăng ký thành công |
| 2 | Xem nhóm Telegram | Có tin "ĐĂNG KÝ TƯ VẤN MỚI — MICC · Hải Vân Bay" |
| 3 | Xem Google Sheet | Có dòng mới, cột nguồn bắt đầu bằng `[MICC · Hải Vân Bay]` |
| 4 | Ở bảng giá, bấm một mã căn (ví dụ VM-03) rồi gửi form | Tin Telegram có nội dung "Tôi quan tâm căn VM-03…" |
| 5 | Mở `https://<tên-miền>/api/config.local.php` | Trang 404 hoặc trang chủ, **không** tải về file |
| 6 | Xóa dòng test trong Sheet | — |

Không thấy tin Telegram hoặc dòng Sheet: vào **Deployments → bản mới nhất → Functions / Logs**, tìm dòng `Lead NOT delivered` để biết kênh nào thiếu (`hasWebhook` / `hasTelegram`).

---

## 5. Bàn giao cho khách

### 5.1. ⚠️ Không giao token dùng chung
Hiện dự án dùng **chung bot Telegram và Google Sheet** với các landing page khác của DANAVA.
Ai có `TELEGRAM_BOT_TOKEN` thì điều khiển được bot đó; ai có link webhook thì ghi được vào Sheet chung.
Trước khi chuyển quyền cho khách, **thay bằng bot và Sheet riêng của khách** (5.2 và 5.3), rồi redeploy.

Hai cách bàn giao:
- **Chuyển cả project**: project → **Settings → General → Transfer Project** sang team Vercel của khách. Biến môi trường đi theo project, nên phải thay token riêng **trước** khi chuyển.
- **Khách tự deploy**: chuyển/cho khách fork repo GitHub, khách làm lại mục 2 bằng tài khoản Vercel của họ với token của họ.

### 5.2. Tạo bot Telegram riêng & lấy Chat ID
1. Trong Telegram, mở **@BotFather** → gửi `/newbot` → đặt tên → nhận **token** (`TELEGRAM_BOT_TOKEN`).
2. Tạo nhóm nhận lead, thêm bot vừa tạo vào nhóm, gửi một tin bất kỳ trong nhóm (ví dụ `hello`).
3. Mở trình duyệt: `https://api.telegram.org/bot<TOKEN>/getUpdates` (thay `<TOKEN>`).
4. Tìm `"chat":{"id":-100...` → số âm đó là **`TELEGRAM_CHAT_ID`**.
   Nếu kết quả rỗng: gửi thêm một tin trong nhóm rồi tải lại trang.

### 5.3. Tạo Google Sheet riêng
Làm theo mục 2 trong `docs/LEAD_INTEGRATION_GUIDE.md` (dán mã Apps Script → **Deploy → New deployment → Web app**, *Execute as: Me*, *Who has access: Anyone*). Link `.../exec` nhận được chính là **`GOOGLE_SHEET_WEBHOOK_URL`**.

### 5.4. Đổi token về sau
Settings → Environment Variables → biến cần đổi → **Edit** → dán giá trị mới → Save → **Redeploy** (mục 2.3).
Nếu token cũ bị lộ: trong @BotFather gửi `/revoke` để vô hiệu token cũ, lấy token mới rồi cập nhật.

---

## 6. Gắn tên miền
Project → **Settings → Domains** → nhập tên miền (ví dụ `haivanbay-micc.vn`) → làm theo hướng dẫn trỏ DNS Vercel hiển thị (bản ghi `A` `76.76.21.21` cho tên miền gốc, `CNAME` `cname.vercel-dns.com` cho `www`). SSL tự cấp sau vài phút.

---

## 7. Lỗi thường gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|---|---|
| Form báo "chạy thử / demo", không có tin Telegram | `VITE_ENABLE_DEMO_MODE` đang `true` hoặc chưa redeploy sau khi đổi → đặt `false` và **Redeploy không dùng cache** |
| Form báo "Hệ thống tạm thời chưa nhận được đăng ký" | Cả Telegram và Sheet đều lỗi: kiểm tra lại 3 biến, chú ý khoảng trắng/dấu ngoặc kép thừa, rồi redeploy |
| Có dòng Sheet nhưng không có tin Telegram | Sai `TELEGRAM_CHAT_ID`, hoặc bot chưa được thêm vào nhóm / bị kick |
| Có tin Telegram nhưng không có dòng Sheet | Link webhook sai, hoặc Apps Script chưa deploy quyền *Anyone* |
| Sửa biến xong website vẫn như cũ | Chưa redeploy (mục 2.3) |

---

## Phụ lục: Hosting PHP (cPanel/AZDIGI) thay cho Vercel
Chạy `npm run build`, upload toàn bộ thư mục `dist/` lên `public_html`.
Token cho bản PHP nằm ở `public/api/config.local.php` (không có trên GitHub, tự tạo theo mẫu `public/api/config.php`).
Trên Vercel, các file `.php` tự động bị loại khỏi bản build để không lộ token.
