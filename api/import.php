<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';
require_post();
require_csrf();

try {
    $input = json_decode(file_get_contents('php://input') ?: '', true, 512, JSON_THROW_ON_ERROR);
    $url = trim((string)($input['url'] ?? ''));
    if ($url === '') {
        throw new RuntimeException('Bitte eine URL eingeben.');
    }

    $result = fetch_external_document($config, $url);
    json_response(['ok' => true] + $result);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
