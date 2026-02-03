---
description: "List all available AIOS agents with descriptions"
when-to-invoke: "When you want to see all available agents and their purposes"
---

# List Available Agents

Display all AIOS agents currently available in this project.

## 🤖 AIOS Agents

### Core Agents
| Agent | Command | Description |
|-------|---------|-------------|
| AIOS Master | `/aios-master` | Orchestrador central - coordena todos os agents |
| Developer | `/dev` | Desenvolvimento full-stack, bugs, features e code review |
| Architect | `/architect` | Design e arquitetura de sistemas, technology stack |

### Product & Delivery
| Agent | Command | Description |
|-------|---------|-------------|
| Product Owner | `/po` | Roadmap, user stories, requirements, backlog |
| Project Manager | `/pm` | Planejamento, timelines, recursos, governance |
| Scrum Master | `/sm` | Sprint planning, cerimônias ágeis, coaching |

### Specialized Agents
| Agent | Command | Description |
|-------|---------|-------------|
| Analyst | `/analyst` | Análise de dados, requirements, business intelligence |
| Data Engineer | `/data-engineer` | Data pipelines, ETL/ELT, data warehousing |
| DevOps | `/devops` | Infraestrutura, CI/CD, deployment, monitoring |
| QA | `/qa` | Test planning, test cases, bug reporting, quality |
| UX Design Expert | `/ux-design-expert` | UX research, wireframing, design systems |
| Squad Creator | `/squad-creator` | Composição de times, roles, skills assessment |

## 🛠️ AIOS CLI Commands

| Command | Purpose |
|---------|---------|
| `/aios` | Comando genérico para qualquer operação AIOS |
| `/aios-init` | Criar novo projeto AIOS |
| `/aios-install` | Instalar/configurar AIOS |
| `/aios-update` | Atualizar AIOS para última versão |
| `/aios-doctor` | Diagnóstico do sistema |
| `/aios-info` | Informações do sistema |
| `/aios-version` | Versão instalada |

## 📊 Total de Agents Disponíveis: 12

- ✅ 3 Core Agents
- ✅ 3 Product & Delivery Agents
- ✅ 6 Specialized Agents

## 🚀 Como Usar

Digite qualquer comando acima no Claude Code para invocar o agent correspondente:

```
/dev
```

Cada agent possui sua própria persona, instruções de operação e workflows específicos.

## 📁 Localização dos Arquivos

- **Agents Scripts:** `.claude/commands/AIOS/agents/`
- **Comandos:** `.claude/commands/`
- **Índice Completo:** `.claude/commands/AGENTS_INDEX.md`

Para mais detalhes sobre cada agent, consulte o arquivo `AGENTS_INDEX.md`.
