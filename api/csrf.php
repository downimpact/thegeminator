<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/bootstrap.php';

json_response([
    'ok' => true,
    'csrfToken' => $_SESSION['csrf_token'],
]);
