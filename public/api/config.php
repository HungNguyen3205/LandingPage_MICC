<?php

return [
    'GOOGLE_SHEET_WEBHOOK_URL' => getenv('GOOGLE_SHEET_WEBHOOK_URL') ?: '',
    'TELEGRAM_BOT_TOKEN' => getenv('TELEGRAM_BOT_TOKEN') ?: '',
    'TELEGRAM_CHAT_ID' => getenv('TELEGRAM_CHAT_ID') ?: '',
    'ENABLE_DEMO_MODE' => getenv('ENABLE_DEMO_MODE') === 'true',
];
