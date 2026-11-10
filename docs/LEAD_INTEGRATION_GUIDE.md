# Hướng Dẫn Tích Hợp Hệ Thống Tiếp Nhận Đăng Ký Tư Vấn VINHOMES

Tài liệu này hướng dẫn quản trị viên cách cấu hình Google Sheets và Telegram Bot để website **VINHOMES** chuyển từ chế độ Demo sang chế độ tiếp nhận đăng ký tư vấn thật với giao diện quản lý khách hàng tối ưu nhất.

---

## 1. Cấu Trúc Bảng Quản Lý Lead Google Sheets (Tối Ưu 10 Cột Thiết Yếu)

Bảng tính được tinh gọn từ 16 cột xuống **10 cột quan trọng nhất**, loại bỏ hoàn toàn các thông số kỹ thuật thừa để nhân viên bán hàng (Sales) và quản lý theo dõi thuận tiện nhất:

| Cột | Tên Cột | Ý nghĩa cho Sales & Báo Cáo | Định dạng |
| :---: | :--- | :--- | :--- |
| **A** | `Mã đăng ký` | Mã tra cứu độc nhất (ví dụ: `VH-20261020-4821`) | Văn bản |
| **B** | `Thời gian` | Thời điểm khách gửi đăng ký (Giờ VN) | `YYYY-MM-DD HH:mm:ss` |
| **C** | `Họ tên` | Tên khách hàng để xưng hô khi liên hệ | Văn bản |
| **D** | `Số điện thoại` | Số điện thoại liên hệ (bảo toàn số 0 ở đầu) | Chuỗi (tiền tố `'`) |
| **E** | `Email` | Email nhận tài liệu dự án | Email / Chưa cung cấp |
| **F** | `Sản phẩm quan tâm` | Phân loại nhu cầu: Ocean Villa / Garden Residence / Sky Collection... | Dropdown / Văn bản |
| **G** | `Giờ hẹn tư vấn` | Khung giờ tiện liên hệ (Sáng / Chiều / Tối / Giờ hành chính...) | Văn bản |
| **H** | `Nội dung tư vấn` | Nhu cầu chi tiết, yêu cầu bảng giá hoặc mặt bằng căn | Văn bản dài |
| **I** | `Nguồn tiếp cận` | Kênh khách hàng tìm đến (Facebook Ads, Google Ads, Zalo, Web...) | Rút gọn thông minh |
| **J** | `Trạng thái xử lý` | Menu chọn trạng thái CSKH để đội ngũ sales phối hợp | Dropdown màu sắc |

### Các ô thông tin đã được loại bỏ / tinh gọn (Lý do):
1. **Bỏ `Phiên bản thông báo đồng ý`**: Dòng code kỹ thuật (`v1.0-20261020`), không có ý nghĩa trong việc chăm sóc khách hàng.
2. **Bỏ `Đồng ý liên hệ`**: Form bắt buộc tích checkbox mới được gửi, nên 100% khách đã gửi đều là "Đã đồng ý", để thêm 1 cột chỉ gây rối mắt.
3. **Bỏ `Trạng thái thông báo Telegram`**: Telegram đã báo tin nhắn thẳng vào nhóm của đội ngũ sales rồi, không cần ghi thêm một cột "Thành công" trên Sheet.
4. **Gộp `UTM Source`, `UTM Medium`, `UTM Campaign`, `Trang nguồn` thành `Nguồn tiếp cận`**: Trước đây chia làm 4 cột kỹ thuật khiến bảng quá dài. Giờ được gộp gọn (ví dụ: `facebook / biet_thu_bien` hoặc `/lien-he`), vừa biết nguồn vừa không choán màn hình.

---

## 2. Mã Tự Động Định Dạng Google Apps Script (1 Click Tạo Bảng)

Trong file Google Sheet của bạn:
1. Mở menu **Tiện ích mở rộng** (Extensions) $\rightarrow$ **Apps Script**.
2. Xóa hết code cũ trong file `Code.gs` và dán toàn bộ đoạn mã sau vào:

```javascript
/**
 * VINHOMES - Hệ Thống Tiếp Nhận Lead Bất Động Sản (Tối ưu 10 cột)
 */

var SHEET_NAME = "Đăng ký tư vấn";

// Hàm khởi tạo bảng đẹp chuẩn chỉnh tự động
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
  }

  // 10 Cột chuẩn
  var headers = [
    "Mã đăng ký",
    "Thời gian",
    "Họ tên",
    "Số điện thoại",
    "Email",
    "Sản phẩm quan tâm",
    "Giờ hẹn tư vấn",
    "Nội dung tư vấn",
    "Nguồn tiếp cận",
    "Trạng thái xử lý"
  ];

  // Ghi tiêu đề
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight("bold");
  headerRange.setFontColor("#ffffff");
  headerRange.setBackground("#0f172a"); // Màu xanh than sang trọng Vinhomes Navy
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // Đóng băng dòng 1
  sheet.setFrozenRows(1);

  // Căn chỉnh độ rộng từng cột cho đẹp mắt
  var columnWidths = [150, 160, 170, 140, 200, 180, 140, 260, 170, 180];
  for (var i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]);
  }

  // Định dạng số điện thoại ở Cột D thành dạng Chuỗi Text
  sheet.getRange("D2:D1000").setNumberFormat("@");

  // Tạo Menu thả xuống (Dropdown) cho Cột J (Trạng thái xử lý)
  var statusOptions = [
    "Mới tiếp nhận",
    "Đã gọi - Tiềm năng",
    "Hẹn gặp tư vấn",
    "Không nghe máy / Gọi lại",
    "Đã chốt cọc",
    "Không có nhu cầu"
  ];
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusOptions, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("J2:J1000").setDataValidation(rule);

  // Tô màu có điều kiện cho trạng thái (Tùy chọn)
  SpreadsheetApp.getUi().alert(" Đã tạo bảng quản lý 10 cột chuyên nghiệp thành công!");
}

// Hàm tiếp nhận lead từ Website gửi về
function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : null;
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Empty payload" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getActiveSheet();
    }

    if (data.row && Array.isArray(data.row)) {
      sheet.appendRow(data.row);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid row data" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Chọn hàm **`setupSheet`** ở thanh menu trên cùng rồi bấm nút **Run** (Chạy).
   - Bảng tính của bạn sẽ ngay lập tức có 10 cột được kẻ ô, đổi màu tiêu đề xanh navy đậm sang trọng và có sẵn menu thả xuống cho cột **Trạng thái xử lý**.
4. Bấm **Triển khai** (Deploy) $\rightarrow$ **Quản lý tùy chọn triển khai** (Manage Deployments) $\rightarrow$ Sửa version mới (hoặc Tạo triển khai mới):
   - *Loại*: **Ứng dụng web** (Web app).
   - *Thực thi dưới dạng*: **Tôi** (Tài khoản của bạn).
   - *Ai có quyền truy cập*: **Bất kỳ ai** (Anyone).
5. Dán URL Webhook vào biến `GOOGLE_SHEET_WEBHOOK_URL` trong file `.env` hoặc cấu hình hosting.

---

## 3. Thiết Lập Telegram Bot Tiếp Nhận Thông Báo Ngay Lập Tức

1. Mở ứng dụng Telegram, tìm bot **@BotFather**.
2. Gửi lệnh `/newbot`, tạo bot tiếp nhận. Lưu chuỗi **HTTP API Token** vào `TELEGRAM_BOT_TOKEN`.
3. Tạo nhóm Telegram cho các chuyên viên tư vấn / ban kinh doanh bất động sản.
4. Thêm bot vừa tạo vào nhóm.
5. Lấy `TELEGRAM_CHAT_ID` của nhóm (thường có dấu trừ, ví dụ `CHAT_ID` hoặc `-100...`).
6. Khi có khách điền form, Telegram bot sẽ báo chuông ngay lập tức với đầy đủ thông tin:
   - Họ tên & Số điện thoại bấm gọi ngay được
   - Dự án / dòng căn hộ quan tâm
   - Giờ hẹn tư vấn
   - Ghi chú nhu cầu của khách

---

## 4. Tóm Tắt Cấu Hình `.env`

```ini
# Chuyển sang false để bật chế độ nhận data thật
VITE_ENABLE_DEMO_MODE=false
MOCK_MODE=false

# Google Sheet Webhook
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec

# Telegram Group Alert
TELEGRAM_BOT_TOKEN=BOT_TOKEN
TELEGRAM_CHAT_ID=CHAT_ID
```
