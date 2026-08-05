<?php
declare(strict_types=1);

function is_public_ip(string $ip): bool
{
    return filter_var(
        $ip,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) !== false;
}

function assert_remote_host_allowed(array $config, string $host): void
{
    $host = strtolower(rtrim($host, '.'));
    $allowed = array_map(static fn($v) => strtolower(rtrim((string)$v, '.')), $config['allowed_internal_hosts']);

    if (in_array($host, $allowed, true)) {
        return;
    }

    if ($host === 'localhost' || str_ends_with($host, '.localhost')) {
        throw new RuntimeException('Lokale Ziele sind gesperrt.');
    }

    $records = dns_get_record($host, DNS_A | DNS_AAAA);
    if ($records === false || $records === []) {
        throw new RuntimeException('Hostname konnte nicht aufgelöst werden.');
    }

    foreach ($records as $record) {
        $ip = $record['ip'] ?? $record['ipv6'] ?? null;
        if (!is_string($ip) || !is_public_ip($ip)) {
            throw new RuntimeException('Private oder reservierte Zieladressen sind gesperrt.');
        }
    }
}

function fetch_external_document(array $config, string $url, int $redirects = 0): array
{
    if ($redirects > $config['max_redirects']) {
        throw new RuntimeException('Zu viele Weiterleitungen.');
    }

    $parts = parse_url(trim($url));
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        throw new RuntimeException('Ungültige URL.');
    }

    $scheme = strtolower($parts['scheme']);
    if (!in_array($scheme, $config['allowed_schemes'], true)) {
        throw new RuntimeException('Dieses Protokoll ist nicht erlaubt.');
    }

    assert_remote_host_allowed($config, (string)$parts['host']);

    return match ($scheme) {
        'http', 'https' => fetch_http_document($config, $url, $redirects),
        'gemini' => fetch_gemini_document($config, $url, $redirects),
        default => throw new RuntimeException('Nicht unterstütztes Protokoll.'),
    };
}

function fetch_http_document(array $config, string $url, int $redirects): array
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('Die PHP-cURL-Erweiterung ist nicht installiert.');
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => $config['connect_timeout'],
        CURLOPT_TIMEOUT => $config['download_timeout'],
        CURLOPT_USERAGENT => 'GemtextEditor/0.1',
        CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    ]);

    $response = curl_exec($ch);
    if ($response === false) {
        throw new RuntimeException('HTTP-Abruf fehlgeschlagen: ' . curl_error($ch));
    }

    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);

    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);

    if (strlen($body) > $config['max_import_size']) {
        throw new RuntimeException('Die externe Datei ist zu groß.');
    }

    if ($status >= 300 && $status < 400 && preg_match('/^Location:\s*(.+)$/mi', $headers, $m)) {
        $next = trim($m[1]);
        if (!preg_match('~^[a-z][a-z0-9+.-]*://~i', $next)) {
            $base = parse_url($url);
            $port = isset($base['port']) ? ':' . $base['port'] : '';
            $basePath = isset($base['path']) ? dirname($base['path']) : '/';
            if (str_starts_with($next, '/')) {
                $next = $base['scheme'] . '://' . $base['host'] . $port . $next;
            } else {
                $next = $base['scheme'] . '://' . $base['host'] . $port . rtrim($basePath, '/') . '/' . $next;
            }
        }
        return fetch_external_document($config, $next, $redirects + 1);
    }

    if ($status < 200 || $status >= 300) {
        throw new RuntimeException('HTTP-Status ' . $status);
    }

    $mime = strtolower(trim(explode(';', $contentType)[0] ?? ''));
    if (!in_array($mime, ['text/gemini', 'text/plain', 'text/markdown', ''], true)) {
        throw new RuntimeException('Nicht unterstützter Medientyp: ' . $contentType);
    }

    return [
        'url' => $url,
        'content' => $body,
        'mime' => $contentType ?: 'text/plain',
        'suggested_name' => suggested_filename($url),
    ];
}

function fetch_gemini_document(array $config, string $url, int $redirects): array
{
    $parts = parse_url($url);
    $host = (string)$parts['host'];
    $port = isset($parts['port']) ? (int)$parts['port'] : 1965;

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => (bool)$config['verify_gemini_peer'],
            'verify_peer_name' => (bool)$config['verify_gemini_peer'],
            'allow_self_signed' => !(bool)$config['verify_gemini_peer'],
            'SNI_enabled' => true,
            'peer_name' => $host,
        ],
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        'tls://' . $host . ':' . $port,
        $errno,
        $errstr,
        $config['connect_timeout'],
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!is_resource($socket)) {
        throw new RuntimeException('Gemini-Verbindung fehlgeschlagen: ' . $errstr);
    }

    stream_set_timeout($socket, $config['download_timeout']);
    fwrite($socket, $url . "\r\n");

    $header = fgets($socket, 1027);
    if ($header === false || !preg_match('/^(\d{2})\s(.*)\r?\n$/', $header, $m)) {
        fclose($socket);
        throw new RuntimeException('Ungültige Gemini-Antwort.');
    }

    $status = (int)$m[1];
    $meta = trim($m[2]);

    if ($status >= 30 && $status < 40) {
        fclose($socket);
        return fetch_external_document($config, $meta, $redirects + 1);
    }

    if ($status < 20 || $status >= 30) {
        fclose($socket);
        throw new RuntimeException('Gemini-Status ' . $status . ': ' . $meta);
    }

    $mime = strtolower(trim(explode(';', $meta)[0] ?? ''));
    if (!in_array($mime, ['text/gemini', 'text/plain'], true)) {
        fclose($socket);
        throw new RuntimeException('Nicht unterstützter Medientyp: ' . $meta);
    }

    $content = '';
    while (!feof($socket)) {
        $chunk = fread($socket, 8192);
        if ($chunk === false) {
            break;
        }
        $content .= $chunk;
        if (strlen($content) > $config['max_import_size']) {
            fclose($socket);
            throw new RuntimeException('Die externe Datei ist zu groß.');
        }
    }
    fclose($socket);

    return [
        'url' => $url,
        'content' => $content,
        'mime' => $meta,
        'suggested_name' => suggested_filename($url),
    ];
}

function suggested_filename(string $url): string
{
    $path = (string)(parse_url($url, PHP_URL_PATH) ?? '');
    $name = basename(rtrim($path, '/'));
    if ($name === '' || $name === '.' || $name === '/') {
        return 'index.gmi';
    }
    if (pathinfo($name, PATHINFO_EXTENSION) === '') {
        $name .= '.gmi';
    }
    return preg_replace('/[^A-Za-z0-9._-]/', '_', $name) ?: 'import.gmi';
}
