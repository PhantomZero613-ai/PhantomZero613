# PsychIDE Setup & Usage Guide

## Quick Start

### Prerequisites
- VS Code 1.75.0 or later
- Node.js 18+ (for building the extension)
- Python 3.8+ (for backend LSP server, optional)

### Installation

#### Option A: Build from Source (Recommended)

```bash
cd /workspaces/PhantomZero613/PsychIDE/vscode-extension
npm install
npm run compile
```

Then load the extension in VS Code:
1. Open **Extensions** view (`Ctrl+Shift+X`)
2. Click **Views** menu → **Show Built-in Extensions**
3. Search for `PsychIDE` or use Command Palette: **Extensions: Install from VSIX**
4. Select the `PsychIDE` folder

#### Option B: Development Mode

1. Open this folder in VS Code
2. Press `F5` to start the Extension Development Host
3. Open a `.lua` file in the new window and start typing snippet prefixes

## Available Snippets

### General Lua Patterns
- `shader` — Full shader activation template
- `sprite-tween` — Create and tween a sprite
- `event` — Custom event handler
- `callback` — Psych Engine callback function

### Gameplay Features
- `event-char-change` — Change character on event
- `event-cam-zoom` — Camera zoom tween
- `tween-alpha` — Sprite fade effect
- `beat-sync` — Beat-synced animations
- `step-counter` — Measure-based logic

### Shader & Effects
- `effect-glow` — Glow shader setup
- `effect-chromatic` — Chromatic aberration
- `effect-scanlines` — CRT scanlines
- `effect-pixelate` — Pixelation effect
- `shader-time` — Update shader time uniform

### Haxe Patterns
- `haxe-playstate` — FlxState class skeleton
- `haxe-sprite` — Create and add sprite
- `haxe-text` — Create text object
- `haxe-tween` — FlxTween animation
- `haxe-shader` — Initialize shader from Haxe

### Version-Specific
- `v104-shader` — Psych v1.0.4 shader setup
- `v104-cam` — v1.0.4 camera follow
- `v073-note` — v0.7.3 legacy note handler
- `v073-char` — v0.7.3 character switching

## Using Snippets

1. Open a `.lua` or `.hx` file
2. Type a snippet prefix (e.g., `shader`)
3. Press `Tab` to expand
4. Fill in placeholders marked with `${}`
5. Press `Tab` to move between placeholders

**Example:**
```lua
-- Type: sprite-tween
-- Tab expands to:
makeLuaSprite('spriteId', 'path/to/image.png', 0, 0)
addLuaSprite('spriteId', false)

doTweenY('spriteId_tween', 'spriteId', endValue, 1.0, 'linear')
```

## Validation & Hover Hints

### Real-time Validation
- Lua files are validated when saved
- Errors appear in the **Problems** panel
- Common issues:
  - Float literal mismatches (e.g., `0` instead of `0.0`)
  - Missing function parameters
  - Undefined global variables

### Hover Information
- Hover over Psych Engine function names to see documentation
- Shows parameter names and types
- Quick reference for API usage

**Hover over:** `makeLuaSprite`, `setProperty`, `doTweenX`, etc.

## JSON Schema Validation

Automatically validates:
- `song.json` — Song chart configuration
- `character.json` — Character definitions
- Provides autocomplete for valid fields

## Backend LSP Server (Optional)

To run the Python LSP server for advanced features:

```bash
cd PsychIDE/backend
pip install -r requirements.txt
python psych_lsp.py --host 127.0.0.1 --port 8000
```

The extension will auto-connect if the server is running.

## Troubleshooting

### Snippets Not Appearing
- Verify file type: `.lua` for Lua snippets, `.hx` for Haxe
- Restart VS Code (`Ctrl+Shift+P` → Reload Window)
- Check extension is active: Extensions view should show PsychIDE

### Validation Not Working
- Check **Output** panel (View → Output, select "PsychIDE")
- Ensure file is saved (validation runs on save)
- Check `.lua` file is in workspace

### Performance Issues
- Large Lua files may slow validation
- LSP server can be disabled: don't run `psych_lsp.py`
- Disable problematic rules in extension settings

## Contributing Snippets

To add new snippets:

1. Edit the relevant `snippets/*.json` file
2. Follow the format:
   ```json
   "snippet-name": {
     "prefix": "snippet-prefix",
     "body": ["line1", "line2"],
     "description": "What this snippet does"
   }
   ```
3. Re-compile: `npm run compile`
4. Test in Extension Development Host

## Resources

- [Psych Engine Wiki](https://github.com/ShadowMario/FNF-PsychEngine/wiki)
- [Lua Documentation](https://www.lua.org/manual/5.3/)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [PsychIDE on GitHub](https://github.com/PhantomZero613-ai/PhantomZero613)

## Version Compatibility

| Engine Version | Lua API | Haxe API | Snippets Available |
|---|---|---|---|
| v1.0.4 | ✅ Full | ✅ Full | v104-*, general |
| v0.7.3 | ⚠️ Legacy | ⚠️ Legacy | v073-*, general |

## Support & Issues

- Report bugs: [GitHub Issues](https://github.com/PhantomZero613-ai/PhantomZero613/issues)
- Suggest features: [GitHub Discussions](https://github.com/PhantomZero613-ai/PhantomZero613/discussions)

---

**PsychIDE** — Making Psych Engine modding faster and more accessible. 🎮
