import { CommercialAccount, Material } from "../types";

export const INITIAL_ACCOUNTS: CommercialAccount[] = [
  {
    id: "acc-1",
    name: "Alimentos Sul S.A.",
    sector: "Qualidade",
    porte: "Enterprise",
    decisor: "Eduardo Santini",
    cargo: "Diretor de Operações e Qualidade",
    email: "eduardo.santini@alimentossul.com.br",
    whatsapp: "51998887766",
    challenges: "Uso massivo de papel nas auditorias de higiene interna, atraso de ate dez dias para consolidar planilhas Excel e falta de padronizacao entre as tres plantas industriais.",
    createdAt: "2026-05-15"
  },
  {
    id: "acc-2",
    name: "Transportes Rapido Carga",
    sector: "Logística",
    porte: "Grande",
    decisor: "Vanessa Camargo",
    cargo: "Gerente de SSMA",
    email: "vanessa.camargo@rapidocarga.com.br",
    whatsapp: "11977665544",
    challenges: "Checklists de expedicao e seguranca dos caminhoes sao feitos de forma em papel, gerando perda frequente de dados de conformidade e impossibilidade de criar planos de acao rapidos em rota.",
    createdAt: "2026-05-20"
  },
  {
    id: "acc-3",
    name: "Construtora Vertice",
    sector: "SSMA",
    porte: "Média",
    decisor: "Ricardo Menezes",
    cargo: "Coordenador de Seguranca de Trabalho",
    email: "ricardo.menezes@construtoravertice.com.br",
    whatsapp: "21966554433",
    challenges: "Dificuldade na aplicacao pratica de NR-18 e NR-35 em canteiros de obra distantes. Inconformidades de seguranca levam semanas para serem resolvidas por falta de fluxo automatizado.",
    createdAt: "2026-06-01"
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: "mat-1",
    title: "Proposta Comercial Automacao Alimentos Sul",
    type: "proposta",
    accountId: "acc-1",
    clientName: "Alimentos Sul S.A.",
    createdAt: "2026-06-01",
    content: {
      proposal: {
        clientName: "Alimentos Sul S.A.",
        segment: "Qualidade",
        decisorName: "Eduardo Santini",
        challengeSummary: "Eliminar auditorias em papel que demoram ate dez dias para gerar relatorios gerenciais consolidados em Excel, unificando tres fabricas.",
        productScope: [
          "Módulo Checklist Mobile (Preenchimento Offline)",
          "Painel de Indicadores de Conformidade em Tempo Real",
          "Fluxo de Planos de Ação Automatizado para Correcoes",
          "Modulo de Assinatura Digital e Registro Fotografico"
        ],
        implementationFee: 4500,
        monthlyLicenseFee: 2900,
        contractTermMonths: 12,
        customCopywriting: "A solucao Checklist Facil centralizara os processos de auditoria de qualidade da Alimentos Sul S.A. Atraves do aplicativo mobile offline, os operadores realizarao as inspecoes diretamente do chao de fabrica. Qualquer inconformidade abrira automaticamente um Plano de Acao com responsavel e prazo de conclusao de acordo com a meta da empresa. A diretoria tera acesso imediato a dashboards analiticos consolidados das tres plantas, reduzindo o tempo de fechamento operacional de dez dias para zero."
      }
    },
    compiledHtml: `
<div style="font-family: 'Sora', sans-serif; background-color: #FFFFFF; color: #181A29; padding: 40px; border-radius: 12px 12px 12px 2px; border: 1px solid #E2E8F8; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #00AC69; padding-bottom: 20px; margin-bottom: 30px;">
    <div>
      <h1 style="color: #184B44; font-size: 24px; margin: 0; font-weight: 700;">PROPOSTA COMERCIAL</h1>
      <p style="color: #00AC69; font-size: 14px; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">CHECKLIST FÁCIL</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 300;">Identificador: CF-PR-2026-001</p>
      <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748b; font-weight: 300;">Data: 04/06/2026</p>
    </div>
  </div>

  <!-- Destinatário -->
  <div style="background-color: #F1F2F7; padding: 20px; border-radius: 12px 12px 12px 2px; margin-bottom: 30px;">
    <h3 style="color: #184B44; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Preparado para:</h3>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
      <tr>
        <td style="padding: 4px 0; color: #64748b; font-weight: 400; width: 120px;">Empresa:</td>
        <td style="padding: 4px 0; color: #181A29; font-weight: 600;">Alimentos Sul S.A.</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #64748b; font-weight: 400;">A/C:</td>
        <td style="padding: 4px 0; color: #181A29; font-weight: 600;">Eduardo Santini (Diretor de Operações e Qualidade)</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #64748b; font-weight: 400;">Setor:</td>
        <td style="padding: 4px 0; color: #181A29; font-weight: 600;">Qualidade e Higiene Digital</td>
      </tr>
    </table>
  </div>

  <!-- Contexto do Desafio -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">1. Introdução e Desafio Identificado</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #181A29; font-weight: 300; text-align: justify; margin: 0;">
      A Alimentos Sul S.A. possui como objetivo prioritario eliminar auditorias em papel que demoram ate dez dias para gerar relatorios gerenciais consolidados em Excel, unificando tres fabricas. A falta de padronizacao imediata e as dificuldades de rastreamento das acoes corretivas representam obstaculos para a expansao acelerada e conformidade regulatoria plena.
    </p>
  </div>

  <!-- Escopo da Solução -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">2. Escopo Checklist Fácil Recomendado</h2>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #181A29; font-weight: 300;">
      <li style="margin-bottom: 6px;"><strong style="color: #184B44; font-weight: 600;">Módulo Checklist Mobile (Preenchimento Offline):</strong> Preenchimento rapido pelo operador mesmo sem conexao de internet ativa no momento da inspecao.</li>
      <li style="margin-bottom: 6px;"><strong style="color: #184B44; font-weight: 600;">Painel de Indicadores de Conformidade em Tempo Real:</strong> Dashboards inteligentes para toda a lideranca com dados consolidados das plantas.</li>
      <li style="margin-bottom: 6px;"><strong style="color: #184B44; font-weight: 600;">Fluxo de Planos de Ação Automatizado para Correcoes:</strong> Abertura sistematica de planos de acao ao registrar itens fora do padrao exigido.</li>
      <li style="margin-bottom: 6px;"><strong style="color: #184B44; font-weight: 600;">Modulo de Assinatura Digital e Registro Fotografico:</strong> Evidencias incontestaveis com fotos integradas nos relatorios e assinaturas registradas diretamente na tela.</li>
    </ul>
  </div>

  <!-- Copywriting da Proposta -->
  <div style="margin-bottom: 30px; background-color: #E2E8F8; padding: 20px; border-left: 4px solid #469DE2; border-radius: 4px 12px 12px 4px;">
    <h3 style="color: #184B44; margin: 0 0 8px 0; font-size: 15px; font-weight: 600;">Benefício de Negócio Esperado</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #181A29; margin: 0; font-weight: 300; font-style: italic;">
      A solucao Checklist Facil centralizara os processos de auditoria de qualidade da Alimentos Sul S.A. Atraves do aplicativo mobile offline, os operadores realizarao as inspecoes diretamente do chao de fabrica. Qualquer inconformidade abrira automaticamente um Plano de Acao com responsavel e prazo de conclusao de acordo com a meta da empresa. A diretoria tera acesso imediato a dashboards analiticos consolidados das tres plantas, reduzindo o tempo de fechamento operacional de dez dias para zero.
    </p>
  </div>

  <!-- Preço e Detalhes Comerciais -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">3. Investimento</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background-color: #184B44; color: #FFFFFF;">
          <th style="padding: 10px; text-align: left; border-radius: 6px 0 0 0; font-weight: 600;">Item Comercial</th>
          <th style="padding: 10px; text-align: right; border-radius: 0 6px 0 0; font-weight: 600;">Valor do Investimento</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #E2E8F8;">
          <td style="padding: 12px 10px; color: #181A29; font-weight: 500;">Taxa de Implantacao e Treinamento (Faturamento unico)</td>
          <td style="padding: 12px 10px; text-align: right; color: #181A29; font-weight: 600;">R$ 4.500,00</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F8; background-color: #F1F2F7;">
          <td style="padding: 12px 10px; color: #181A29; font-weight: 500;">Licenca Mensal de Acesso de Software (SaaS)</td>
          <td style="padding: 12px 10px; text-align: right; color: #181A29; font-weight: 600;">R$ 2.900,00</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 15px; font-size: 12px; color: #64748b; font-weight: 300; line-height: 1.5;">
      * Vigencia e vigencia do contrato estipulada em 12 meses.<br>
      * Faturas emitidas com vencimento para d+30 do fechamento comercial.
    </div>
  </div>

  <!-- Sign-off -->
  <div style="display: flex; justify-content: space-between; margin-top: 40px; border-top: 1px solid #E2E8F8; padding-top: 25px;">
    <div style="width: 45%; text-align: center;">
      <div style="border-bottom: 1px solid #64748b; height: 40px; margin-bottom: 5px;"></div>
      <p style="margin: 0; font-size: 12px; color: #181A29; font-weight: 600;">Checklist Fácil</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Representante Comercial</p>
    </div>
    <div style="width: 45%; text-align: center;">
      <div style="border-bottom: 1px solid #64748b; height: 40px; margin-bottom: 5px;"></div>
      <p style="margin: 0; font-size: 12px; color: #181A29; font-weight: 600;">Alimentos Sul S.A.</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Eduardo Santini</p>
    </div>
  </div>
</div>
`
  },
  {
    id: "mat-2",
    title: "ROI Business Case Transportes Rapido Carga",
    type: "business_case",
    accountId: "acc-2",
    clientName: "Transportes Rapido Carga",
    createdAt: "2026-06-02",
    content: {
      businessCase: {
        clientName: "Transportes Rapido Carga",
        segment: "Logística",
        workersCount: 25,
        wasteHoursPerWeek: 4,
        workerHourlyCost: 35,
        paperFormsPerDay: 50,
        auditsPerYear: 12,
        monthlyLicensePrice: 1500,
        calculatedEconomyYearly: 198000,
        calculatedEconomyMonthly: 16500,
        calculatedPaperSavedYearly: 18250,
        calculatedPaybackMonths: 0.8,
        aiExecutiveSummary: "Com base nas variaveis operacionais coletadas com Vanessa Camargo, estimamos uma perda anual severa no processo manual de coleta de dados. Com 25 colaboradores em campo perdendo aproximadamente 4 horas semanais cada apenas com preenchimentos e redigitacoes, a empresa drena recursos vitais. Ao digitalizar as inspecoes de expedicao da Rapido Carga, estimamos liberar R$ 198.000 em produtividade reprimida anualmente, trazendo o payback do investimento de licenca para menos de um mes comercial completo."
      }
    },
    compiledHtml: `
<div style="font-family: 'Sora', sans-serif; background-color: #FFFFFF; color: #181A29; padding: 40px; border-radius: 12px 12px 12px 2px; border: 1px solid #E2E8F8; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #FF7133; padding-bottom: 20px; margin-bottom: 30px;">
    <div>
      <h1 style="color: #184B44; font-size: 24px; margin: 0; font-weight: 700;">ESTUDO DE RETORNO FINANCEIRO (ROI)</h1>
      <p style="color: #FF7133; font-size: 14px; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">BUSINESS CASE OPERACIONAL</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 300;">Status: Pronto para Apresentação</p>
    </div>
  </div>

  <!-- Resumo da Conta e Premissas -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Premissas Operacionais Coletadas</h2>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
      <div style="background-color: #F1F2F7; padding: 15px; border-radius: 12px 12px 12px 2px;">
        <span style="font-size: 12px; color: #64748b; display: block; font-weight: 300;">Colaboradores em Campo</span>
        <span style="font-size: 20px; color: #184B44; font-weight: 700; display: block; margin-top: 5px;">25 operadores</span>
      </div>
      <div style="background-color: #F1F2F7; padding: 15px; border-radius: 12px 12px 12px 2px;">
        <span style="font-size: 12px; color: #64748b; display: block; font-weight: 300;">Desperdício de Tempo por Semana</span>
        <span style="font-size: 20px; color: #184B44; font-weight: 700; display: block; margin-top: 5px;">4 horas/colaborador</span>
      </div>
      <div style="background-color: #F1F2F7; padding: 15px; border-radius: 12px 12px 12px 2px;">
        <span style="font-size: 12px; color: #64748b; display: block; font-weight: 300;">Custo Mensal da Licenca Digital</span>
        <span style="font-size: 20px; color: #184B44; font-weight: 700; display: block; margin-top: 5px;">R$ 1.500,00</span>
      </div>
      <div style="background-color: #F1F2F7; padding: 15px; border-radius: 12px 12px 12px 2px;">
        <span style="font-size: 12px; color: #64748b; display: block; font-weight: 300;">Gasto Diario Formularios de Papel</span>
        <span style="font-size: 20px; color: #184B44; font-weight: 700; display: block; margin-top: 5px;">50 folhas de papel</span>
      </div>
    </div>
  </div>

  <!-- Métricas de Retorno -->
  <div style="margin-bottom: 30px; border: 1px solid #93EEAA; padding: 25px; border-radius: 12px 12px 12px 2px; background-color: rgba(147,238,170,0.1);">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Retorno Obtido da Aplicacao</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
      <div style="text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: 400; display: block; text-transform: uppercase;">Retorno Mensal</span>
        <span style="font-size: 20px; color: #00AC69; font-weight: 700; display: block; margin-top: 5px;">+ R$ 16.500</span>
      </div>
      <div style="text-align: center; border-left: 1px solid #E2E8F8; border-right: 1px solid #E2E8F8;">
        <span style="font-size: 11px; color: #64748b; font-weight: 400; display: block; text-transform: uppercase;">Economia Anual</span>
        <span style="font-size: 20px; color: #00AC69; font-weight: 700; display: block; margin-top: 5px;">R$ 198.000</span>
      </div>
      <div style="text-align: center;">
        <span style="font-size: 11px; color: #64748b; font-weight: 400; display: block; text-transform: uppercase;">Prazo de Payback</span>
        <span style="font-size: 20px; color: #FF7133; font-weight: 700; display: block; margin-top: 5px;">0.8 Meses</span>
      </div>
    </div>
  </div>

  <!-- Resumo Executivo Gerado pela IA -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #184B44; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Justificativa de Investimento e Resumo Executivo</h2>
    <div style="font-size: 14px; line-height: 1.6; color: #181A29; font-weight: 300; text-align: justify; border-left: 3px solid #00AC69; padding-left: 15px;">
      Com base nas variaveis operacionais coletadas com Vanessa Camargo, estimamos uma perda anual severa no processo manual de coleta de dados. Com 25 colaboradores em campo perdendo aproximadamente 4 horas semanais cada apenas com preenchimentos e redigitacoes, a empresa drena recursos vitais. Ao digitalizar as inspecoes de expedicao da Rapido Carga, estimamos liberar R$ 198.000 em produtividade reprimida anualmente, trazendo o payback do investimento de licenca para menos de um mes comercial completo.
    </div>
  </div>

  <!-- Nota de Rodapé -->
  <div style="text-align: center; border-top: 1px solid #E2E8F8; padding-top: 20px; color: #64748b; font-size: 11px; font-weight: 300;">
    Calculos embasados nas medias de mercado indicadas pela diretoria operacional e casos reais da carteira Checklist Facil.
  </div>
</div>
`
  }
];
