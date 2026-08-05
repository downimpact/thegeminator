<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';
require_post();
require_csrf();

try {
    $input = json_decode(file_get_contents('php://input') ?: '', true, 512, JSON_THROW_ON_ERROR);
    $path = (string)($input['path'] ?? '');
    $type = delete_content_item($config, $path);
    json_response(['ok' => true, 'path' => normalize_relative_path($path), 'type' => $type]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
