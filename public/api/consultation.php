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
// Tên dự án hiện trên Telegram & cột nguồn Sheet (phân biệt khi dùng chung bot/sheet)
$projectLabel = trim($config['LEAD_SOURCE_LABEL'] ?? (getenv('LEAD_SOURCE_LABEL') ?: ''));

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
// Căn khách bấm chọn trong bảng giá, ví dụ "VM-03 · Vịnh Mây · Giá TTTĐ 5,781 tỷ"
$unit = mb_substr(trim($data['unit'] ?? ''), 0, 120);
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
if ($projectLabel !== '') {
    $sourceText = "[{$projectLabel}] {$sourceText}";
}

$rowValues = [
    $registrationCode,
    $now,
    $fullName,
    $formattedPhoneForSheet,
    !empty($email) ? $email : 'Chưa cung cấp',
    $unit !== '' ? "{$product} · Căn {$unit}" : $product,
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

// 6. Hàm ghi Google Sheet (Apps Script chậm ~2-3s nên gọi SAU khi đã trả kết quả nếu được)
$sendToSheet = function () use ($webhookUrl, $rowValues) {
    if (empty($webhookUrl)) return false;
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['row' => $rowValues]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 9);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $httpCode >= 200 && $httpCode < 400;
};

/** Trả JSON cho khách và đóng kết nối, script vẫn chạy tiếp phía sau. */
$respondAndContinue = function (array $body) {
    ignore_user_abort(true);
    $json = json_encode($body);
    header('Content-Length: ' . strlen($json));
    header('Connection: close');
    echo $json;
    while (ob_get_level() > 0) ob_end_flush();
    flush();
    if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
    elseif (function_exists('litespeed_finish_request')) litespeed_finish_request();
};

// 7. Gửi thông báo đến Telegram Group (nhanh, gửi trước)
$telegramSuccess = false;
if (!empty($botToken) && !empty($chatId)) {
    // Cùng bố cục với server/telegramMessage.ts (bản Node/Vercel)
    $e = fn($v) => htmlspecialchars(trim((string) $v), ENT_QUOTES, 'UTF-8');
    $divider = '━━━━━━━━━━━━━━━━';
    $phoneShown = strlen($displayPhone) === 10
        ? substr($displayPhone, 0, 4) . ' ' . substr($displayPhone, 4, 3) . ' ' . substr($displayPhone, 7)
        : $displayPhone;
    $pageNames = ['/' => 'Trang chủ', '' => 'Trang chủ', '/lien-he' => 'Trang liên hệ'];
    $sourceShown = implode(' · ', array_filter([$pageNames[$pageSource] ?? $pageSource, $utmSource, $utmCampaign], fn($x) => trim((string) $x) !== ''));

    $lines = ['🔔 <b>KHÁCH ĐĂNG KÝ TƯ VẤN MỚI</b>'];
    if ($projectLabel !== '') $lines[] = '🏝 ' . $e($projectLabel);
    array_push($lines, $divider, '');
    $lines[] = '👤 <b>' . $e($fullName) . '</b>';
    $lines[] = '📞 <code>' . $e($phoneShown) . '</code>';
    if ($email !== '') $lines[] = '✉️ ' . $e($email);
    $lines[] = '';
    $lines[] = '🏡 <b>Quan tâm:</b> ' . ($product !== '' ? $e($product) : 'Cần tư vấn thêm');
    if ($unit !== '') $lines[] = '🔑 <b>Căn chọn:</b> ' . $e($unit);
    $lines[] = '🕐 <b>Gọi lại:</b> ' . ($preferredTime !== '' ? $e($preferredTime) : 'Bất kỳ lúc nào');
    if ($notes !== '') array_push($lines, '', '💬 <b>Lời nhắn:</b>', '<blockquote>' . $e(mb_substr($notes, 0, 600)) . '</blockquote>');
    array_push($lines, '', $divider);
    $lines[] = '<i>🆔 ' . $e($registrationCode) . '  ·  ' . date('H:i · d/m/Y') . '</i>';
    $lines[] = '<i>🌐 ' . $e($sourceShown) . '</i>';
    $msg = implode("\n", $lines);

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
    $teleRes = curl_exec($ch);
    $teleCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($teleCode === 200) {
        $telegramSuccess = true;
    }
}

$successBody = [
    'success' => true,
    'isDemo' => false,
    'statusCode' => 'SUCCESS',
    'registrationCode' => $registrationCode,
    'message' => 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.'
];

// 8. Telegram đã nhận → trả kết quả ngay (~0,5s), ghi Sheet phía sau
if ($telegramSuccess) {
    $respondAndContinue($successBody);
    if (!$sendToSheet()) error_log("[Consultation] Ghi Google Sheet lỗi cho {$registrationCode}");
    exit;
}

// 9. Telegram lỗi → bắt buộc chờ Sheet; cả hai lỗi thì báo khách gọi hotline (không mất lead âm thầm)
if ($sendToSheet()) {
    echo json_encode($successBody);
    exit;
}
error_log("[Consultation] Lead NOT delivered {$registrationCode}");
http_response_code(502);
echo json_encode([
    'success' => false,
    'statusCode' => 'DELIVERY_FAILED',
    'message' => 'Hệ thống tạm thời chưa nhận được đăng ký. Quý khách vui lòng gọi hotline 0905 688 070 để được hỗ trợ ngay.'
]);
