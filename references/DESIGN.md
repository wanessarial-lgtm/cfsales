# DESIGN.md — Tokens, paleta, tipografia, voz

Leia antes de escrever qualquer CSS ou escolher cor, tamanho ou token.

**Diretriz central: interface clara, dados em destaque, verde como âncora.**
O canvas é claro (`#F1F2F7`). O verde entra nos cards, badges, botões e acentos. O topbar escuro (`#181A29`) é o único elemento dark permanente.

---

## 1. Brand DNA

**Checklist Fácil** é uma plataforma de produtividade para gestão de processos. O `cf-sales` é uma ferramenta interna de inteligência comercial B2B — gera propostas, estudos de ROI e apresentações em slides HTML para vendas industriais.

| Tensão | Resolução |
|---|---|
| Profissional vs. acessível | Dados densos entregues com hierarquia clara, espaçamento generoso e linguagem direta |
| Moderno vs. funcional | Interface limpa, sem ruído decorativo — cada elemento existe por uma razão |
| Marca vs. ferramenta | Verde Checklist em acentos e CTAs; o restante é neutro e legível |

A forma-assinatura da marca é o **canto assimétrico**: `border-radius: 12px 12px 12px 2px`. O canto inferior esquerdo reto é o traço mais reconhecível da identidade visual — use em cards, botões e painéis.

---

## 2. Sistema de cores

Todas as cores vivem como tokens CSS. **Nunca use hex direto nos componentes.**

### Paleta principal

| Token | Hex | RGB | Papel |
|---|---|---|---|
| `--cf-verde` | `#00AC69` | 0,172,105 | Primário — crescimento, confiança, ação |
| `--cf-verde-dk` | `#184B44` | 24,75,68 | Âncora escura — autoridade, topbar, textos de destaque |
| `--cf-verde-lt` | `#93EEAA` | 147,238,170 | Success states, fills suaves, badges positivos |
| `--cf-laranja` | `#FF7133` | 255,113,51 | Alerta, CTAs secundários, atenção |
| `--cf-laranja-lt` | `#F8AA6C` | 248,170,108 | Fills suaves laranja |
| `--cf-azul` | `#469DE2` | 70,157,226 | Info, links, badges neutros |

### Superfícies e tinta

| Token | Hex | Uso |
|---|---|---|
| `--cf-surface` | `#F1F2F7` | Fundo padrão da aplicação |
| `--cf-surface-2` | `#E8E9F0` | Cards aninhados, inputs, áreas recuadas |
| `--cf-white` | `#FFFFFF` | Cards principais, modais, painéis |
| `--cf-dark` | `#181A29` | Topbar, textos de máximo contraste |
| `--cf-dark-2` | `#2B2F4B` | Textos secundários escuros, ícones |
| `--cf-ink` | `#1E2235` | Corpo de texto padrão — nunca `#000` puro |
| `--cf-ink-muted` | `#5A6073` | Textos secundários, labels, meta |
| `--cf-ink-soft` | `#9299B0` | Placeholders, desabilitados |
| `--cf-border` | `rgba(24,75,68,0.10)` | Bordas de cards e inputs |

### Tints para fills (derivados)

| Token | Valor | Uso |
|---|---|---|
| `--cf-verde-soft` | `#E6F9F1` | Card background, badge suave verde |
| `--cf-laranja-soft` | `#FFF0E8` | Card background, badge alerta |
| `--cf-azul-soft` | `#EAF4FC` | Card background, badge info |

### Gradiente da marca

```css
:root {
  --cf-grad-marca: linear-gradient(135deg, #184B44 0%, #00AC69 60%, #93EEAA 100%);
  --cf-grad-cta:   linear-gradient(135deg, #00AC69 0%, #184B44 100%);
}
```

---

## 3. Tipografia

### Família tipográfica

| Família | Papel | Fonte | Pesos |
|---|---|---|---|
| **Sora** | Tudo — display, corpo, UI, labels | Google Fonts | 300, 400, 600 |

Sora é a única família do projeto. Diferencia-se pelo peso e tamanho:
- Display: Sora 600 em tamanhos grandes
- Corpo: Sora 400 em 15–16px
- Labels/eyebrows: Sora 600 em 11–13px uppercase

### Carregamento

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-sans: "Sora", ui-sans-serif, system-ui, sans-serif;
}
```

### Escala tipográfica

| Uso | Tamanho | Peso | Letter-spacing |
|---|---|---|---|
| Título de página / hero | `clamp(22px, 2.5vw, 32px)` | 600 | `-0.02em` |
| Título de seção (H2) | `clamp(18px, 2vw, 24px)` | 600 | `-0.01em` |
| Título de card (H3) | `16–18px` | 600 | `-0.01em` |
| Corpo principal | `15–16px` | 400 | normal |
| Label / eyebrow | `11–13px` | 600 | `0.08em` |
| Meta / caption | `12–13px` | 400 | normal |
| Botão | `13–14px` | 600 | `0.02em` |
| Stat / número grande | `clamp(22px, 3vw, 36px)` | 600 | `-0.02em` |

Line-height: corpo `1.6`, títulos `1.2`, labels `1.0`.

---

## 4. A forma-assinatura Checklist Fácil

```css
.cf-shape    { border-radius: 12px 12px 12px 2px; }  /* card padrão */
.cf-shape-lg { border-radius: 20px 20px 20px 4px; }  /* painel/modal grande */
.cf-shape-sm { border-radius: 8px 8px 8px 2px; }     /* badge/chip pequeno */
.cf-pill     { border-radius: 999px; }                /* tags, status pills */
```

**Regra:** todo card principal usa `cf-shape`. Botões usam `cf-pill` ou `cf-shape-sm`. Nunca canto `0px` reto em todos os lados.

---

## 5. Espaçamento

| Step | Valor | Uso |
|---|---|---|
| xs | 4–6px | Gap interno de chips, ícone+label |
| sm | 8–12px | Padding interno de badges, espaço entre campos |
| md | 16–20px | Padding de cards, gap entre componentes |
| lg | 24–32px | Padding de seções, gap entre cards |
| xl | 48–64px | Separação entre blocos maiores |

---

## 6. Sombras

```css
/* Card padrão */
box-shadow: 0 2px 8px rgba(24, 75, 68, 0.06),
            0 1px 3px rgba(24, 75, 68, 0.04);

/* Card hover */
box-shadow: 0 8px 24px rgba(0, 172, 105, 0.12),
            0 2px 8px rgba(0, 172, 105, 0.06);

/* CTA / botão primário glow */
box-shadow: 0 4px 16px rgba(0, 172, 105, 0.30);
```

Nunca `rgba(0,0,0, >0.15)` — sombra preta pura é pesada e off-brand.

---

## 7. Motion tokens

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* reveal, entrada */
  --ease-inout:  cubic-bezier(0.4, 0, 0.2, 1);    /* hover, transições */
  --ease-bounce: cubic-bezier(0.34, 1.3, 0.5, 1); /* botões, chips */
}
```

| Range | Uso |
|---|---|
| 100–180ms | Hover color/borda |
| 200–300ms | Hover transform, button press |
| 300–450ms | Abertura de modal, expansão de painel |
| 400–600ms | Reveal de seção |

---

## 8. Voz e copy

| Propriedade | Regra |
|---|---|
| Língua | Português (pt-BR), direto e profissional |
| Tom | Claro, eficiente, confiante. Sem jargão excessivo, sem frieza corporativa. |
| Pronome | "Você" para a usuária; "nós" para a empresa |
| Labels | Curtos e verbais: "Gerar proposta", "Novo lead", "Exportar slides" |
| Estados vazios | Acolhedores: "Nenhuma proposta ainda. Crie a primeira abaixo." |
| Erros | Claros e acionáveis: "Preencha o nome da empresa antes de continuar." |
| Confirmações | Breves: "Proposta salva." "ROI calculado com sucesso." |

---

## 9. Anti-padrões a evitar

| Anti-padrão | Por que quebra a marca | Em vez disso |
|---|---|---|
| Verde em texto sobre branco (`#00AC69` em corpo) | Contraste insuficiente (≈2.8:1) | Use `--cf-verde-dk` `#184B44` para textos verdes |
| Cantos completamente arredondados em cards principais | Perde a forma-assinatura | `cf-shape` em cards, `cf-pill` apenas em botões/tags |
| Dark mode completo | Fora do tema definido (surface é claro) | Topbar escuro + cards brancos + surface cinza claro |
| Muitas cores em uma seção | Ruído visual em ferramenta de dados | Um acento de cor por card/seção |
| Fonte diferente de Sora | Inconsistência de marca | Só Sora, variando peso e tamanho |
| Emoji em labels de UI | Amadorismo em ferramenta B2B | Ícones Lucide (outline 2px, round caps) |
