# THE GEMINATOR

Browserbasierter Gemtext-Editor in PHP für Inhalte unter `/srv/gemini`.

## Funktionen

- moderne responsive Oberfläche
- Dateiübersicht
- Verzeichnisse anlegen
- Laden und Speichern von `.gmi`, `.gemini` und `.txt`
- automatische Sicherung vor dem Überschreiben
- Gemtext-Vorschau
- Import von `gemini://`, `https://` und `http://`
- Schutz vor Path Traversal und SSRF
- System-, Hell- und Dunkelmodus
- Druck von Vorschau oder Gemtext-Quelltext
- Löschen von Dateien und leeren Verzeichnissen

## Installation

```bash
sudo mkdir -p /var/www/html/gemini-editor
sudo unzip gemini-editor.zip -d /var/www/html/gemini-editor
sudo chown -R root:www-data /var/www/html/gemini-editor
sudo find /var/www/html/gemini-editor -type d -exec chmod 750 {} \;
sudo find /var/www/html/gemini-editor -type f -exec chmod 640 {} \;

sudo chown -R www-data:www-data /var/www/html/gemini-editor/backups
sudo chmod 770 /var/www/html/gemini-editor/backups
```

Damit Apache Inhalte in `/srv/gemini` bearbeiten darf:

```bash
sudo chgrp -R www-data /srv/gemini
sudo find /srv/gemini -type d -exec chmod 2770 {} \;
sudo find /srv/gemini -type f -exec chmod 660 {} \;
```

Benötigte PHP-Erweiterung für HTTP/HTTPS-Importe:

```bash
sudo apt install php-curl
sudo systemctl reload apache2
```

## Konfiguration

In `config.php`:

```php
'content_root' => '/srv/gemini',
'allowed_internal_hosts' => [
    'gemini.fritzbox',
],
'verify_gemini_peer' => false,
```

`verify_gemini_peer` ist für selbstsignierte Gemini-Zertifikate im Heimnetz standardmäßig deaktiviert.

- automatische Erneuerung des CSRF-Tokens nach Ablauf der PHP-Session

- integrierte Emoji-Auswahl mit Kategorien und zuletzt verwendeten Symbolen

- durchsuchbare Emoji-Auswahl mit rund 300 Symbolen, Kategorien, Favoriten und zuletzt verwendeten Emojis

- Emoji-Kategorie „Wissenschaft & Technik“ mit Labor-, Medizin-, Physik- und Mathematiksymbolen

- eigenes SVG-Favicon passend zum blauen Editor-Design

- Emoji-Katalog bereinigt: jedes Symbol erscheint nur noch in einer passenden Kategorie

- Verzeichnisbaum als dritte Druckansicht für Dokumentationszwecke

- integrierter Hilfe-Dialog mit Emoji-Anzahl, unterstützten Dateitypen und Tastenkürzeln

- logisch neu sortierte Hauptwerkzeugleiste: Hilfe, neue Datei, neues Verzeichnis, Import, Drucken, Speichern, Sprache, Theme

- lädt beim Start automatisch die zuletzt geöffnete Datei, ersatzweise `index.gmi`
