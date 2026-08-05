<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';
require_post();
require_csrf();

try {
    $input = json_decode(file_get_contents('php://input') ?: '', true, 512, JSON_THROW_ON_ERROR);
    $path = (string)($input['path'] ?? '');
    $content = (string)($input['content'] ?? '');

    if (strlen($content) > $config['max_file_size']) {
        throw new RuntimeException('Datei ist zu groß.');
    }

    $relative = normalize_relative_path($path);
    $root = content_root($config);
    $candidate = $root . '/' . $relative;
    $absolute = file_exists($candidate)
        ? existing_path($config, $relative)
        : new_path($config, $relative);

    assert_allowed_extension($config, $absolute);
    backup_file($config, $absolute, $relative);

    if (file_put_contents($absolute, $content, LOCK_EX) === false) {
        throw new RuntimeException('Datei konnte nicht gespeichert werden.');
    }

    json_response(['ok' => true, 'path' => $relative]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
