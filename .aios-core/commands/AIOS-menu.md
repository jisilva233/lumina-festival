# 🤖 AIOS Framework - Menu Interativo

**Status:** Menu Principal do AIOS Framework
**Última Atualização:** 2026-02-01

---

## ╔════════════════════════════════════════════════════════════╗
## ║           🤖 AIOS FRAMEWORK - MENU PRINCIPAL              ║
## ╚════════════════════════════════════════════════════════════╝

Bem-vindo ao **AIOS (Autonomous Intelligence Operating System)**!

Selecione uma opção abaixo digitando o número ou o comando:

---

### 👥 AGENTES DISPONÍVEIS

#### **1. 💻 @dev (Dex) - Full Stack Developer**
- **Quando usar:** Implementação de código, debugging, refatoração, testes
- **Comandos rápidos:** `*develop`, `*run-tests`, `*build`
- **Exemplo:** `@dev *develop story-1.4`

#### **2. 🎨 @ux-design-expert (Uma) - UX/UI Designer & Design System Architect**
- **Quando usar:** Pesquisa UX, wireframes, design systems, componentes
- **Fases:** Research → Audit → Tokenize → Build → Quality
- **Comandos rápidos:** `*research`, `*audit`, `*tokenize`, `*build`
- **Exemplo:** `@ux-design-expert *research`

#### **3. ⚡ @github-devops (Gage) - DevOps Specialist**
- **Quando usar:** Push para repositório, PRs, releases, CI/CD
- **EXCLUSIVO:** Único agente autorizado para push remoto
- **Comandos rápidos:** `*pre-push`, `*push`, `*create-pr`, `*release`
- **Exemplo:** `@github-devops *pre-push`

#### **4. 📋 @pm (River) - Project Manager/Product Owner**
- **Quando usar:** Gerenciar histórias, backlog, sprint planning
- **Comandos rápidos:** `*create-story`, `*update-backlog`
- **Exemplo:** `@pm *create-story`

#### **5. 🏗️ @architect (Aria) - Solution Architect**
- **Quando usar:** Design de arquitetura, decisões técnicas, infraestrutura
- **Comandos rápidos:** `*design`, `*review-architecture`
- **Exemplo:** `@architect *design`

#### **6. ✅ @qa (Quinn) - Quality Assurance**
- **Quando usar:** Testes, validação, relatórios de qualidade
- **Comandos rápidos:** `*test`, `*audit`, `*report`
- **Exemplo:** `@qa *test`

#### **7. 📊 @analyst - Business Analyst**
- **Quando usar:** Análise de requisitos, dados, insights
- **Comandos rápidos:** `*analyze`, `*report`
- **Exemplo:** `@analyst *analyze`

#### **8. 📈 @data-engineer - Data Engineer**
- **Quando usar:** Pipeline de dados, transformações, SQL
- **Comandos rápidos:** `*create-pipeline`, `*optimize-query`
- **Exemplo:** `@data-engineer *create-pipeline`

---

## 🎯 FLUXOS DE TRABALHO RECOMENDADOS

### Fluxo 1: Desenvolvimento Completo (Dev + DevOps)
```
1. @dev *develop story-X.Y.Z
2. @qa *test
3. @github-devops *pre-push
4. @github-devops *push
```

### Fluxo 2: Design System (UX + Dev)
```
1. @ux-design-expert *research
2. @ux-design-expert *audit ./src
3. @ux-design-expert *tokenize
4. @dev *build button
5. @ux-design-expert *document
```

### Fluxo 3: Release (Dev + DevOps)
```
1. @dev *run-tests
2. @github-devops *version-check
3. @github-devops *release
```

---

## ⚡ COMANDOS RÁPIDOS POR CONTEXTO

### 🚀 Quero Começar a Programar
```
@dev
```

### 🎨 Quero Trabalhar com Design
```
@ux-design-expert
```

### 📤 Quero Fazer Push do Código
```
@github-devops
```

### 📋 Quero Gerenciar Histórias
```
@pm
```

### 🏗️ Quero Discutir Arquitetura
```
@architect
```

### ✅ Quero Testar o Código
```
@qa
```

---

## 📚 MAIS INFORMAÇÕES

Após ativar um agente, use:

```
*help              # Ver todos os comandos do agente
*guide             # Ver guia completo de uso
*status            # Ver status atual do agente
*session-info      # Ver detalhes da sessão
```

---

## 🔄 ESTRUTURA DO AIOS

```
AIOS Framework
├── Agentes (Personas Autônomas)
│   ├── @dev (Dex) - Desenvolvedor
│   ├── @ux-design-expert (Uma) - Designer UX/UI
│   ├── @github-devops (Gage) - DevOps
│   ├── @pm (River) - Project Manager
│   ├── @architect (Aria) - Arquiteto
│   ├── @qa (Quinn) - QA
│   ├── @analyst - Analista
│   └── @data-engineer - Data Engineer
│
├── Skills (Funcionalidades)
│   ├── /skills - Listar skills disponíveis
│   ├── /help - Ajuda geral
│   ├── /clear - Limpar memória
│   └── /AIOS - Este menu
│
└── Comandos (Dentro de Agentes)
    ├── *help - Listar comandos
    ├── *guide - Guia de uso
    └── *exit - Sair do agente
```

---

## 💡 DICAS IMPORTANTES

✅ **Sempre ative um agente antes de usar comandos com `*`**
```
@dev
*develop story-1.4
```

✅ **Use `/clear` para limpar a memória entre sessões**

✅ **Use `*help` para ver todos os comandos do agente ativado**

✅ **Use `@github-devops` APENAS para push (único autorizado)**

✅ **Combine agentes para fluxos completos**

---

## 🎬 COMEÇAR AGORA

Escolha uma opção:

1. **Digitar número:** `1` (para ativar @dev)
2. **Mencionar agente:** `@ux-design-expert`
3. **Comando direto:** `@github-devops *pre-push`

---

**Qual agente você gostaria de ativar?** 🚀

Ou use `/AIOS` novamente para voltar a este menu.

---

*AIOS Framework v3.0 - Autonomous Intelligence Operating System*
