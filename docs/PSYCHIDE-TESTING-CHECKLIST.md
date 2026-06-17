# PsychIDE Extension Testing Checklist

## Pre-Release Testing

### 1. Extension Loading
- [ ] Extension loads without errors in VS Code
- [ ] No console errors in Extension Development Host
- [ ] VS Code recognizes `.lua` and `.hx` files

### 2. Snippet Functionality
- [ ] Lua snippets appear in autocomplete (`shader`, `sprite-tween`, etc.)
- [ ] Haxe snippets appear in `.hx` files
- [ ] Pressing `Tab` correctly expands snippets
- [ ] Placeholder navigation works (`${1}`, `${2}` etc.)

#### Snippet Test Cases
- [ ] Type `shader` and verify full shader template expands
- [ ] Type `event-char-change` in Lua file
- [ ] Type `haxe-playstate` in Haxe file
- [ ] Type `v104-shader` for version-specific snippet
- [ ] Type `effect-glow` for shader effect

### 3. Validation & Errors
- [ ] Create file with `setShaderFloat('test', 'x', 0)` (missing `.0`)
- [ ] Save file → should show warning in Problems panel
- [ ] Hover over `setShaderFloat` → shows documentation
- [ ] Edit file → validation runs without lag

### 4. JSON Validation
- [ ] Open `song.json` → schema validation active
- [ ] Open `character.json` → autocomplete for fields
- [ ] Invalid JSON shows error
- [ ] Valid JSON shows no errors

### 5. Real-time Feedback
- [ ] Save Lua file → Problems panel updates within 1s
- [ ] Hover info appears immediately
- [ ] No lag when typing or editing
- [ ] Autocomplete suggestions appear smoothly

### 6. Lua Specific Features
- [ ] Test all Lua snippet categories expand correctly
- [ ] Debug messages don't cause validation errors
- [ ] Comment lines are ignored in validation
- [ ] String quotes handled correctly

### 7. Haxe Support
- [ ] Haxe snippets available only in `.hx` files
- [ ] `haxe-playstate` creates proper class skeleton
- [ ] `haxe-tween` snippet includes FlxTween import
- [ ] Haxe language ID recognized

### 8. File Watcher
- [ ] Create new `.lua` file in workspace
- [ ] Validation runs automatically on save
- [ ] Changes to file trigger re-validation
- [ ] Multiple files validate independently

### 9. Edge Cases
- [ ] Empty file doesn't crash extension
- [ ] Very large Lua file (>10k lines) still responsive
- [ ] Binary files don't break extension
- [ ] Files with special characters handled

### 10. Documentation
- [ ] README.md in vscode-extension/ is clear
- [ ] Setup guide explains snippet prefixes
- [ ] Troubleshooting section covers common issues
- [ ] Examples are runnable

## Manual Integration Tests

### Test Case 1: Full Shader Workflow
```lua
-- 1. Type: shader
-- 2. Fill in shaderName = "heatwave"
-- 3. Type: shader-float (for setting uniform)
-- 4. Verify no validation errors
```

### Test Case 2: Animation Loop
```lua
-- 1. Type: anim-loop
-- 2. Expand all placeholders
-- 3. Save file → no errors
```

### Test Case 3: Event Handler
```lua
-- 1. Type: event-char-change
-- 2. Add to project mod
-- 3. Test that no syntax errors appear
```

## Performance Benchmarks

- [ ] Extension activates in < 2s
- [ ] Snippet list loads in < 500ms
- [ ] Validation completes in < 1s for typical file (< 500 lines)
- [ ] Memory usage < 100MB for normal operation

## Browser/VS Code Compatibility

| Environment | Status | Notes |
|---|---|---|
| VS Code 1.75.0 | ✅ Test | Latest LTS |
| VS Code 1.80+ | ✅ Test | Latest |
| Codespaces | ✅ Test | This environment |
| Local Install | ⏳ Pending | Manual test required |

## Sign-Off

- [ ] All tests passed
- [ ] No critical errors
- [ ] Documentation complete
- [ ] Ready for release

**Tested by:** ___________  
**Date:** ___________  
**Notes:** ___________
