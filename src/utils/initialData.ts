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
    challenges: "Uso massivo de papel nas auditorias de higiene interna, atraso de até 10 dias para consolidar planilhas Excel e falta de padronização entre as três plantas industriais.",
    createdAt: "2026-05-15",
  },
  {
    id: "acc-2",
    name: "Transportes Rápido Carga",
    sector: "Logística",
    porte: "Grande",
    decisor: "Vanessa Camargo",
    cargo: "Gerente de SSMA",
    email: "vanessa.camargo@rapidocarga.com.br",
    whatsapp: "11977665544",
    challenges: "Checklists de expedição e segurança dos caminhões feitos em papel, gerando perda de dados de conformidade e impossibilidade de abrir planos de ação em rota.",
    createdAt: "2026-05-20",
  },
  {
    id: "acc-3",
    name: "Construtora Vértice",
    sector: "SSMA",
    porte: "Média",
    decisor: "Ricardo Menezes",
    cargo: "Coordenador de Segurança do Trabalho",
    email: "ricardo.menezes@construtoravertice.com.br",
    whatsapp: "21966554433",
    challenges: "Dificuldade na aplicação de NR-18 e NR-35 em canteiros distantes. Inconformidades de segurança levam semanas para serem resolvidas por falta de fluxo automatizado.",
    createdAt: "2026-06-01",
  },
];

export const INITIAL_MATERIALS: Material[] = [];
