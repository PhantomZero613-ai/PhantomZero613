# Psych Engine IDE VS Code Extension

This extension provides a Psych Engine modding environment for Visual Studio Code, including code snippets, validation, and hover hints for common Lua APIs.

## Installed features

- Lua code validation for common Psych Engine patterns
- JSON schema validation for `song.json` and `character.json`
- Psych Engine snippet library for Lua and Haxe
- Hover hints for common Psych functions
- Commands:
  - `Psych: Validate Lua File`
  - `Psych: Validate JSON File`
  - `Psych: Generate Code Snippet`

## Snippet files

- `snippets/psych-snippets.json` — Lua snippet library
- `snippets/psych-haxe-snippets.json` — Haxe snippet library
- `snippets/psych-version-snippets.json` — version-specific Lua snippets for Psych Engine v1.0.4 and v0.7.3

## How to install

1. Open this folder in VS Code.
2. Install the `TypeScript` dependencies if you want to build the extension:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Open the Debug view in VS Code and run `Launch Extension`.
5. In the new Extension Development Host window, open a `.lua` or `.hx` file and type a snippet prefix.

## Snippet usage

Use the following example prefixes:

- `shader` — Lua shader activation template
- `sprite-tween` — Lua sprite creation with tween
- `event` — Lua event handler
- `haxe-playstate` — Haxe PlayState class skeleton
- `haxe-sprite` — Haxe sprite creation
- `v104-shader` — v1.0.4-specific shader setup
- `v073-note` — v0.7.3 legacy note handler

## Notes

This extension is currently scaffolded for Psych Engine modding learning and fast code generation. The snippet library is meant to help you explore engine APIs with quick, ready-made examples.
