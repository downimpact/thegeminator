<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';

try {
    $path = (string)($_GET['path'] ?? '');
    $absolute = existing_path($config, $path);
    if (!is_file($absolute)) {
        throw new RuntimeException('Datei nicht gefunden.');
    }
    assert_allowed_extension($config, $absolute);
    if (filesize($absolute) > $config['max_file_size']) {
        throw new RuntimeException('Datei ist zu groß.');
    }
    $content = file_get_contents($absolute);
    if ($content === false) {
        throw new RuntimeException('Datei konnte nicht gelesen werden.');
    }
    json_response(['ok' => true, 'path' => normalize_relative_path($path), 'content' => $content]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
