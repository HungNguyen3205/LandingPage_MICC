import {
  validateLeadSubmission,
  sanitizeSpreadsheetText,
  formatPhoneForSheet,
  escapeTelegramHtml,
} from './leadValidator';
import { googleSheetsService, SHEET_COLUMNS } from './googleSheetsService';
import { handleLeadSubmission } from './leadHandler';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[TEST FAILED] ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n--- BẮT ĐẦU KIỂM THỬ HỆ THỐNG TIẾP NHẬN LEAD ---');

  // 1. Kiểm tra 10 cột Google Sheets thiết yếu
  console.log('\n[1] Kiểm tra cấu trúc 10 cột Google Sheets thiết yếu:');
  assert(SHEET_COLUMNS.length === 10, `Số lượng cột phải là 10 (thực tế: ${SHEET_COLUMNS.length})`);
  assert(SHEET_COLUMNS[0] === 'Mã đăng ký', 'Cột 1 là Mã đăng ký');
  assert(SHEET_COLUMNS[3] === 'Số điện thoại', 'Cột 4 là Số điện thoại');
  assert(SHEET_COLUMNS[9] === 'Trạng thái xử lý', 'Cột 10 là Trạng thái xử lý');

  // 2. Kiểm tra Phòng chống Formula Injection
  console.log('\n[2] Kiểm tra phòng chống Formula Injection trong Spreadsheet:');
  const formula1 = sanitizeSpreadsheetText('=SUM(A1:A10)');
  assert(formula1 === "'=SUM(A1:A10)", `Chuỗi bắt đầu bằng '=' phải được thêm tiền tố nháy đơn (thực tế: ${formula1})`);
  const formula2 = sanitizeSpreadsheetText('+123456');
  assert(formula2 === "'+123456", `Chuỗi bắt đầu bằng '+' phải được thêm tiền tố nháy đơn (thực tế: ${formula2})`);
  const normalText = sanitizeSpreadsheetText('Khách hàng VIP');
  assert(normalText === 'Khách hàng VIP', `Văn bản bình thường không bị thay đổi (thực tế: ${normalText})`);

  // 3. Kiểm tra Giữ số 0 ở đầu số điện thoại
  console.log('\n[3] Kiểm tra giữ số 0 đầu trong số điện thoại:');
  const formattedPhone = formatPhoneForSheet('0912 345 678');
  assert(formattedPhone === "'0912345678", `Số điện thoại phải giữ tiền tố ' và số 0 (thực tế: ${formattedPhone})`);

  // 4. Kiểm tra Escape ký tự đặc biệt Telegram HTML
  console.log('\n[4] Kiểm tra escape ký tự đặc biệt Telegram HTML:');
  const dirtyInput = 'Căn hộ <3 phòng ngủ> & view biển';
  const cleanTelegram = escapeTelegramHtml(dirtyInput);
  assert(
    cleanTelegram === 'Căn hộ &lt;3 phòng ngủ&gt; &amp; view biển',
    `Ký tự < > & phải được escape HTML (thực tế: ${cleanTelegram})`
  );

  // 5. Kiểm tra Honeypot chống Bot
  console.log('\n[5] Kiểm tra Honeypot chống bot:');
  const spamPayload = {
    fullName: 'Bot Spammer',
    phone: '0912345678',
    consentAgreed: true,
    _hp_company: 'Evil Bot Corp',
  };
  const validationSpam = validateLeadSubmission(spamPayload);
  assert(validationSpam.isSpam === true, 'Phát hiện spam khi honeypot được điền');

  // 6. Kiểm tra Dữ liệu hợp lệ sinh đủ 10 cột thiết yếu
  console.log('\n[6] Kiểm tra chuẩn hóa dữ liệu thành 10 cột thiết yếu:');
  const validPayload = {
    fullName: 'Trần Minh Quang',
    phone: '0988 123 456',
    email: 'quang.tm@example.com',
    product: 'Ocean Villa',
    preferredTime: 'Buổi sáng',
    notes: 'Muốn nhận mặt bằng chi tiết',
    consentAgreed: true,
    pageSource: '/lien-he',
    utmSource: 'facebook',
  };
  const valResult = validateLeadSubmission(validPayload);
  assert(valResult.isValid === true, 'Payload hợp lệ phải vượt qua validation');
  assert(Boolean(valResult.sanitizedData), 'Phải có sanitizedData');
  if (valResult.sanitizedData) {
    const row = googleSheetsService.toRowValues(valResult.sanitizedData);
    assert(row.length === 10, `Hàng xuất ra phải có đúng 10 cột (thực tế: ${row.length})`);
    assert(row[0].startsWith('VH-'), `Mã đăng ký phải có tiền tố VH- (thực tế: ${row[0]})`);
    assert(row[3] === "'0988123456", `Số điện thoại phải giữ số 0 (thực tế: ${row[3]})`);
    assert(row[5] === 'Ocean Villa', `Sản phẩm quan tâm khớp (thực tế: ${row[5]})`);
    assert(row[8] === 'facebook', `Nguồn tiếp cận khớp (thực tế: ${row[8]})`);
    assert(row[9] === 'Mới tiếp nhận', `Trạng thái xử lý mặc định (thực tế: ${row[9]})`);
  }

  // 7. Kiểm tra Idempotency (Chống tạo dòng trùng khi submit 2 lần)
  console.log('\n[7] Kiểm tra Idempotency Key (chống tạo dòng trùng lặp):');
  process.env.MOCK_MODE = 'true';
  const testIdempotencyKey = 'idem-test-double-submit-' + Date.now();
  const submission1 = await handleLeadSubmission(
    {
      ...validPayload,
      idempotencyKey: testIdempotencyKey,
    },
    '127.0.0.1'
  );
  assert(submission1.status === 200, 'Lần 1 gửi thành công');
  assert(submission1.body.success === true, 'Lần 1 có success = true');
  const initialRowCount = googleSheetsService.mockRows.length;

  // Gửi lại cùng idempotency key
  const submission2 = await handleLeadSubmission(
    {
      ...validPayload,
      idempotencyKey: testIdempotencyKey,
    },
    '127.0.0.1'
  );
  assert(submission2.status === 200, 'Lần 2 trả về kết quả thành công từ cache');
  assert(
    submission2.body.registrationCode === submission1.body.registrationCode,
    'Mã đăng ký lần 2 phải trùng khớp lần 1'
  );
  assert(
    googleSheetsService.mockRows.length === initialRowCount,
    `Không được tạo thêm hàng mới trong Google Sheets (Số hàng: ${googleSheetsService.mockRows.length})`
  );

  // 8. Kiểm tra Rate Limiting
  console.log('\n[8] Kiểm tra Rate Limiting:');
  const spamIp = '192.168.1.99';
  let wasRateLimited = false;
  for (let i = 0; i < 7; i++) {
    const res = await handleLeadSubmission(
      {
        ...validPayload,
        idempotencyKey: 'idem-flood-' + i + '-' + Date.now(),
      },
      spamIp
    );
    if (res.status === 429) {
      wasRateLimited = true;
      break;
    }
  }
  assert(wasRateLimited === true, 'IP gửi liên tiếp nhiều lần phải bị chặn 429 Rate Limited');

  console.log('\n========================================');
  console.log('TẤT CẢ 8 MỤC KIỂM THỬ ĐÃ THÀNH CÔNG VƯỢT TRỘI!');
  console.log('========================================\n');
}

runTests().catch((err) => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});
