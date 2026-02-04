# ⚡ Quick Test Guide - AIOS Agents (1-2 hours)

**Teste rápido dos agentes AIOS em ação**

---

## 🎯 Objetivo

Testar 3 agentes em 1-2 horas:
- `@dev` - Criar componente + testes
- `@architect` - Design de sistema
- `@qa` - Planejar testes

---

## 📅 Timeline

```
00:00 - 00:15  | Setup e preparação
00:15 - 00:45  | Test 1: @architect (design)
00:45 - 01:15  | Test 2: @dev (code generation)
01:15 - 01:45  | Test 3: @qa (test planning)
01:45 - 02:00  | Revisão e análise
```

---

## 🚀 Test 1: @architect - Design System (15-30 min)

### Objetivo
Ver como o agent ajuda a desenhar a arquitetura.

### Passo 1: Abrir Terminal
```bash
cd E:\Backup_HD\code
claude code
```

### Passo 2: Ativar Architect Agent
```bash
@architect
```

Você vai ver:
```
👨‍💼 Aria - Architect Agent & System Design Specialist

Available Commands:
- *design-system
- *tech-decision
- *architecture-audit
- *scalability-check
...
```

### Passo 3: Executar Comando
```bash
*design-system
```

### Passo 4: Descrever o que quer
```
"Design the architecture for a simple Login Form component.
Include:
- Component structure
- State management approach
- Form validation strategy
- Error handling
- TypeScript types"
```

### Esperado - Agent retorna:
```
✅ Component architecture
✅ Folder structure
✅ State management solution
✅ Validation approach
✅ Error handling strategy
✅ TypeScript type suggestions
✅ Dependencies needed
```

### Passo 5: Analisar Resultado
```
⏱️ Tempo: 5-10 minutos
📊 Valor: Design claro antes de codificar
✅ Resultado: Você entende a arquitetura
```

### Sair do Agent
```bash
*exit
```

---

## 💻 Test 2: @dev - Code Generation (30-45 min)

### Objetivo
Ver como o agent gera código de qualidade.

### Passo 1: Ativar Dev Agent
```bash
@dev
```

Você vai ver:
```
👨‍💻 Dex - Developer Agent & Full-Stack Implementation Specialist

Available Commands:
- *create-feature
- *write-tests
- *optimize-performance
- *code-review
...
```

### Passo 2: Criar um Componente Simples
```bash
*create-feature
```

### Passo 3: Descrever o Componente
```
"Create a Login Form React component in TypeScript.
Requirements:
- Email and password input fields
- Form validation (email format, password min 8 chars)
- Submit button
- Error message display
- Loading state
- Styling with Tailwind CSS
- Accessibility attributes (WCAG 2.1)
- Clean, production-ready code"
```

### Esperado - Agent Cria:
```
✅ src/components/LoginForm.tsx
   ├── React component with hooks
   ├── TypeScript types
   ├── Form validation with Zod
   ├── Error handling
   ├── Tailwind CSS styling
   ├── Accessibility (aria labels, roles)
   ├── Loading state
   └── Clean code structure
```

### Passo 4: Revisar o Código Gerado
O agent vai mostrar:
1. **Arquivo:** `src/components/LoginForm.tsx`
2. **Linhas de código:** ~100-150 linhas
3. **Features:**
   - ✅ Form state management
   - ✅ Validation logic
   - ✅ Error messages
   - ✅ TypeScript types
   - ✅ Tailwind styling
   - ✅ Accessibility

### Passo 5: Pedir para Gerar Testes
```bash
*write-tests
```

### Descrever os Testes
```
"Create Jest and React Testing Library tests for the LoginForm component.
Test cases:
- Form renders correctly
- Valid form submission
- Email validation error
- Password validation error
- Loading state display
- Error message display
- Accessibility"
```

### Esperado - Agent Cria Testes:
```
✅ src/__tests__/components/LoginForm.test.tsx
   ├── Test setup and mocks
   ├── Render test
   ├── Validation tests
   ├── Error message tests
   ├── Accessibility tests
   └── ~80-100 linhas de testes
```

### Analisar Resultado
```
⏱️ Tempo: 20-30 minutos
📊 Código gerado: ~200 linhas (component + testes)
✅ Qualidade: Produção-ready
✅ Cobertura: Tests inclusos
🎯 Ganho: 3-4 horas economizadas!
```

### Sair do Agent
```bash
*exit
```

---

## 🧪 Test 3: @qa - Test Planning (15-30 min)

### Objetivo
Ver como o agent ajuda a planejar testes.

### Passo 1: Ativar QA Agent
```bash
@qa
```

Você vai ver:
```
✅ Quinn - QA Agent & Quality Assurance Specialist

Available Commands:
- *create-test-plan
- *generate-tests
- *quality-report
- *accessibility-audit
...
```

### Passo 2: Criar Plano de Testes
```bash
*create-test-plan
```

### Passo 3: Descrever o Escopo
```
"Create a comprehensive test plan for the User Login feature.
Include:
- Functional test cases (login flow)
- Validation tests (invalid inputs)
- Security tests (rate limiting, password rules)
- UX tests (error messages, loading states)
- Accessibility tests (keyboard navigation, screen readers)
- Performance tests (form response time)
- Edge cases and error scenarios"
```

### Esperado - Agent Retorna:
```
✅ Test Plan Document
   ├── Test cases estruturados
   ├── Casos de sucesso
   ├── Casos de erro
   ├── Edge cases
   ├── Security considerations
   ├── Performance targets
   ├── Acceptance criteria
   └── ~40-50 casos de teste
```

### Passo 4: Revisar Plano
Agent vai listar:
- ✅ 10-15 functional tests
- ✅ 8-10 validation tests
- ✅ 5-8 security tests
- ✅ 5-8 accessibility tests
- ✅ 3-5 performance tests

### Analisar Resultado
```
⏱️ Tempo: 10-15 minutos
📊 Test cases: 30-40 casos
✅ Cobertura: Completa
🎯 Ganho: 1-2 horas economizadas!
```

### Sair do Agent
```bash
*exit
```

---

## 📊 Análise de Resultado

### Tempo Investido vs Economizado

| Agent | Tarefa | Tempo Gasto | Tempo Normal | Ganho |
|-------|--------|-------------|------------|-------|
| @architect | Design | 10 min | 1-2 horas | **85%** |
| @dev | Component | 15 min | 3-4 horas | **87%** |
| @dev | Tests | 10 min | 2 horas | **83%** |
| @qa | Test Plan | 15 min | 2 horas | **87%** |
| **TOTAL** | **4 tarefas** | **50 min** | **8-13h** | **85%** |

### Valor Gerado

```
Código Gerado:
✅ Component (150 linhas)
✅ Tests (100 linhas)
✅ Design document
✅ Test plan (50 casos)
✅ TypeScript types
✅ Validation logic
✅ Error handling
✅ Accessibility
✅ Tailwind styling

Qualidade:
✅ Production-ready
✅ Type-safe
✅ Tested
✅ Accessible
✅ Well-documented

Tempo Economizado:
✅ 50 minutos gerou 8-13 horas de trabalho
✅ Ratio: 1:10 (10x productivity boost!)
```

---

## 💡 O que Você Aprenderá

### Sobre @architect
- [ ] Como descrever problemas para um architect
- [ ] Como validar design decisions
- [ ] Como pensar sobre arquitetura
- [ ] Quando pedir para o architect revisar

### Sobre @dev
- [ ] Como descrever features para um dev
- [ ] Qualidade do código gerado
- [ ] Como revisar código gerado
- [ ] Como iterar com ajustes

### Sobre @qa
- [ ] Como pensar em casos de teste
- [ ] Importância de test planning
- [ ] Coverage completude
- [ ] Edge cases and scenarios

### Sobre Você
- [ ] Como colaborar com AI agents
- [ ] Como revisar criticamente
- [ ] Quando usar agents (quando não usar)
- [ ] Workflow eficiente human + AI

---

## 🎯 Success Criteria

Ao final do teste, você conseguiu:

- [ ] Ativar @architect e executar comando
- [ ] Ver design ser criado em minutos
- [ ] Ativar @dev e gerar componente
- [ ] Ver código TypeScript/React pronto
- [ ] Ativar @qa e planejar testes
- [ ] Ver test cases estruturados
- [ ] Revisar qualidade do output
- [ ] Entender como usar agents
- [ ] Entender ganhos de produtividade
- [ ] Pronto para testar em produção

---

## 📋 Checklist do Teste

### Setup (5 min)
- [ ] Terminal aberto
- [ ] Diretório correto (`E:\Backup_HD\code`)
- [ ] Claude Code iniciado

### Test 1: @architect (15 min)
- [ ] Agent ativado
- [ ] Comando executado
- [ ] Descrição fornecida
- [ ] Design revisado
- [ ] Agent finalizado

### Test 2: @dev (30 min)
- [ ] Agent ativado
- [ ] Component criado
- [ ] Código revisado
- [ ] Testes gerados
- [ ] Testes revisados
- [ ] Agent finalizado

### Test 3: @qa (15 min)
- [ ] Agent ativado
- [ ] Test plan criado
- [ ] Plano revisado
- [ ] Agent finalizado

### Analysis (10 min)
- [ ] Tempo anotado
- [ ] Qualidade avaliada
- [ ] Ganhos documentados
- [ ] Próximos passos definidos

---

## 🚀 Próximos Passos Após Teste

### Se Resultado Bom (esperado!)
```
✅ Teste uma story completa (Story 1)
✅ Envolva toda a squad
✅ Meça ganhos reais em produção
✅ Ajuste conforme necessário
```

### Se Quiser Mais Testes
```
✅ Testar @devops (CI/CD)
✅ Testar @pm (project management)
✅ Testar @ux-design-expert (design)
✅ Testar @aios-master (orchestration)
```

### Se Encontrar Problemas
```
✅ Refinar prompts (ser mais específico)
✅ Usar agentes secundários (suporte)
✅ Documentar e compartilhar feedback
✅ Ajustar configuração
```

---

## 💬 Exemplos de Prompts

### @architect
```
"Design a simple counter component.
What state management would you recommend?
How should we handle increment/decrement?
What TypeScript types do we need?"
```

### @dev
```
"Create a Button component with:
- Primary and secondary variants
- Disabled state
- Loading spinner
- Icon support
- Tailwind CSS
- Full TypeScript"
```

### @qa
```
"Plan tests for a simple search input that:
- Filters a list of items
- Debounces search
- Shows loading state
- Handles no results"
```

---

## ⏱️ Timeline Recomendado

### 14:00 - 14:15: Setup
```bash
cd E:\Backup_HD\code
claude code
```

### 14:15 - 14:45: @architect Test
```bash
@architect
*design-system
# Descrever componente
```

### 14:45 - 15:15: @dev Test (Componente)
```bash
@dev
*create-feature
# Descrever componente
```

### 15:15 - 15:45: @dev Test (Testes)
```bash
# Continuando no @dev
*write-tests
# Descrever testes
```

### 15:45 - 16:15: @qa Test
```bash
@qa
*create-test-plan
# Descrever plano
```

### 16:15 - 16:30: Análise
```
Revisar resultados
Documentar tempo
Preparar próximos passos
```

---

## 📸 O que Esperar Ver

### Output do @architect
```
Architecture Design for Login Form Component
=============================================

Component Structure:
- LoginForm (main component)
  ├── FormInput (reusable)
  ├── FormError (error display)
  └── SubmitButton

State Management: React Hook Form + Zod

Validation Strategy:
- Email: valid email format
- Password: min 8 chars

Error Handling:
- Display validation errors
- Show server errors
- Provide helpful messages

TypeScript Types:
interface LoginFormData {
  email: string;
  password: string;
}

Dependencies:
- react-hook-form
- zod
- tailwindcss

[... mais 50+ linhas de design ...]
```

### Output do @dev
```
// src/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } =
    useForm({
      resolver: zodResolver(schema),
    });

  return (
    <form onSubmit={handleSubmit(...)}>
      {/* form fields */}
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      {/* password field */}
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
};

[... 100+ linhas de código bem estruturado ...]
```

### Output do @qa
```
Test Plan: Login Form Component
==============================

Functional Tests:
1. ✓ Form renders without errors
2. ✓ User can enter email
3. ✓ User can enter password
4. ✓ Submit button is clickable
5. ✓ Form submission succeeds with valid data

Validation Tests:
6. ✓ Email validation error shows for invalid email
7. ✓ Password validation error shows for short password
8. ✓ Both errors show when both fields invalid
9. ✓ Errors clear when user corrects input

Accessibility Tests:
10. ✓ Form is keyboard navigable
11. ✓ Error messages associated with inputs
12. ✓ Labels visible and linked to inputs
13. ✓ Screen reader reads all content

Edge Cases:
14. ✓ Very long email is rejected
15. ✓ Special characters in password handled
16. ✓ Copy-paste into fields works
17. ✓ Autofill works

[... 30+ test cases ...]
```

---

## ✨ Dicas Importantes

### 🎯 Seja Específico
```
❌ Ruim: "Create a form"
✅ Bom: "Create a login form with email/password validation,
        Tailwind styling, error messages, and accessibility."
```

### 🔍 Sempre Revise
```
✅ Agent sugere → Você revisa criticamente
✅ Se não ficou bom → Pedir ajustes ou refactor
✅ Nunca usar 100% sem revisar
```

### 💭 Iterar
```
@dev
*refactor-code "src/components/LoginForm.tsx"
"Move validation to separate file"

# Agent melhora o código
```

### 🚫 Quando Não Usar Agent
```
❌ Decisões de negócio (você decide)
❌ Arquitetura crítica (tech lead decide)
❌ Segurança crítica (revisar 2x)
❌ Código legado complexo (pair programming)
```

---

## 🎉 Resultado Final Esperado

Após 1-2 horas:

```
✅ Component React pronto (150 linhas)
✅ Testes Jest/RTL pronto (100 linhas)
✅ Design document criado
✅ Test plan estruturado (30+ casos)
✅ TypeScript types inclusos
✅ Tailwind styling aplicado
✅ Acessibilidade validada
✅ Documentação automática

Total de trabalho:
- Tempo investido: 1-2 horas
- Código criado: ~250 linhas
- Testes criados: 30+ casos
- Ganho: 8-13 horas economizadas!
```

---

## 🚀 Comece AGORA!

```bash
# Abrir terminal
cd E:\Backup_HD\code

# Iniciar Claude Code
claude code

# Ativar architect agent
@architect

# Executar design-system
*design-system

# Descrever: "Design a simple Login Form component"

# Resultado em 10 minutos! 🎉
```

---

**Boa sorte no teste! Aproveite o 85% de ganho de produtividade! 🚀**

Last Updated: 2026-02-04

