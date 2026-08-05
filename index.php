<?php
declare(strict_types=1);
require_once __DIR__ . '/lib/bootstrap.php';
$csrf = $_SESSION['csrf_token'];
?><!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>THE GEMINATOR</title>
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="stylesheet" href="assets/app.css">
</head>
<body>
<header class="topbar">
    <div class="brand">
        <div class="brand-mark">G</div>
        <div>
            <strong>THE GEMINATOR</strong>
            <span data-i18n="subtitle">Gemini-Protokoll</span>
        </div>
    </div>
    <div class="toolbar">
        <button id="helpBtn" data-i18n="help">Hilfe</button>
        <button id="newFileBtn" data-i18n="newFile">Neue Datei</button>
        <button id="newDirBtn" data-i18n="newDirectory">Neues Verzeichnis</button>
        <button id="importBtn" data-i18n="externalFile">Externe Datei</button>
        <button id="printBtn" data-i18n="print">Drucken</button>
        <button id="saveBtn" class="primary" data-i18n="save">Speichern</button>
        <select id="languageSelect" aria-label="Sprache">
            <option value="de">Deutsch</option>
            <option value="en">English</option>
        </select>
        <select id="themeSelect" aria-label="Darstellung" data-i18n-aria="appearance">
            <option value="system" data-i18n="themeSystem">System</option>
            <option value="light" data-i18n="themeLight">Hell</option>
            <option value="dark" data-i18n="themeDark">Dunkel</option>
            <option value="terminal" data-i18n="themeTerminal">Terminal</option>
        </select>
    </div>
</header>

<div class="pathbar">
    <span class="protocol-badge">gemini</span>
    <span class="root-label">/srv/gemini/</span>
    <input id="pathInput" value="index.gmi" spellcheck="false" aria-label="Dateipfad">
</div>

<main class="layout">
    <aside class="sidebar">
        <div class="section-heading">
            <h2 data-i18n="files">Dateien</h2>
            <button id="refreshBtn" class="icon-button" title="Aktualisieren" data-i18n-title="refresh">↻</button>
        </div>
        <div id="tree" class="tree">Lade …</div>
    </aside>

    <section class="editor-panel panel">
        <div class="panel-title" data-i18n="editor">Editor</div>
        <div class="editor-toolbar" role="toolbar" aria-label="Gemtext-Werkzeuge" data-i18n-aria="editorTools">
            <button type="button" class="format-button" data-action="h1" title="Überschrift 1" data-i18n-title="heading1">H1</button>
            <button type="button" class="format-button" data-action="h2" title="Überschrift 2" data-i18n-title="heading2">H2</button>
            <button type="button" class="format-button" data-action="h3" title="Überschrift 3" data-i18n-title="heading3">H3</button>
            <span class="toolbar-separator"></span>
            <button type="button" class="format-button" data-action="link" title="Link" data-i18n-title="link">↗</button>
            <button type="button" class="format-button" data-action="list" title="Liste" data-i18n-title="list">•</button>
            <button type="button" class="format-button" data-action="quote" title="Zitat" data-i18n-title="quote">❯</button>
            <button type="button" class="format-button" data-action="pre" title="Vorformatierter Text" data-i18n-title="preformatted">&lt;/&gt;</button>
            <button type="button" id="emojiBtn" class="format-button emoji-button" title="Emoji einfügen" data-i18n-title="insertEmoji">😀</button>
            <span class="toolbar-spacer"></span>
            <span class="toolbar-separator"></span>
            <button type="button" class="format-button clear-format-button" data-action="clear" title="Formatierung entfernen" data-i18n-title="clearFormatting">🧽</button>
        </div>
        <textarea id="editor" spellcheck="false" aria-label="THE GEMINATOR"></textarea>
    </section>

    <section class="preview-panel panel">
        <div class="panel-title" data-i18n="preview">Vorschau</div>
        <article id="preview" class="preview"></article>
    </section>
</main>

<div id="status" class="status" data-i18n="ready">Bereit</div>



<dialog id="emojiDialog" class="emoji-dialog">
    <form method="dialog" id="emojiForm">
        <div class="emoji-dialog-header">
            <h2 data-i18n="emojiTitle">Emoji einfügen</h2>
            <button id="closeEmojiBtn" type="button" class="icon-button" aria-label="Schließen" data-i18n-aria="close">×</button>
        </div>

        <div class="emoji-search-wrap">
            <input id="emojiSearch" type="search" placeholder="Emoji suchen …" data-i18n-placeholder="searchEmoji">
        </div>

        <div id="favoriteEmojiSection" class="emoji-section">
            <h3 data-i18n="favoriteEmoji">Favoriten</h3>
            <div id="favoriteEmojiGrid" class="emoji-grid"></div>
        </div>

        <div id="recentEmojiSection" class="emoji-section">
            <h3 data-i18n="recentEmoji">Zuletzt verwendet</h3>
            <div id="recentEmojiGrid" class="emoji-grid"></div>
        </div>

        <div id="emojiResultsSection" class="emoji-section" hidden>
            <h3 data-i18n="searchResults">Suchergebnisse</h3>
            <div id="emojiResultsGrid" class="emoji-grid"></div>
        </div>

        <div id="emojiCategories">
            <div class="emoji-section">
                <h3 data-i18n="smileysEmoji">Gesichter</h3>
                <div class="emoji-grid" data-emoji-group="smileys"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="gesturesEmoji">Gesten</h3>
                <div class="emoji-grid" data-emoji-group="gestures"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="navigationEmoji">Navigation</h3>
                <div class="emoji-grid" data-emoji-group="navigation"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="informationEmoji">Information</h3>
                <div class="emoji-grid" data-emoji-group="information"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="servicesEmoji">Dienste</h3>
                <div class="emoji-grid" data-emoji-group="services"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="technologyEmoji">Technik</h3>
                <div class="emoji-grid" data-emoji-group="technology"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="scienceTechnologyEmoji">Wissenschaft &amp; Technik</h3>
                <div class="emoji-grid" data-emoji-group="scienceTechnology"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="mediaEmoji">Medien</h3>
                <div class="emoji-grid" data-emoji-group="media"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="natureEmoji">Tiere und Natur</h3>
                <div class="emoji-grid" data-emoji-group="nature"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="foodEmoji">Essen und Trinken</h3>
                <div class="emoji-grid" data-emoji-group="food"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="travelEmoji">Reisen und Orte</h3>
                <div class="emoji-grid" data-emoji-group="travel"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="activitiesEmoji">Aktivitäten</h3>
                <div class="emoji-grid" data-emoji-group="activities"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="objectsEmoji">Objekte</h3>
                <div class="emoji-grid" data-emoji-group="objects"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="symbolsEmoji">Symbole</h3>
                <div class="emoji-grid" data-emoji-group="symbols"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="spaceEmoji">Weltraum</h3>
                <div class="emoji-grid" data-emoji-group="space"></div>
            </div>

            <div class="emoji-section">
                <h3 data-i18n="flagsEmoji">Flaggen</h3>
                <div class="emoji-grid" data-emoji-group="flags"></div>
            </div>
        </div>
    </form>
</dialog>

<dialog id="directoryDialog">
    <form method="dialog" id="directoryForm">
        <h2 data-i18n="newDirectoryTitle">Neues Verzeichnis erstellen</h2>
        <p data-i18n="newDirectoryInfo">Der Pfad wird relativ zu /srv/gemini angelegt.</p>
        <label for="directoryPath" data-i18n="directoryPath">Verzeichnispfad</label>
        <input id="directoryPath" type="text" placeholder="informationen" required>
        <div class="dialog-actions">
            <button id="cancelDirectoryBtn" type="button" data-i18n="cancel">Abbrechen</button>
            <button type="submit" class="primary" data-i18n="create">Erstellen</button>
        </div>
    </form>
</dialog>

<dialog id="importDialog">
    <form method="dialog" id="importForm">
        <h2 data-i18n="loadExternalTitle">Externe Gemtext-Datei laden</h2>
        <p data-i18n="loadExternalInfo">Die Datei wird zunächst nur in den Editor geladen. Gespeichert wird sie erst über „Speichern“.</p>
        <label for="importUrl" data-i18n="externalAddress">Gemini-, HTTPS- oder HTTP-Adresse</label>
        <input id="importUrl" type="url" placeholder="gemini://example.org/index.gmi" required>
        <div class="dialog-actions">
            <button id="cancelImportBtn" type="button" data-i18n="cancel">Abbrechen</button>
            <button type="submit" class="primary" data-i18n="load">Laden</button>
        </div>
    </form>
</dialog>


<dialog id="helpDialog" class="help-dialog">
    <form method="dialog">
        <div class="help-dialog-header">
            <h2 data-i18n="helpTitle">Hilfe zum THE GEMINATOR</h2>
            <button id="closeHelpBtn" type="button" class="icon-button" aria-label="Schließen" data-i18n-aria="close">×</button>
        </div>
        <div class="help-content">
            <section>
                <h3 data-i18n="helpOverviewTitle">Kurzüberblick</h3>
                <p data-i18n="helpOverviewText">Der Editor verwaltet Gemtext-Dateien unter /srv/gemini, zeigt eine Live-Vorschau und unterstützt Import, Drucken, Verzeichnisse, Backups und Emojis.</p>
            </section>
            <section>
                <h3 data-i18n="helpEmojiTitle">Emoji-Auswahl</h3>
                <p><span data-i18n="helpEmojiText">Die integrierte Auswahl enthält</span> <strong id="helpEmojiCount">0</strong> <span data-i18n="helpEmojiSuffix">eindeutige Emojis und Unicode-Symbole. Favoriten und zuletzt verwendete Symbole werden lokal im Browser gespeichert.</span></p>
            </section>
            <section>
                <h3 data-i18n="helpFilesTitle">Unterstützte Dateitypen</h3>
                <dl class="help-file-types">
                    <div><dt data-i18n="helpEditable">Bearbeitbar und speicherbar</dt><dd><code>.gmi</code>, <code>.gemini</code>, <code>.txt</code></dd></div>
                    <div><dt data-i18n="helpImportable">Extern importierbar</dt><dd><code>text/gemini</code>, <code>text/plain</code>, <code>text/markdown</code></dd></div>
                </dl>
                <p class="help-note" data-i18n="helpFileNote">HTML- und Binärdateien werden nicht in den Texteditor geladen. Downloads aus einer Capsule erfolgen über die jeweiligen Links im Gemini-Client.</p>
            </section>
            <section>
                <h3 data-i18n="helpShortcutsTitle">Tastenkürzel</h3>
                <p><kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd> — <span data-i18n="helpSaveShortcut">Datei speichern</span></p>
            </section>
        </div>
        <div class="dialog-actions help-actions">
            <button id="helpCloseBottomBtn" type="button" class="primary" data-i18n="close">Schließen</button>
        </div>
    </form>
</dialog>

<dialog id="printDialog">
    <form method="dialog" id="printForm">
        <h2 data-i18n="printTitle">Drucken</h2>
        <p data-i18n="printInfo">Wähle, welche Darstellung gedruckt werden soll.</p>
        <div class="print-options">
            <button id="printPreviewBtn" type="button" class="print-option">
                <strong data-i18n="printPreview">Vorschau drucken</strong>
                <span data-i18n="printPreviewInfo">Den fertig formatierten Gemtext-Inhalt drucken.</span>
            </button>
            <button id="printSourceBtn" type="button" class="print-option">
                <strong data-i18n="printSource">Quelltext drucken</strong>
                <span data-i18n="printSourceInfo">Den Gemtext-Quelltext in Monospace drucken.</span>
            </button>
            <button id="printTreeBtn" type="button" class="print-option">
                <strong data-i18n="printTree">Verzeichnisbaum drucken</strong>
                <span data-i18n="printTreeInfo">Die vollständige Struktur unter /srv/gemini drucken.</span>
            </button>
        </div>
        <div class="dialog-actions">
            <button id="cancelPrintBtn" type="button" data-i18n="cancel">Abbrechen</button>
        </div>
    </form>
</dialog>

<script>
window.APP_CONFIG = { csrfToken: <?= json_encode($csrf) ?> };
</script>
<script src="assets/editor.js"></script>
</body>
</html>
