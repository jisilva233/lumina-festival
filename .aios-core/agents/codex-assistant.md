# codex-assistant

ACTIVATION-NOTICE: This file provides Codex CLI integration for AIOS agents who want an alternative AI assistant.

## INTEGRATION OVERVIEW

Codex CLI (OpenAI's Codex) is now available as an alternative AI tool within AIOS workflows. Use this when you need:
- Specialized code generation
- Fast prototyping
- Alternative AI perspective
- Parallel analysis with Claude

## WHEN TO USE CODEX

| Agent | Use Case | Command |
|-------|----------|---------|
| @dev | Generate boilerplate, refactor functions | `*codex-generate`, `*codex-refactor` |
| @architect | Analyze design patterns, suggest architecture | `*codex-analyze-design` |
| @qa | Generate test cases, analyze coverage | `*codex-generate-tests` |
| @analyst | Code complexity analysis, documentation | `*codex-analyze-code` |

## AVAILABLE COMMANDS

### For All Agents

- `*codex-status` - Show Codex integration status
- `*codex-help` - Show available Codex commands
- `*codex-guide` - Full integration guide

### Developer-Specific

- `*codex-generate <prompt>` - Generate code from description
- `*codex-refactor <file>` - Suggest refactoring improvements
- `*codex-optimize <file>` - Optimize code performance
- `*codex-debug <file>` - Analyze and suggest bug fixes

### Architecture-Specific

- `*codex-analyze-design <context>` - Analyze design patterns
- `*codex-suggest-pattern <problem>` - Suggest architectural pattern

### QA-Specific

- `*codex-generate-tests <file>` - Generate test cases
- `*codex-coverage-analysis <file>` - Analyze test coverage

### Analyst-Specific

- `*codex-analyze-code <file>` - Deep code analysis
- `*codex-generate-docs <file>` - Generate documentation

## INTEGRATION WITH AIOS WORKFLOWS

Codex integrates seamlessly into existing AIOS workflows:

### Story Development Cycle
```
Phase 3: @dev implementation
  → Use *codex-generate for boilerplate
  → Use *codex-refactor for quality improvements
  → Normal flow continues
```

### Code Review & QA
```
Phase 4: @qa review
  → Use *codex-analyze-code for additional perspective
  → Use *codex-generate-tests for coverage gaps
  → Combine findings with standard QA checks
```

## CONFIGURATION

Codex is pre-installed via npm (v0.104.0). Verify installation:

```bash
codex --version
```

Run integration check:

```bash
node .aios-core/scripts/codex-cli-integration.js check
```

## FRAMEWORK STATUS

✅ **Installed**: Codex CLI v0.104.0
✅ **Integration**: Ready
✅ **Config**: Listed in core-config.yaml (ide.selected)
✅ **Scripts**: codex-cli-integration.js available

## NOTES

- Codex requires authentication with OpenAI
- Configure with: `codex auth login`
- Codex works best for code generation and optimization
- Claude Code remains primary for complex reasoning and planning
- Use Codex as complementary tool, not replacement
- Results from Codex should be reviewed before integration

## ROADMAP

- [ ] Add Codex task templates
- [ ] Create Codex-specific workflows
- [ ] Add cost tracking for Codex usage
- [ ] Implement Codex + Claude hybrid decisions
- [ ] Add Codex performance metrics

---

**Framework Integration**: Synkra AIOS v2.1.0
**Codex Version**: 0.104.0 (@openai/codex)
**Status**: Active ✓
