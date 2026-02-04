# 🚀 AIOS Agents Quick Start Guide

**Como usar Agentes AIOS na Web Development Squad**

---

## ⚡ TL;DR (Resumo Rápido)

### Para começar AGORA:

```bash
# Terminal
cd seu-projeto
claude code

# Depois, no Claude Code:
@aios-master
*help

# Ou ative um agente específico:
@dev
*create-feature "Login Component"
```

---

## 🎯 5 Passos para Usar Agentes

### 1. Ative o Agent
```bash
@dev              # Ativa Dev Agent
@qa               # Ativa QA Agent
@architect        # Ativa Architect Agent
@devops           # Ativa DevOps Agent
```

### 2. Veja os Comandos Disponíveis
```bash
*help             # Lista todos os comandos
*guide            # Guia completo do agente
```

### 3. Execute um Comando
```bash
*create-feature "Nome da Feature"
*fix-bug "Descrição do bug"
*generate-tests
```

### 4. Agente Trabalha (Você Revisa)
- Agente gera código/testes/documentação
- Você revisa a sugestão
- Você aprova ou pede ajustes

### 5. Saia do Agente
```bash
*exit             # Volta para Claude Code normal
```

---

## 👥 Agentes por Rol

### Tech Lead → @architect + @aios-master

**Comandos principais:**
```bash
@architect
*design-system          # Desenhar arquitetura
*tech-decision          # Ajudar em decisões
*review-design          # Revisar design de features
*scalability-check      # Validar escalabilidade

@aios-master
*create-story           # Criar história de feature
*sprint-planning        # Planejar sprint
*task                   # Executar tarefa específica
```

**Quando usar:**
- Decidindo arquitetura de nova feature
- Revisando design de componente
- Planejando escalabilidade
- Criando histórias de desenvolvimento

---

### Senior Frontend → @dev

**Comandos principais:**
```bash
@dev
*create-feature "Login Component"       # Gerar componente completo
*optimize-performance "Bundle size"     # Sugerir otimizações
*write-tests "Login Component"          # Gerar testes automatizados
*refactor-code "arquivo.tsx"            # Refatorar código
*code-review                            # Revisar pull request
*debug-issue "Erro de renderização"     # Debugar problema
```

**Exemplo real:**
```bash
@dev
*create-feature "Shopping Cart Modal"

# Agente cria:
# - Componente React com TypeScript
# - Testes (Jest + RTL)
# - Documentação
# - Acessibilidade validada

# Você revisa + integra
```

---

### Mid Frontend → @dev + Mentor

**Comandos principais:**
```bash
@dev
*create-feature "Card Component"        # Feature simples
*fix-bug "Botão não responde ao clique" # Bug simples
*write-tests                            # Testes para seu código
*explain-code "Redux patterns"          # Entender um padrão
*learn-pattern "Context API"            # Aprender tecnologia
```

**Exemplo real:**
```bash
@dev
*explain-code

# Agente explica:
# - O que é Context API
# - Como usá-lo em React
# - Exemplos práticos
# - Quando usar/não usar

# Você aprende + implementa
```

---

### Senior Backend → @dev + @architect

**Comandos principais:**
```bash
@dev
*design-api "Payment endpoints"         # Desenhar API REST/GraphQL
*optimize-query "Slow query"            # Otimizar database
*generate-endpoint "GET /products"      # Gerar endpoint
*security-review                        # Revisar segurança

@architect
*database-design "Payment schema"       # Desenhar BD
*scalability "10k concurrent users"     # Planejar escala
```

**Exemplo real:**
```bash
@dev
*design-api
# Agente propõe endpoints para API de pagamento

@architect
*database-design
# Agente desenha schema do banco

# Você revisa + aprova
```

---

### Mid Backend → @dev

**Comandos principais:**
```bash
@dev
*generate-endpoint "POST /users"        # Criar novo endpoint
*fix-bug "Database connection error"    # Corrigir bug
*write-tests                            # Testes para seu código
*optimize-query                         # Otimizar query
*explain-code "ORM patterns"            # Entender padrão
```

---

### QA Engineer → @qa + @dev

**Comandos principais:**
```bash
@qa
*create-test-plan "Login Feature"       # Planejar testes
*generate-tests "Cypress tests"         # Gerar testes e2e
*quality-report                         # Relatório de qualidade
*accessibility-audit                    # Auditar acessibilidade

@dev
*generate-tests "Unit tests"            # Testes unitários
*performance-test                       # Testar performance
```

**Exemplo real:**
```bash
@qa
*create-test-plan

# Agente sugere:
# - Casos de teste
# - Cenários edge cases
# - Fluxos críticos

# Você executa + valida

@dev
*generate-tests

# Agente cria:
# - Testes Cypress (e2e)
# - Fixtures
# - Page objects

# Você roda + aprova
```

---

### UI/UX Designer → @ux-design-expert

**Comandos principais:**
```bash
@ux-design-expert
*design-component "Modal Dialog"        # Design componente
*accessibility-audit                    # Auditar WCAG
*design-system "Add new colors"         # Expandir design system
*usability-test "User testing plan"     # Planejar testes UX
*research-pattern "E-commerce flows"    # Pesquisar padrões
```

---

### DevOps Engineer → @devops

**Comandos principais:**
```bash
@devops
*setup-cicd "GitHub Actions"            # Configurar CI/CD
*deploy-setup "Production deployment"   # Setup deploy
*monitoring-setup "Alerts and logs"     # Monitoramento
*security-audit                         # Auditoria segurança
*github-management                      # Gerenciar repositório
```

---

## 📋 Workflow Completo de Sprint

### Sprint Planning (Com Agents)

```bash
# 1. PM cria plano
@pm
*sprint-planning

# 2. Architect revisa design
@architect
*design-system

# 3. Tech Lead aprova
# (revisão manual)

# 4. Squad estima
# (manual)
```

### Durante o Sprint (Development)

**Exemplo: Implementar Feature Login**

```bash
# Dia 1 - Design
@architect
*design-system "Login authentication flow"
# → Arquitetura proposta

# Dia 2 - Frontend
@dev
*create-feature "Login Form Component"
# → Componente React completo com testes

# Dia 3 - Backend
@dev
*design-api "Authentication endpoints"
# → API endpoints com documentação

@dev
*generate-endpoint "POST /auth/login"
# → Implementação do endpoint

# Dia 4 - QA
@qa
*create-test-plan "Login Feature"
# → Plano de testes

@dev
*generate-tests "Login e2e tests"
# → Testes Cypress prontos

# Dia 5 - Review
@architect
*code-review
# → Revisão de qualidade

# Resultado: Feature pronta em 5 dias vs. 7-8 dias (30% mais rápido!)
```

### Sprint Review

```bash
@pm
*sprint-status

# Agente gera:
# - Features completadas
# - Bugs resolvidos
# - Métricas
# - Velocity
# - Próximas prioridades
```

### Sprint Retrospective

```bash
@sm
*retrospective-prep

# Agente sugere:
# - O que foi bem
# - O que melhorar
# - Action items
```

---

## 💡 Boas Práticas

### ✅ Faça Isso
```bash
# Ser específico
@dev
*create-feature "User Authentication with OAuth2 and JWT"

# Fornecer contexto
@dev
*fix-bug "Shopping cart total is incorrect,
         should calculate tax based on user location"

# Pedir para revisar seu código
@dev
*code-review "src/components/Login.tsx"

# Fazer uma pergunta
@dev
*explain-code "How does useCallback prevent re-renders?"
```

### ❌ Evite Isso
```bash
# Muito vago
@dev
*create-feature "Login"  # Muito genérico

# Sem contexto
@dev
*fix-bug "Something is broken"

# Pedir para tomar decisão de negócio
@dev
*decide "Should we use React or Vue?"  # Você decide isso!

# Não revisar o que o agente fez
# (Sempre revise a sugestão!)
```

---

## 🔄 Workflow: Agente + Humano

```
1. Você: Descrever tarefa
   ↓
2. @agente: Gerar sugestão
   ↓
3. Você: Revisar criticamente
   ↓
4. Escolher:
   a) Perfeito! → Usar código
   b) Quase! → Pedir ajustes → Voltar para 2
   c) Errado → Tentar outra abordagem → Voltar para 1
```

---

## 📊 Tempo Economizado por Tarefa

| Tarefa | Sem Agent | Com Agent | Economia |
|--------|-----------|-----------|----------|
| Feature média | 3 dias | 1.5 dias | **50%** |
| Testes unitários | 1 dia | 2 horas | **87%** |
| Testes e2e | 2 dias | 4 horas | **80%** |
| Refatoração | 2 dias | 4 horas | **75%** |
| Code review | 4 horas | 1 hora | **75%** |
| Otimização performance | 2 dias | 4 horas | **80%** |

**Multiplicado por 8 pessoas:**
```
8 pessoas × 50% ganho = 4 pessoas extras de produtividade!
Equivalente a aumentar squad de 8 para 12 pessoas!
```

---

## 🎓 Aprenda Mais

### Para cada agent, veja:
```bash
@agent-name
*guide                 # Guia completo do agente
*help                  # Todos os comandos
```

### Documentação:
- `docs/squad-design/aios-integration.md` - Integração detalhada
- `docs/squad-design/web-development-squad.md` - Estrutura da squad
- `docs/squad-design/team-handbook.md` - Processos

---

## ❓ Perguntas Frequentes

**P: O agente vai fazer tudo sozinho?**
R: Não! Agente sugere, você revisa. Você tem a palavra final.

**P: Posso confiar 100% no código gerado?**
R: Não. Sempre revise! O agente erra às vezes. Você é responsável.

**P: Meu trabalho vai desaparecer?**
R: Não! Você fica mais rápido e pode fazer coisas mais interessantes.

**P: Como começo?**
R: Escolha um agente acima, copie um comando, e teste agora mesmo!

**P: Qual agente devo usar?**
R: Veja a tabela de "Agentes por Rol" acima e encontre o seu.

---

## 🚀 Comece AGORA

```bash
# 1. Abrir terminal
cd seu-projeto

# 2. Iniciar Claude Code
claude code

# 3. Ativar agent
@dev

# 4. Escolher comando
*help

# 5. Executar
*create-feature "Seu primeiro componente"

# 6. Revisar resultado
# 7. Aproveitar o tempo economizado! 🎉
```

---

**Última atualização:** 2026-02-04
**Próxima revisão:** 2026-03-04

Boa sorte! 🚀

