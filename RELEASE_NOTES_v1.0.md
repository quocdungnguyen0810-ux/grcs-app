# RELEASE NOTES — v1.0-locked

**Version**: 1.0.0  
**Codename**: grcs-baseline  
**Date**: 2026-04-02  
**Status**: 🔒 LOCKED — Do not modify without creating a new version branch  

## Features

### Core Tabs (10)
1. **Tổng quan** (Overview) — Thesis hero, objectives, scope, contributions, research flow
2. **Mô hình** (Model) — Interactive SVG model with layer toggles + cross-section view
3. **Thông số** (Parameters) — Soil, column, geogrid properties; spacing configs; scale table
4. **Quy trình** (Procedure) — 12-step experimental procedure with illustrations
5. **Thí nghiệm** (Experiment) — Scenario runner with playback controls & live charts
6. **Biểu đồ** (Charts) — 10 chart types covering all experimental + numerical results
7. **So sánh** (Comparison) — Multi-scenario comparison with auto-generated insights
8. **Cơ chế** (Mechanism) — 6 scientific mechanisms with SVG illustrations
9. **Dữ liệu** (Data) — Full data tables + JSON/CSV export
10. **Kết luận** (Insights) — Key findings, proposed formulas, application example

### Data Coverage
- Single column results: 6 scenarios (3 IL × 2 geogrid conditions)
- Group column results: 3 spacing ratios (s/D = 2.5, 3.0, 3.5)
- Numerical analysis: n vs Ec, Es, J, s/D
- 7 pressure levels: 18–120 kPa
- 12 experimental procedure steps

### Technical Stack
- Vite 8 + React 19 + TypeScript 5.9
- Tailwind CSS v4 (via @tailwindcss/vite)
- Recharts 3.8 for data visualization
- Framer Motion 12 for animations
- Zustand 5 for state management
- Lucide React for icons

### Modes
- Lab Mode — Technical detail focus
- Defense Mode — Presentation-ready
- Presentation Mode — Large format

## Known Limitations (v1.0)
- No Chapter 1/2/4 thesis content beyond overview
- Placeholder-level overview (no research gaps, background)
- No physical model construction module
- No dynamic experiment animation
- Generic dark theme (not UTC-branded)
- No figure gallery
- No storyline navigation
