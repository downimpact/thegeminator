<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/bootstrap.php';

try {
    json_response(['ok' => true, 'tree' => build_tree($config)]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
}
