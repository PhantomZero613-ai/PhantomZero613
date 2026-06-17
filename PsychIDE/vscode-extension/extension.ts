import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let diagnosticCollection: vscode.DiagnosticCollection;

export async function activate(context: vscode.ExtensionContext) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('psych-ide');
    context.subscriptions.push(diagnosticCollection);
    
    console.log('Psych Engine IDE activated');

    // Register validation command
    context.subscriptions.push(
        vscode.commands.registerCommand('psychIde.validateLua', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No file open');
                return;
            }
            validateLuaFile(editor.document);
            vscode.window.showInformationMessage('✓ Lua file validated');
        })
    );

    // Register JSON validation command
    context.subscriptions.push(
        vscode.commands.registerCommand('psychIde.validateJson', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No file open');
                return;
            }
            validateJsonFile(editor.document);
            vscode.window.showInformationMessage('✓ JSON file validated');
        })
    );

    // Register snippet generator
    context.subscriptions.push(
        vscode.commands.registerCommand('psychIde.generateSnippet', async () => {
            const snippets = [
                'Shader Template',
                'Sprite + Tween',
                'Event Handler',
                'Character JSON'
            ];
            
            const choice = await vscode.window.showQuickPick(snippets);
            if (choice) {
                vscode.window.showInformationMessage(`Generated: ${choice}`);
            }
        })
    );

    // Register Snippet Explorer (UI/UX overhaul)
    context.subscriptions.push(
        vscode.commands.registerCommand('psychIde.openSnippetExplorer', async () => {
            openSnippetExplorer(context);
        })
    );

    // Watch Lua files for changes and validate on change
    const luaWatcher = vscode.workspace.createFileSystemWatcher('**/*.lua');
    luaWatcher.onDidChange(uri => {
        const document = vscode.workspace.textDocuments.find(doc => doc.uri === uri);
        if (document) {
            validateLuaFile(document);
        }
    });
    context.subscriptions.push(luaWatcher);

    // Watch JSON files for changes
    const jsonWatcher = vscode.workspace.createFileSystemWatcher('{**/song.json,**/character.json}');
    jsonWatcher.onDidChange(uri => {
        const document = vscode.workspace.textDocuments.find(doc => doc.uri === uri);
        if (document) {
            validateJsonFile(document);
        }
    });
    context.subscriptions.push(jsonWatcher);

    // Provide hover hints for Psych functions
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('lua', {
            provideHover(document, position, token) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);
                
                const psychFunctions: { [key: string]: string } = {
                    'initLuaShader': 'Initialize a Lua shader (e.g., `game.initLuaShader(\'heatwave\')`)',
                    'setSpriteShader': 'Apply shader to sprite/camera',
                    'setShaderFloat': 'Set float uniform (must be 0.0, not 0)',
                    'setShaderInt': 'Set integer uniform',
                    'setShaderVec2': 'Set vec2 uniform (2 float values)',
                    'setShaderVec3': 'Set vec3 uniform (3 float values)',
                    'makeLuaSprite': 'Create sprite instance',
                    'addLuaSprite': 'Add sprite to render queue',
                    'makeGraphic': 'Create graphic primitive',
                    'runHaxeCode': 'Execute Haxe code inline',
                    'debugPrint': 'Print debug message to console',
                    'getSongPosition': 'Get current song position in milliseconds',
                    'getVar': 'Get variable from game state',
                    'setVar': 'Set variable in game state',
                    'doTweenX': 'Animate X position',
                    'doTweenY': 'Animate Y position',
                };

                if (word in psychFunctions) {
                    return new vscode.Hover(new vscode.MarkdownString(`**${word}**\n\n${psychFunctions[word]}`));
                }
                return null;
            }
        })
    );

    // Signature info and completion data derived from the same function set
    const psychSignatures: { [key: string]: { label: string, params: string[] } } = {
        'initLuaShader': { label: 'initLuaShader(shaderName: string)', params: ['shaderName'] },
        'setSpriteShader': { label: 'setSpriteShader(spriteId: string, shaderName: string)', params: ['spriteId', 'shaderName'] },
        'setShaderFloat': { label: 'setShaderFloat(spriteId: string, uniform: string, value: number)', params: ['spriteId', 'uniform', 'value'] },
        'setShaderInt': { label: 'setShaderInt(spriteId: string, uniform: string, value: number)', params: ['spriteId', 'uniform', 'value'] },
        'setShaderVec2': { label: 'setShaderVec2(spriteId: string, uniform: string, x: number, y: number)', params: ['spriteId', 'uniform', 'x', 'y'] },
        'setShaderVec3': { label: 'setShaderVec3(spriteId: string, uniform: string, x: number, y: number, z: number)', params: ['spriteId', 'uniform', 'x', 'y', 'z'] },
        'makeLuaSprite': { label: 'makeLuaSprite(id: string, image: string, x: number, y: number)', params: ['id', 'image', 'x', 'y'] },
        'addLuaSprite': { label: 'addLuaSprite(id: string, inFront: boolean)', params: ['id', 'inFront'] },
        'makeGraphic': { label: 'makeGraphic(name: string, width: number, height: number, color: number)', params: ['name', 'width', 'height', 'color'] },
        'runHaxeCode': { label: 'runHaxeCode(code: string)', params: ['code'] },
        'debugPrint': { label: 'debugPrint(message: string)', params: ['message'] },
        'getSongPosition': { label: 'getSongPosition()', params: [] },
        'getVar': { label: 'getVar(name: string)', params: ['name'] },
        'setVar': { label: 'setVar(name: string, value: any)', params: ['name', 'value'] },
        'doTweenX': { label: 'doTweenX(id: string, target: string, value: number, duration: number)', params: ['id','target','value','duration'] },
        'doTweenY': { label: 'doTweenY(id: string, target: string, value: number, duration: number)', params: ['id','target','value','duration'] }
    };

    // Completion provider for Psych functions and registered snippet prefixes
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const items: vscode.CompletionItem[] = [];
            // Add function completions
            Object.keys(psychSignatures).forEach(fn => {
                const item = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
                item.detail = psychSignatures[fn].label;
                item.insertText = fn + '(';
                items.push(item);
            });

            // Add snippet prefix completions by scanning snippets folder (fast cache)
            try {
                const snippetsDir = path.join(context.extensionPath, 'snippets');
                const files = fs.readdirSync(snippetsDir);
                files.forEach(f => {
                    if (f.endsWith('.json')) {
                        try {
                            const raw = fs.readFileSync(path.join(snippetsDir, f), 'utf8');
                            const json = JSON.parse(raw);
                            Object.keys(json).forEach(key => {
                                const s = json[key];
                                if (s.prefix) {
                                    const it = new vscode.CompletionItem(s.prefix, vscode.CompletionItemKind.Snippet);
                                    it.detail = s.description || f;
                                    it.insertText = new vscode.SnippetString(Array.isArray(s.body) ? s.body.join('\n') : s.body || '');
                                    items.push(it);
                                }
                            });
                        } catch (e) {
                            // ignore
                        }
                    }
                });
            } catch (e) {
                // ignore
            }

            return items;
        }
    }, '.', '('));

    // Signature help provider
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('lua', {
        provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position) {
            const line = document.lineAt(position.line).text.substring(0, position.character);
            const match = line.match(/(\w+)\s*\([^()]*$/);
            if (!match) return null;
            const fn = match[1];
            const sig = psychSignatures[fn];
            if (!sig) return null;
            const params = sig.params.map(p => new vscode.ParameterInformation(p));
            const si = new vscode.SignatureInformation(sig.label, '');
            si.parameters = params;
            const help = new vscode.SignatureHelp();
            help.signatures = [si];
            // attempt to set active parameter by counting commas
            const commaCount = (line.match(/,/g) || []).length;
            help.activeParameter = Math.min(commaCount, params.length-1);
            help.activeSignature = 0;
            return help;
        }
    }, '(', ','));

    console.log('Psych Engine IDE commands registered');
}

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    const psychFunctions = [
        'initLuaShader', 'setSpriteShader', 'setShaderFloat', 'setShaderInt', 
        'setShaderVec2', 'setShaderVec3', 'makeLuaSprite', 'addLuaSprite', 
        'makeGraphic', 'runHaxeCode', 'debugPrint', 'getSongPosition',
        'getVar', 'setVar', 'doTweenX', 'doTweenY'
    ];

    lines.forEach((line, i) => {
        // Skip comments
        if (line.trim().startsWith('--')) return;

        // Check for integer literals in float contexts (setShaderFloat with integer)
        const floatMatch = line.match(/setShaderFloat\([^,]+,\s*['"]([\w_]+)['"]\s*,\s*(-?\d+)(?![.\d])/);
        if (floatMatch) {
            const col = line.indexOf(floatMatch[2]);
            const range = new vscode.Range(i, col, i, col + floatMatch[2].length);
            diagnostics.push(new vscode.Diagnostic(
                range,
                `Float literal should be ${floatMatch[2]}.0`,
                vscode.DiagnosticSeverity.Warning
            ));
        }

        // Check for division that should use .0
        const divMatch = line.match(/\/\s*1000(?![.\d])/);
        if (divMatch) {
            const col = line.indexOf(divMatch[0]);
            const range = new vscode.Range(i, col, i, col + divMatch[0].length);
            diagnostics.push(new vscode.Diagnostic(
                range,
                'Should be / 1000.0 for float division',
                vscode.DiagnosticSeverity.Warning
            ));
        }
    });

    diagnosticCollection.set(document.uri, diagnostics);
}

function validateJsonFile(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    try {
        JSON.parse(document.getText());
    } catch (error: any) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            let lineNum = 0;
            let col = pos;
            const lines = document.getText().split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (col <= lines[i].length) {
                    lineNum = i;
                    break;
                }
                col -= lines[i].length + 1;
            }
            diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(lineNum, col, lineNum, col + 1),
                `JSON Error: ${error.message}`,
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {}

function openSnippetExplorer(context: vscode.ExtensionContext) {
        const panel = vscode.window.createWebviewPanel(
                'psychSnippetExplorer',
                'Psych Snippet Explorer',
                vscode.ViewColumn.One,
                { enableScripts: true }
        );

        // Load snippets from extension snippets folder
        const snippetsDir = path.join(context.extensionPath, 'snippets');
        const snippets: any[] = [];
        try {
                const files = fs.readdirSync(snippetsDir);
                files.forEach(f => {
                        if (f.endsWith('.json')) {
                                try {
                                        const raw = fs.readFileSync(path.join(snippetsDir, f), 'utf8');
                                        const json = JSON.parse(raw);
                                        Object.keys(json).forEach(key => {
                                                const s = json[key];
                                                snippets.push({
                                                        id: key,
                                                        prefix: s.prefix || key,
                                                        description: s.description || '',
                                                        body: Array.isArray(s.body) ? s.body.join('\n') : (s.body || ''),
                                                        source: f
                                                });
                                        });
                                } catch (e) {
                                        // ignore malformed snippet files
                                }
                        }
                });
        } catch (e) {
                vscode.window.showErrorMessage('Unable to load snippet files: ' + e.message);
        }

        panel.webview.html = getSnippetExplorerHtml(panel.webview, snippets);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(async message => {
                if (message.command === 'insertSnippet') {
                        const editor = vscode.window.activeTextEditor;
                        if (!editor) {
                                vscode.window.showErrorMessage('Open a file to insert a snippet into');
                                return;
                        }
                        const snippetString = new vscode.SnippetString(message.body);
                        editor.insertSnippet(snippetString, editor.selection.start);
                } else if (message.command === 'copySnippet') {
                        await vscode.env.clipboard.writeText(message.body);
                        vscode.window.showInformationMessage('Snippet copied to clipboard');
                }
        });
}

function escapeHtml(s: string) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getSnippetExplorerHtml(webview: vscode.Webview, snippets: any[]) {
        const snippetsJson = JSON.stringify(snippets);
        return `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body{font-family:Segoe UI,system-ui,-apple-system,Roboto,Ubuntu,'Helvetica Neue',Arial;margin:0;padding:0}
        .toolbar{display:flex;gap:8px;padding:8px;background:#1e1e1e;color:#fff}
        .search{flex:1;padding:6px;border-radius:4px;border:1px solid #333;background:#252526;color:#fff}
        .container{display:grid;grid-template-columns:360px 1fr;gap:12px;height:calc(100vh - 48px);padding:12px}
        .list{overflow:auto;border-right:1px solid #2d2d2d;padding-right:8px}
        .item{padding:8px;border-radius:6px;margin-bottom:6px;background:#0e0e0e;cursor:pointer}
        .item:hover{background:#1a1a1a}
        .prefix{font-weight:600}
        .desc{color:#bfbfbf;font-size:12px}
        .preview{padding:8px;background:#0b0b0b;border-radius:6px;color:#dcdcdc;height:100%;overflow:auto}
        pre{background:#0b0b0b;padding:8px;border-radius:6px;color:#dcdcdc}
        .actions{margin-top:8px;display:flex;gap:8px}
        button{padding:6px 10px;border-radius:4px;border:0;background:#007acc;color:white;cursor:pointer}
        button.secondary{background:#3a3d41}
    </style>
</head>
<body>
    <div class="toolbar">
        <input id="search" class="search" placeholder="Search snippets by prefix, id, or description..." />
        <select id="sourceFilter">
            <option value="all">All files</option>
        </select>
    </div>
    <div class="container">
        <div class="list" id="list"></div>
        <div class="preview" id="preview">
            <h3 id="p_title">Select a snippet</h3>
            <div id="p_desc"></div>
            <pre id="p_code"></pre>
            <div class="actions">
                <button id="insert">Insert</button>
                <button id="copy" class="secondary">Copy</button>
            </div>
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        const snippets = ${snippetsJson};
        const listEl = document.getElementById('list');
        const previewTitle = document.getElementById('p_title');
        const previewDesc = document.getElementById('p_desc');
        const previewCode = document.getElementById('p_code');
        const search = document.getElementById('search');
        const sourceFilter = document.getElementById('sourceFilter');
        let current = null;

        // populate sourceFilter
        const sources = Array.from(new Set(snippets.map(s=>s.source)));
        sources.forEach(s=>{
            const opt = document.createElement('option'); opt.value = s; opt.text = s; sourceFilter.appendChild(opt);
        });

        function renderList(filter=''){
            const src = sourceFilter.value;
            listEl.innerHTML = '';
            const q = filter.toLowerCase();
            snippets.filter(s=> (src==='all' || s.source===src) && (
                s.prefix.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
            )).forEach(s=>{
                const it = document.createElement('div'); it.className='item';
                it.innerHTML = `<div class='prefix'>${escapeHtml(s.prefix)}</div><div class='desc'>${escapeHtml(s.description)}</div>`;
                it.onclick = ()=>{ selectSnippet(s); };
                listEl.appendChild(it);
            });
        }

        function selectSnippet(s){
            current = s;
            previewTitle.textContent = s.prefix + ' — ' + s.id;
            previewDesc.textContent = s.description + ' (from ' + s.source + ')';
            previewCode.textContent = s.body;
        }

        document.getElementById('insert').onclick = ()=>{
            if(!current) return; vscode.postMessage({command:'insertSnippet', body: current.body});
        };
        document.getElementById('copy').onclick = ()=>{
            if(!current) return; vscode.postMessage({command:'copySnippet', body: current.body});
        };

        search.addEventListener('input', ()=> renderList(search.value));
        sourceFilter.addEventListener('change', ()=> renderList(search.value));

        function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        renderList('');
    </script>
</body>
</html>`;
}

