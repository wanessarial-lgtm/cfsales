# INTERACTIONS.md — Comportamentos e wiring

Leia antes de implementar qualquer comportamento. Interações no cf-sales são **rápidas, previsíveis e orientadas a tarefa** — a usuária quer gerar um material, não explorar uma interface. Cada interação deve confirmar ação, guiar o fluxo e nunca surpreender.

---

## 1. Helpers compartilhados

```js
// Calm flag — respeitar reduced-motion
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Focus trap (para modais e painéis)
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};
  const first = focusable[0], last = focusable[focusable.length - 1];
  const onKey = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}
```

---

## 2. Tab selector

Troca de aba com transição de fade no workspace. A aba ativa recebe `is-active` e `aria-selected="true"`.

```js
const tabs = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');

tabs.forEach(tab => tab.addEventListener('click', () => {
  const target = tab.dataset.tab;
  tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
  panels.forEach(p => {
    if (p.dataset.panel === target) { p.hidden = false; if (!calm()) p.classList.add('animate-fade-in-up'); }
    else p.hidden = true;
  });
}));
```

Suporta navegação por teclado (← → entre tabs com `role="tablist"`).

---

## 3. Modal de criação/edição

Abre centralizado com fade + scale-in suave. Fecha no Escape, clique no backdrop, ou botão de fechar.

```js
function openModal(modal) {
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  const release = trapFocus(modal);
  modal.querySelector('[data-close-modal], [autofocus]')?.focus();
  const close = () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    release();
    document.removeEventListener('keydown', onEsc);
  };
  const onEsc = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onEsc);
  modal.querySelector('[data-close-modal]')?.addEventListener('click', close);
  modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', close);
}
```

CSS:
```css
[data-modal]:not([hidden]) {
  display: flex; align-items: center; justify-content: center;
  position: fixed; inset: 0;
  background: rgba(24, 75, 68, 0.4);
  z-index: 50;
  animation: fadeInUp .3s var(--ease-out);
}
.modal-panel {
  border-radius: 20px 20px 20px 4px; /* cf-shape-lg */
  background: var(--cf-white);
  width: 100%; max-width: 640px;
  max-height: 90vh; overflow-y: auto;
  padding: 32px;
}
```

---

## 4. Formulários de geração (wizard)

Padrão para os geradores de proposta, ROI e slides: multi-step com barra de progresso.

```
[ Step indicator: 1 → 2 → 3 ]
[ Conteúdo do step atual      ]
[ Voltar ]           [ Próximo / Gerar ]
```

Princípios:
- Labels sempre visíveis (nunca só placeholder)
- Validação no blur e no submit — não a cada keystroke
- Mensagens de erro claras: "Informe o nome da empresa." (não "Campo obrigatório.")
- Campos obrigatórios marcados com `*` + `aria-required="true"`
- Erros: `aria-describedby` + `aria-invalid` + borda `--cf-laranja`
- Sucesso: feedback inline verde + botão de próxima ação

```css
.field-error { border-color: var(--cf-laranja); }
.error-msg   { color: var(--cf-laranja); font-size: 12px; margin-top: 4px; }
.field-ok    { border-color: var(--cf-verde); }
```

---

## 5. Estado de geração por IA (loading)

Quando a chamada Gemini está em andamento:

1. Botão "Gerar" desabilita + mostra spinner inline
2. Área de resultado exibe skeleton shimmer
3. Quando chega, conteúdo entra com `animate-fade-in-up`
4. Toast de confirmação: "Proposta gerada com sucesso."

```js
async function generateContent(btn, resultArea) {
  btn.disabled = true;
  btn.textContent = 'Gerando…';
  resultArea.innerHTML = '<div class="skeleton h-6 w-full mb-2"></div>...';
  try {
    const result = await callGemini(/* params */);
    resultArea.innerHTML = result;
    if (!calm()) resultArea.classList.add('animate-fade-in-up');
    showToast('Gerado com sucesso!', 'success');
  } catch (e) {
    showToast('Erro ao gerar. Tente novamente.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Gerar novamente';
  }
}
```

---

## 6. Toast notifications

Feedback rápido no canto superior direito. Auto-fecha em 3s. Empilha se múltiplos.

```js
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `cf-toast cf-toast--${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  document.querySelector('#toast-container').appendChild(toast);
  if (!calm()) toast.classList.add('animate-fade-in-up');
  setTimeout(() => toast.remove(), 3000);
}
```

```css
.cf-toast {
  padding: 10px 16px;
  border-radius: 8px 8px 8px 2px; /* cf-shape-sm */
  font-size: 13px; font-weight: 600;
  color: white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.cf-toast--success { background: var(--cf-verde-dk); }
.cf-toast--error   { background: var(--cf-laranja); }
.cf-toast--info    { background: var(--cf-azul); }
```

---

## 7. Ações destrutivas (delete)

Sempre confirmar antes de deletar — mas sem `window.confirm()` nativo. Usar um mini-modal de confirmação inline.

```
"Excluir esta proposta definitivamente?"
[ Cancelar ]   [ Excluir ]
```

Botão de excluir: vermelho suave, não o `--cf-laranja` do brand (reservar laranja para alerts, não destrutivo).

---

## 8. Scroll e ancoragem

```css
/* Garante que o topbar fixo não cubra âncoras */
section[id] { scroll-margin-top: 72px; }
```

Smooth scroll desabilitado em `prefers-reduced-motion`.
