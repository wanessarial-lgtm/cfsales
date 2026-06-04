# ANIMATIONS.md — Vocabulário de motion

Leia antes de adicionar qualquer animação. O motion no cf-sales é **funcional e discreto** — confirma ações, guia o olhar e dá feedback. Não é decorativo. Uma ferramenta B2B precisa de confiabilidade visual, não de espetáculo.

**Regra de ouro:** toda animação deve respeitar `prefers-reduced-motion: reduce`. Sem exceções.

---

## 0. Contrato de reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .reveal { opacity: 1; transform: none; }
}
```

Flag JS para checar em animações controladas por script:

```js
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 1. Tokens de easing e duração

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.3, 0.5, 1);
}
```

| Range | Uso |
|---|---|
| 100–180ms | Hover cor/borda |
| 200–300ms | Hover transform, press de botão |
| 300–450ms | Abertura de modal/painel, accordion |
| 400–600ms | Reveal de seção/card |

---

## 2. Reveal suave (padrão de entrada)

Cards e seções entram com fade + leve subida. IntersectionObserver, one-shot.

```css
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .5s var(--ease-out), transform .5s var(--ease-out);
}
.reveal.is-in { opacity: 1; transform: none; }
```

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.intersectionRatio > 0.1) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: [0, 0.1] });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

---

## 3. Stagger-in (grid de cards)

```css
.reveal[style*="--i"] { transition-delay: calc(var(--i) * 60ms); }
```

```html
<div class="cf-card reveal" style="--i:0">…</div>
<div class="cf-card reveal" style="--i:1">…</div>
```

Passo máximo: 60ms. Total da cascata: ≤400ms para 6+ cards.

---

## 4. Hover lift em cards

```css
.cf-card {
  transition: transform .2s var(--ease-out), box-shadow .2s var(--ease-inout);
}
.cf-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 172, 105, 0.12), 0 2px 8px rgba(0, 172, 105, 0.06);
}
```

Amplitude máxima: `translateY(-4px)`. Discreto — confirma interatividade sem chamar atenção.

---

## 5. Botão press

```css
.cf-btn {
  transition: transform .2s var(--ease-bounce), box-shadow .2s var(--ease-inout);
}
.cf-btn:hover  { transform: translateY(-1px) scale(1.02); }
.cf-btn:active { transform: scale(.97); }
```

---

## 6. Count-up (stats do dashboard)

Números do KPI sobem ao entrar na viewport. Uma vez, sem loop.

```js
function countUp(el) {
  if (calm()) { el.textContent = el.dataset.count; return; }
  const target = parseInt(el.dataset.count, 10);
  const dur = 900; const t0 = performance.now();
  const prefix = el.textContent.trim().startsWith('+') ? '+' : '';
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
```

---

## 7. Fade-in para geração de conteúdo (IA)

Quando conteúdo é gerado via API Gemini, entra com fade simples — comunica "chegou".

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s var(--ease-out) forwards;
}
```

---

## 8. Loading skeleton

Para estados de carregamento — nunca spinner girando de forma agressiva.

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--cf-surface-2) 25%, var(--cf-white) 50%, var(--cf-surface-2) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
```

---

## 9. O que NÃO fazer

| Não | Por que | Em vez disso |
|---|---|---|
| Animações longas (>600ms) em interações | Ferramenta de trabalho deve ser rápida | ≤300ms para state changes |
| Loops infinitos em elementos de UI | Distrai durante uso | Somente em estados de carregamento, com fim definido |
| Parallax | Desorientador, desnecessário em app interno | Revela estáticos com fade |
| Bounce exagerado (`cubic-bezier overshoot >1.4`) | Parece brinquedo | Overshoot sutil no `--ease-bounce` |
| Animação sem fallback reduced-motion | Exclui usuários sensíveis | Sempre o contrato do §0 |
