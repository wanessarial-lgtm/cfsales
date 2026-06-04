import React, { useState, useEffect } from "react";
import { CommercialAccount, Material } from "./types";
import { INITIAL_ACCOUNTS, INITIAL_MATERIALS } from "./utils/initialData";
import AccountTab from "./components/AccountTab";
import ProposalTab from "./components/ProposalTab";
import BusinessCaseTab from "./components/BusinessCaseTab";
import PresentationTab from "./components/PresentationTab";
import { 
  Briefcase, 
  Building2, 
  FileText, 
  Sliders, 
  Tv, 
  HelpCircle,
  PiggyBank,
  CheckCircle,
  Plus
} from "lucide-react";

export default function App() {
  // 1. Core State Hydration with localStorage
  const [accounts, setAccounts] = useState<CommercialAccount[]>(() => {
    const raw = localStorage.getItem("cf_accounts");
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { console.error(e); }
    }
    return INITIAL_ACCOUNTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const raw = localStorage.getItem("cf_materials");
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { console.error(e); }
    }
    return INITIAL_MATERIALS;
  });

  const [activeTab, setActiveTab] = useState<"contas" | "propostas" | "roi" | "slides">("contas");
  const [selectedAccountPreset, setSelectedAccountPreset] = useState<CommercialAccount | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("cf_accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("cf_materials", JSON.stringify(materials));
  }, [materials]);

  // Derived Statistics for Dashboard Cards
  const totalLeads = accounts.length;
  const proposalsCount = materials.filter(m => m.type === "proposta").length;
  const businessCasesCount = materials.filter(m => m.type === "business_case").length;
  const presentationsCount = materials.filter(m => m.type === "apresentacao").length;

  const totalCalculatedSavingsYearly = materials.reduce((acc, m) => {
    if (m.type === "business_case" && m.content.businessCase) {
      return acc + (m.content.businessCase.calculatedEconomyYearly || 0);
    }
    return acc;
  }, 0);

  // 2. Action handlers passed to children tabs
  const handleAddAccount = (acc: CommercialAccount) => {
    setAccounts(prev => [acc, ...prev]);
  };

  const handleEditAccount = (updated: CommercialAccount) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm("Confirmar exclusão desta conta de lead? Isso nao afetara materiais salvos.")) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleAddProposal = (mat: Material) => {
    setMaterials(prev => [mat, ...prev]);
  };

  const handleDeleteProposal = (id: string) => {
    if (confirm("Excluir esta proposta comercial definitivamente?")) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddBusinessCase = (mat: Material) => {
    setMaterials(prev => [mat, ...prev]);
  };

  const handleDeleteBusinessCase = (id: string) => {
    if (confirm("Excluir este estudo de ROI definitivamente?")) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddPresentation = (mat: Material) => {
    setMaterials(prev => [mat, ...prev]);
  };

  const handleDeletePresentation = (id: string) => {
    if (confirm("Excluir esta apresentação comercial definitivamente?")) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  // Quick action shortcut from Account Card click
  const handleQuickGenerate = (acc: CommercialAccount, type: "proposal" | "business_case" | "presentation") => {
    setSelectedAccountPreset(acc);
    if (type === "proposal") {
      setActiveTab("propostas");
    } else if (type === "business_case") {
      setActiveTab("roi");
    } else if (type === "presentation") {
      setActiveTab("slides");
    }
  };

  // Clear presets to avoid infinite wizard boot-up
  useEffect(() => {
    setSelectedAccountPreset(null);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[var(--color-cf-surface)] font-sans flex flex-col relative overflow-x-hidden pb-12">
      
      {/* 1. TOPBAR FIXED */}
      <header id="app-topbar" className="w-full h-14 bg-[var(--color-cf-cinza-dk)] px-6 flex items-center justify-between shadow-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          {/* Pulsing on-brand green led light */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AC69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00AC69]"></span>
          </span>
          <span className="text-white text-[15px] font-semibold tracking-tight">
            Gerador de Materiais Comerciais
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-g20 font-semibold uppercase tracking-wider hidden sm:inline select-none">
            Wanessa · Checklist Fácil
          </span>
          <div className="w-8 h-8 rounded-full bg-g60 text-white font-semibold text-xs flex items-center justify-center border border-white/20 select-none">
            W
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER LIMIT WIDTH FOR desktop precision */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 flex-1 space-y-6 z-15 relative">
        
        {/* Background Visual Check Decor Overlay (with linear gradient) */}
        <div className="absolute right-4 bottom-0 w-80 h-80 pointer-events-none select-none opacity-5 z-0" aria-hidden="true">
          <svg className="w-full h-full text-cf-verde" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cf-app-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00AC69" />
                <stop offset="100%" stopColor="#93EEAA" />
              </linearGradient>
            </defs>
            <path d="M25 75 L55 105 L125 35" stroke="url(#cf-app-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* 3. HERO & DYNAMIC KPI stats header PANEL */}
        <section id="commercial-identity-panel" className="bg-white border border-cf-surface/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-pattern-light">
          <div className="space-y-1.5 text-left relative z-10 max-w-xl">
            <span className="text-[10px] bg-cf-verde/10 text-cf-verde font-semibold uppercase py-0.5 px-2 rounded">
              Espaço de Trabalho da Wanessa · Inteligência de Vendas B2B
            </span>
            <h1 className="text-xl md:text-2xl font-semibold text-cf-escuro tracking-tight">
              Acelere Vendas Industriais B2B
            </h1>
            <p className="text-xs text-cf-cinza-dk/70 font-light leading-relaxed">
              Bem-vinda, Wanessa. Utilize esta ferramenta pessoal para gerar propostas corporativas, simulações financeiras de ROI e roteiros de apresentação em slides HTML, tudo embalado com a identidade visual da Checklist Fácil.
            </p>
          </div>

          {/* Dynamic aggregate statistics box */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto relative z-10">
            <div className="bg-cf-surface/50 p-3.5 rounded-xl border border-cf-surface/20 min-w-[140px] text-left">
              <span className="text-[9px] text-[#64748b] uppercase tracking-wider block">Leads Ativos</span>
              <span className="text-lg font-bold text-cf-escuro block mt-0.5">{totalLeads}</span>
            </div>
            <div className="bg-cf-surface/50 p-3.5 rounded-xl border border-cf-surface/20 min-w-[140px] text-left">
              <span className="text-[9px] text-[#64748b] uppercase tracking-wider block">Materiais Criados</span>
              <span className="text-lg font-bold text-cf-escuro block mt-0.5">{proposalsCount + businessCasesCount + presentationsCount}</span>
            </div>
            <div className="bg-[#184B44]/5 p-3.5 rounded-xl border border-[#184B44]/10 col-span-2 text-left flex items-center justify-between">
              <div>
                <span className="text-[9px] text-cf-escuro font-bold uppercase tracking-wider block">Economia Anual Mapeada</span>
                <span className="text-sm font-bold text-cf-verde mt-0.5 block">
                  R$ {Math.round(totalCalculatedSavingsYearly / 1000)}k / ano
                </span>
              </div>
              <PiggyBank className="w-6 h-6 text-cf-verde shrink-0" />
            </div>
          </div>
        </section>

        {/* 4. SEAMLESS TAB SELECTOR */}
        <section id="commercial-tab-selector" className="flex border-b border-cf-surface mb-2 select-none overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("contas")}
            className={`px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-150 border-b-2 outline-none flex items-center gap-2 shrink-0 cursor-pointer
              ${activeTab === "contas" 
                ? "border-cf-escuro text-cf-escuro font-bold" 
                : "border-transparent text-cf-cinza-dk/50 hover:text-cf-escuro"}`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Contas Leads ({totalLeads})</span>
          </button>
          
          <button
            onClick={() => setActiveTab("propostas")}
            className={`px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-150 border-b-2 outline-none flex items-center gap-2 shrink-0 cursor-pointer
              ${activeTab === "propostas" 
                ? "border-cf-escuro text-cf-escuro font-bold" 
                : "border-transparent text-cf-cinza-dk/50 hover:text-cf-escuro"}`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Propostas Comerciais ({proposalsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("roi")}
            className={`px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-150 border-b-2 outline-none flex items-center gap-2 shrink-0 cursor-pointer
              ${activeTab === "roi" 
                ? "border-cf-escuro text-cf-escuro font-bold" 
                : "border-transparent text-cf-cinza-dk/50 hover:text-cf-escuro"}`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Estudos de ROI ({businessCasesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("slides")}
            className={`px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-150 border-b-2 outline-none flex items-center gap-2 shrink-0 cursor-pointer
              ${activeTab === "slides" 
                ? "border-cf-escuro text-cf-escuro font-bold" 
                : "border-transparent text-cf-cinza-dk/50 hover:text-cf-escuro"}`}
          >
            <Tv className="w-4 h-4 shrink-0" />
            <span>Slides HTML ({presentationsCount})</span>
          </button>
        </section>

        {/* 5. CURRENT ACTIVE TAB WORKSPACE */}
        <section id="commercial-workspace-viewport" className="pb-6">
          {activeTab === "contas" && (
            <AccountTab
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onDeleteAccount={handleDeleteAccount}
              onQuickGenerate={handleQuickGenerate}
            />
          )}

          {activeTab === "propostas" && (
            <ProposalTab
              proposals={materials.filter(m => m.type === "proposta")}
              accounts={accounts}
              onAddProposal={handleAddProposal}
              onDeleteProposal={handleDeleteProposal}
              selectedAccountPreset={selectedAccountPreset}
            />
          )}

          {activeTab === "roi" && (
            <BusinessCaseTab
              businessCases={materials.filter(m => m.type === "business_case")}
              accounts={accounts}
              onAddBusinessCase={handleAddBusinessCase}
              onDeleteBusinessCase={handleDeleteBusinessCase}
              selectedAccountPreset={selectedAccountPreset}
            />
          )}

          {activeTab === "slides" && (
            <PresentationTab
              presentations={materials.filter(m => m.type === "apresentacao")}
              accounts={accounts}
              onAddPresentation={handleAddPresentation}
              onDeletePresentation={handleDeletePresentation}
              selectedAccountPreset={selectedAccountPreset}
            />
          )}
        </section>

      </main>
    </div>
  );
}
