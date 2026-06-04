import { ProposalContent, BusinessCaseContent, PresentationContent } from "../types";

/**
 * Builds a robust self-contained HTML document for a Commercial Proposal.
 * Styled with Checklist Fácil branding, Sora font, and responsive layout.
 */
export function compileProposalHtml(content: ProposalContent): string {
  const scopeItems = content.productScope.map(
    item => `<li style="margin-bottom: 8px; font-weight: 300;"><strong style="color: #184B44; font-weight: 600;">${item}</strong></li>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposta Comercial - ${content.clientName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cf-verde: #00AC69;
      --cf-escuro: #184B44;
      --cf-verde-claro: #93EEAA;
      --cf-laranja: #FF7133;
      --cf-surface: #F1F2F7;
      --cf-branco: #FFFFFF;
      --cf-cinza-dk: #181A29;
    }
    body {
      font-family: 'Sora', sans-serif;
      background-color: var(--cf-surface);
      color: var(--cf-cinza-dk);
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--cf-branco);
      border-radius: 12px 12px 12px 2px;
      border: 1px solid #E2E8F8;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
      padding: 40px;
      box-sizing: border-box;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--cf-verde);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header h1 {
      color: var(--cf-escuro);
      font-size: 26px;
      margin: 0;
      font-weight: 700;
    }
    .header p {
      color: var(--cf-verde);
      font-size: 13px;
      margin: 6px 0 0 0;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .meta-info {
      text-align: right;
      font-size: 13px;
      color: #64748b;
      font-weight: 300;
    }
    .badge-client {
      background-color: var(--cf-surface);
      padding: 20px;
      border-radius: 12px 12px 12px 2px;
      margin-bottom: 32px;
    }
    .badge-client h3 {
      color: var(--cf-escuro);
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
    }
    .badge-client table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .badge-client td {
      padding: 5px 0;
    }
    .badge-client td.label {
      color: #64748b;
      width: 140px;
      font-weight: 300;
    }
    .badge-client td.value {
      color: var(--cf-cinza-dk);
      font-weight: 600;
    }
    .section-title {
      color: var(--cf-escuro);
      font-size: 18px;
      margin-top: 32px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .text-block {
      font-size: 14px;
      color: var(--cf-cinza-dk);
      font-weight: 300;
      text-align: justify;
      margin-top: 0;
      margin-bottom: 24px;
    }
    ul.scope-list {
      margin: 0 0 32px 0;
      padding-left: 20px;
      font-size: 14px;
    }
    .investment-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .investment-table th {
      background-color: var(--cf-escuro);
      color: var(--cf-branco);
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
    }
    .investment-table th.right {
      text-align: right;
    }
    .investment-table td {
      padding: 14px 16px;
      border-bottom: 1px solid #E2E8F8;
    }
    .investment-table tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    .investment-table td.value {
      text-align: right;
      font-weight: 600;
      color: var(--cf-escuro);
    }
    .callout {
      background-color: rgba(70, 157, 226, 0.08);
      border-left: 4px solid var(--cf-azul);
      padding: 20px;
      border-radius: 2px 12px 12px 2px;
      margin-bottom: 32px;
    }
    .callout h4 {
      margin: 0 0 8px 0;
      color: var(--cf-escuro);
      font-size: 14px;
      font-weight: 600;
    }
    .callout p {
      margin: 0;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.5;
      font-style: italic;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 48px;
      border-top: 1px solid #E2E8F8;
      padding-top: 32px;
    }
    .signature-block {
      width: 45%;
      text-align: center;
    }
    .signature-line {
      border-bottom: 1px solid #94a3b8;
      height: 48px;
      margin-bottom: 8px;
    }
    .signature-block p {
      margin: 0;
      font-size: 13px;
    }
    .signature-title {
      font-weight: 600;
      color: var(--cf-escuro);
    }
    .signature-role {
      color: #64748b;
      font-size: 11px;
      margin-top: 2px;
    }
    @media print {
      body {
        background-color: #FFFFFF;
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>PROPOSTA DE OPERAÇÃO DIGITAL</h1>
        <p>Checklist Fácil · Eficiência e Controle</p>
      </div>
      <div class="meta-info">
        <div>Nº Proposta: CF-PR-${Math.floor(1000 + Math.random() * 9000)}</div>
        <div style="margin-top: 4px;">Validade: 30 dias operacionais</div>
      </div>
    </div>

    <div class="badge-client">
      <h3>Preparado para:</h3>
      <table>
        <tr>
          <td class="label">Empresa Prospecto:</td>
          <td class="value">${content.clientName}</td>
        </tr>
        <tr>
          <td class="label">Decisor Principal:</td>
          <td class="value">${content.decisorName}</td>
        </tr>
        <tr>
          <td class="label">Segmento Focado:</td>
          <td class="value">${content.segment}</td>
        </tr>
      </table>
    </div>

    <div class="section-title">1. Diagnóstico e Cenário Atual</div>
    <p class="text-block">
      Através do alinhamento inicial com a equipe executiva da ${content.clientName}, identificamos um desafio vital focado em seu setor de ${content.segment}. As premissas destacam: <em>"${content.challengeSummary}"</em>. O principal objetivo da automação é fornecer rastreabilidade, padronizar auditorias em múltiplas frentes e otimizar tempo operacional de consolidação.
    </p>

    <div class="section-title">2. Escopo Checklist Fácil Recomendado</div>
    <ul class="scope-list">
      ${scopeItems}
    </ul>

    <div class="callout">
      <h4>Benefício Comercial Estratégico</h4>
      <p>${content.customCopywriting || "A implementação do Checklist Fácil proverá preenchimentos de relatórios em tempo real de forma totalmente digital e com suporte offline para operação no campo. Fluxos inteligentes de Planos de Ação se encarregam de alertar as lideranças de não-conformidades de forma imediata."}</p>
    </div>

    <div class="section-title">3. Detalhamento Comercial de Investimentos</div>
    <table class="investment-table">
      <thead>
        <tr>
          <th>Serviço / Licença</th>
          <th class="right">Investimento Recomendado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Serviço de Implantação e Treinamento Completo</strong><br>
            <span style="font-size: 11px; color:#64748b;">Cobrança única de setup, importação de checklist histórico e onboarding.</span>
          </td>
          <td class="value">R$ ${content.implementationFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>
            <strong>Licenciamento Mensal Recorrente (SaaS)</strong><br>
            <span style="font-size: 11px; color:#64748b;">Suporte contínuo, armazenamento em nuvem e painel de indicadores completo.</span>
          </td>
          <td class="value">R$ ${content.monthlyLicenseFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / mês</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size: 11px; color:#64748b; margin-top: 8px; font-weight: 300;">
      * O prazo estipulado padrão do contrato corresponde a ${content.contractTermMonths} meses de vigência.<br>
      * Reajuste anual pelo índice geral de preços.
    </p>

    <div class="signatures">
      <div class="signature-block">
        <div class="signature-line"></div>
        <p class="signature-title">Checklist Fácil</p>
        <p class="signature-role">Consultor de Soluções B2B</p>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <p class="signature-title">${content.clientName}</p>
        <p class="signature-role">${content.decisorName}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Builds a robust self-contained HTML document for a Business Case ROI.
 * Highly analytics oriented.
 */
export function compileBusinessCaseHtml(content: BusinessCaseContent): string {
  const totWastedHourYearly = content.workersCount * 52 * content.wasteHoursPerWeek;
  const financialWasteYearly = totWastedHourYearly * content.workerHourlyCost;
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estudo de ROI Checklist Fácil - ${content.clientName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cf-verde: #00AC69;
      --cf-escuro: #184B44;
      --cf-verde-claro: #93EEAA;
      --cf-laranja: #FF7133;
      --cf-surface: #F1F2F7;
      --cf-branco: #FFFFFF;
      --cf-cinza-dk: #181A29;
    }
    body {
      font-family: 'Sora', sans-serif;
      background-color: var(--cf-surface);
      color: var(--cf-cinza-dk);
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .case-card {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--cf-branco);
      border-radius: 12px 12px 12px 2px;
      border: 1px solid #E2E8F8;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
      padding: 40px;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--cf-laranja);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header h1 {
      color: var(--cf-escuro);
      font-size: 24px;
      margin: 0;
      font-weight: 700;
    }
    .header p {
      color: var(--cf-laranja);
      font-size: 13px;
      margin: 6px 0 0 0;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .grid-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-badge {
      background-color: var(--cf-surface);
      padding: 16px;
      border-radius: 12px 12px 12px 2px;
    }
    .stat-label {
      font-size: 11px;
      color: #64748b;
      display: block;
      text-transform: uppercase;
      font-weight: 400;
    }
    .stat-value {
      font-size: 18px;
      color: var(--cf-escuro);
      font-weight: 700;
      display: block;
      margin-top: 6px;
    }
    .roi-highlight {
      border: 1px solid var(--cf-verde-claro);
      background-color: rgba(147, 238, 170, 0.12);
      padding: 24px;
      border-radius: 12px 12px 12px 2px;
      margin-bottom: 32px;
    }
    .roi-title {
      font-size: 16px;
      color: var(--cf-escuro);
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    .roi-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .roi-factor {
      text-align: center;
    }
    .roi-factor-lbl {
      font-size: 11px;
      color: #64748b;
      display: block;
      text-transform: uppercase;
    }
    .roi-factor-val {
      font-size: 22px;
      color: var(--cf-verde);
      font-weight: 700;
      display: block;
      margin-top: 6px;
    }
    .roi-factor-val.warn {
      color: var(--cf-laranja);
    }
    .summary-text {
      font-size: 14px;
      line-height: 1.7;
      color: var(--cf-cinza-dk);
      font-weight: 300;
      text-align: justify;
      border-left: 3px solid var(--cf-verde);
      padding-left: 20px;
      margin-bottom: 32px;
    }
  </style>
</head>
<body>
  <div class="case-card">
    <div class="header">
      <div>
        <h1>ESTUDO DE VIABILIDADE FINANCEIRA (ROI)</h1>
        <p>Business Case Ativo · Checklist Fácil</p>
      </div>
      <div style="font-size: 12px; color: #64748b; font-weight: 300;">Dispositivo: Simulação de Retorno</div>
    </div>

    <div class="grid-stats">
      <div class="stat-badge">
        <span class="stat-label">Colaboradores Monitorados</span>
        <span class="stat-value">${content.workersCount} profissionais</span>
      </div>
      <div class="stat-badge">
        <span class="stat-label">Tempo Médio Perdido com Redigitação</span>
        <span class="stat-value">${content.wasteHoursPerWeek} horas / semana</span>
      </div>
      <div class="stat-badge">
        <span class="stat-label">Custo Médio de Hora</span>
        <span class="stat-value">R$ ${content.workerHourlyCost.toFixed(2)} / hora</span>
      </div>
      <div class="stat-badge">
        <span class="stat-label">Formulários em Papel Diários</span>
        <span class="stat-value">${content.paperFormsPerDay} folhas</span>
      </div>
    </div>

    <div class="roi-highlight">
      <div class="roi-title">Performance Financeira do Projeto</div>
      <div class="roi-metrics">
        <div class="roi-factor">
          <span class="roi-factor-lbl">Economia Potencial Mensal</span>
          <span class="roi-factor-val">R$ ${Math.round(content.calculatedEconomyMonthly).toLocaleString("pt-BR")}</span>
        </div>
        <div class="roi-factor" style="border-left: 1px solid #E2E8F8; border-right: 1px solid #E2E8F8;">
          <span class="roi-factor-lbl">Economia Potencial Anual</span>
          <span class="roi-factor-val">R$ ${Math.round(content.calculatedEconomyYearly).toLocaleString("pt-BR")}</span>
        </div>
        <div class="roi-factor">
          <span class="roi-factor-lbl">Payback Estimado</span>
          <span class="roi-factor-val warn">${content.calculatedPaybackMonths.toFixed(1)} Meses</span>
        </div>
      </div>
    </div>

    <h3 style="color: var(--cf-escuro); font-size: 16px; margin: 0 0 12px 0;">Justificativa Financeira Executiva</h3>
    <div class="summary-text">
      ${content.aiExecutiveSummary || "Considerando as horas gastas em relatórios físicos, a automação com a tecnologia Checklist Fácil neutraliza o tempo invisível de computação de auditorias. O retorno de capital investido é imediato."}
    </div>

    <h3 style="color: var(--cf-escuro); font-size: 15px; margin: 0 0 8px 0;">Impacto Ecológico Direto</h3>
    <p style="font-size: 13px; color: #64748b; font-weight: 300; margin: 0 0 32px 0;">
      A transição para auditorias 100% sem papel poupará aproximadamente de <strong>${Math.round(content.calculatedPaperSavedYearly).toLocaleString("pt-BR")} formulários analógicos por ano</strong> na operação de ${content.clientName}.
    </p>

    <div style="text-align: center; border-top: 1px solid #E2E8F8; padding-top: 20px; font-size: 11px; color: #64748b; font-weight: 300;">
      Simulação fundamentada de acordo com premissas fornecidas. Checklist Fácil, Líder em Checklist na América Latina.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Compiles a beautiful fully standalone active slide deck.
 * Embedded inside is an incredible vanilla JS slide navigator so the client or salesperson 
 * can open this file and flip through pages natively, offline! Zero emojis included.
 */
export function compilePresentationHtml(content: PresentationContent): string {
  const slidesJson = JSON.stringify(content.slides);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apresentação Comercial - ${content.clientName} - Checklist Fácil</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cf-verde: #00AC69;
      --cf-escuro: #184B44;
      --cf-verde-claro: #93EEAA;
      --cf-laranja: #FF7133;
      --cf-surface: #F1F2F7;
      --cf-branco: #FFFFFF;
      --cf-cinza-dk: #181A29;
    }
    body {
      font-family: 'Sora', sans-serif;
      margin: 0;
      padding: 0;
      background-color: ${content.themeStyle === "dark" ? "var(--cf-cinza-dk)" : content.themeStyle === "bold" ? "var(--cf-escuro)" : "var(--cf-surface)"};
      color: ${content.themeStyle === "dark" || content.themeStyle === "bold" ? "var(--cf-branco)" : "var(--cf-cinza-dk)"};
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .presentation-container {
      width: 90vw;
      height: 80vh;
      max-width: 1000px;
      max-height: 600px;
      background-color: ${content.themeStyle === "dark" ? "rgba(24,26,41,0.95)" : content.themeStyle === "bold" ? "var(--cf-escuro)" : "var(--cf-branco)"};
      border-radius: 20px 20px 20px 4px;
      border: 1px solid ${content.themeStyle === "bold" ? "var(--cf-verde)" : "var(--cf-surface)"};
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 40px;
    }
    .slide-stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .slide-watermark {
      position: absolute;
      right: -20px;
      bottom: -20px;
      font-size: 15rem;
      font-weight: 700;
      color: ${content.themeStyle === "bold" ? "rgba(147,238,170,0.05)" : "rgba(24,75,68,0.03)"};
      pointer-events: none;
      line-height: 1;
    }
    .slide-header {
      margin-bottom: 24px;
    }
    .slide-tag {
      color: var(--cf-verde);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 6px;
      display: block;
    }
    .slide-title {
      font-size: 30px;
      color: ${content.themeStyle === "standard" ? "var(--cf-escuro)" : "var(--cf-branco)"};
      font-weight: 700;
      margin: 0;
      line-height: 1.25;
    }
    .slide-subtitle {
      font-size: 15px;
      color: ${content.themeStyle === "standard" ? "#64748b" : "var(--cf-verde-claro)"};
      font-weight: 300;
      margin: 6px 0 0 0;
    }
    .bullet-list {
      margin: 24px 0 0 0;
      padding-left: 20px;
      list-style-type: none;
    }
    .bullet-item {
      font-size: 16px;
      margin-bottom: 12px;
      font-weight: 300;
      position: relative;
      line-height: 1.5;
    }
    .bullet-item::before {
      content: "";
      position: absolute;
      left: -20px;
      top: 8px;
      width: 8px;
      height: 8px;
      background-color: var(--cf-laranja);
      border-radius: 4px 4px 4px 1px;
    }
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      border-top: 1px solid ${content.themeStyle === "bold" ? "rgba(255,255,255,0.1)" : "#E2E8F8"};
      padding-top: 20px;
      z-index: 10;
    }
    .logo-text {
      font-size: 12px;
      color: var(--cf-verde);
      font-weight: 700;
      letter-spacing: 1px;
    }
    .btn-nav {
      background-color: ${content.themeStyle === "standard" ? "var(--cf-surface)" : "rgba(255,255,255,0.1)"};
      border: none;
      color: ${content.themeStyle === "standard" ? "var(--cf-escuro)" : "var(--cf-branco)"};
      padding: 8px 16px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Sora', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 8px 8px 8px 2px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-nav:hover {
      background-color: var(--cf-verde);
      color: var(--cf-branco);
    }
    .nav-indicator {
      font-size: 11px;
      color: #7c8ba1;
    }
  </style>
</head>
<body>
  <div class="presentation-container">
    <div class="slide-watermark">CF</div>
    
    <div id="slide-content" class="slide-stage">
      <!-- Injected Dynamically by JavaScript -->
    </div>

    <div class="nav-bar">
      <span class="logo-text">CHECKLIST FÁCIL | ${content.clientName}</span>
      <div style="display: flex; align-items: center; gap: 16px;">
        <button id="btn-prev" class="btn-nav">Anterior</button>
        <span id="slide-num" class="nav-indicator">1 / 5</span>
        <button id="btn-next" class="btn-nav">Próximo</button>
      </div>
    </div>
  </div>

  <script>
    const slides = ${slidesJson};
    let currentIdx = 0;

    const contentEl = document.getElementById("slide-content");
    const numEl = document.getElementById("slide-num");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    function renderSlide() {
      const slide = slides[currentIdx];
      
      // Fade out effect
      contentEl.style.opacity = 0;
      
      setTimeout(() => {
        let bulletsHtml = "";
        slide.bullets.forEach(b => {
          bulletsHtml += \`<li class="bullet-item">\${b}</li>\`;
        });

        contentEl.innerHTML = \`
          <div class="slide-header">
            <span class="slide-tag">CHECKLIST FÁCIL</span>
            <h2 class="slide-title">\${slide.title}</h2>
            \${slide.subtitle ? \`<h3 class="slide-subtitle">\${slide.subtitle}</h3>\` : ""}
          </div>
          <ul class="bullet-list">
            \${bulletsHtml}
          </ul>
        \`;
        
        numEl.innerText = \`\${currentIdx + 1} / \${slides.length}\`;
        
        // Disabled styling on extremes
        btnPrev.style.opacity = currentIdx === 0 ? "0.4" : "1";
        btnPrev.style.pointerEvents = currentIdx === 0 ? "none" : "auto";
        btnNext.style.opacity = currentIdx === slides.length - 1 ? "0.4" : "1";
        btnNext.style.pointerEvents = currentIdx === slides.length - 1 ? "none" : "auto";
        
        // Fade in
        contentEl.style.opacity = 1;
      }, 200);
    }

    btnPrev.addEventListener("click", () => {
      if (currentIdx > 0) {
        currentIdx--;
        renderSlide();
      }
    });

    btnNext.addEventListener("click", () => {
      if (currentIdx < slides.length - 1) {
        currentIdx++;
        renderSlide();
      }
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        if (currentIdx < slides.length - 1) {
          currentIdx++;
          renderSlide();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIdx > 0) {
          currentIdx--;
          renderSlide();
        }
      }
    });

    // Initial render
    renderSlide();
  </script>
</body>
</html>`;
}
