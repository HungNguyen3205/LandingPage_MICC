# Thông tin server & cách vận hành — Landing page MICC · Hải Vân Bay

Tài liệu này để **bất kỳ ai trong team** cũng cập nhật, sửa lỗi và bàn giao website được mà không cần hỏi người làm trước.
Đọc từ đầu đến mục 4 là đủ để tự đưa bản mới lên server.

> ⚠️ **Repo GitHub đang để public.** Tuyệt đối không ghi mật khẩu, token, link webhook thật vào file này hay bất kỳ file nào được commit.
> Những thông tin đó cất ở nơi riêng của công ty (xem mục 1.2).

---

## 1. Tổng quan

### 1.1. Website đang chạy ở đâu

| Hạng mục | Giá trị |
|---|---|
| Tên miền chính | <https://vinhomeshaivanbaydanang.vn> (`www.` tự chuyển về tên miền gốc) |
| Hosting đang chạy thật | **AZDIGI**, gói cPanel, máy chủ web LiteSpeed, có PHP |
| Thư mục web trên hosting | `public_html/` |
| API nhận đăng ký tư vấn | `POST /api/consultation` → file PHP `public_html/api/consultation.php` |
| Lead đi về | Nhóm Telegram + Google Sheet (gửi song song, chỉ cần một kênh chạy là không mất lead) |
| SSL | Let's Encrypt cấp trong cPanel, `.htaccess` ép mọi truy cập sang HTTPS |
| Bản dự phòng | Project Vercel `landingpage-micc` (xem [HUONG_DAN_VERCEL.md](HUONG_DAN_VERCEL.md)). **Không phải** bản khách đang dùng |

Mã nguồn có trên hai repo, nội dung giống nhau. Khi push nhớ push cả hai:

| Remote | Repo |
|---|---|
| `origin` | <https://github.com/HungNguyen3205/LandingPage_MICC> |
| `danava` | <https://github.com/danava-org/LandingPage_MICC> |

```bash
git push origin main
git push danava main
```

### 1.2. Tài khoản & mật khẩu (không ghi ở đây)

Chỉ ghi **mật khẩu đang cất ở đâu**, không ghi bản thân mật khẩu. Ai nắm thông tin thì điền giúp cột "Cất ở đâu":

| Cần gì | Dùng để làm gì | Cất ở đâu |
|---|---|---|
| Tài khoản khách hàng AZDIGI (my.azdigi.com) | Gia hạn hosting/tên miền, mở ticket hỗ trợ | _(điền)_ |
| Đăng nhập cPanel | Upload code, xem log, SSL | _(điền)_ |
| Nơi đăng ký tên miền & ngày hết hạn | Gia hạn trước khi web chết | _(điền)_ |
| Ngày hết hạn hosting | Gia hạn | _(điền)_ |
| Token bot Telegram, Chat ID, link webhook Google Sheet | Nằm trong `config.local.php` (mục 3) | File `.env` / `public/api/config.local.php` trên máy người phụ trách, và bản trên server |
| Tài khoản Vercel (team chứa `landingpage-micc`) | Bản dự phòng | _(điền)_ |

Cách lấy lại khi mất: cPanel thì đăng nhập my.azdigi.com → dịch vụ hosting → **Đăng nhập cPanel**. Còn token thì mở `public_html/api/config.local.php` trên server bằng File Manager.

---

## 2. Trên server có gì

Sau khi build, nội dung thư mục `dist/` chính là những gì nằm trong `public_html/`:

```
public_html/
├── index.html            trang chủ (React)
├── 404.html              giao diện trang không tồn tại (tự tạo khi build)
├── .htaccess             chuyển HTTPS, www → gốc, định tuyến API, chặn file nhạy cảm, cache
├── robots.txt, sitemap.xml
├── assets/               JS/CSS đã build (tên có mã hash, mỗi lần build đổi tên)
├── images/               ảnh dự án, ảnh quỹ căn
└── api/
    ├── consultation.php  nhận form → gửi Telegram + Google Sheet
    ├── config.php        đọc cấu hình (có trên GitHub, không chứa token)
    └── config.local.php  TOKEN THẬT. KHÔNG có trên GitHub, không được xóa
```

`.htaccess` đã chặn truy cập trực tiếp vào `config.php`, `config.local.php`, `.env`, `.git` và file `.md`.
Lưu ý `.htaccess` là **file ẩn**: trong File Manager phải bật **Settings → Show Hidden Files** mới thấy.

---

## 3. File cấu hình token `config.local.php`

Đường dẫn trong code: `public/api/config.local.php` (git đã bỏ qua file này). Khi build, file tự được chép sang `dist/api/`.
Máy mới clone repo về sẽ **không có** file này. Tạo mới với nội dung sau rồi điền giá trị thật:

```php
<?php
return [
    'GOOGLE_SHEET_WEBHOOK_URL' => 'https://script.google.com/macros/s/.../exec',
    'TELEGRAM_BOT_TOKEN'       => '123456789:AA...',
    'TELEGRAM_CHAT_ID'         => '-100...',
    'LEAD_SOURCE_LABEL'        => 'MICC · Hải Vân Bay',
    'ENABLE_DEMO_MODE'         => false,   // true = form chạy thử, KHÔNG gửi lead đi
];
```

Lấy giá trị thật ở đâu:
- Mở file `.env` trên máy người phụ trách (cùng giá trị), hoặc
- Mở `public_html/api/config.local.php` trên server bằng File Manager → **Edit** (đây là nguồn đúng nhất).

Chỉ cần đổi token (không đổi code)? Sửa thẳng file này trên server bằng File Manager → Save. Có hiệu lực ngay, không cần build lại.

Cách tạo bot Telegram, lấy Chat ID và tạo Google Sheet mới: xem mục 5.2 và 5.3 trong [HUONG_DAN_VERCEL.md](HUONG_DAN_VERCEL.md). Cách làm giống hệt bản Vercel.

---

## 4. Đưa bản mới lên server (làm mỗi lần sửa web)

### 4.1. Build trên máy

Cần Node.js 20 trở lên (đang dùng Node 24).

```bash
git pull origin main
npm ci                     # cài thư viện (lần đầu hoặc khi package.json đổi)
# kiểm tra đã có public/api/config.local.php (mục 3), thiếu là form không gửi được lead
npm run build              # tạo thư mục dist/
```

Nén **nội dung bên trong** `dist/` (không nén chính thư mục `dist`) thành một file zip, ví dụ `micc-azdigi.zip`.
Mở zip ra phải thấy ngay `index.html`, `.htaccess`, `assets/`, `api/`…

Windows PowerShell:
```powershell
Compress-Archive -Path dist\* -DestinationPath micc-azdigi.zip -Force
```

> `Compress-Archive` có thể bỏ sót file ẩn `.htaccess`. Mở zip kiểm tra lại. Nếu thiếu thì nén bằng 7-Zip/WinRAR, hoặc upload riêng `dist/.htaccess`.
> File `*.zip` đã được git bỏ qua, không lo bị commit nhầm.

### 4.2. Upload qua cPanel

1. Đăng nhập cPanel → **File Manager** → mở `public_html`. Bật **Show Hidden Files** (nút Settings góc phải).
2. Xóa thư mục `assets/` cũ (bản build mới có tên file khác, để lại thì rác dần). **Không xóa** `api/config.local.php`.
3. **Upload** file zip vào `public_html`.
4. Chuột phải file zip → **Extract** → thư mục đích `/public_html` → đồng ý ghi đè.
5. Xóa file zip trên server sau khi giải nén.
6. Làm ngay mục 5 để kiểm tra.

Muốn quay lại bản cũ: giữ lại file zip của lần deploy trước trên máy, upload và giải nén lại y như trên.

---

## 5. Kiểm tra sau mỗi lần deploy

| # | Việc cần làm | Kết quả đúng |
|---|---|---|
| 1 | Mở <https://vinhomeshaivanbaydanang.vn> trên điện thoại, tải lại bằng Ctrl+F5 | Thấy bản mới |
| 2 | Mở `http://www.vinhomeshaivanbaydanang.vn` | Tự chuyển về `https://vinhomeshaivanbaydanang.vn` |
| 3 | Gửi form với tên `TEST - <tên bạn>` | Báo đăng ký thành công |
| 4 | Xem nhóm Telegram | Có tin "ĐĂNG KÝ TƯ VẤN MỚI — MICC · Hải Vân Bay" |
| 5 | Xem Google Sheet | Có dòng mới, cột nguồn bắt đầu bằng `[MICC · Hải Vân Bay]` |
| 6 | Mở `https://vinhomeshaivanbaydanang.vn/api/config.local.php` | Bị chặn (403/404), **không** hiện hay tải về nội dung |
| 7 | Mở một đường dẫn bậy, ví dụ `/abcxyz` | Hiện trang 404 của web |
| 8 | Xóa dòng test trong Sheet và tin test trong nhóm (nếu cần) | — |

---

## 6. Lỗi thường gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|---|---|
| Form báo "chạy thử / demo" | `ENABLE_DEMO_MODE` trong `config.local.php` đang `true` → đổi `false` |
| Form báo "Hệ thống tạm thời chưa nhận được đăng ký" | Cả Telegram và Sheet đều lỗi: thiếu/xóa mất `config.local.php`, hoặc token sai (thừa dấu cách, thừa ngoặc) |
| Có dòng Sheet nhưng không có tin Telegram | Sai `TELEGRAM_CHAT_ID`, hoặc bot bị kick khỏi nhóm |
| Có tin Telegram nhưng không có dòng Sheet | Link webhook sai, hoặc Apps Script chưa deploy quyền *Anyone* |
| Gửi form báo lỗi 404 | Thiếu `.htaccess` (file ẩn, bị sót khi nén/upload) → upload lại `dist/.htaccess` |
| Web vẫn hiện bản cũ | Cache trình duyệt → Ctrl+F5. Nếu vẫn cũ: kiểm tra đã giải nén đúng vào `public_html` chưa (không phải `public_html/dist`) |
| Trắng trang, console báo không tải được `assets/...` | Xóa `assets/` nhưng giải nén thiếu. Giải nén lại zip |
| Báo lỗi chứng chỉ / "Không an toàn" | cPanel → **SSL/TLS Status** → **Run AutoSSL** cho tên miền và `www.` |
| Lỗi 500 toàn trang | Sai cú pháp `.htaccess` hoặc `config.local.php` (thiếu dấu `,` `'`). Xem cPanel → **Errors** / **Metrics → Errors** |

Không tự xử lý được: mở ticket ở my.azdigi.com, gửi kèm tên miền và giờ xảy ra lỗi.

---

## 7. Lưu ý trước khi bàn giao cho khách

- Bot Telegram và Google Sheet hiện **dùng chung** với các landing page khác của DANAVA. Trước khi giao quyền cho khách, tạo bot và Sheet riêng (mục 3) rồi sửa `config.local.php` trên server. Nếu token cũ đã lộ thì vào @BotFather gửi `/revoke`.
- Đổi mật khẩu cPanel / AZDIGI nếu chuyển quyền quản lý hosting.
- Cập nhật lại bảng ở mục 1.2 mỗi khi đổi tài khoản, gia hạn hay đổi nơi cất mật khẩu.
