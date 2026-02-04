# 🧪 Testing Story 1 with AIOS Agents

**Como testar a story de autenticação usando agentes AIOS**

---

## 📋 Visão Geral

Este guia mostra como executar a **Story 1: User Authentication System** usando os agentes AIOS da squad. Você verá como cada rol da squad usa seu agente correspondente para completar as tarefas.

---

## 🎯 Objetivo

Implementar um sistema completo de autenticação (login, registro, OAuth, etc) em **6-7 dias** com ajuda dos agentes, vs. **12-14 dias** sem eles.

---

## 📅 Timeline de Teste

```
Day 1: Planning & Design
Day 2-3: Frontend Development
Day 4-5: Backend Development
Day 6: Testing
Day 7: Review & Documentation
```

---

## 🚀 Day 1: Planning & Design

### Tech Lead: Desenhar Arquitetura

**Objetivo:** Tech Lead entende a story e desenha a arquitetura.

```bash
# 1. Abrir Claude Code
claude code

# 2. Ativar agent architect
@architect

# 3. Usar comando para desenhar sistema
*design-system

# 4. Descrever o sistema
"User Authentication System with Email/Password and Google OAuth2"

# Agente retorna:
# - Arquitetura de componentes
# - Fluxos de dados
# - Padrões de segurança
# - Recomendações de tecnologias
```

**Resultado esperado:**
- [ ] Diagrama de arquitetura
- [ ] Fluxos de autenticação definidos
- [ ] Decisões técnicas documentadas

**Tempo:**
- Sem agent: 2-3 horas
- Com agent: 30 minutos (85% ganho!)

---

### Tech Lead: Criar Story

**Objetivo:** Converter a story em tasks executáveis.

```bash
# Continuando no @architect...

*exit

# Ativar master agent
@aios-master

# Criar a story
*create-story

# Descrever
"Story 1: User Authentication System"

# Agente cria:
# - Tasks estruturadas
# - Estimativas
# - Dependências
# - Checklist
```

**Resultado esperado:**
- [ ] Story criada em docs/stories/
- [ ] Tasks divididas por função
- [ ] Estimativas definidas

---

## 💻 Day 2-3: Frontend Development

### Senior Frontend: Criar Componentes

**Objetivo:** Frontend engineer cria componentes de login/registro.

#### Task 1: Login Page Component

```bash
# Terminal
claude code

# Ativar dev agent
@dev

# Comando para criar feature
*create-feature

# Descrever o que quer
"Login Page Component with Email/Password and Google OAuth2 button.
Include form validation, error messages, and styling with Tailwind CSS.
Component should be accessibility compliant (WCAG 2.1)."

# Agente cria:
# ✅ Componente React/TypeScript
# ✅ Form validation com Zod
# ✅ Google OAuth integration
# ✅ Tailwind CSS styling
# ✅ Acessibilidade
```

**Resultado esperado:**
```
src/components/Auth/LoginForm.tsx
├── Form validation
├── Google OAuth button
├── Error messages
├── TypeScript types
└── Accessibility attributes
```

**Tempo:**
- Sem agent: 4 horas
- Com agent: 30 minutos (87% ganho!)

**Próximo passo: Revisar código**
```bash
# Senior Frontend abre o arquivo gerado
# Revisa a qualidade
# Faz ajustes se necessário
# Aprova ou pede melhorias

# Se precisa de ajuste:
*refactor-code "src/components/Auth/LoginForm.tsx"
"Move OAuth button to separate component"
```

#### Task 2: Criar Testes

```bash
# Continuando no @dev...

*write-tests

# Descrever
"Jest + React Testing Library tests for LoginForm component.
Test cases:
- Form submission with valid credentials
- Form validation errors
- Google OAuth button click
- Error message display
- Accessibility"

# Agente cria:
# ✅ Testes Jest
# ✅ Testing Library queries
# ✅ Mocks para API
# ✅ Acessibilidade tests
```

**Resultado esperado:**
```
src/__tests__/components/LoginForm.test.tsx
├── Valid login test
├── Validation error tests
├── OAuth button test
└── Accessibility test
```

**Tempo:**
- Sem agent: 2 horas
- Com agent: 20 minutos (83% ganho!)

#### Task 3: Register Page Component

```bash
# Usar mesmo fluxo:

@dev

*create-feature

"Registration Page with email and password fields.
Include password strength indicator, confirmation field,
and email verification flow. Use Tailwind CSS and ensure WCAG compliance."

# Resultado: Componente completo em 30 min
# vs. 4 horas sem agent
```

#### Task 4: Auth Context

```bash
@dev

*create-feature

"Create useAuth hook and AuthContext for managing authentication state.
Handle JWT token storage in httpOnly cookies, refresh token logic,
and user logout. Include TypeScript types and error handling."

# Resultado: Hook + Context em 30 min
# Inclui: token refresh, logout, user state, etc
```

### Mid Frontend: Tarefas Simples

```bash
@dev

*create-feature

"Protected Route component that checks authentication status
and redirects to login if user is not authenticated."

# Resultado: Componente pronto em 20 min
```

---

## 🔧 Day 4-5: Backend Development

### Tech Lead: Design de Database

**Objetivo:** Desenhar schema do banco de dados.

```bash
@architect

*database-design

"Design database schema for User Authentication System.
Include users table, sessions table, password_reset_tokens table.
Add indexes, constraints, and timestamps."

# Agente retorna:
# ✅ Prisma schema
# ✅ Migrations
# ✅ Indexes
# ✅ Constraints
# ✅ Relationships
```

**Tempo:**
- Sem agent: 2 horas
- Com agent: 20 minutos (83% ganho!)

### Senior Backend: Design API

```bash
@dev

*design-api

"Design REST API endpoints for User Authentication System.
Endpoints needed:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/logout
- POST /api/auth/refresh

Include request/response schemas, error codes, and security considerations."

# Agente retorna:
# ✅ OpenAPI spec
# ✅ Request/response models
# ✅ Error codes
# ✅ Security headers
# ✅ Rate limiting strategy
```

**Tempo:**
- Sem agent: 2 horas
- Com agent: 20 minutos (83% ganho!)

### Senior Backend: Implementar Endpoints

#### Endpoint 1: Register

```bash
@dev

*generate-endpoint

"POST /api/auth/register endpoint for user registration.
Requirements:
- Validate email format
- Validate password complexity (min 8 chars, numbers, symbols)
- Hash password with bcrypt
- Store user in database
- Send confirmation email
- Return success/error message
- Add error handling for duplicate emails"

# Agente cria:
# ✅ Controller method
# ✅ Service method
# ✅ DTO with validation
# ✅ Database query
# ✅ Email sending
# ✅ Error handling
# ✅ Tests
```

**Resultado esperado:**
```
src/modules/auth/
├── auth.controller.ts
├── auth.service.ts
├── dto/register.dto.ts
└── __tests__/auth.service.spec.ts
```

**Tempo:**
- Sem agent: 3 horas
- Com agent: 30 minutos (83% ganho!)

**Próximo: Revisar código**
```bash
# Senior Backend revisa o código gerado
# Valida lógica de negócio
# Aprova ou pede ajustes

@dev

*code-review

# Se precisa otimizar:
*optimize-query

"Performance optimization for user lookup in login endpoint"
```

#### Endpoint 2: Login

```bash
@dev

*generate-endpoint

"POST /api/auth/login endpoint for user login.
Requirements:
- Find user by email
- Compare password with hash
- Rate limiting (5 attempts = 15 min block)
- Generate JWT (access + refresh tokens)
- Set secure cookies
- Return tokens and user info
- Handle invalid credentials
- Add logging for security"

# Resultado: Endpoint completo em 30 min com:
# - Rate limiting
# - JWT generation
# - Security logging
# - Error handling
```

#### Endpoint 3: Google OAuth

```bash
@dev

*generate-endpoint

"POST /api/auth/google endpoint for Google OAuth2.
Requirements:
- Verify Google ID token
- Find user by email or create new one
- Vinculação de contas existentes
- Generate JWT tokens
- Return tokens and user info
- Handle verification errors"

# Resultado: OAuth endpoint com Passport.js em 30 min
```

#### Endpoints 4-5: Password Reset

```bash
@dev

*generate-endpoint

"POST /api/auth/forgot-password endpoint.
- Validate email exists
- Generate reset token (random, hashed)
- Save token in database (expires in 24h)
- Send email with reset link
- Return confirmation message"

# E depois:

*generate-endpoint

"POST /api/auth/reset-password endpoint.
- Validate reset token
- Verify token not expired
- Validate new password
- Hash new password
- Update user in database
- Invalidate old tokens
- Return success message"
```

### Senior Backend: Auth Middleware

```bash
@dev

*create-feature

"Create JWT authentication middleware for Nest.js.
Requirements:
- Extract JWT from cookies
- Verify JWT signature
- Add user info to request object
- Handle expired tokens (suggest refresh)
- Handle invalid tokens
- Return proper error responses"

# Resultado: Middleware pronto para usar em 30 min
```

### Mid Backend: Tasks Simples

```bash
# Mid backend cria:

@dev

*create-feature

"Create Prisma migrations for authentication database schema."

# Resultado: Migrations prontas em 20 min
```

---

## 🧪 Day 6: Testing

### QA: Planejar Testes

```bash
@qa

*create-test-plan

"User Authentication System testing plan.
Include:
- Registration flow (valid/invalid inputs)
- Login flow (valid/invalid credentials)
- Password reset flow
- Google OAuth flow
- Logout flow
- Protected routes access
- Rate limiting
- Security considerations"

# Agente retorna:
# ✅ Test plan document
# ✅ Test cases por fluxo
# ✅ Edge cases
# ✅ Security tests
```

**Tempo:**
- Sem agent: 2 horas
- Com agent: 20 minutos (83% ganho!)

### Dev: Gerar Testes E2E

```bash
@dev

*generate-tests

"Cypress E2E tests for user authentication flows.
Test scenarios:
1. User registers with email/password
2. User receives confirmation email
3. User confirms email
4. User logs in with credentials
5. User gets JWT token
6. User accesses protected page
7. User logs out
8. User cannot access protected page after logout
9. User can reset forgotten password
10. User can login with Google OAuth"

# Agente cria:
# ✅ Cypress specs
# ✅ Page objects
# ✅ Fixtures
# ✅ Helper functions
```

**Resultado:**
```
e2e/auth.spec.ts
├── Registration test
├── Login test
├── Password reset test
├── Google OAuth test
└── Logout test
```

**Tempo:**
- Sem agent: 6 horas
- Com agent: 1 hora (83% ganho!)

### Dev: Backend Tests

```bash
@dev

*write-tests

"Jest integration tests for authentication API endpoints.
Test all endpoints:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/logout

Include:
- Valid requests
- Invalid requests
- Error scenarios
- Rate limiting
- JWT validation"

# Resultado: Testes completos em 1 hora
# vs. 4 horas sem agent
```

### QA: Executar Testes

```bash
# Executar testes automatizados
npm test                    # Jest tests
npm run e2e                 # Cypress tests

# Resultados esperados:
# ✅ 100% passing tests
# ✅ Code coverage > 80%
# ✅ Zero flaky tests
```

---

## 📚 Day 7: Review & Documentation

### Dev: Criar Documentação

```bash
@dev

*generate-docs

"Create API documentation for authentication endpoints.
Include:
- Authentication flow diagrams
- Endpoint descriptions
- Request/response examples
- Error codes
- Rate limiting info
- Security considerations
- Example cURL commands"

# Resultado: Documentação completa em 1 hora
# Inclui: Markdown + OpenAPI spec
```

### Tech Lead: Security Review

```bash
@architect

*security-review

"Perform security audit of authentication system.
Check:
- Password hashing (bcrypt with proper salt rounds)
- JWT token security
- HTTPS enforcement
- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting
- Secure cookie flags
- Token expiration times"

# Agente retorna:
# ✅ Security checklist
# ✅ Vulnerabilities found
# ✅ Recommendations
```

### Code Review (Manual)

```bash
# Tech Lead revisa todos os PRs
# Verifica:
# - Padrões de código
# - Performance
# - Security
# - Tests
# - Documentation

# Aprova PRs
# Merge para main
```

---

## 📊 Resultado Final

### Comparação de Tempo

```
TAREFA                      SEM AGENT    COM AGENT    GANHO
─────────────────────────────────────────────────────────
Frontend Components         8 horas      1 hora       87%
Tests (Frontend)            2 horas      20 min       83%
API Design                  2 horas      20 min       83%
Backend Endpoints           12 horas     2 horas      83%
Auth Middleware             2 horas      30 min       75%
E2E Tests                   6 horas      1 hora       83%
Integration Tests           4 horas      1 hora       75%
Documentation               2 horas      1 hora       50%
Security Review             2 horas      1 hora       50%
─────────────────────────────────────────────────────────
TOTAL                       40 horas     8 horas      80%

Dias tradicionais: 12-14 dias (assumindo 8h/dia)
Dias com agentes: 2-3 dias  (assumindo 8h/dia)
```

### Output Esperado

```
✅ Frontend
├── Login page component
├── Register page component
├── Auth context/hook
├── Protected routes
└── Tests (Jest + RTL)

✅ Backend
├── User schema
├── Register endpoint
├── Login endpoint
├── Google OAuth endpoint
├── Password reset flow
├── Auth middleware
└── Tests (Jest)

✅ Testing
├── E2E tests (Cypress)
├── Integration tests
├── Unit tests
└── Code coverage > 80%

✅ Documentation
├── API documentation
├── Architecture diagrams
├── Security guidelines
└── Setup guide

✅ Quality
├── Zero vulnerabilities
├── 100% test pass rate
├── Code review approved
└── Ready for production
```

---

## 🎓 What You'll Learn

### By Using @dev Agent
- Como gerar código de qualidade
- Padrões de desenvolvimento
- Validação e error handling
- Testes automatizados
- Code review workflow

### By Using @architect Agent
- Design de sistemas
- Decisões arquiteturais
- Segurança em aplicações
- Performance optimization
- Database design

### By Using @qa Agent
- Test planning
- Test automation
- Quality metrics
- Bug finding strategies

### By Using @devops Agent
- CI/CD setup
- Deployment strategies
- Monitoring and logging

---

## 🚀 Quick Start: Execute AGORA!

### Começar o teste:

```bash
# 1. Abrir terminal
cd seu-projeto
claude code

# 2. Day 1: Architecture
@architect
*design-system

# Descrever: "User Authentication System with JWT and OAuth2"

# Resultado: Architecture em 30 minutos!

# 3. Day 2: Frontend
@dev
*create-feature "Login Page Component"

# Resultado: Componente em 30 minutos!

# 4. Day 3: Backend
@dev
*design-api "Authentication REST API"
*generate-endpoint "POST /api/auth/register"

# Resultado: API endpoints em 1-2 horas!

# 5. Day 4: Tests
@qa
*create-test-plan "Auth Testing"

@dev
*generate-tests "Cypress E2E tests"

# Resultado: Testes prontos em 1 hora!

# 6. Revisar e Aprovar
# (Você revisa todo output)

# Total: Story completa em 2-3 dias vs. 12-14 dias! 🎉
```

---

## 📝 Success Criteria

- [ ] Todos os endpoints funcionando
- [ ] Testes passando (100%)
- [ ] Code coverage > 80%
- [ ] Zero vulnerabilidades críticas
- [ ] Documentação completa
- [ ] Code review aprovado
- [ ] Pronto para produção
- [ ] Tempo < 3 dias (vs. 12-14 dias)
- [ ] Squad satisfeita com resultado

---

## 💡 Tips

**Revisar sempre!** Agente faz sugestões, você valida.

**Iterar se necessário:** Se código não ficou bom:
```bash
@dev
*refactor-code "arquivo.ts"
"Melhorar validação de email"
```

**Fazer perguntas:** Se não entender:
```bash
@dev
*explain-code "Como funciona JWT?"
```

**Aprender:** Use como oportunidade de aprendizado:
```bash
@dev
*learn-pattern "OAuth2 flow"
```

---

## 📞 Support

Dúvidas durante o teste?
- Revisar documentação: `docs/squad-design/aios-quick-start.md`
- Ver exemplo: `docs/squad-design/aios-integration.md`
- Pedir ajuda: `@dev *help`

---

**Bom teste! Aproveite os 80% de ganho de tempo! 🚀**

Last Updated: 2026-02-04

