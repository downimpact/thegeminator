<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/bootstrap.php';

require_post();
require_csrf();

try {
    $input = json_decode(file_get_contents('php://input') ?: '', true, 512, JSON_THROW_ON_ERROR);
    $relative = normalize_relative_path((string)($input['path'] ?? ''));

    if ($relative === '') {
        throw new RuntimeException('Leerer Verzeichnispfad.');
    }

    $absolute = new_path($config, $relative);

    if (file_exists($absolute)) {
        throw new RuntimeException('Datei oder Verzeichnis existiert bereits.');
    }

    if (!mkdir($absolute, 0770)) {
        throw new RuntimeException('Verzeichnis konnte nicht erstellt werden.');
    }

    json_response([
        'ok' => true,
        'path' => $relative,
    ]);
} catch (Throwable $e) {
    json_response([
        'ok' => false,
        'error' => $e->getMessage(),
    ], 400);
}
