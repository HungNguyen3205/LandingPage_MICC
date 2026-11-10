<?php
/**
 * API Endpoint tiếp nhận đăng ký tư vấn VINHOMES trên máy chủ PHP / cPanel / LiteSpeed (AZDIGI)
 * Endpoint: POST /api/consultation
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Idempotency-Key');

// Xử lý preflight request CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Chỉ hỗ trợ phương thức POST']);
    exit;
}

// 1. Tải cấu hình
$configFile = __DIR__ . '/config.php';
$config = file_exists($configFile) ? require $configFile : [];

$webhookUrl = $config['GOOGLE_SHEET_WEBHOOK_URL'] ?? getenv('GOOGLE_SHEET_WEBHOOK_URL') ?? '';
$botToken   = $config['TELEGRAM_BOT_TOKEN'] ?? getenv('TELEGRAM_BOT_TOKEN') ?? '';
$chatId     = $config['TELEGRAM_CHAT_ID'] ?? getenv('TELEGRAM_CHAT_ID') ?? '';
$isDemoMode = ($config['ENABLE_DEMO_MODE'] ?? false) === true;

// 2. Đọc payload JSON
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'statusCode' => 'VALIDATION_ERROR',
        'message' => 'Dữ liệu gửi lên không đúng định dạng JSON'
    ]);
    exit;
}

// 3. Chống bot Spam bằng Honeypot
if (!empty($data['_hp_company'])) {
    // Trả về thành công giả lập để lừa bot
    echo json_encode([
        'success' => true,
        'statusCode' => 'SUCCESS',
        'registrationCode' => 'VH-FILTERED',
        'message' => 'Yêu cầu tư vấn của bạn đã được ghi nhận.'
    ]);
    exit;
}

// 4. Validate dữ liệu
$fullName = trim($data['fullName'] ?? '');
$phoneRaw = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$product = trim($data['product'] ?? 'Chưa xác định');
$preferredTime = trim($data['preferredTime'] ?? 'Bất kỳ lúc nào');
$notes = trim($data['notes'] ?? '');
$pageSource = trim($data['pageSource'] ?? '/lien-he');
$utmSource = trim($data['utmSource'] ?? '');
$utmCampaign = trim($data['utmCampaign'] ?? '');

if (mb_strlen($fullName) < 2) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'statusCode' => 'VALIDATION_ERROR',
        'message' => 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).'
    ]);
    exit;
}

// Chuẩn hóa số điện thoại
$cleanPhone = preg_replace('/[^\d+]/', '', $phoneRaw);
if (!preg_match('/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/', $cleanPhone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'statusCode' => 'VALIDATION_ERROR',
        'message' => 'Số điện thoại không hợp lệ (cần là số di động Việt Nam 10 chữ số).'
    ]);
    exit;
}

// Chuẩn hóa dạng '0xxxxxxxxx để Google Sheet không nuốt số 0
$formattedPhoneForSheet = "'" . (str_starts_with($cleanPhone, '+84') ? '0' . substr($cleanPhone, 3) : $cleanPhone);
$displayPhone = str_starts_with($cleanPhone, '+84') ? '0' . substr($cleanPhone, 3) : $cleanPhone;

// 5. Chuẩn bị thông tin lưu trữ 10 cột
date_default_timezone_set('Asia/Ho_Chi_Minh');
$now = date('Y-m-d H:i:s');
$randCode = mt_rand(1000, 9999);
$registrationCode = 'VH-' . date('Ymd') . '-' . $randCode;

$sourceText = $pageSource;
if (!empty($utmSource)) {
    $sourceText = !empty($utmCampaign) ? "$utmSource / $utmCampaign" : $utmSource;
}

$rowValues = [
    $registrationCode,
    $now,
    $fullName,
    $formattedPhoneForSheet,
    !empty($email) ? $email : 'Chưa cung cấp',
    $product,
    $preferredTime,
    !empty($notes) ? $notes : 'Không có ghi chú thêm',
    $sourceText,
    'Mới tiếp nhận'
];

if ($isDemoMode) {
    echo json_encode([
        'success' => true,
        'isDemo' => true,
        'statusCode' => 'DEMO_MODE',
        'registrationCode' => $registrationCode,
        'message' => 'Hệ thống đang ở chế độ demo.'
    ]);
    exit;
}

// 6. Gửi dữ liệu vào Google Sheets qua Webhook
$sheetSuccess = false;
if (!empty($webhookUrl)) {
    $sheetPayload = json_encode(['row' => $rowValues]);
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $sheetPayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpCode >= 200 && $httpCode < 400) {
        $sheetSuccess = true;
    }
}

// 7. Gửi thông báo đến Telegram Group
$telegramSuccess = false;
if (!empty($botToken) && !empty($chatId)) {
    $safeName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($displayPhone, ENT_QUOTES, 'UTF-8');
    $safeEmail = !empty($email) ? htmlspecialchars($email, ENT_QUOTES, 'UTF-8') : '<i>Chưa cung cấp</i>';
    $safeProduct = htmlspecialchars($product, ENT_QUOTES, 'UTF-8');
    $safeTime = htmlspecialchars($preferredTime, ENT_QUOTES, 'UTF-8');
    $safeSource = htmlspecialchars($sourceText, ENT_QUOTES, 'UTF-8');
    $safeNotes = !empty($notes) ? htmlspecialchars(mb_substr($notes, 0, 500), ENT_QUOTES, 'UTF-8') : '<i>Không có ghi chú thêm</i>';

    $msg = "🌿 <b>ĐĂNG KÝ TƯ VẤN MỚI — VINHOMES HẢI VÂN BAY</b>\n\n"
         . "▫️ <b>Mã đăng ký:</b> <code>{$registrationCode}</code>\n"
         . "▫️ <b>Thời gian:</b> {$now} (Giờ VN)\n"
         . "▫️ <b>Khách hàng:</b> {$safeName}\n"
         . "▫️ <b>Điện thoại:</b> <code>{$safePhone}</code>\n"
         . "▫️ <b>Email:</b> {$safeEmail}\n"
         . "▫️ <b>Sản phẩm quan tâm:</b> {$safeProduct}\n"
         . "▫️ <b>Thời gian liên hệ:</b> {$safeTime}\n"
         . "▫️ <b>Trang nguồn:</b> <code>{$safeSource}</code>\n\n"
         . "▫️ <b>Nội dung tư vấn:</b>\n"
         . "<blockquote>{$safeNotes}</blockquote>";

    $teleUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $telePayload = json_encode([
        'chat_id' => $chatId,
        'text' => $msg,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ]);

    $ch = curl_init($teleUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $telePayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $teleRes = curl_exec($ch);
    $teleCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($teleCode === 200) {
        $telegramSuccess = true;
    }
}

// 8. Trả về kết quả cho Frontend
echo json_encode([
    'success' => true,
    'isDemo' => false,
    'statusCode' => 'SUCCESS',
    'registrationCode' => $registrationCode,
    'sheetSaved' => $sheetSuccess,
    'telegramSent' => $telegramSuccess,
    'message' => 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.'
]);
