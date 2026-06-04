export type MaterialType = 'proposta' | 'business_case' | 'apresentacao';

export interface CommercialAccount {
  id: string;
  name: string;
  sector: string; // Indústria, Logística, SSMA, Qualidade, Operações, Construção, Outro
  porte: string; // Pequena, Média, Grande, Enterprise
  decisor: string;
  cargo: string;
  email: string;
  whatsapp: string;
  challenges: string; // Text summarizing their pain points (e.g. formulários em papel, atraso de relatórios)
  createdAt: string;
}

export interface ProposalContent {
  clientName: string;
  segment: string;
  decisorName: string;
  challengeSummary: string;
  productScope: string[]; // e.g., ["Módulo Checklist Mobile", "Workflow de Planos de Ação", "Painéis Analíticos", "Roteamento de Auditorias"]
  implementationFee: number;
  monthlyLicenseFee: number;
  contractTermMonths: number;
  customCopywriting: string; // Persuasive corporate text developed by the server-side Gemini
}

export interface BusinessCaseContent {
  clientName: string;
  segment: string;
  workersCount: number; // Colaboradores coletando dados em campo
  wasteHoursPerWeek: number; // Horas perdidas por colaborador semanalmente consolidando dados
  workerHourlyCost: number; // Custo médio da hora de trabalho do colaborador
  paperFormsPerDay: number; // Formulários analógicos/papel gastos por dia
  auditsPerYear: number; // Auditorias periódicas executadas por ano
  monthlyLicensePrice: number; // Valor total da licença mensal estimada para o cliente
  calculatedEconomyYearly: number;
  calculatedEconomyMonthly: number;
  calculatedPaperSavedYearly: number;
  calculatedPaybackMonths: number;
  aiExecutiveSummary: string; // Business case executive summary developed by the server-side Gemini
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
}

export interface PresentationContent {
  clientName: string;
  segment: string;
  themeStyle: 'standard' | 'dark' | 'bold';
  customFocusArea: string; // Focus of presentation, e.g. "Auditorias de Qualidade", "Gestão de Segurança (SSMA)"
  slides: SlideItem[];
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  accountId?: string; // Optlink to client account
  clientName: string;
  createdAt: string;
  content: {
    proposal?: ProposalContent;
    businessCase?: BusinessCaseContent;
    presentation?: PresentationContent;
  };
  compiledHtml: string; // Fully formatted standalone HTML content
}
