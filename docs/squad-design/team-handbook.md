# 📖 Team Handbook - Web Development Squad

**Bem-vindo à Web Development Squad!** Este handbook define nossas normas, valores e expectativas de trabalho.

---

## 🎯 Nossa Missão

Desenvolver sites e landing pages **profissionais, escaláveis e performáticos**, entregando excelência em:
- **Qualidade do código** - Clean code, bem testado
- **Performance** - Rápido em qualquer dispositivo
- **User Experience** - Intuitivo e acessível
- **Segurança** - Protegido contra vulnerabilidades
- **Documentação** - Claro e mantível

---

## 💎 Nossos Valores

### 1. Qualidade em Primeiro Lugar
- Não entregamos código que não atende nossos padrões
- Preferimos entregar tarde e bem, do que cedo e ruim
- Code reviews são sérios e construtivos
- Testes são obrigatórios, não opcionais

### 2. Colaboração
- Compartilhamos conhecimento abertamente
- Perguntamos quando não sabemos
- Ajudamos colegas quando estão bloqueados
- Ninguém é "a estrela" - somos um time

### 3. Transparência
- Comunicamos progresso, riscos e bloqueios claramente
- Erros são oportunidades de aprendizado
- Falamos cedo e frequente
- Sem surpresas desagradáveis

### 4. Aprendizado Contínuo
- Dedicamos tempo a crescimento (4h/mês mínimo)
- Compartilhamos descobertas com o time
- Lemos artigos, fazemos cursos, experimentamos
- Mentoramos uns aos outros

### 5. Excelência Técnica
- Buscamos melhorar constantemente
- Refatoramos quando necessário
- Mantemos dependências atualizadas
- Documentamos decisões (ADRs)

---

## 📋 Normas de Trabalho

### Horário de Trabalho
- **Core hours:** 9:30 AM - 4:00 PM (timezone local)
- **Flexibilidade:** Antes/depois é flexível, desde que cubra core hours
- **Reuniões:** Agendadas durante core hours quando possível
- **Async:** Preferir comunicação assíncrona fora das core hours

### Comunicação

#### Slack
**Response time esperado:**
- Emergências (production down): < 15 min
- Bloqueios (#web-dev-blockers): < 1 hora
- Mensagens normais: < 2 horas
- Fora do horário: Sem expectativa

**Boas práticas:**
- Use threads para discussões
- Evite @here/@channel sem necessidade
- Use reações 👍 em vez de "ok"
- Comunique ausências (vacation mode)

#### Email
- Usar para comunicação formal/oficial
- Response time: < 24 horas
- Não é para emergências

#### Reuniões
- Agenda compartilhada é respeitada
- Se não puder, avise com antecedência
- Câmera on em reuniões importantes
- Tomar notas e compartilhar outcomes

### Working from Home (WFH)
- **Permitido:** Totalmente remoto, flexível
- **Expectativa:** Disponível durante core hours
- **Tools:** Slack, Zoom, GitHub sempre funcionando
- **Comunicação:** Mais importante quando remoto

### Feedback & 1-on-1s
- **Frequência:** Semanal (15-30 min)
- **Objetivo:** Acompanhar progressão, apoiar
- **Two-way:** Você também dá feedback
- **Privado:** Sem surpresas em feedback

---

## 🤝 Etiqueta Profissional

### Code Review
**Ao revisar:**
- [ ] Seja respeitoso e construtivo
- [ ] Explique o "por quê" não só o "o quê"
- [ ] Diferencie bloqueios vs sugestões
- [ ] Reconheça bom trabalho

**Ao ser revisado:**
- [ ] Não leve pessoalmente
- [ ] Pergunte se não entender
- [ ] Implemente sugestões ou justifique
- [ ] Agradeça o tempo do revisor

### Resolvendo Conflitos
1. **Conversation privada** - Fale 1-on-1 primeiro
2. **Listen actively** - Entenda a perspectiva do outro
3. **Find middle ground** - Busque solução juntos
4. **Escalate if needed** - Tech Lead se não resolver
5. **Move on** - Decisão é final, segue em frente

### Celebrações
- Comemoramos wins (PRs merged, bugs resolvidos, etc)
- Reconhecemos esforço extra
- Channel #web-dev-wins para celebrações
- Bolo/drinks quando evento importante

---

## 📊 Expectativas de Performance

### Produto (Devs)
- **Velocity consistente** - Estimativas realistas
- **Quality** - < 5% de bug rate pós-produção
- **Test coverage** - > 80%
- **Documentation** - 100% de features documentadas
- **Communication** - Bloqueios avisados cedo

### Design
- **Handoff on time** - Designs antes de dev começar
- **Design system consistency** - 95%+ compliance
- **Accessibility** - WCAG 2.1 AA mínimo
- **Responsiveness** - Mobile, tablet, desktop

### QA
- **Coverage** - Testes de 100% fluxos críticos
- **Catch bugs** - 90%+ bugs encontrados antes de prod
- **Documentation** - Testes documentados e mantíveis
- **Automation** - 70%+ testes automatizados

### DevOps (part-time)
- **Uptime** - 99.95%
- **Deploy time** - < 5 minutos
- **MTTR** - < 30 minutos para resolve
- **Documentation** - Runbooks atualizados

---

## 🎓 Desenvolvimento & Crescimento

### Aprendizado Esperado
- **4 horas/mês** dedicadas a aprendizado
- Pode ser: Cursos, leitura, experimentação, pair programming
- Compartilhe o que aprendeu (lunch & learn, blog post, etc)

### Certificações
- **Apoiados:** Certificações relevantes à função
- **Subsídio:** Empresa cobre até $500/ano
- **Tempo:** 8 horas/mês do trabalho para preparação

### Mentoría
- **Mentoring others:** Esperado de seniores
- **Asking for help:** Esperado de juniors
- **Pair programming:** Mínimo 2h/mês

### Growth Plan
- Anualmente revisamos goals de carreira
- Mapeamos passos para próxima posição
- Identificamos gaps de skills
- Criamos plano de desenvolvimento

---

## 🔒 Segurança & Confidencialidade

### Passwords & Secrets
- [ ] Nunca commit secrets no Git
- [ ] Use .env.local (gitignored)
- [ ] Senhas em password manager corporativo
- [ ] Rotate senhas a cada 90 dias

### Data Privacy
- [ ] GDPR compliance em todos os features
- [ ] Não guarde dados desnecessários
- [ ] Criptografe dados sensíveis
- [ ] Audit logs para mudanças críticas

### Code Security
- [ ] Validar input sempre (XSS, SQL injection)
- [ ] HTTPS obrigatório
- [ ] Não exponha info no console
- [ ] Security review para auth/payment/PII

### Device Security
- [ ] Laptop com password
- [ ] Antivírus atualizado
- [ ] VPN para redes públicas
- [ ] 2FA no GitHub, AWS, etc

---

## 🚫 O Que Não Fazemos

### Absolutamente Proibido
- ❌ Discriminação ou assédio de qualquer tipo
- ❌ Abuso de poder ou autoridade
- ❌ Leaks de informação confidencial
- ❌ Código malicioso ou backdoors
- ❌ Atitudes tóxicas ou agressivas

### Não Aceitável
- ❌ Bullying ou intimidação
- ❌ Falta de respeito com colegas
- ❌ Negligência deliberada de qualidade
- ❌ Não comunicar bloqueios/problemas
- ❌ Micromanagement dos outros

### Penalidades
1. **First offense:** Conversa privada + awareness
2. **Second offense:** Formal warning
3. **Third offense:** Demissão ou transfer
4. **Severe cases:** Ação imediata

---

## 🎉 Benefícios da Squad

### Horário Flexível
- Trabalhe quando mais produtivo
- 1-2 dias/semana remoto (ou 100% remoto)
- Respeitamos time zones diferentes
- Ausências planejadas sem hassle

### Desenvolvimento Profissional
- Budget de $1,000/ano para cursos
- Subsídio de certificações
- Conference allowance
- Mentoring dedicado

### Saúde & Wellbeing
- Gym allowance ($50/mês)
- Mental health support
- Home office setup allowance
- Flexible schedule para exercício

### Work-Life Balance
- Expectativa de 40h/semana máximo
- Respeito a time off
- Não fazemos crunch sem bônus
- Semana de shutdown em dezembro

---

## 📈 Métricas que Importam

### Não Medimos
- ❌ Horas trabalhadas
- ❌ Linhas de código
- ❌ Número de commits
- ❌ Tempo em mesa

### Medimos
- ✅ Features entregues
- ✅ Qualidade do código
- ✅ Test coverage
- ✅ Satisfação do cliente
- ✅ Performance da aplicação
- ✅ Contribution ao time

---

## 🏥 Saúde e Segurança Mental

### Burnout Prevention
- Não romanticizamos crunch
- Monitorizamos workload
- Pedimos ajuda sem julgamento
- Férias são obrigatórias

### Support Disponível
- **EAP (Employee Assistance Program):** Acesso 24/7
- **Psicólogo corporativo:** 6 sessões/ano cobertas
- **Mental health days:** Sem questões feitas
- **Open door:** Tech Lead está sempre disponível

### Quando Falar
- Estou muito sobrecarregado
- Estou tendo problemas pessoais
- Estou com burnout/ansiedade
- Preciso de ajuda com algo

**Ninguém é julgado por falar.**

---

## 🔄 Feedback & Improvement

### Feedback Cycle
- **Monthly:** Check-ins 1-on-1
- **Quarterly:** Formal feedback
- **Annually:** Review e salary adjustment

### Giving Feedback
- **Soon:** Dar feedback logo, não esperar acumular
- **Specific:** Descrever exatamente o que viu
- **Constructive:** Focar em melhoria, não culpa
- **Private:** Crítica em privado, elogio público

### Receiving Feedback
- **Listen:** Sem defensivas
- **Clarify:** Se não entender, pergunte
- **Commit:** "Vou trabalhar nisso"
- **Follow-up:** Volte depois com progresso

### Retrospectives
- **Mensalmente:** O que foi bem, o que melhorar
- **Acionável:** Máximo 3 action items
- **Inclusive:** Voz de todos importa
- **Safe space:** Honestidade protegida

---

## 📞 Escalation & Conflicts

### Problema com Colega
1. Talk directly with them
2. Involve mentor/lead if unresolved
3. HR se for assédio/discriminação
4. Never gossip - fale direto

### Discordância Técnica
1. Discuss em code review ou meeting
2. Tech Lead faz call final
3. Uma vez decidido, everyone supports

### Underperformance
1. Feedback privado (não é surpresa)
2. Action plan criado juntos
3. Check-ins regulares
4. Support oferecido

---

## 📚 Recursos Úteis

### Interno
- [Squad Dashboard] - Métricas
- [Technical Docs] - Arquitetura
- [Runbook] - Troubleshooting
- [Code Guidelines] - Padrões
- [EAP] - Mental health support

### Externo
- [Dev.to] - Tech articles
- [CSS-Tricks] - Frontend
- [Node Best Practices] - Backend
- [OWASP] - Security

---

## ✅ Onboarding Checklist

Você recebeu este handbook e:
- [ ] Leu até o final
- [ ] Entendeu os valores
- [ ] Tem dúvidas? Perguntou ao mentor
- [ ] Concordo em seguir estas normas
- [ ] Assinei digitalmente (se necessário)

---

**Bem-vindo(a) à squad! 🚀**

Se tem perguntas sobre qualquer coisa neste handbook, pergunte ao Tech Lead ou seu mentor. Não há perguntas bobas.

---

**Última atualização:** 2026-02-04
**Próxima revisão:** 2026-08-04

