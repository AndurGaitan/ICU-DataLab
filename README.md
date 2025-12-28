# 🧠 ICU DataLab
**Real-time ICU Monitoring Dashboard + Bioengineering HL7 Integration Project**

ICU DataLab es un dashboard de monitoreo multiparamétrico para UCI.  
Nace como frontend con datos simulados / MIMIC-IV replay, pero forma parte de un proyecto de investigación bioingenieril cuyo objetivo es **interconectar monitores multiparamétricos reales mediante HL7** para alimentar la plataforma en tiempo casi real.

---

## 🚀 Features (Frontend)

- Vista multipaciente con cards por paciente (incluye **ubicación de cama/sector**)
- Clasificación de riesgo (low / medium / high)
- Signos vitales: HR · RR · SpO₂ · MAP · Temp · EtCO₂
- Vista detallada por paciente:
  - snapshot por sistemas (resp / hemo / metabólico)
  - gráficos multiparámetro + tendencias
- Diseño responsive (desktop / mobile)
- Arquitectura preparada para múltiples fuentes de datos:
  - `mock`
  - `mimic_replay`
  - `future_live_hl7`

> 🟡 Estado: demo funcional orientada a investigación — no para uso clínico asistencial.

---

## 🧩 Arquitectura (Frontend)

- React + TypeScript + Vite  
- Tailwind CSS + Recharts  
- Data layer desacoplada (`repository + hooks`)  
- Modelo `Patient` como dominio de frontend

El dashboard es **agnóstico a la fuente de datos** y puede recibir:
- datos simulados
- datasets históricos (MIMIC-IV)
- flujos en vivo a futuro

---

## 🔬 Bioengineering Research Goal

Este proyecto explora una hipótesis de integración biomédica:

> Es posible interconectar monitores multiparamétricos de distintas marcas mediante un **gateway de dispositivos + servidor de integración HL7 (ORU^R01)**, estandarizar las señales fisiológicas y disponibilizarlas vía API/WebSocket para alimentar ICU DataLab en tiempo casi real, manteniendo trazabilidad, independencia de proveedor y soporte para investigación en UCI.

---

## 🏗️ Integración propuesta (visión por capas)

**Capa 0 — Monitor**  
Protocolo nativo / serial / Ethernet

**Capa 1 — Device Gateway (Edge)**  
Adquisición → normalización → empaquetado HL7 → envío MLLP

**Capa 2 — Servidor de Integración HL7**  
(Mirth u otro motor) → validación · mapping paciente-cama · persistencia

**Capa 3 — API para ICU DataLab**  
HL7 → JSON → endpoints para snapshot + tendencias

**Capa 4 — Frontend (este repo)**  
Visualización multipaciente + trends + riesgo

> El frontend **no consume HL7 directamente** — recibe JSON estructurado.

---

## 🧭 Roadmap

- [ ] MIMIC-IV replay mode (datos reales históricos)
- [ ] Prototipo HL7 con 1 monitor real + gateway
- [ ] Escalado multipaciente
- [ ] Integración de analítica / ML exploratorio

---

## 🏥 Impacto esperado

- Acceso abierto a señales fisiológicas en UCI  
- Plataforma para investigación e interoperabilidad  
- Base para futuros desarrollos clínicos e IA aplicada

---

## ⚠️ Disclaimer

Proyecto con fines **académicos y de investigación**.  
No apto para uso clínico sin validación y certificación.

---

## 🤝 Colaboración

Interdisciplinario: bioingeniería, UCI, ingeniería de software, datos clínicos.  
Contribuciones y colaboración científica son bienvenidas.

---
