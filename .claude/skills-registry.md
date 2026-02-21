# Registro de Skills Instalados

**Projeto:** Synkra AIOS
**Atualizado:** 2026-02-21
**Status:** ✅ Skills Registrados

---

## ✅ Skills Ativos

### 1. Squad Creator Premium v3.0.0

**Identificador:** `squad-creator-premium`
**Ícone:** 🎨
**Status:** ✅ Instalado

**Localização:**
- Skill definition: `./squads/squad-creator-premium/skills/squad.md`
- Config: `./.claude/skills/squad-creator-premium.yaml`

**Triggers de Ativação:**
- "create squad"
- "create team"
- "want a squad"
- "need experts in"
- "squad de"
- "time de"
- "quero um squad"
- "especialistas em"

**Subagents:**
- @oalanicolas — Mind cloning architect
- @pedro-valerio — Process absolutist

**Comandos Principais:**
- `*create-squad {domain}` — Create complete squad from scratch
- `*clone-mind {name}` — Clone single mind into agent
- `*create-agent` — Create agent from DNA
- `*validate-squad` — Run quality validation
- `*resume` — Continue interrupted workflow
- `*status` — Show current state
- `*help` — Show all commands

**Ativar skill:**
```
/squad  (in Claude Code chat)
```

---

## Configuração Global

**settings.json Status:**
```json
{
  "language": "portuguese"
}
```

**CLAUDE.md Status:**
```
✅ Language & Communication section added
✅ Português Brasileiro (pt-BR) configured as primary
```

---

## Como Usar Squad Creator Premium

### Via Trigger (Automático)
Quando você menciona qualquer palavra-chave de trigger, o skill é sugerido automaticamente.

### Via Comando Direto
```
/squad
```
ou
```
@squad-creator-premium
```

### Via Task Execution
```
*create-squad legal
*clone-mind gary-halbert
*validate-squad my-squad
```

---

## Verificação de Instalação

```bash
# Verificar existência de files
✅ ./squads/squad-creator-premium/skills/squad.md
✅ ./.claude/skills/squad-creator-premium.yaml
✅ Skill definition completo (289 linhas)

# Verificar registro
✅ ./.claude/skills-registry.md (este arquivo)
✅ Skills registry documentado
```

---

## Status: ✅ COMPLETO

Squad Creator Premium v3.0.0 está **100% instalado e pronto para usar**.

