<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';
require_post();

try {
    $input = json_decode(file_get_contents('php://input') ?: '', true, 512, JSON_THROW_ON_ERROR);
    $content = (string)($input['content'] ?? '');
    if (strlen($content) > $config['max_file_size']) {
        throw new RuntimeException('Inhalt ist zu groß.');
    }
    json_response(['ok' => true, 'html' => gemtext_to_html($content)]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
