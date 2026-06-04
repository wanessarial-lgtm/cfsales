---
name: cf-sales-design
description: Design system para o cf-sales — ferramenta interna de inteligência comercial B2B da Checklist Fácil. Ative sempre que for construir ou modificar UI, componentes, cores, tipografia, animações ou copy dentro do projeto cf-sales. Fornece os tokens exatos da marca (verde #00AC69 / verde-escuro #184B44 / laranja #FF7133 sobre surface clara #F1F2F7), a tipografia Sora, a forma-assinatura assimétrica (border-radius: 12px 12px 12px 2px), os padrões de card/modal/wizard/toast, e as regras que mantêm a interface lendo como uma ferramenta B2B profissional e confiável — nunca dark SaaS genérico, nunca site marketing. Leia references/DESIGN.md antes de qualquer CSS, references/LAYOUT.md para estrutura de página, references/COMPONENTS.md para anatomia de componentes, references/ANIMATIONS.md para motion, references/INTERACTIONS.md para comportamentos, e references/INSPIRATION.md para direção criativa.
---

# cf-sales Design System — Checklist Fácil

Você está construindo o **cf-sales**, ferramenta interna de inteligência comercial B2B para a **Wanessa** na **Checklist Fácil**. A ferramenta gera propostas comerciais, estudos de ROI e apresentações em slides HTML para vendas industriais. A interface deve sentir como uma **ferramenta de trabalho séria** — rápida, clara, confiável — com a identidade visual verde da Checklist Fácil como âncora.

## A instrução mais importante

**A interface é clara.** Surface `#F1F2F7`, cards brancos, topbar escuro. O verde `#00AC69` está nos acentos — botões, badges, stats, CTAs. Nunca flood verde em backgrounds. O canto inferior esquerdo dos cards é **sempre reto** (a forma-assinatura `12px 12px 12px 2px`).

## Brand DNA em um parágrafo

Checklist Fácil é uma plataforma de gestão de processos B2B. O cf-sales é o espaço de trabalho da Wanessa para fechar vendas industriais: ela cadastra leads, gera propostas com IA, simula ROI financeiro e exporta apresentações. A identidade é verde-moderna, tipografia geométrica (Sora), superfícies claras com o topbar escuro como âncora, e a forma assimétrica como impressão digital da marca.

## Como este skill está organizado

| Arquivo | Quando ler |
|---|---|
| `references/DESIGN.md` | Antes de escrever CSS ou escolher cor, token, tamanho. Paleta completa, tipografia Sora, forma-assinatura, shadows, voz. |
| `references/LAYOUT.md` | Antes de montar qualquer layout. Shell da app, hero panel, tab selector, grids de cards, responsividade. |
| `references/ANIMATIONS.md` | Antes de adicionar motion. Reveal, stagger, hover lift, count-up, skeleton, fade de geração IA. |
| `references/INTERACTIONS.md` | Antes de implementar comportamento. Tab switching, modais, formulários wizard, geração IA, toasts, delete confirm. |
| `references/INSPIRATION.md` | Ao idechar feature nova ou ao sentir que algo está off. North-stars, anti-refs, motifs da marca, gut-check. |

## Os dez mandamentos do cf-sales

1. **Surface clara, verde nos acentos.** Fundo `#F1F2F7`, cards `#ffffff`. Verde entra em botões, badges, stats e bordas de destaque — nunca como fundo de seção inteira.
2. **Tinta quente, nunca preta pura.** Texto principal é `--cf-ink: #1E2235`. Nunca `#000`. Textos secundários em `--cf-ink-muted: #5A6073`.
3. **A forma assimétrica é obrigatória em cards.** `border-radius: 12px 12px 12px 2px` é a identidade visual da marca. Todo card, painel e modal usa `cf-shape` ou `cf-shape-lg`.
4. **Sora para tudo.** Única família tipográfica. Display em Sora 600 tamanho grande; corpo em Sora 400 15–16px; labels em Sora 600 11–13px uppercase.
5. **Verde `#00AC69` não é texto em branco.** Contraste insuficiente (~2.8:1). Para texto verde, use `--cf-verde-dk: #184B44`. Verde `#00AC69` fica em fills, botões, badges.
6. **Motion discreto e funcional.** Reveal suave, hover lift `translateY(-3px)`, fade na geração de IA. Sem loops infinitos em UI, sem animações longas em interações. Sempre `prefers-reduced-motion`.
7. **Topbar escura é permanente.** O `#181A29` cria o "teto" que ancora a interface. Não remova, não aclare, não adicione elementos que concorram com ele.
8. **Ícones Lucide, outline 2px, round caps.** `stroke-linecap: round; stroke-linejoin: round`. Tamanho padrão 16px na UI, 20px em títulos de card.
9. **Copy direto e orientado a ação.** Labels verbais ("Gerar proposta"), toasts concisos ("Proposta salva."), erros acionáveis ("Informe o CNPJ antes de continuar.").
10. **Cada feature em ≤3 cliques.** Ferramenta de trabalho: o caminho feliz deve ser óbvio e rápido. Sem menus escondidos para ações primárias.

## Onde o sistema vive (ground truth)

- [`src/index.css`](../src/index.css) — tokens de cor e tipografia no `@theme` do Tailwind, forma-assinatura, padrão de fundo, animações base
- [`src/App.tsx`](../src/App.tsx) — shell da aplicação, topbar, hero panel, tab selector
- [`src/components/AccountTab.tsx`](../src/components/AccountTab.tsx) — padrão de card de lead/conta
- [`src/components/ProposalTab.tsx`](../src/components/ProposalTab.tsx) — wizard de geração de proposta
- [`src/components/BusinessCaseTab.tsx`](../src/components/BusinessCaseTab.tsx) — simulação de ROI
- [`src/components/PresentationTab.tsx`](../src/components/PresentationTab.tsx) — gerador de slides HTML

Quando o usuário pedir algo novo, **primeiro leia o componente mais próximo** e estenda o padrão existente. Não invente novos sistemas de cor, nova tipografia ou novos padrões de borda.
