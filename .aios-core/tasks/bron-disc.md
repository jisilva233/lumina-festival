# Brownfield Discovery Command - *bron-disc

## Ativação

```
*bron-disc
```

Ou com agente:

```
@aios-master *bron-disc
```

---

## 📋 O Que Este Comando Faz

Executa o **workflow brownfield-discovery completo** em 10 fases coordenadas:

1. **FASES 1-3** → Coleta de dados (paralelo)
   - @architect documenta sistema
   - @data-engineer audita database
   - @ux-design-expert especifica frontend

2. **FASE 4** → Consolidação inicial (DRAFT)
   - @architect consolida todos os débitos

3. **FASES 5-7** → Validação especialistas
   - @data-engineer valida débitos DB
   - @ux-design-expert valida débitos UX
   - @qa faz review geral

4. **FASE 8** → Assessment final consolidado
   - @architect finaliza com todos os inputs

5. **FASE 9** → Relatório executivo
   - @analyst cria relatório para stakeholders

6. **FASE 10** → Planning
   - @pm cria epic + stories

---

## 🎯 Modo de Execução

Este comando ativa o workflow em **YOLO MODE**:

- ✅ Executa automaticamente com mínima interação
- ✅ Cria diretórios necessários
- ✅ Detecta tech stack
- ✅ Coordena múltiplos agents
- ✅ Valida cada fase antes de prosseguir

---

## 📊 Outputs Gerados

Ao final, você terá:

```
docs/
├── architecture/system-architecture.md
├── frontend/frontend-spec.md
├── prd/
│   ├── technical-debt-DRAFT.md
│   └── technical-debt-assessment.md
├── reviews/
│   ├── db-specialist-review.md
│   ├── ux-specialist-review.md
│   └── qa-review.md
├── reports/
│   └── TECHNICAL-DEBT-REPORT.md ⭐
└── stories/
    ├── epic-technical-debt.md
    └── story-*.md

supabase/docs/
├── SCHEMA.md
└── DB-AUDIT.md
```

---

## ⏱️ Tempo Estimado

- **Total:** 4-6 horas
- **Fases 1-3:** 60-120 min (paralelo)
- **Fase 4:** 30-45 min
- **Fases 5-7:** 70-105 min
- **Fase 8:** 30-45 min
- **Fase 9:** 30-45 min
- **Fase 10:** 30-60 min

---

## 🚀 Como Usar

### Passo 1: Ativar
```
@aios-master *bron-disc
```

### Passo 2: Confirmar Modo
```
Selecione: 🚀 Iniciar Discovery (YOLO Mode)
```

### Passo 3: Aguardar Fases
- Fases 1-3 rodam em paralelo
- Sistema cria diretórios
- Agents executam tasks

### Passo 4: Revisar Checkpoints
- Cada fase gera checkpoint
- Você revisa antes de prosseguir
- Pode pausar/retomar quando quiser

### Passo 5: Coletar Resultados
- Após Fase 10: Epic + Stories prontas
- Após Fase 9: Relatório para stakeholders
- Pronto para: desenvolvimento com @dev

---

## 📂 Localização do Workflow

```
.aios-core/workflows/brownfield-discovery.yaml
```

---

## 🔗 Tasks Relacionadas

Este comando executa estas tasks em sequência:

| Fase | Task | Checklist |
|------|------|-----------|
| 1 | `document-project.md` | `architect-checklist.md` |
| 2 | `db-schema-audit.md` | `database-design-checklist.md` |
| 3 | `audit-codebase.md` | `component-quality-checklist.md` |

---

## ✅ Checklist de Pré-Requisitos

Antes de executar `*bron-disc`:

- [ ] Projeto está em git (`.git/` existe)
- [ ] Node.js instalado
- [ ] Pode criar diretórios em `docs/`
- [ ] GitHub CLI instalado (opcional, para context)
- [ ] Ambiente preparado

---

## 💡 Pro Tips

1. **Primeira execução?** Use YOLO Mode
2. **Pausar entre fases?** Possível - cada checkpoint é independente
3. **Revisar draft?** Abra `docs/prd/technical-debt-DRAFT.md`
4. **Mostrar stakeholders?** Use `docs/reports/TECHNICAL-DEBT-REPORT.md`
5. **Começar desenvolvimento?** Use stories de `docs/stories/`

---

## 🎯 Casos de Uso

### Caso 1: Projeto Migrado de Lovable
```
*bron-disc
→ Gera audit completo do codebase novo
→ Identifica débitos carregados da migration
→ Prioriza resolução
```

### Caso 2: Projeto Legado
```
*bron-disc
→ Documenta arquitetura atual
→ Identifica débitos acumulados
→ Cria plano de modernização
```

### Caso 3: Due Diligence Técnica
```
*bron-disc
→ Análise completa
→ Relatório executivo
→ Justifica orçamento para investimento
```

---

## 🔄 Fluxo Detalhado

```
Você: *bron-disc
    ↓
Sistema: Detecta tech stack
    ↓
Sistema: Cria diretórios
    ↓
FASES 1-3: Coleta Paralela (3 agents)
    ↓ @architect | @data-engineer | @ux-expert
    ↓ [Aguarda todas completarem]
    ↓
FASE 4: Consolidação DRAFT (@architect)
    ↓ Você revisa
    ↓
FASES 5-7: Validação (3 agents)
    ↓ @data-engineer | @ux-expert | @qa
    ↓ Você revisa cada review
    ↓
FASE 8: Assessment Final (@architect)
    ↓ Você aprova
    ↓
FASE 9: Relatório Executivo (@analyst)
    ↓ Pronto para stakeholders
    ↓
FASE 10: Planning (@pm)
    ↓ Epic + Stories criadas
    ↓
✅ COMPLETO - Pronto para dev
```

---

## 🎬 Comando Equivalente (Alternativa)

Se preferir usar o workflow diretamente:

```
@aios-master *workflow brownfield-discovery
```

Mas **`*bron-disc` é mais simples e direto**! 🚀

---

## 📞 Próximos Passos

1. **Ativar:** `@aios-master *bron-disc`
2. **Confirmar:** YOLO Mode
3. **Aguardar:** Fases 1-3 (coleta)
4. **Revisar:** Cada checkpoint
5. **Implementar:** Stories geradas

---

**Tempo total: 4-6 horas**

**Pronto para descobrir seus débitos técnicos? 🚀**
