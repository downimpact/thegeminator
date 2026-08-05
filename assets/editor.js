(() => {
    'use strict';

    let csrfToken = window.APP_CONFIG.csrfToken;
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const pathInput = document.getElementById('pathInput');
    const tree = document.getElementById('tree');
    const status = document.getElementById('status');
    const directoryDialog = document.getElementById('directoryDialog');
    const directoryForm = document.getElementById('directoryForm');
    const directoryPath = document.getElementById('directoryPath');
    const cancelDirectoryBtn = document.getElementById('cancelDirectoryBtn');
    const importDialog = document.getElementById('importDialog');
    const importForm = document.getElementById('importForm');
    const importUrl = document.getElementById('importUrl');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiDialog = document.getElementById('emojiDialog');
    const closeEmojiBtn = document.getElementById('closeEmojiBtn');
    const emojiSearch = document.getElementById('emojiSearch');
    const favoriteEmojiSection = document.getElementById('favoriteEmojiSection');
    const favoriteEmojiGrid = document.getElementById('favoriteEmojiGrid');
    const recentEmojiSection = document.getElementById('recentEmojiSection');
    const recentEmojiGrid = document.getElementById('recentEmojiGrid');
    const emojiResultsSection = document.getElementById('emojiResultsSection');
    const emojiResultsGrid = document.getElementById('emojiResultsGrid');
    const emojiCategories = document.getElementById('emojiCategories');
    const languageSelect = document.getElementById('languageSelect');
    const themeSelect = document.getElementById('themeSelect');
    const printDialog = document.getElementById('printDialog');
    const cancelPrintBtn = document.getElementById('cancelPrintBtn');
    const printPreviewBtn = document.getElementById('printPreviewBtn');
    const printSourceBtn = document.getElementById('printSourceBtn');
    const printTreeBtn = document.getElementById('printTreeBtn');
    const helpDialog = document.getElementById('helpDialog');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    const helpCloseBottomBtn = document.getElementById('helpCloseBottomBtn');
    const helpEmojiCount = document.getElementById('helpEmojiCount');

    let previewTimer = null;
    let currentPath = pathInput.value;
    let currentTreeData = [];

    const translations = {
        de: {
            subtitle: 'Gemini-Protokoll',
            newFile: 'Neue Datei',
            newDirectory: 'Neues Verzeichnis',
            newDirectoryTitle: 'Neues Verzeichnis erstellen',
            newDirectoryInfo: 'Der Pfad wird relativ zu /srv/gemini angelegt.',
            directoryPath: 'Verzeichnispfad',
            create: 'Erstellen',
            enterDirectoryPath: 'Bitte einen Verzeichnispfad eingeben.',
            creatingDirectory: 'Verzeichnis wird erstellt …',
            directoryCreated: 'Verzeichnis {path} erstellt',
            externalFile: 'Externe Datei',
            save: 'Speichern',
            appearance: 'Darstellung',
            themeSystem: 'System',
            themeLight: 'Hell',
            themeDark: 'Dunkel',
            themeTerminal: 'Terminal',
            files: 'Dateien',
            refresh: 'Aktualisieren',
            loading: 'Lade …',
            editor: 'Editor',
            preview: 'Vorschau',
            ready: 'Bereit',
            loadExternalTitle: 'Externe Gemtext-Datei laden',
            loadExternalInfo: 'Die Datei wird zunächst nur in den Editor geladen. Gespeichert wird sie erst über „Speichern“.',
            externalAddress: 'Gemini-, HTTPS- oder HTTP-Adresse',
            cancel: 'Abbrechen',
            load: 'Laden',
            loadingFile: 'Datei wird geladen …',
            fileLoaded: '{path} geladen',
            enterFilename: 'Bitte einen Dateinamen eingeben.',
            saving: 'Speichere …',
            fileSaved: '{path} gespeichert',
            newFilePrepared: 'Neue Datei vorbereitet',
            newFileTitle: '# Neue Seite\n\n',
            enterExternalAddress: 'Bitte eine externe Adresse eingeben.',
            loadingExternal: 'Externe Datei wird geladen …',
            loadedFrom: 'Geladen: {url}',
            importCancelled: 'Import abgebrochen',
            editorTools: 'Gemtext-Werkzeuge',
            heading1: 'Überschrift 1',
            heading2: 'Überschrift 2',
            heading3: 'Überschrift 3',
            link: 'Link einfügen',
            list: 'Listeneintrag',
            quote: 'Zitat',
            preformatted: 'Vorformatierter Text',
            clearFormatting: 'Formatierung entfernen',
            print: 'Drucken',
            printTitle: 'Drucken',
            printInfo: 'Wähle, welche Darstellung gedruckt werden soll.',
            printPreview: 'Vorschau drucken',
            printPreviewInfo: 'Den fertig formatierten Gemtext-Inhalt drucken.',
            printSource: 'Quelltext drucken',
            printSourceInfo: 'Den Gemtext-Quelltext in Monospace drucken.',
            delete: 'Löschen',
            confirmDeleteFile: 'Datei „{path}“ wirklich löschen? Vorher wird eine Sicherung erstellt.',
            confirmDeleteDir: 'Leeres Verzeichnis „{path}“ wirklich löschen?',
            deleting: 'Lösche …',
            deleted: '{path} gelöscht',
            printWindowBlocked: 'Das Druckfenster wurde vom Browser blockiert.',
            insertEmoji: 'Emoji einfügen',
            emojiTitle: 'Emoji einfügen',
            searchEmoji: 'Emoji suchen …',
            favoriteEmoji: 'Favoriten',
            recentEmoji: 'Zuletzt verwendet',
            searchResults: 'Suchergebnisse',
            smileysEmoji: 'Gesichter',
            gesturesEmoji: 'Gesten',
            navigationEmoji: 'Navigation',
            informationEmoji: 'Information',
            servicesEmoji: 'Dienste',
            technologyEmoji: 'Technik',
            scienceTechnologyEmoji: 'Wissenschaft & Technik',
            mediaEmoji: 'Medien',
            natureEmoji: 'Tiere und Natur',
            foodEmoji: 'Essen und Trinken',
            travelEmoji: 'Reisen und Orte',
            activitiesEmoji: 'Aktivitäten',
            objectsEmoji: 'Objekte',
            symbolsEmoji: 'Symbole',
            spaceEmoji: 'Weltraum',
            flagsEmoji: 'Flaggen',
            help: 'Hilfe',
            helpTitle: 'Hilfe zum THE GEMINATOR',
            helpOverviewTitle: 'Kurzüberblick',
            helpOverviewText: 'Der Editor verwaltet Gemtext-Dateien unter /srv/gemini, zeigt eine Live-Vorschau und unterstützt Import, Drucken, Verzeichnisse, Backups und Emojis.',
            helpEmojiTitle: 'Emoji-Auswahl',
            helpEmojiText: 'Die integrierte Auswahl enthält',
            helpEmojiSuffix: 'eindeutige Emojis und Unicode-Symbole. Favoriten und zuletzt verwendete Symbole werden lokal im Browser gespeichert.',
            helpFilesTitle: 'Unterstützte Dateitypen',
            helpEditable: 'Bearbeitbar und speicherbar',
            helpImportable: 'Extern importierbar',
            helpFileNote: 'HTML- und Binärdateien werden nicht in den Texteditor geladen. Downloads aus einer Capsule erfolgen über die jeweiligen Links im Gemini-Client.',
            helpShortcutsTitle: 'Tastenkürzel',
            helpSaveShortcut: 'Datei speichern',
            printTree: 'Verzeichnisbaum drucken',
            printTreeInfo: 'Die vollständige Struktur unter /srv/gemini drucken.',
            close: 'Schließen'
        },
        en: {
            subtitle: 'Gemini Protocol',
            newFile: 'New file',
            newDirectory: 'New directory',
            newDirectoryTitle: 'Create new directory',
            newDirectoryInfo: 'The path is created relative to /srv/gemini.',
            directoryPath: 'Directory path',
            create: 'Create',
            enterDirectoryPath: 'Please enter a directory path.',
            creatingDirectory: 'Creating directory …',
            directoryCreated: 'Directory {path} created',
            externalFile: 'External file',
            save: 'Save',
            appearance: 'Appearance',
            themeSystem: 'System',
            themeLight: 'Light',
            themeDark: 'Dark',
            themeTerminal: 'Terminal',
            files: 'Files',
            refresh: 'Refresh',
            loading: 'Loading …',
            editor: 'Editor',
            preview: 'Preview',
            ready: 'Ready',
            loadExternalTitle: 'Load external Gemtext file',
            loadExternalInfo: 'The file is first loaded into the editor only. It is saved locally after choosing “Save”.',
            externalAddress: 'Gemini, HTTPS or HTTP address',
            cancel: 'Cancel',
            load: 'Load',
            loadingFile: 'Loading file …',
            fileLoaded: '{path} loaded',
            enterFilename: 'Please enter a file name.',
            saving: 'Saving …',
            fileSaved: '{path} saved',
            newFilePrepared: 'New file prepared',
            newFileTitle: '# New page\n\n',
            enterExternalAddress: 'Please enter an external address.',
            loadingExternal: 'Loading external file …',
            loadedFrom: 'Loaded: {url}',
            importCancelled: 'Import cancelled',
            editorTools: 'Gemtext tools',
            heading1: 'Heading 1',
            heading2: 'Heading 2',
            heading3: 'Heading 3',
            link: 'Insert link',
            list: 'List item',
            quote: 'Quote',
            preformatted: 'Preformatted text',
            clearFormatting: 'Remove formatting',
            print: 'Print',
            printTitle: 'Print',
            printInfo: 'Choose which representation should be printed.',
            printPreview: 'Print preview',
            printPreviewInfo: 'Print the formatted Gemtext content.',
            printSource: 'Print source',
            printSourceInfo: 'Print the Gemtext source in a monospaced font.',
            delete: 'Delete',
            confirmDeleteFile: 'Really delete “{path}”? A backup will be created first.',
            confirmDeleteDir: 'Really delete the empty directory “{path}”?',
            deleting: 'Deleting …',
            deleted: '{path} deleted',
            printWindowBlocked: 'The browser blocked the print window.',
            insertEmoji: 'Insert emoji',
            emojiTitle: 'Insert emoji',
            searchEmoji: 'Search emoji …',
            favoriteEmoji: 'Favorites',
            recentEmoji: 'Recently used',
            searchResults: 'Search results',
            smileysEmoji: 'Smileys',
            gesturesEmoji: 'Gestures',
            navigationEmoji: 'Navigation',
            informationEmoji: 'Information',
            servicesEmoji: 'Services',
            technologyEmoji: 'Technology',
            scienceTechnologyEmoji: 'Science & Technology',
            mediaEmoji: 'Media',
            natureEmoji: 'Animals and nature',
            foodEmoji: 'Food and drink',
            travelEmoji: 'Travel and places',
            activitiesEmoji: 'Activities',
            objectsEmoji: 'Objects',
            symbolsEmoji: 'Symbols',
            spaceEmoji: 'Space',
            flagsEmoji: 'Flags',
            help: 'Help',
            helpTitle: 'THE GEMINATOR Help',
            helpOverviewTitle: 'Overview',
            helpOverviewText: 'The editor manages Gemtext files below /srv/gemini, provides a live preview, and supports imports, printing, directories, backups and emoji.',
            helpEmojiTitle: 'Emoji picker',
            helpEmojiText: 'The built-in picker contains',
            helpEmojiSuffix: 'unique emoji and Unicode symbols. Favorites and recently used symbols are stored locally in the browser.',
            helpFilesTitle: 'Supported file types',
            helpEditable: 'Editable and saveable',
            helpImportable: 'External imports',
            helpFileNote: 'HTML and binary files are not loaded into the text editor. Capsule downloads are opened through their links in a Gemini client.',
            helpShortcutsTitle: 'Keyboard shortcuts',
            helpSaveShortcut: 'Save file',
            printTree: 'Print directory tree',
            printTreeInfo: 'Print the complete structure below /srv/gemini.',
            close: 'Close'
        }
    };

    let currentLanguage = localStorage.getItem('gemtext-editor-language') || 'de';

    function t(key, values = {}) {
        let text = translations[currentLanguage]?.[key] ?? translations.de[key] ?? key;
        for (const [name, value] of Object.entries(values)) {
            text = text.replaceAll(`{${name}}`, String(value));
        }
        return text;
    }

    function applyLanguage(language) {
        currentLanguage = translations[language] ? language : 'de';
        document.documentElement.lang = currentLanguage;
        languageSelect.value = currentLanguage;
        localStorage.setItem('gemtext-editor-language', currentLanguage);

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            element.title = t(element.dataset.i18nTitle);
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            element.setAttribute('aria-label', t(element.dataset.i18nAria));
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
        });
    }

    async function refreshCsrfToken() {
        const response = await fetch('api/csrf.php', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
        });

        const data = await response.json().catch(() => ({
            ok: false,
            error: 'Ungültige Serverantwort.',
        }));

        if (!response.ok || !data.ok || !data.csrfToken) {
            throw new Error(data.error || 'CSRF-Token konnte nicht erneuert werden.');
        }

        csrfToken = data.csrfToken;
        window.APP_CONFIG.csrfToken = csrfToken;
    }

    async function api(url, options = {}, retryCsrf = true) {
        const requestOptions = {
            credentials: 'same-origin',
            ...options,
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json().catch(() => ({
            ok: false,
            error: 'Ungültige Serverantwort.',
        }));

        if (
            response.status === 403 &&
            retryCsrf &&
            requestOptions.method === 'POST'
        ) {
            await refreshCsrfToken();

            const retryOptions = {
                ...requestOptions,
                headers: {
                    ...(requestOptions.headers || {}),
                    'X-CSRF-Token': csrfToken,
                },
            };

            return api(url, retryOptions, false);
        }

        if (!response.ok || !data.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    }

    function setStatus(message, isError = false) {
        status.textContent = message;
        status.style.color = isError ? '#b43c3c' : '';
    }

    function postJson(url, payload) {
        return api(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(payload),
        });
    }

    async function refreshPreview() {
        try {
            const data = await postJson('api/preview.php', { content: editor.value });
            preview.innerHTML = data.html;
        } catch (error) {
            preview.textContent = error.message;
        }
    }

    function schedulePreview() {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(refreshPreview, 180);
    }

    function renderTree(items, isRoot = false) {
        const ul = document.createElement('ul');
        ul.className = `tree-list${isRoot ? ' root' : ''}`;

        for (const item of items) {
            const li = document.createElement('li');
            li.className = `tree-item tree-${item.type}`;

            const row = document.createElement('div');
            row.className = 'tree-row';

            const button = document.createElement('button');
            button.className = 'tree-button';
            button.type = 'button';
            button.dataset.path = item.path;

            const icon = document.createElement('span');
            icon.className = 'tree-icon';
            icon.textContent = item.type === 'dir' ? '📂' : '📄';

            const label = document.createElement('span');
            label.className = 'tree-label';
            label.textContent = item.name;

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'tree-delete';
            deleteButton.textContent = '🗑';
            deleteButton.title = t('delete');
            deleteButton.setAttribute('aria-label', `${t('delete')}: ${item.name}`);
            deleteButton.addEventListener('click', event => {
                event.stopPropagation();
                deleteItem(item);
            });

            button.append(icon, label);
            row.append(button, deleteButton);
            li.appendChild(row);

            if (item.type === 'file') {
                button.addEventListener('click', () => loadFile(item.path));
            } else {
                const childTree = item.children?.length ? renderTree(item.children) : null;

                if (childTree) {
                    li.appendChild(childTree);
                    button.addEventListener('click', () => {
                        const collapsed = li.classList.toggle('collapsed');
                        icon.textContent = collapsed ? '📁' : '📂';
                        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
                    });
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    icon.textContent = '📁';
                }
            }

            ul.appendChild(li);
        }

        return ul;
    }

    async function refreshTree() {
        try {
            const data = await api('api/tree.php');
            currentTreeData = data.tree;
            tree.replaceChildren(renderTree(data.tree, true));
            markActivePath();
        } catch (error) {
            tree.textContent = error.message;
            setStatus(error.message, true);
        }
    }

    function markActivePath() {
        document.querySelectorAll('.tree-button').forEach(button => {
            button.classList.toggle('active', button.dataset.path === currentPath);
        });
    }

    async function loadFile(path) {
        try {
            setStatus(t('loadingFile'));
            const data = await api(`api/load.php?path=${encodeURIComponent(path)}`);
            currentPath = data.path;
            pathInput.value = data.path;
            localStorage.setItem('the-geminator-last-path', data.path);
            editor.value = data.content;
            await refreshPreview();
            markActivePath();
            setStatus(t('fileLoaded', { path: data.path }));
        } catch (error) {
            setStatus(error.message, true);
        }
    }

    async function saveFile() {
        const path = pathInput.value.trim();
        if (!path) {
            setStatus(t('enterFilename'), true);
            pathInput.focus();
            return;
        }

        try {
            setStatus(t('saving'));
            const data = await postJson('api/save.php', {
                path,
                content: editor.value,
            });
            currentPath = data.path;
            pathInput.value = data.path;
            localStorage.setItem('the-geminator-last-path', data.path);
            await refreshTree();
            setStatus(t('fileSaved', { path: data.path }));
        } catch (error) {
            setStatus(error.message, true);
        }
    }

    function newFile() {
        currentPath = '';
        pathInput.value = 'neue-datei.gmi';
        editor.value = t('newFileTitle');
        refreshPreview();
        markActivePath();
        pathInput.focus();
        pathInput.select();
        setStatus(t('newFilePrepared'));
    }

    async function createDirectory(path) {
        try {
            setStatus(t('creatingDirectory'));
            const data = await postJson('api/create_directory.php', { path });
            directoryDialog.close();
            await refreshTree();
            setStatus(t('directoryCreated', { path: data.path }));
        } catch (error) {
            setStatus(error.message, true);
        }
    }

    async function importExternal(url) {
        try {
            setStatus(t('loadingExternal'));
            const data = await postJson('api/import.php', { url });
            editor.value = data.content;
            currentPath = '';
            pathInput.value = data.suggested_name || 'import.gmi';
            await refreshPreview();
            markActivePath();
            importDialog.close();
            setStatus(t('loadedFrom', { url: data.url }));
        } catch (error) {
            setStatus(error.message, true);
        }
    }

    async function deleteItem(item) {
        const message = item.type === 'dir'
            ? t('confirmDeleteDir', { path: item.path })
            : t('confirmDeleteFile', { path: item.path });

        if (!window.confirm(message)) return;

        try {
            setStatus(t('deleting'));
            await postJson('api/delete.php', { path: item.path });

            if (item.type === 'file' && currentPath === item.path) {
                currentPath = '';
                pathInput.value = '';
                editor.value = '';
                await refreshPreview();
            }

            await refreshTree();
            setStatus(t('deleted', { path: item.path }));
        } catch (error) {
            setStatus(error.message, true);
        }
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[character]);
    }

    function buildPrintableTree(items) {
        if (!items.length) {
            return `<p>${currentLanguage === 'en' ? 'No files or directories.' : 'Keine Dateien oder Verzeichnisse.'}</p>`;
        }

        const list = items.map(item => {
            const icon = item.type === 'dir' ? '📁' : '📄';
            const children = item.type === 'dir' && item.children?.length
                ? buildPrintableTree(item.children)
                : '';
            return `<li class="tree-${item.type}"><span>${icon} ${escapeHtml(item.name)}</span>${children}</li>`;
        }).join('');

        return `<ul class="directory-tree">${list}</ul>`;
    }

    function openPrintView(mode) {
        const printWindow = window.open('', 'gemtextPrintWindow', 'width=900,height=700');
        if (!printWindow) {
            setStatus(t('printWindowBlocked'), true);
            return;
        }

        try {
            printWindow.opener = null;
        } catch (_) {
            // Some browsers prevent changing opener; printing can continue safely.
        }

        const fileName = mode === 'tree'
            ? (currentLanguage === 'en' ? 'Gemini directory tree' : 'Gemini-Verzeichnisbaum')
            : (pathInput.value.trim() || 'Gemtext');
        const content = mode === 'source'
            ? `<pre class="source">${escapeHtml(editor.value)}</pre>`
            : mode === 'tree'
                ? `<section class="tree-print">${buildPrintableTree(currentTreeData)}</section>`
                : `<article class="preview-print">${preview.innerHTML}</article>`;
        const printPath = mode === 'tree' ? '/srv/gemini/' : `/srv/gemini/${fileName}`;

        printWindow.document.open();
        printWindow.document.write(`<!doctype html>
<html lang="${currentLanguage}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(fileName)}</title>
<style>
@page { margin: 18mm; }
body { margin: 0; color: #111; background: #fff; font: 11pt/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
header { margin-bottom: 1.5rem; padding-bottom: .65rem; border-bottom: 1px solid #bbb; }
header h1 { margin: 0; font-size: 16pt; }
header p { margin: .2rem 0 0; color: #555; font: 9pt ui-monospace, monospace; }
h1, h2, h3 { page-break-after: avoid; line-height: 1.2; }
a { color: #000; text-decoration: underline; }
blockquote { margin: 1rem 0; padding-left: 1rem; border-left: 3px solid #777; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; border: 1px solid #bbb; padding: .8rem; background: #f5f5f5; }
pre.source { border: 0; padding: 0; background: transparent; font: 9.5pt/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.directory-tree { list-style: none; margin: 0; padding-left: 0; font: 10.5pt/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.directory-tree .directory-tree { margin-left: .45rem; padding-left: 1.2rem; border-left: 1px solid #aaa; }
.directory-tree li { break-inside: avoid; margin: .12rem 0; }
.directory-tree li > span { display: block; }
.blank { height: .45rem; }
</style>
</head>
<body>
<header><h1>${escapeHtml(fileName)}</h1><p>${escapeHtml(printPath)}</p></header>
${content}
<script>window.addEventListener('load', () => { window.print(); window.addEventListener('afterprint', () => window.close()); });<\/script>
</body></html>`);
        printWindow.document.close();
        printDialog.close();
    }

    function selectedLineRange() {
        const value = editor.value;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
        let lineEnd = value.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = value.length;
        return { value, start, end, lineStart, lineEnd };
    }

    function replaceEditorRange(start, end, replacement, selectionStart = null, selectionEnd = null) {
        editor.setRangeText(replacement, start, end, 'select');
        editor.focus();

        if (selectionStart !== null) {
            editor.setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
        }

        schedulePreview();
    }

    function prefixSelectedLines(prefix) {
        const range = selectedLineRange();
        const block = range.value.slice(range.lineStart, range.lineEnd);
        const lines = block.split('\n');
        const cleaned = lines.map(line => line.replace(/^(#{1,3}\s+|\*\s+|>\s?)/, ''));
        const replacement = cleaned.map(line => prefix + line).join('\n');

        replaceEditorRange(
            range.lineStart,
            range.lineEnd,
            replacement,
            range.lineStart + prefix.length,
            range.lineStart + replacement.length
        );
    }

    const emojiGroups = {
        "smileys": [
                [
                        "😀",
                        "grinning face smile happy"
                ],
                [
                        "😃",
                        "smiling face happy"
                ],
                [
                        "😄",
                        "smile happy"
                ],
                [
                        "😁",
                        "beaming face"
                ],
                [
                        "😆",
                        "laughing face"
                ],
                [
                        "😅",
                        "sweat smile"
                ],
                [
                        "😂",
                        "tears of joy laugh"
                ],
                [
                        "🤣",
                        "rolling laughing"
                ],
                [
                        "😊",
                        "smiling blush"
                ],
                [
                        "🙂",
                        "slightly smiling"
                ],
                [
                        "🙃",
                        "upside down"
                ],
                [
                        "😉",
                        "wink"
                ],
                [
                        "😍",
                        "heart eyes"
                ],
                [
                        "🥰",
                        "love hearts"
                ],
                [
                        "😘",
                        "kiss"
                ],
                [
                        "😎",
                        "cool sunglasses"
                ],
                [
                        "🤓",
                        "nerd"
                ],
                [
                        "🧐",
                        "monocle"
                ],
                [
                        "🤔",
                        "thinking"
                ],
                [
                        "🤨",
                        "raised eyebrow"
                ],
                [
                        "😐",
                        "neutral"
                ],
                [
                        "😑",
                        "expressionless"
                ],
                [
                        "😴",
                        "sleeping"
                ],
                [
                        "🥱",
                        "yawn"
                ],
                [
                        "😬",
                        "grimace"
                ],
                [
                        "😮",
                        "surprised"
                ],
                [
                        "😱",
                        "scream"
                ],
                [
                        "😢",
                        "cry"
                ],
                [
                        "😭",
                        "loud cry"
                ],
                [
                        "😡",
                        "angry"
                ],
                [
                        "🤯",
                        "mind blown"
                ],
                [
                        "🥳",
                        "party"
                ],
                [
                        "🤖",
                        "robot"
                ],
                [
                        "👻",
                        "ghost"
                ],
                [
                        "💩",
                        "poop"
                ]
        ],
        "gestures": [
                [
                        "👋",
                        "wave hello"
                ],
                [
                        "🤚",
                        "raised hand"
                ],
                [
                        "🖐️",
                        "hand fingers"
                ],
                [
                        "✋",
                        "stop hand"
                ],
                [
                        "👌",
                        "ok hand"
                ],
                [
                        "🤏",
                        "pinch"
                ],
                [
                        "✌️",
                        "victory"
                ],
                [
                        "🤞",
                        "crossed fingers"
                ],
                [
                        "🤟",
                        "love you gesture"
                ],
                [
                        "🤘",
                        "rock sign"
                ],
                [
                        "🤙",
                        "call me"
                ],
                [
                        "👈",
                        "point left"
                ],
                [
                        "👉",
                        "point right"
                ],
                [
                        "👆",
                        "point up"
                ],
                [
                        "👇",
                        "point down"
                ],
                [
                        "👍",
                        "thumbs up"
                ],
                [
                        "👎",
                        "thumbs down"
                ],
                [
                        "👏",
                        "clap"
                ],
                [
                        "🙌",
                        "raised hands"
                ],
                [
                        "🙏",
                        "please thanks"
                ],
                [
                        "💪",
                        "strong arm"
                ],
                [
                        "🫶",
                        "heart hands"
                ]
        ],
        "navigation": [
                [
                        "🏠",
                        "home house start"
                ],
                [
                        "📁",
                        "folder directory"
                ],
                [
                        "📂",
                        "open folder directory"
                ],
                [
                        "📄",
                        "document file"
                ],
                [
                        "🔗",
                        "link"
                ],
                [
                        "↩️",
                        "back return"
                ],
                [
                        "➡️",
                        "next right"
                ],
                [
                        "⬅️",
                        "left previous"
                ],
                [
                        "⬆️",
                        "up"
                ],
                [
                        "⬇️",
                        "down"
                ],
                [
                        "🔼",
                        "up button"
                ],
                [
                        "🔽",
                        "down button"
                ],
                [
                        "⏮️",
                        "previous"
                ],
                [
                        "⏭️",
                        "next"
                ],
                [
                        "🔙",
                        "back"
                ],
                [
                        "🔝",
                        "top"
                ],
                [
                        "🧭",
                        "compass navigation"
                ],
                [
                        "🗂️",
                        "card index folders"
                ]
        ],
        "information": [
                [
                        "ℹ️",
                        "information info"
                ],
                [
                        "❓",
                        "question"
                ],
                [
                        "❔",
                        "question white"
                ],
                [
                        "⚠️",
                        "warning caution"
                ],
                [
                        "✅",
                        "done check success"
                ],
                [
                        "☑️",
                        "checkbox"
                ],
                [
                        "❌",
                        "error cross"
                ],
                [
                        "⭕",
                        "circle"
                ],
                [
                        "💡",
                        "idea light bulb"
                ],
                [
                        "📌",
                        "pin pinned"
                ],
                [
                        "📍",
                        "location pin"
                ],
                [
                        "📝",
                        "note memo"
                ],
                [
                        "📢",
                        "announcement"
                ],
                [
                        "🔔",
                        "bell notification"
                ],
                [
                        "🔕",
                        "muted bell"
                ],
                [
                        "🚨",
                        "alert siren"
                ],
                [
                        "🆕",
                        "new"
                ],
                [
                        "🆗",
                        "ok"
                ],
                [
                        "🆘",
                        "sos help"
                ]
        ],
        "services": [
                [
                        "🌐",
                        "web globe internet"
                ],
                [
                        "🔎",
                        "search magnifying"
                ],
                [
                        "📰",
                        "news newspaper"
                ],
                [
                        "🌦️",
                        "weather"
                ],
                [
                        "☀️",
                        "sun weather"
                ],
                [
                        "🌧️",
                        "rain weather"
                ],
                [
                        "❄️",
                        "snow"
                ],
                [
                        "📡",
                        "network antenna"
                ],
                [
                        "📨",
                        "mail incoming"
                ],
                [
                        "✉️",
                        "email"
                ],
                [
                        "📅",
                        "calendar"
                ],
                [
                        "🗺️",
                        "map"
                ],
                [
                        "🕒",
                        "time clock"
                ],
                [
                        "☎️",
                        "phone"
                ],
                [
                        "💬",
                        "chat"
                ],
                [
                        "🗨️",
                        "speech"
                ],
                [
                        "🛒",
                        "shopping cart"
                ],
                [
                        "🏦",
                        "bank"
                ],
                [
                        "🏥",
                        "hospital"
                ],
                [
                        "🏫",
                        "school"
                ]
        ],
        "scienceTechnology": [
                [
                        "🔬",
                        "microscope science biology"
                ],
                [
                        "🔭",
                        "telescope astronomy"
                ],
                [
                        "🧪",
                        "test tube chemistry"
                ],
                [
                        "⚗️",
                        "alembic chemistry"
                ],
                [
                        "🧬",
                        "dna genetics"
                ],
                [
                        "🦠",
                        "microbe microbiology"
                ],
                [
                        "🧫",
                        "petri dish biology"
                ],
                [
                        "🧲",
                        "magnet physics"
                ],
                [
                        "⚛️",
                        "atom physics"
                ],
                [
                        "☢️",
                        "radioactive radiation"
                ],
                [
                        "☣️",
                        "biohazard biology"
                ],
                [
                        "💉",
                        "syringe medicine"
                ],
                [
                        "🩺",
                        "stethoscope medicine"
                ],
                [
                        "🩻",
                        "x ray medicine"
                ],
                [
                        "🧠",
                        "brain neuroscience"
                ],
                [
                        "🫀",
                        "heart anatomy"
                ],
                [
                        "🫁",
                        "lungs anatomy"
                ],
                [
                        "📐",
                        "geometry set square"
                ],
                [
                        "📏",
                        "ruler measurement"
                ],
                [
                        "🧮",
                        "abacus mathematics"
                ],
                [
                        "➕",
                        "plus addition"
                ],
                [
                        "➖",
                        "minus subtraction"
                ],
                [
                        "✖️",
                        "multiply"
                ],
                [
                        "➗",
                        "divide"
                ],
                [
                        "=",
                        "equals"
                ],
                [
                        "≠",
                        "not equal"
                ],
                [
                        "≈",
                        "approximately equal"
                ],
                [
                        "≤",
                        "less than or equal"
                ],
                [
                        "≥",
                        "greater than or equal"
                ],
                [
                        "∞",
                        "infinity"
                ],
                [
                        "√",
                        "square root"
                ],
                [
                        "∑",
                        "sum sigma"
                ],
                [
                        "∏",
                        "product pi"
                ],
                [
                        "∫",
                        "integral calculus"
                ],
                [
                        "∂",
                        "partial derivative"
                ],
                [
                        "π",
                        "pi"
                ],
                [
                        "Δ",
                        "delta change"
                ],
                [
                        "Ω",
                        "omega resistance"
                ],
                [
                        "μ",
                        "micro prefix"
                ],
                [
                        "λ",
                        "lambda wavelength"
                ],
                [
                        "α",
                        "alpha"
                ],
                [
                        "β",
                        "beta"
                ],
                [
                        "γ",
                        "gamma"
                ],
                [
                        "°",
                        "degree"
                ],
                [
                        "℃",
                        "celsius"
                ],
                [
                        "℉",
                        "fahrenheit"
                ],
                [
                        "㎐",
                        "hertz"
                ],
                [
                        "㎞",
                        "kilometre"
                ],
                [
                        "㎏",
                        "kilogram"
                ],
                [
                        "㎜",
                        "millimetre"
                ],
                [
                        "㎝",
                        "centimetre"
                ],
                [
                        "㎧",
                        "metres per second"
                ],
                [
                        "⚙️",
                        "gear engineering"
                ],
                [
                        "🔩",
                        "nut bolt engineering"
                ],
                [
                        "🪛",
                        "screwdriver"
                ],
                [
                        "🔧",
                        "wrench"
                ],
                [
                        "🛠️",
                        "tools"
                ],
                [
                        "💻",
                        "computer"
                ],
                [
                        "🖥️",
                        "desktop computer"
                ],
                [
                        "🧰",
                        "toolbox"
                ]
        ],
        "technology": [
                [
                        "⌨️",
                        "keyboard"
                ],
                [
                        "🖱️",
                        "mouse"
                ],
                [
                        "🖨️",
                        "printer"
                ],
                [
                        "💾",
                        "disk storage"
                ],
                [
                        "💿",
                        "disc"
                ],
                [
                        "📀",
                        "dvd"
                ],
                [
                        "📦",
                        "package"
                ],
                [
                        "🔌",
                        "plug"
                ],
                [
                        "🔋",
                        "battery"
                ],
                [
                        "🪫",
                        "low battery"
                ],
                [
                        "📱",
                        "phone mobile"
                ],
                [
                        "🎥",
                        "video camera"
                ],
                [
                        "🎙️",
                        "microphone"
                ],
                [
                        "📻",
                        "radio"
                ],
                [
                        "📺",
                        "television"
                ],
                [
                        "🔐",
                        "locked secure"
                ],
                [
                        "🔓",
                        "unlocked"
                ],
                [
                        "🔑",
                        "key"
                ]
        ],
        "media": [
                [
                        "🖼️",
                        "image picture"
                ],
                [
                        "📷",
                        "camera photo"
                ],
                [
                        "🎵",
                        "music note"
                ],
                [
                        "🎶",
                        "music notes"
                ],
                [
                        "🎬",
                        "movie film"
                ],
                [
                        "🎧",
                        "headphones audio"
                ],
                [
                        "🎤",
                        "microphone"
                ],
                [
                        "📚",
                        "books"
                ],
                [
                        "📖",
                        "open book"
                ],
                [
                        "📕",
                        "red book"
                ],
                [
                        "✏️",
                        "edit pencil"
                ],
                [
                        "🖊️",
                        "pen"
                ],
                [
                        "🖋️",
                        "fountain pen"
                ],
                [
                        "🗞️",
                        "rolled newspaper"
                ],
                [
                        "🎨",
                        "art palette"
                ],
                [
                        "🧩",
                        "puzzle"
                ],
                [
                        "🕹️",
                        "joystick"
                ]
        ],
        "nature": [
                [
                        "🐶",
                        "dog"
                ],
                [
                        "🐱",
                        "cat"
                ],
                [
                        "🐭",
                        "mouse animal"
                ],
                [
                        "🐹",
                        "hamster"
                ],
                [
                        "🐰",
                        "rabbit"
                ],
                [
                        "🦊",
                        "fox"
                ],
                [
                        "🐻",
                        "bear"
                ],
                [
                        "🐼",
                        "panda"
                ],
                [
                        "🐨",
                        "koala"
                ],
                [
                        "🐯",
                        "tiger"
                ],
                [
                        "🦁",
                        "lion"
                ],
                [
                        "🐮",
                        "cow"
                ],
                [
                        "🐷",
                        "pig"
                ],
                [
                        "🐸",
                        "frog"
                ],
                [
                        "🐵",
                        "monkey"
                ],
                [
                        "🐔",
                        "chicken"
                ],
                [
                        "🐧",
                        "penguin"
                ],
                [
                        "🐦",
                        "bird"
                ],
                [
                        "🦉",
                        "owl"
                ],
                [
                        "🦋",
                        "butterfly"
                ],
                [
                        "🐝",
                        "bee"
                ],
                [
                        "🐞",
                        "ladybug"
                ],
                [
                        "🐢",
                        "turtle"
                ],
                [
                        "🐍",
                        "snake"
                ],
                [
                        "🦎",
                        "lizard"
                ],
                [
                        "🐙",
                        "octopus"
                ],
                [
                        "🐠",
                        "fish"
                ],
                [
                        "🐳",
                        "whale"
                ],
                [
                        "🌱",
                        "seedling"
                ],
                [
                        "🌿",
                        "herb"
                ],
                [
                        "🍀",
                        "clover"
                ],
                [
                        "🌳",
                        "tree"
                ],
                [
                        "🌲",
                        "evergreen tree"
                ],
                [
                        "🌴",
                        "palm tree"
                ],
                [
                        "🌵",
                        "cactus"
                ],
                [
                        "🌷",
                        "tulip"
                ],
                [
                        "🌹",
                        "rose"
                ],
                [
                        "🌻",
                        "sunflower"
                ],
                [
                        "🍂",
                        "fallen leaf"
                ],
                [
                        "🍁",
                        "maple leaf"
                ]
        ],
        "food": [
                [
                        "🍎",
                        "apple"
                ],
                [
                        "🍐",
                        "pear"
                ],
                [
                        "🍊",
                        "orange"
                ],
                [
                        "🍋",
                        "lemon"
                ],
                [
                        "🍌",
                        "banana"
                ],
                [
                        "🍉",
                        "watermelon"
                ],
                [
                        "🍇",
                        "grapes"
                ],
                [
                        "🍓",
                        "strawberry"
                ],
                [
                        "🫐",
                        "blueberries"
                ],
                [
                        "🍒",
                        "cherries"
                ],
                [
                        "🥝",
                        "kiwi"
                ],
                [
                        "🍅",
                        "tomato"
                ],
                [
                        "🥑",
                        "avocado"
                ],
                [
                        "🥕",
                        "carrot"
                ],
                [
                        "🌽",
                        "corn"
                ],
                [
                        "🥔",
                        "potato"
                ],
                [
                        "🍞",
                        "bread"
                ],
                [
                        "🥐",
                        "croissant"
                ],
                [
                        "🥨",
                        "pretzel"
                ],
                [
                        "🧀",
                        "cheese"
                ],
                [
                        "🍳",
                        "egg"
                ],
                [
                        "🍔",
                        "burger"
                ],
                [
                        "🍟",
                        "fries"
                ],
                [
                        "🍕",
                        "pizza"
                ],
                [
                        "🌭",
                        "hot dog"
                ],
                [
                        "🥪",
                        "sandwich"
                ],
                [
                        "🌮",
                        "taco"
                ],
                [
                        "🍝",
                        "pasta"
                ],
                [
                        "🍜",
                        "noodles"
                ],
                [
                        "🍣",
                        "sushi"
                ],
                [
                        "🍰",
                        "cake"
                ],
                [
                        "🧁",
                        "cupcake"
                ],
                [
                        "🍪",
                        "cookie"
                ],
                [
                        "🍫",
                        "chocolate"
                ],
                [
                        "🍿",
                        "popcorn"
                ],
                [
                        "🧇",
                        "waffle"
                ],
                [
                        "☕️",
                        "coffee"
                ],
                [
                        "🍵",
                        "tea"
                ],
                [
                        "🥤",
                        "drink"
                ],
                [
                        "🍺",
                        "beer"
                ]
        ],
        "travel": [
                [
                        "🚗",
                        "car"
                ],
                [
                        "🚕",
                        "taxi"
                ],
                [
                        "🚌",
                        "bus"
                ],
                [
                        "🚎",
                        "trolleybus"
                ],
                [
                        "🏎️",
                        "race car"
                ],
                [
                        "🚓",
                        "police car"
                ],
                [
                        "🚑",
                        "ambulance"
                ],
                [
                        "🚒",
                        "fire engine"
                ],
                [
                        "🚲",
                        "bicycle"
                ],
                [
                        "🛴",
                        "scooter"
                ],
                [
                        "🏍️",
                        "motorcycle"
                ],
                [
                        "🚂",
                        "train"
                ],
                [
                        "🚆",
                        "railway"
                ],
                [
                        "🚇",
                        "metro"
                ],
                [
                        "✈️",
                        "airplane"
                ],
                [
                        "🛫",
                        "departure"
                ],
                [
                        "🛬",
                        "arrival"
                ],
                [
                        "🚁",
                        "helicopter"
                ],
                [
                        "⛵",
                        "sailboat"
                ],
                [
                        "🚢",
                        "ship"
                ],
                [
                        "⚓",
                        "anchor"
                ],
                [
                        "⛽",
                        "fuel"
                ],
                [
                        "🚦",
                        "traffic light"
                ],
                [
                        "🏁",
                        "finish"
                ],
                [
                        "🏕️",
                        "camping"
                ],
                [
                        "🏖️",
                        "beach"
                ],
                [
                        "🏝️",
                        "island"
                ],
                [
                        "🏔️",
                        "mountain"
                ],
                [
                        "🏙️",
                        "city"
                ],
                [
                        "🌉",
                        "bridge"
                ],
                [
                        "🏰",
                        "castle"
                ],
                [
                        "🗼",
                        "tower"
                ],
                [
                        "🗽",
                        "statue liberty"
                ]
        ],
        "activities": [
                [
                        "⚽",
                        "football"
                ],
                [
                        "🏀",
                        "basketball"
                ],
                [
                        "🏈",
                        "american football"
                ],
                [
                        "⚾",
                        "baseball"
                ],
                [
                        "🎾",
                        "tennis"
                ],
                [
                        "🏐",
                        "volleyball"
                ],
                [
                        "🏓",
                        "table tennis"
                ],
                [
                        "🏸",
                        "badminton"
                ],
                [
                        "🥅",
                        "goal"
                ],
                [
                        "⛳",
                        "golf"
                ],
                [
                        "🏹",
                        "archery"
                ],
                [
                        "🎣",
                        "fishing"
                ],
                [
                        "🤿",
                        "diving"
                ],
                [
                        "🏊",
                        "swimming"
                ],
                [
                        "🚴",
                        "cycling"
                ],
                [
                        "🏃",
                        "running"
                ],
                [
                        "🥾",
                        "hiking"
                ],
                [
                        "🎯",
                        "target"
                ],
                [
                        "🎳",
                        "bowling"
                ],
                [
                        "♟️",
                        "chess"
                ],
                [
                        "🎮",
                        "gaming"
                ],
                [
                        "🎲",
                        "dice"
                ],
                [
                        "🎭",
                        "theater"
                ],
                [
                        "🎪",
                        "circus"
                ],
                [
                        "🎉",
                        "celebration"
                ],
                [
                        "🎊",
                        "confetti"
                ],
                [
                        "🎁",
                        "gift"
                ],
                [
                        "🏆",
                        "trophy"
                ],
                [
                        "🥇",
                        "gold medal"
                ]
        ],
        "objects": [
                [
                        "⌚",
                        "watch"
                ],
                [
                        "⏰",
                        "alarm"
                ],
                [
                        "⏳",
                        "hourglass"
                ],
                [
                        "📞",
                        "telephone"
                ],
                [
                        "🔦",
                        "flashlight"
                ],
                [
                        "🕯️",
                        "candle"
                ],
                [
                        "🧯",
                        "fire extinguisher"
                ],
                [
                        "🛢️",
                        "oil drum"
                ],
                [
                        "💰",
                        "money bag"
                ],
                [
                        "💳",
                        "credit card"
                ],
                [
                        "🧾",
                        "receipt"
                ],
                [
                        "📎",
                        "paperclip"
                ],
                [
                        "✂️",
                        "scissors"
                ],
                [
                        "🔒",
                        "lock"
                ],
                [
                        "🔨",
                        "hammer"
                ],
                [
                        "🪓",
                        "axe"
                ],
                [
                        "🩹",
                        "bandage"
                ],
                [
                        "🧹",
                        "broom"
                ],
                [
                        "🧽",
                        "sponge eraser"
                ],
                [
                        "🪣",
                        "bucket"
                ]
        ],
        "symbols": [
                [
                        "❤️",
                        "heart"
                ],
                [
                        "🧡",
                        "orange heart"
                ],
                [
                        "💛",
                        "yellow heart"
                ],
                [
                        "💚",
                        "green heart"
                ],
                [
                        "💙",
                        "blue heart"
                ],
                [
                        "💜",
                        "purple heart"
                ],
                [
                        "🖤",
                        "black heart"
                ],
                [
                        "🤍",
                        "white heart"
                ],
                [
                        "💔",
                        "broken heart"
                ],
                [
                        "⭐",
                        "star"
                ],
                [
                        "🌟",
                        "glowing star"
                ],
                [
                        "✨",
                        "sparkles"
                ],
                [
                        "🔥",
                        "fire"
                ],
                [
                        "💥",
                        "boom"
                ],
                [
                        "💯",
                        "hundred"
                ],
                [
                        "🔴",
                        "red circle"
                ],
                [
                        "🟠",
                        "orange circle"
                ],
                [
                        "🟡",
                        "yellow circle"
                ],
                [
                        "🟢",
                        "green circle"
                ],
                [
                        "🔵",
                        "blue circle"
                ],
                [
                        "🟣",
                        "purple circle"
                ],
                [
                        "⚫",
                        "black circle"
                ],
                [
                        "⚪",
                        "white circle"
                ],
                [
                        "🔺",
                        "triangle"
                ],
                [
                        "🔻",
                        "down triangle"
                ],
                [
                        "▶️",
                        "play"
                ],
                [
                        "⏸️",
                        "pause"
                ],
                [
                        "⏹️",
                        "stop"
                ],
                [
                        "♻️",
                        "recycle"
                ],
                [
                        "©️",
                        "copyright"
                ],
                [
                        "®️",
                        "registered"
                ],
                [
                        "™️",
                        "trademark"
                ],
                [
                        "✔️",
                        "check"
                ],
                [
                        "〰️",
                        "wave"
                ]
        ],
        "space": [
                [
                        "🌕",
                        "full moon"
                ],
                [
                        "🌖",
                        "waning gibbous"
                ],
                [
                        "🌗",
                        "last quarter"
                ],
                [
                        "🌘",
                        "waning crescent"
                ],
                [
                        "🌑",
                        "new moon"
                ],
                [
                        "🌒",
                        "waxing crescent"
                ],
                [
                        "🌓",
                        "first quarter"
                ],
                [
                        "🌔",
                        "waxing gibbous"
                ],
                [
                        "🌙",
                        "crescent moon"
                ],
                [
                        "🌞",
                        "sun face"
                ],
                [
                        "💫",
                        "shooting star"
                ],
                [
                        "🌌",
                        "galaxy"
                ],
                [
                        "☄️",
                        "comet"
                ],
                [
                        "🌍",
                        "earth europe africa"
                ],
                [
                        "🌎",
                        "earth americas"
                ],
                [
                        "🌏",
                        "earth asia"
                ],
                [
                        "🪐",
                        "saturn planet"
                ],
                [
                        "🚀",
                        "rocket"
                ],
                [
                        "🛰️",
                        "satellite"
                ],
                [
                        "🛸",
                        "ufo"
                ],
                [
                        "👽",
                        "alien"
                ],
                [
                        "👨‍🚀",
                        "astronaut"
                ],
                [
                        "👩‍🚀",
                        "astronaut woman"
                ]
        ],
        "flags": [
                [
                        "🇩🇪",
                        "Germany flag"
                ],
                [
                        "🇬🇧",
                        "United Kingdom flag"
                ],
                [
                        "🇺🇸",
                        "United States flag"
                ],
                [
                        "🇫🇷",
                        "France flag"
                ],
                [
                        "🇮🇹",
                        "Italy flag"
                ],
                [
                        "🇪🇸",
                        "Spain flag"
                ],
                [
                        "🇳🇱",
                        "Netherlands flag"
                ],
                [
                        "🇧🇪",
                        "Belgium flag"
                ],
                [
                        "🇦🇹",
                        "Austria flag"
                ],
                [
                        "🇨🇭",
                        "Switzerland flag"
                ],
                [
                        "🇩🇰",
                        "Denmark flag"
                ],
                [
                        "🇸🇪",
                        "Sweden flag"
                ],
                [
                        "🇳🇴",
                        "Norway flag"
                ],
                [
                        "🇫🇮",
                        "Finland flag"
                ],
                [
                        "🇵🇱",
                        "Poland flag"
                ],
                [
                        "🇨🇿",
                        "Czechia flag"
                ],
                [
                        "🇯🇵",
                        "Japan flag"
                ],
                [
                        "🇨🇳",
                        "China flag"
                ],
                [
                        "🇮🇳",
                        "India flag"
                ],
                [
                        "🇨🇦",
                        "Canada flag"
                ],
                [
                        "🇦🇺",
                        "Australia flag"
                ],
                [
                        "🇳🇿",
                        "New Zealand flag"
                ],
                [
                        "🇪🇺",
                        "European Union flag"
                ],
                [
                        "🏳️",
                        "white flag"
                ],
                [
                        "🏴",
                        "black flag"
                ],
                [
                        "🚩",
                        "red flag"
                ]
        ]
};

    let recentEmojis = JSON.parse(localStorage.getItem('gemtext-editor-recent-emojis') || '[]');
    let favoriteEmojis = JSON.parse(localStorage.getItem('gemtext-editor-favorite-emojis') || '[]');

    function insertAtCursor(text) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText(text, start, end, 'end');
        editor.focus();
        schedulePreview();
    }

    function rememberEmoji(emoji) {
        recentEmojis = [emoji, ...recentEmojis.filter(item => item !== emoji)].slice(0, 10);
        localStorage.setItem('gemtext-editor-recent-emojis', JSON.stringify(recentEmojis));
        renderRecentEmojis();
    }

    function findEmojiLabel(emoji) {
        for (const group of Object.values(emojiGroups)) {
            const found = group.find(item => item[0] === emoji);
            if (found) return found[1];
        }
        return emoji;
    }

    function toggleFavorite(emoji) {
        if (favoriteEmojis.includes(emoji)) {
            favoriteEmojis = favoriteEmojis.filter(item => item !== emoji);
        } else {
            favoriteEmojis = [emoji, ...favoriteEmojis].slice(0, 24);
        }
        localStorage.setItem('gemtext-editor-favorite-emojis', JSON.stringify(favoriteEmojis));
        renderFavoriteEmojis();
        renderEmojiGroups();
        filterEmojis();
    }

    function createEmojiButton(emoji, label) {
        const wrapper = document.createElement('div');
        wrapper.className = 'emoji-option-wrap';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'emoji-option';
        button.textContent = emoji;
        button.title = label;
        button.setAttribute('aria-label', label);
        button.addEventListener('click', () => {
            insertAtCursor(emoji);
            rememberEmoji(emoji);
            emojiDialog.close();
        });

        const favorite = document.createElement('button');
        favorite.type = 'button';
        favorite.className = 'emoji-favorite';
        favorite.textContent = favoriteEmojis.includes(emoji) ? '★' : '☆';
        favorite.title = favoriteEmojis.includes(emoji) ? 'Remove favorite' : 'Add favorite';
        favorite.setAttribute('aria-label', favorite.title);
        favorite.addEventListener('click', event => {
            event.stopPropagation();
            toggleFavorite(emoji);
        });

        wrapper.append(button, favorite);
        return wrapper;
    }

    function renderEmojiGroups() {
        document.querySelectorAll('[data-emoji-group]').forEach(grid => {
            const group = emojiGroups[grid.dataset.emojiGroup] || [];
            grid.replaceChildren(...group.map(([emoji, label]) => createEmojiButton(emoji, label)));
        });
    }

    function renderRecentEmojis() {
        recentEmojiSection.hidden = recentEmojis.length === 0;
        recentEmojiGrid.replaceChildren(
            ...recentEmojis.map(emoji => createEmojiButton(emoji, findEmojiLabel(emoji)))
        );
    }

    function renderFavoriteEmojis() {
        favoriteEmojiSection.hidden = favoriteEmojis.length === 0;
        favoriteEmojiGrid.replaceChildren(
            ...favoriteEmojis.map(emoji => createEmojiButton(emoji, findEmojiLabel(emoji)))
        );
    }

    function allEmojiEntries() {
        const map = new Map();
        for (const group of Object.values(emojiGroups)) {
            for (const [emoji, label] of group) {
                if (!map.has(emoji)) map.set(emoji, label);
            }
        }
        return [...map.entries()];
    }

    function filterEmojis() {
        const query = emojiSearch.value.trim().toLocaleLowerCase();

        if (!query) {
            emojiResultsSection.hidden = true;
            emojiCategories.hidden = false;
            return;
        }

        const matches = allEmojiEntries()
            .filter(([emoji, label]) =>
                emoji.includes(query) || label.toLocaleLowerCase().includes(query)
            )
            .slice(0, 120);

        emojiResultsGrid.replaceChildren(
            ...matches.map(([emoji, label]) => createEmojiButton(emoji, label))
        );
        emojiResultsSection.hidden = false;
        emojiCategories.hidden = true;
    }

    function clearGemtextFormatting() {
        const range = selectedLineRange();
        let block = range.value.slice(range.lineStart, range.lineEnd);

        if (/^\s*```[\s\S]*```\s*$/.test(block)) {
            block = block
                .replace(/^\s*```\s*\n?/, '')
                .replace(/\n?```\s*$/, '');
        } else {
            block = block
                .split('\n')
                .map(line => {
                    if (/^=>\s*/.test(line)) {
                        return line.replace(/^=>\s*/, '');
                    }
                    return line.replace(/^(#{1,3}\s+|\*\s+|>\s?)/, '');
                })
                .join('\n');
        }

        replaceEditorRange(
            range.lineStart,
            range.lineEnd,
            block,
            range.lineStart,
            range.lineStart + block.length
        );
    }

    function insertGemtext(action) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selected = editor.value.slice(start, end);

        switch (action) {
            case 'h1':
                prefixSelectedLines('# ');
                break;
            case 'h2':
                prefixSelectedLines('## ');
                break;
            case 'h3':
                prefixSelectedLines('### ');
                break;
            case 'list':
                prefixSelectedLines('* ');
                break;
            case 'quote':
                prefixSelectedLines('> ');
                break;
            case 'link': {
                const label = selected || (currentLanguage === 'en' ? 'Link text' : 'Linktext');
                const url = 'gemini://example.org/';
                const replacement = `=> ${url} ${label}`;
                replaceEditorRange(start, end, replacement, start + 3, start + 3 + url.length);
                break;
            }
            case 'pre': {
                const content = selected || (currentLanguage === 'en' ? 'Preformatted text' : 'Vorformatierter Text');
                const replacement = `\`\`\`\n${content}\n\`\`\``;
                const contentStart = start + 4;
                replaceEditorRange(start, end, replacement, contentStart, contentStart + content.length);
                break;
            }
            case 'clear':
                clearGemtextFormatting();
                break;
        }
    }

    function applyTheme(value) {
        if (value === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.dataset.theme = value;
        }
        localStorage.setItem('gemtext-editor-theme', value);
    }

    editor.addEventListener('input', schedulePreview);
    pathInput.addEventListener('input', () => {
        currentPath = pathInput.value.trim();
        markActivePath();
    });

    document.getElementById('saveBtn').addEventListener('click', saveFile);
    document.getElementById('newFileBtn').addEventListener('click', newFile);
    document.getElementById('newDirBtn').addEventListener('click', () => {
        directoryPath.value = '';
        directoryDialog.showModal();
        directoryPath.focus();
    });
    document.getElementById('refreshBtn').addEventListener('click', refreshTree);
    document.getElementById('helpBtn').addEventListener('click', () => {
        helpEmojiCount.textContent = String(allEmojiEntries().length);
        helpDialog.showModal();
    });
    closeHelpBtn.addEventListener('click', () => helpDialog.close());
    helpCloseBottomBtn.addEventListener('click', () => helpDialog.close());
    helpDialog.addEventListener('click', event => {
        const rect = helpDialog.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) helpDialog.close();
    });

    document.getElementById('printBtn').addEventListener('click', () => printDialog.showModal());
    printPreviewBtn.addEventListener('click', () => openPrintView('preview'));
    printSourceBtn.addEventListener('click', () => openPrintView('source'));
    printTreeBtn.addEventListener('click', () => openPrintView('tree'));
    cancelPrintBtn.addEventListener('click', () => printDialog.close());
    printDialog.addEventListener('click', event => {
        const rect = printDialog.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) printDialog.close();
    });

    directoryForm.addEventListener('submit', event => {
        event.preventDefault();
        const path = directoryPath.value.trim();
        if (!path) {
            setStatus(t('enterDirectoryPath'), true);
            directoryPath.focus();
            return;
        }
        createDirectory(path);
    });

    cancelDirectoryBtn.addEventListener('click', () => directoryDialog.close());

    directoryDialog.addEventListener('click', event => {
        const rect = directoryDialog.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) directoryDialog.close();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        importUrl.value = '';
        importDialog.showModal();
        importUrl.focus();
    });

    importForm.addEventListener('submit', event => {
        event.preventDefault();

        const url = importUrl.value.trim();
        if (!url) {
            setStatus(t('enterExternalAddress'), true);
            importUrl.focus();
            return;
        }

        importExternal(url);
    });

    cancelImportBtn.addEventListener('click', () => {
        importDialog.close();
        setStatus(t('importCancelled'));
    });

    importDialog.addEventListener('click', event => {
        const rect = importDialog.getBoundingClientRect();
        const insideDialog =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!insideDialog) {
            importDialog.close();
            setStatus(t('importCancelled'));
        }
    });

    importDialog.addEventListener('cancel', () => {
        setStatus(t('importCancelled'));
    });

    document.querySelectorAll('.format-button').forEach(button => {
        button.addEventListener('click', () => insertGemtext(button.dataset.action));
    });

    emojiBtn.addEventListener('click', () => {
        emojiSearch.value = '';
        renderFavoriteEmojis();
        renderRecentEmojis();
        filterEmojis();
        emojiDialog.showModal();
        emojiSearch.focus();
    });

    emojiSearch.addEventListener('input', filterEmojis);

    closeEmojiBtn.addEventListener('click', () => emojiDialog.close());

    emojiDialog.addEventListener('click', event => {
        const rect = emojiDialog.getBoundingClientRect();
        const inside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!inside) {
            emojiDialog.close();
        }
    });

    languageSelect.addEventListener('change', () => {
        applyLanguage(languageSelect.value);
        renderEmojiGroups();
        renderFavoriteEmojis();
        renderRecentEmojis();
        filterEmojis();
        setStatus(t('ready'));
    });
    themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));

    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            saveFile();
        }
    });

    const storedTheme = localStorage.getItem('gemtext-editor-theme') || 'system';
    themeSelect.value = storedTheme;
    applyTheme(storedTheme);
    applyLanguage(currentLanguage);

    async function initializeEditor() {
        renderEmojiGroups();
        renderFavoriteEmojis();
        renderRecentEmojis();
        await refreshTree();

        const startupPath =
            localStorage.getItem('the-geminator-last-path') ||
            pathInput.value.trim() ||
            'index.gmi';

        try {
            await loadFile(startupPath);
        } catch (error) {
            currentPath = '';
            pathInput.value = startupPath;
            await refreshPreview();
            setStatus(error.message, true);
        }
    }

    initializeEditor();
})();
