export type MaterialType = 'proposta' | 'business_case' | 'material_customizado';

export interface CommercialAccount {
  id: string;
  name: string;
  sector: string;
  porte: string;
  decisor: string;
  cargo: string;
  email: string;
  whatsapp: string;
  challenges: string;
  createdAt: string;
}

export interface ProposalContent {
  clientName: string;
  segment: string;
  decisorName: string;
  challengeSummary: string;
  productScope: string[];
  implementationFee: number;
  monthlyLicenseFee: number;
  contractTermMonths: number;
  customCopywriting: string;
}

export interface BusinessCaseContent {
  clientName: string;
  segment: string;
  workersCount: number;
  wasteHoursPerWeek: number;
  workerHourlyCost: number;
  paperFormsPerDay: number;
  auditsPerYear: number;
  monthlyLicensePrice: number;
  calculatedEconomyYearly: number;
  calculatedEconomyMonthly: number;
  calculatedPaperSavedYearly: number;
  calculatedPaybackMonths: number;
  aiExecutiveSummary: string;
}

export interface CustomSection {
  heading: string;
  body: string;
}

export interface CustomMaterialContent {
  clientName: string;
  documentTitle: string;
  documentSubtitle: string;
  accentColor: 'verde' | 'azul' | 'laranja';
  sections: CustomSection[];
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  accountId?: string;
  clientName: string;
  createdAt: string;
  content: {
    proposal?: ProposalContent;
    businessCase?: BusinessCaseContent;
    customMaterial?: CustomMaterialContent;
  };
  compiledHtml: string;
}
