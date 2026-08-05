<?php
declare(strict_types=1);

function content_root(array $config): string
{
    $root = realpath($config['content_root']);
    if ($root === false || !is_dir($root)) {
        throw new RuntimeException('Das Gemini-Inhaltsverzeichnis ist nicht erreichbar.');
    }
    return rtrim($root, DIRECTORY_SEPARATOR);
}

function normalize_relative_path(string $path): string
{
    $path = str_replace('\\', '/', trim($path));
    $path = ltrim($path, '/');

    $parts = [];
    foreach (explode('/', $path) as $part) {
        if ($part === '' || $part === '.') {
            continue;
        }
        if ($part === '..' || str_contains($part, "\0")) {
            throw new RuntimeException('Ungültiger Pfad.');
        }
        $parts[] = $part;
    }

    return implode('/', $parts);
}

function existing_path(array $config, string $relative): string
{
    $root = content_root($config);
    $relative = normalize_relative_path($relative);
    $candidate = realpath($root . ($relative !== '' ? '/' . $relative : ''));

    if ($candidate === false || ($candidate !== $root && !str_starts_with($candidate, $root . DIRECTORY_SEPARATOR))) {
        throw new RuntimeException('Pfad liegt außerhalb des Inhaltsverzeichnisses.');
    }

    return $candidate;
}

function new_path(array $config, string $relative): string
{
    $root = content_root($config);
    $relative = normalize_relative_path($relative);
    if ($relative === '') {
        throw new RuntimeException('Leerer Dateipfad.');
    }

    $candidate = $root . '/' . $relative;
    $parent = realpath(dirname($candidate));

    if ($parent === false || ($parent !== $root && !str_starts_with($parent, $root . DIRECTORY_SEPARATOR))) {
        throw new RuntimeException('Zielverzeichnis ist ungültig.');
    }

    return $candidate;
}

function assert_allowed_extension(array $config, string $path): void
{
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (!in_array($ext, $config['allowed_extensions'], true)) {
        throw new RuntimeException('Dieser Dateityp ist nicht erlaubt.');
    }
}

function build_tree(array $config, string $relative = ''): array
{
    $absolute = existing_path($config, $relative);
    if (!is_dir($absolute)) {
        throw new RuntimeException('Kein Verzeichnis.');
    }

    $items = [];
    foreach (new DirectoryIterator($absolute) as $entry) {
        if ($entry->isDot() || str_starts_with($entry->getFilename(), '.')) {
            continue;
        }

        $childRelative = trim($relative . '/' . $entry->getFilename(), '/');
        if ($entry->isDir()) {
            $items[] = [
                'type' => 'dir',
                'name' => $entry->getFilename(),
                'path' => $childRelative,
                'children' => build_tree($config, $childRelative),
            ];
            continue;
        }

        $ext = strtolower($entry->getExtension());
        if (in_array($ext, $config['allowed_extensions'], true)) {
            $items[] = [
                'type' => 'file',
                'name' => $entry->getFilename(),
                'path' => $childRelative,
            ];
        }
    }

    usort($items, static function (array $a, array $b): int {
        if ($a['type'] !== $b['type']) {
            return $a['type'] === 'dir' ? -1 : 1;
        }
        return strnatcasecmp($a['name'], $b['name']);
    });

    return $items;
}

function backup_file(array $config, string $absolutePath, string $relative): void
{
    if (!is_file($absolutePath)) {
        return;
    }

    $backupRoot = $config['backup_root'];
    if (!is_dir($backupRoot) && !mkdir($backupRoot, 0770, true) && !is_dir($backupRoot)) {
        throw new RuntimeException('Backup-Verzeichnis konnte nicht erstellt werden.');
    }

    $safe = str_replace('/', '__', normalize_relative_path($relative));
    $target = rtrim($backupRoot, '/') . '/' . $safe . '.' . date('Ymd-His') . '.bak';

    if (!copy($absolutePath, $target)) {
        throw new RuntimeException('Backup konnte nicht erstellt werden.');
    }
}


function delete_content_item(array $config, string $relative): string
{
    $relative = normalize_relative_path($relative);
    if ($relative === '') {
        throw new RuntimeException('Das Stammverzeichnis darf nicht gelöscht werden.');
    }

    $absolute = existing_path($config, $relative);
    $root = content_root($config);
    if ($absolute === $root) {
        throw new RuntimeException('Das Stammverzeichnis darf nicht gelöscht werden.');
    }

    if (is_dir($absolute)) {
        $iterator = new FilesystemIterator($absolute, FilesystemIterator::SKIP_DOTS);
        if ($iterator->valid()) {
            throw new RuntimeException('Das Verzeichnis ist nicht leer.');
        }
        if (!rmdir($absolute)) {
            throw new RuntimeException('Das Verzeichnis konnte nicht gelöscht werden.');
        }
        return 'dir';
    }

    if (!is_file($absolute)) {
        throw new RuntimeException('Datei oder Verzeichnis wurde nicht gefunden.');
    }

    assert_allowed_extension($config, $absolute);
    backup_file($config, $absolute, $relative);
    if (!unlink($absolute)) {
        throw new RuntimeException('Die Datei konnte nicht gelöscht werden.');
    }
    return 'file';
}
