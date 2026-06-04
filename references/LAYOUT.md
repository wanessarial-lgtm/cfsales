# LAYOUT.md — Estrutura de página, grid, seções

Leia antes de montar qualquer layout. O cf-sales é uma **single-page app** com topbar fixo, navegação por abas e workspace central. É uma ferramenta — não um site marketing. A estrutura prioriza densidade de informação com clareza.

---

## 1. Shell da aplicação

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR  (fixo, h-14, bg #181A29)                   │
│  logo/status · · · · · · · · · · · nome + avatar    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HERO PANEL  (KPIs + identidade da workspace)       │
│                                                     │
├─────────────────────────────────────────────────────┤
│  TAB SELECTOR  (borda-bottom, sticky no scroll)     │
│  Contas | Propostas | ROI | Slides                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  WORKSPACE  (conteúdo da aba ativa)                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

```css
/* Container principal */
.app-container {
  width: 100%;
  max-width: 1280px; /* max-w-7xl */
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
}

/* Topbar */
.topbar {
  position: fixed; /* ou sticky — avaliar conforme uso */
  top: 0; left: 0; right: 0;
  height: 56px;
  background: var(--cf-dark);
  z-index: 30;
}

/* Workspace abaixo do topbar */
.workspace {
  padding-top: calc(56px + 24px); /* altura do topbar + breathing room */
}
```

---

## 2. Hero panel (dashboard de KPIs)

Dois blocos lado a lado no desktop, empilhados no mobile:
- **Esquerda:** identidade do workspace (eyebrow + título + subtítulo)
- **Direita:** grid 2×2 de KPI cards

```html
<section class="hero-panel cf-shape-lg bg-white shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6">
  <div class="workspace-identity">
    <span class="eyebrow-badge">Espaço de Trabalho · Checklist Fácil</span>
    <h1>Acelere Vendas Industriais B2B</h1>
    <p class="lede">…</p>
  </div>
  <div class="kpi-grid">
    <!-- 4 células: Leads, Materiais, Economia, Propostas -->
  </div>
</section>
```

KPI cards usam `cf-shape` + `--cf-surface` de fundo, com número em Sora 600 e label em eyebrow.

---

## 3. Tab selector

```css
.tab-selector {
  display: flex;
  border-bottom: 1px solid var(--cf-border);
  overflow-x: auto;
  gap: 4px;
  /* sticky abaixo do topbar */
  position: sticky;
  top: 56px;
  background: var(--cf-surface);
  z-index: 20;
}

.tab-btn {
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
  white-space: nowrap;
}

.tab-btn.is-active {
  color: var(--cf-verde-dk);
  border-bottom-color: var(--cf-verde-dk);
}
```

---

## 4. Workspace (área da aba ativa)

Cada aba tem sua própria estrutura interna, mas segue o padrão:

```
[ TOOLBAR:  filtros + botão de ação primária ]
[ LISTA / GRID de itens (cards empilhados ou grid) ]
[ PAINEL LATERAL ou MODAL para criar/editar ]
```

Grid de cards padrão:

```css
.card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* Lista densa (leads/contas) */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

---

## 5. Card anatomy

Todo card usa `cf-shape` + `bg-white` + `border border-cf-border` + shadow suave.

```
┌──────────────────────────────────────────┐
│  EYEBROW BADGE  ·  STATUS PILL           │
│                                          │
│  TÍTULO PRINCIPAL   (Sora 600, 16px)     │
│  Subtítulo/meta     (Sora 400, 13px)     │
│                                          │
│  CONTEÚDO (campos, stats, preview…)      │
│                                          │
│  ─────────────────────────────────────   │
│  [ Ação secundária ]    [ Ação primária ]│
└──────────────────────────────────────────┘
```

Eyebrow badge: `cf-shape-sm` + `--cf-verde-soft` + `--cf-verde-dk` text, uppercase 11px Sora 600.

---

## 6. Modais e painéis laterais

- Modal: centralizado, `max-w-2xl`, `cf-shape-lg`, backdrop `rgba(24,75,68,0.4)`.
- Painel lateral (drawer): `w-[480px]`, full height, slide da direita.
- Ambos: focus trap, fecha no Escape, scroll-lock no body.

---

## 7. Responsividade

Breakpoints (mobile-first):

| Breakpoint | px | O que muda |
|---|---|---|
| `sm` | 640px | Hero empilha (identity em cima, KPIs embaixo) |
| `md` | 768px | Hero lado a lado; tabs mostram rótulos completos |
| `lg` | 1024px | Grid de cards 2–3 colunas |
| `xl` | 1280px | Container no max (1280px) |

Mobile must-checks: tap targets ≥44px; eyebrows não somem; botões de ação sempre acessíveis pelo polegar; overflow-x no tab selector com snap.

---

## 8. Topbar anatomy

```
[ ● LED pulsante verde ]  [ "Gerador de Materiais Comerciais" ]    ·····    [ "Wanessa · Checklist Fácil" ]  [ Avatar W ]
```

- LED: verde `#00AC69`, `animate-ping` — indica app online/ativo
- Texto: Sora 600, 15px, branco
- Nome: Sora 600, 11px uppercase, `--cf-verde-lt` (`#93EEAA`)
- Avatar: círculo 32px, `--cf-dark-2`, borda `white/20`
