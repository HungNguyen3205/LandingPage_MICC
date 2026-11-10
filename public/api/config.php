<?php

// Real keys live in config.local.php (git-ignored, deployed alongside this file).
// Falls back to server environment variables when that file is absent.
$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    return require $local;
}

return [
    'GOOGLE_SHEET_WEBHOOK_URL' => getenv('GOOGLE_SHEET_WEBHOOK_URL') ?: '',
    'TELEGRAM_BOT_TOKEN' => getenv('TELEGRAM_BOT_TOKEN') ?: '',
    'TELEGRAM_CHAT_ID' => getenv('TELEGRAM_CHAT_ID') ?: '',
    'LEAD_SOURCE_LABEL' => getenv('LEAD_SOURCE_LABEL') ?: '',
    'ENABLE_DEMO_MODE' => getenv('ENABLE_DEMO_MODE') === 'true',
];
