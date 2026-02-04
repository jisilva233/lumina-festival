# 📊 RACI Matrix - Web Development Squad

**Responsible** = Responsável por executar
**Accountable** = Autoridade final
**Consulted** = Opinião solicitada
**Informed** = Mantido informado

---

## Principais Atividades

| Atividade | Tech Lead | Sr Frontend | Mid Frontend | Sr Backend | Mid Backend | Designer | QA | DevOps |
|-----------|-----------|------------|------------|-----------|-----------|----------|-----|--------|
| **Arquitetura & Design** | **A/R** | C | I | C | I | C | I | C |
| Feature Planning | **A** | R | C | R | I | R | C | I |
| Design Mockups | I | C | C | **A/R** | I | I | C | I |
| Backend Development | C | I | I | **A/R** | R | I | C | C |
| Frontend Development | C | **A/R** | R | I | I | C | C | I |
| Database Design | C | I | I | **A/R** | C | I | I | C |
| API Design | **A** | C | I | **R** | R | I | I | I |
| Code Review | **A/R** | R | C | R | C | C | C | I |
| Testes Unitários | C | R | R | R | R | I | C | I |
| Testes E2E | I | C | C | I | I | C | **A/R** | I |
| Performance Testing | C | R | I | R | I | I | **A** | C |
| Security Review | **A/R** | C | I | C | I | I | C | **R** |
| Deploy em Staging | C | I | I | I | I | I | C | **A/R** |
| Deploy em Produção | **A** | I | I | I | I | I | C | **R** |
| Monitoramento | C | I | I | C | I | I | C | **A/R** |
| Documentation | **A** | R | R | R | R | R | C | C |
| CI/CD Pipeline | **C** | I | I | I | I | I | I | **A/R** |
| Onboarding | **A/R** | C | I | C | I | I | I | C |
| Knowledge Sharing | **A/R** | R | R | R | R | C | C | C |
| Sprint Planning | **A/R** | R | R | R | R | R | R | I |
| Sprint Review | **A/R** | R | R | R | R | R | R | I |
| Retrospective | **A/R** | R | R | R | R | R | R | I |
| Cliente Communication | **A** | C | I | I | I | R | I | I |
| Reporting & Metrics | **A** | C | I | C | I | I | C | C |

---

## Decisões por Papel

### Tech Lead
- **Arquitetura técnica dos projetos**
- **Stack technology decisions**
- **Code quality standards**
- **Security policies**
- **Production deployments** (aprovação final)
- **Mentoria e desenvolvimento do time**

### Senior Frontend
- **Frontend architecture**
- **Component design patterns**
- **Performance optimization strategies**
- **Testing approach**
- **Accessibility standards**

### Senior Backend
- **Backend architecture**
- **Database design**
- **API design & documentation**
- **Scalability approach**
- **Security implementation**

### UI/UX Designer
- **Visual design decisions**
- **User experience approach**
- **Design system guidelines**
- **Usability testing strategy**

### QA Engineer
- **Test strategy & planning**
- **Testing tools selection**
- **Quality gates**
- **Bug severity classification**

### DevOps Engineer
- **Infrastructure decisions**
- **CI/CD pipeline configuration**
- **Deployment strategy**
- **Monitoring & alerting setup**

---

## Escalation Path

```
Issue/Decision
    ↓
Directly Responsible (Role)
    ↓
[If unresolved in 2 days]
    ↓
Tech Lead / Squad Lead
    ↓
[If unresolved in 5 days]
    ↓
Product Owner / Manager
    ↓
[If unresolved in 10 days]
    ↓
Director / C-Level
```

---

## Approval Requirements

| Decision | Approval Needed |
|----------|-----------------|
| Feature acceptance | Client + Product Owner |
| Architecture change | Tech Lead + Senior roles |
| Code to production | Tech Lead + Code reviewer |
| Security changes | Tech Lead + DevOps |
| Performance changes | Tech Lead + Sr Frontend/Backend |
| API design | Tech Lead + Sr Backend |
| Design system changes | Designer + Tech Lead |
| Infrastructure changes | DevOps + Tech Lead |
| Timeline/scope changes | Project Manager + Tech Lead |

---

