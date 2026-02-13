---
description: "Activate Content Distillery - Transform YouTube content into frameworks and multi-platform content"
when-to-invoke: "When you need to extract frameworks from livestreams, distill content, or derive multi-platform pieces"
---

# 🏭 Content Distillery

**Agent Location:** `.aios-core/agents/content-distillery.md`

Transform raw YouTube livestreams into structured frameworks and 60+ pieces of optimized, multi-platform content through a 6-phase orchestrated pipeline.

## What It Does

**Content Distillery** is a 9-agent squad that transforms long-form content into:

- ✅ Structured knowledge frameworks
- ✅ Tacit knowledge extraction
- ✅ Mental models & decision frameworks
- ✅ 60+ content angles and hooks
- ✅ Platform-native atomic content
- ✅ Content ecosystem architecture
- ✅ YouTube-optimized metadata

**Built on expertise from:**
- Cedric Chin (tacit knowledge extraction)
- Shane Parrish (mental models)
- Tiago Forte (knowledge organization / PARA)
- Gary Vaynerchuk (content atomization)
- Nicolas Cole & Dickie Bush (content multiplication)
- Dan Koe (content ecosystems)
- Justin Welsh (production systems)
- Paddy Galloway (YouTube strategy)

## Quick Commands

```
*distill <youtube-url>     Complete distillery (6 phases)
*extract <youtube-url>     Framework extraction only (3 phases)
*derive <frameworks>       Content derivation only (3 phases)
*agents                    List 9 specialist agents
*status                    Show pipeline status
*gate                      Check/enforce quality gates
*context                   View current pipeline state
*help                      Show all commands
```

## Three Pipeline Modes

### 1. FULL DISTILLERY (`*distill`)
**Input:** YouTube livestream URL
**Output:** Frameworks + 60+ content pieces + ecosystem
**Time:** ~2 hours (for 2-hour livestream)
**Phases:** 1-6 (all tiers)

```
Ingest → Extract (Tier 0) → Build (Tier 1) →
Multiply (Tier 2) → Atomize (Tier 2) → Optimize (Tier 3)
```

### 2. FRAMEWORK EXTRACTION (`*extract`)
**Input:** YouTube livestream URL
**Output:** Frameworks + organized knowledge base
**Time:** ~45 minutes (for 2-hour livestream)
**Phases:** 1-3 (Tiers 0-1)

```
Ingest → Extract (Tier 0) → Build (Tier 1)
```

### 3. CONTENT DERIVATION (`*derive`)
**Input:** Existing frameworks/knowledge base
**Output:** 60+ content pieces + ecosystem
**Time:** ~1 hour per framework
**Phases:** 3-6 (Tiers 1-3)

```
Build (Tier 1) → Multiply (Tier 2) → Atomize (Tier 2) → Optimize (Tier 3)
```

## The 9 Specialist Agents

### Tier 0: Knowledge Extraction
- **tacit-extractor** - Extract hidden expertise and heuristics
- **model-identifier** - Identify mental models and frameworks

### Tier 1: Knowledge Architecture
- **knowledge-architect** - Structure knowledge using PARA method
- **content-atomizer** - Break content into atomic platform pieces

### Tier 2: Content Engineering
- **idea-multiplier** - Generate 60+ content angles and hooks
- **ecosystem-designer** - Design interconnected content ecosystem
- **production-ops** - Systematize production workflows

### Tier 3: Platform Optimization
- **youtube-strategist** - Optimize for YouTube algorithm

## Quality Gates

**Blocking Gates** (pipeline stops until resolved):
- QG-002: Extraction Complete
- QG-003: Distillation Validated
- QG-004: Content Reviewed

**Advisory Gates** (pipeline proceeds with notification):
- QG-001: Transcription Valid
- QG-005: YouTube Ready

## When to Use Which Mode

| Your Situation | Use This | Time |
|---|---|---|
| Have 2-hour livestream, want full treatment | `*distill <url>` | ~2 hours |
| Want just frameworks and knowledge | `*extract <url>` | ~45 min |
| Have frameworks, want content pieces | `*derive <file>` | ~1 hour |
| Want to check quality gates | `*gate` | ~5 min |
| Need to see current pipeline state | `*context` | instant |
| Stuck? Resume interrupted work | `*resume` | varies |

## Collaboration

**Collaborate with other agents:**
- `@devops` - Tool setup (yt-dlp, whisper, ffmpeg)
- `@dev` - Custom integrations and automation
- `@analyst` - Performance analysis and audience research

## Example Workflows

### Extract frameworks from a livestream
```
1. *extract https://youtube.com/watch?v=xyz
2. Agent downloads, transcribes, extracts frameworks
3. Output: frameworks.md (structured knowledge base)
4. Review frameworks quality (QG-003)
5. Done! Ready to derive content or store in knowledge base
```

### Get 60+ content pieces from existing frameworks
```
1. *derive my-frameworks.md
2. Agent multiplies into 60+ angles
3. Creates atomic content pieces
4. Designs ecosystem flywheel
5. Optimizes for YouTube
6. Output: Ready to publish content + calendar
```

### Full distillation (end-to-end)
```
1. *distill https://youtube.com/watch?v=xyz
2. Download + transcribe
3. Extract frameworks (QG-002)
4. Organize knowledge (QG-003)
5. Multiply to 60+ pieces
6. Atomize and design ecosystem
7. YouTube optimize (QG-005)
8. Output: Complete content suite
```

## Troubleshooting

**Pipeline blocked at quality gate?**
- Use `*gate` to see which gate is blocking
- Review current state with `*context`
- Fix the issue and `*resume` to continue
- Or `*abort` and restart from Phase 1

**Need specific agent's expertise?**
- Use `*agents` to list all 9 specialists
- Reach out to that agent directly if needed
- Or stay in orchestrator (Distillery Chief) mode for full pipeline

**Lost context between phases?**
- Use `*context` to view current pipeline state
- All handoffs are logged with timestamps
- Pipeline maintains full context automatically

---

**Philosophy:** A livestream is raw grain. My job is to manage distillation so what comes out is concentrated, refined, and ready to serve.
