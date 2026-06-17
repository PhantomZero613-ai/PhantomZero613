# Psych Engine Modding IDE

A complete modding development environment for Psych Engine v1.0.4 with real-time validation, intelligent autocompletion, and integrated debugging.

## Architecture

```
PsychIDE/
├── backend/               # Python LSP server + API parser
│   ├── psych_lsp.py      # Language Server Protocol implementation
│   ├── haxe_parser.py    # Parses Haxe source for API specs
│   ├── lua_validator.py  # Validates Lua code against Psych API
│   └── requirements.txt
├── vscode-extension/      # VS Code extension package
│   ├── package.json
│   ├── extension.ts
│   └── schemas/
├── lua-library/           # Lua function signatures & library
│   ├── psych.lua         # Main Psych API wrapper
│   ├── shaders.lua       # Shader helper functions
│   └── characters.lua    # Character manipulation API
└── schemas/               # JSON schemas for validation
    ├── song.schema.json
    ├── character.schema.json
    ├── stage.schema.json
    └── event.schema.json
```

## Features

✅ **Real-time API Validation** - Know if your code will work before you test it
✅ **Lua/Haxe Autocomplete** - Function signatures & parameter hints
✅ **Schema Validation** - JSON config validation for songs/characters/stages
✅ **Snippet Library** - Pre-built patterns for common modding tasks
✅ **Debug Sandbox** - Test Lua code without running the full engine
✅ **Integrated Shader Editor** - GLSL shader support with hot reload

## Snippet Library

The PsychIDE extension includes ready-made code snippets for both **Lua** and **Haxe** modding.

- Use the Lua snippet file: `PsychIDE/vscode-extension/snippets/psych-snippets.json`
- Use the Haxe snippet file: `PsychIDE/vscode-extension/snippets/psych-haxe-snippets.json`

Example snippet prefixes:

- `shader` — full Lua shader activation template
- `sprite-tween` — create a sprite and tween it
- `event` — custom Lua event handler
- `haxe-playstate` — Haxe `FlxState` class skeleton
- `haxe-sprite` — create and add a `FlxSprite`
- `v104-shader` — Psych Engine v1.0.4 shader setup
- `v073-note` — Psych Engine v0.7.3 legacy note handler

### Version-specific snippets

The `psych-version-snippets.json` file provides version-aware Lua patterns for both:

- `v1.0.4` Psych Engine workflows
- `v0.7.3` legacy Lua event handling and character switching

This helps you learn the differences between engine versions while coding.

### How to use

1. Install the PsychIDE VS Code extension from `PsychIDE/vscode-extension/`.
2. Open a `.lua` or `.hx` file.
3. Type a snippet prefix and press `Tab` to expand it.

## Quick Start

```bash
cd PsychIDE/backend
pip install -r requirements.txt
python psych_lsp.py --host 0.0.0.0 --port 8000
```

Then install the VS Code extension in `vscode-extension/`.

## Development Roadmap

- [x] Project scaffolding
- [ ] Haxe parser for API extraction
- [ ] LSP server implementation
- [ ] VS Code extension
- [ ] Lua sandbox executor
- [ ] Interactive schema validator
- [ ] Shader preview panel
- [ ] Template generator
