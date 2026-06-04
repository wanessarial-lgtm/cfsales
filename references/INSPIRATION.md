# INSPIRATION.md — Biblioteca criativa

Leia ao idechar uma nova feature ou quando estiver em dúvida sobre a abordagem visual. Mapeia direções criativas para o vocabulário Checklist Fácil: eficiente, confiável, verde, limpo.

---

## North-star references (a vibe certa)

- **Ferramentas B2B SaaS limpas** (Linear, Notion, Retool) — hierarquia clara, tipografia funcional, dados densos mas legíveis. O cf-sales deve ter essa sensação de "ferramenta que respeita seu tempo".
- **Dashboards de analytics** (Metabase, Amplitude) — KPI cards, grids de dados, estados vazios bem desenhados. Estudo para a aba de Leads e o painel de estatísticas.
- **Geradores de documento** (Pitch.com, Beautiful.ai) — fluxo wizard com preview em tempo real. Referência para a geração de propostas e slides.
- **Verde como âncora de marca** (Nubank não — mas Wise, Robinhood) — um verde forte como cor de ação, sobre surfaces neutras, sem sobrecarregar.

## Anti-references (evitar)

- Dark SaaS "premium" — glassmorphism sobre preto, gradientes cósmicos, neon. Esse é o mundo oposto ao cf-sales (claro, verde, funcional).
- Dashboards corporativos genéricos — azul `#0052CC` Atlassian, tabelas infinitas sem hierarquia, ícones flat anos 2015.
- "Startup landing page" — animações excessivas, hero com vídeo autoplay, copy inflado. O cf-sales é uma ferramenta, não um produto de marketing.
- Verde musgo ou verde oliva — o verde Checklist é `#00AC69`, vibrante e moderno. Tons terrosos fogem da identidade.

---

## Mapa de direções

| O trabalho | Direção | Tradução Checklist Fácil |
|---|---|---|
| KPI card parece vazio | Número grande em Sora 600 + label eyebrow + ícone Lucide + verde accent na borda ou badge | DESIGN § Stat cell; cor `--cf-verde` no número |
| Lista de leads parece tabela bruta | Cards empilhados com eyebrow (empresa), título (nome), badges de status e quick actions | LAYOUT § Card anatomy; `cf-shape` |
| Botão de geração precisa de peso | Full-width ou large, `cf-grad-cta`, Sora 600, LED indicator de loading | INTERACTIONS § Estado de geração |
| Separação entre seções parece solta | Divisor sutil: `1px solid var(--cf-border)` ou mudança de `--cf-surface` → `--cf-white` | LAYOUT § Workspace |
| Preview de proposta/slides parece básico | Container com `cf-shape-lg` + shadow elevada + marca d'água Checklist no canto | COMPONENTS (a ser criado) |
| Empty state desmotiva | Ilustração vetorial simples (checkmark ou documento em verde) + copy acolhedor + CTA | INTERACTIONS § Estados vazios |
| Formulário de muitos campos | Wizard em steps com indicador de progresso + validação gentil | INTERACTIONS § Formulários |

---

## Motifs únicos da Checklist Fácil

- **A forma assimétrica** — `border-radius: 12px 12px 12px 2px`. O canto inferior esquerdo reto é a impressão digital da marca. Use em cards, botões, badges, modais. Nunca canto 100% reto ou 100% arredondado nos elementos principais.
- **O LED verde pulsante** — o `animate-ping` no topbar comunica "sistema ativo". Use com parcimônia em outros contextos (ex: badge de status online de um lead).
- **Verde como sinalização de valor** — sempre que um dado representa crescimento, economia ou sucesso, use `--cf-verde`. Reservar laranja para alertas, nunca para coisas positivas.
- **O padrão de fundo** — o `bg-pattern-light` (formas em `#184B44` a 4% de opacidade) é o wallpaper da marca no hero panel. Use com parcimônia — só no hero/painel de identidade, não em todo card.
- **Topbar escura como âncora** — o contraste do topbar `#181A29` contra a surface clara `#F1F2F7` cria um "teto" visual que ancora toda a interface. Não remova ou aclare.

---

## Gut-check antes de qualquer componente novo

1. A surface é clara e os dados são legíveis?
2. O verde está sendo usado como acento, não como fundo de tudo?
3. A forma assimétrica (`cf-shape`) está presente nos cards?
4. O componente parece parte de uma ferramenta de trabalho, não de um site marketing?
5. A Wanessa consegue completar a tarefa em ≤3 cliques?

Se todos forem sim, está no caminho certo. Se algum for não, ajuste antes de continuar.
