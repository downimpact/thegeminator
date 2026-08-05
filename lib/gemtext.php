<?php
declare(strict_types=1);

function gemtext_to_html(string $text): string
{
    $lines = preg_split('/\R/u', $text) ?: [];
    $html = [];
    $inPre = false;
    $pre = [];
    $inList = false;

    $closeList = static function () use (&$html, &$inList): void {
        if ($inList) {
            $html[] = '</ul>';
            $inList = false;
        }
    };

    foreach ($lines as $line) {
        if (str_starts_with($line, '```')) {
            $closeList();
            if ($inPre) {
                $html[] = '<pre><code>' . htmlspecialchars(implode("\n", $pre), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</code></pre>';
                $pre = [];
                $inPre = false;
            } else {
                $inPre = true;
            }
            continue;
        }

        if ($inPre) {
            $pre[] = $line;
            continue;
        }

        if (preg_match('/^###\s+(.*)$/u', $line, $m)) {
            $closeList();
            $html[] = '<h3>' . htmlspecialchars($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</h3>';
        } elseif (preg_match('/^##\s+(.*)$/u', $line, $m)) {
            $closeList();
            $html[] = '<h2>' . htmlspecialchars($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</h2>';
        } elseif (preg_match('/^#\s+(.*)$/u', $line, $m)) {
            $closeList();
            $html[] = '<h1>' . htmlspecialchars($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</h1>';
        } elseif (preg_match('/^=>\s*(\S+)(?:\s+(.*))?$/u', $line, $m)) {
            $closeList();
            $url = $m[1];
            $label = isset($m[2]) && trim($m[2]) !== '' ? trim($m[2]) : $url;
            $html[] = '<p class="gem-link"><a href="' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '" target="_blank" rel="noopener noreferrer">' . htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</a></p>';
        } elseif (preg_match('/^\*\s+(.*)$/u', $line, $m)) {
            if (!$inList) {
                $html[] = '<ul>';
                $inList = true;
            }
            $html[] = '<li>' . htmlspecialchars($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</li>';
        } elseif (preg_match('/^>\s?(.*)$/u', $line, $m)) {
            $closeList();
            $html[] = '<blockquote>' . htmlspecialchars($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</blockquote>';
        } elseif (trim($line) === '') {
            $closeList();
            $html[] = '<div class="blank"></div>';
        } else {
            $closeList();
            $html[] = '<p>' . htmlspecialchars($line, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>';
        }
    }

    $closeList();

    if ($inPre) {
        $html[] = '<pre><code>' . htmlspecialchars(implode("\n", $pre), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</code></pre>';
    }

    return implode("\n", $html);
}
