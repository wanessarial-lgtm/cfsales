import React, { useState } from "react";
import { Material, CommercialAccount, ProposalContent } from "../types";
import { compileProposalHtml } from "../utils/generators";
import { FileText, Plus, Sparkles, Eye, Copy, Download, Trash2, ArrowLeft, Loader2, CheckCircle, RefreshCw } from "lucide-react";

interface ProposalTabProps {
  proposals: Material[];
  accounts: CommercialAccount[];
  onAddProposal: (proposal: Material) => void;
  onDeleteProposal: (id: string) => void;
  selectedAccountPreset?: CommercialAccount | null;
}

export default function ProposalTab({
  proposals,
  accounts,
  onAddProposal,
  onDeleteProposal,
  selectedAccountPreset
}: ProposalTabProps) {
  const [viewState, setViewState] = useState<"list" | "create" | "preview">("list");
  const [selectedProposal, setSelectedProposal] = useState<Material | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [accountId, setAccountId] = useState(selectedAccountPreset?.id || "");
  const [customClientName, setCustomClientName] = useState("");
  const [chosenSector, setChosenSector] = useState("Qualidade");
  const [customChallenge, setCustomChallenge] = useState("");
  
  // Scopes checked
  const [scopes, setScopes] = useState<string[]>([
    "Módulo Checklist Mobile (Preenchimento Offline)",
    "Fluxo de Planos de Ação Automatizado para Correcoes"
  ]);
  
  const [setupFee, setSetupFee] = useState<number>(3500);
  const [monthlyFee, setMonthlyFee] = useState<number>(1800);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [aiText, setAiText] = useState("");

  // UI state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedProposalId, setCopiedProposalId] = useState<string | null>(null);

  const availableModules = [
    "Módulo Checklist Mobile (Preenchimento Offline)",
    "Fluxo de Planos de Ação Automatizado para Correcoes",
    "Painel de Indicadores de Conformidade em Tempo Real",
    "Modulo de Registro Fotografico Integrado (Evidencias)",
    "Modulo de Assinatura Digital de Relatorios",
    "Agendamento de Auditorias Periodicas Recorrentes",
    "Integracoes via API (Sistemas Internos ERP)"
  ];

  React.useEffect(() => {
    if (selectedAccountPreset) {
      setAccountId(selectedAccountPreset.id);
      setCustomClientName("");
      setViewState("create");
    }
  }, [selectedAccountPreset]);

  // Handle account change to autofill pre-requisites
  const handleAccountChange = (id: string) => {
    setAccountId(id);
    if (id) {
      const match = accounts.find(a => a.id === id);
      if (match) {
        setTitle(`Proposta de Operacao Digital - ${match.name}`);
        setCustomClientName(match.name);
        setChosenSector(match.sector);
        setCustomChallenge(match.challenges);
      }
    } else {
      setTitle("");
      setCustomClientName("");
      setCustomChallenge("");
    }
  };

  const toggleScope = (scope: string) => {
    setScopes(prev => 
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  // Generate copywriting via Express server proxy to Gemini
  const handleAiCopywrite = async () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || customClientName) : customClientName;
    if (!clientNameResolved) {
      setErrorMsg("Forneca o nome do cliente ou selecione uma conta lead antes de solicitar a IA.");
      return;
    }

    setIsAiLoading(true);
    setErrorMsg("");

    const systemPrompt = `Voce e o melhor redator comercial de propostas B2B para o Checklist Facil.
Sua missao e escrever um paragrafo comercial ultra-convincente, analitico e persuasivo voltado para o cliente. 
Emfatize os resultados da transicao do papel/manual para auditorias digitais offline do Checklist Facil.
Voce deve retornar estritamente um objeto JSON com a chave "customCopywriting", sem tags de bloco markdown do tipo \`\`\`json ou explicacoes.
Nao use NENHUM emoji (Regra: Zero emojis).`;

    const userMsg = `Crie uma justificativa comercial para o cliente "${clientNameResolved}" que atua no setor "${chosenSector}".
Eles tem o seguinte desafio operacional: "${customChallenge || "Uso de papel e relatorios lentos"}".
Como solucao, propusemos os seguintes modulos: [${scopes.join(", ")}].
Escreva um paragrafo fluido e corporativo. Retorne apenas o JSON.`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userMessage: userMsg })
      });

      if (!res.ok) {
        throw new Error("Erro no processamento do proxy do servidor.");
      }

      const data = await res.json();
      if (data && data.customCopywriting) {
        setAiText(data.customCopywriting);
      } else if (data && data.text) {
        // Fallback parse attempt
        setAiText(data.text);
      } else {
        setAiText(`A solucao comercial desenvolvida focada em ${chosenSector} permitira consolidar todos os dados operacionais em tempo real de forma totalmente digital. Evitaremos re-trabalhos administrativos, com o preenchimento de checklists via aplicativo offline.`);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Ocorreu uma falha ao contatar a IA. Usamos um texto padrão qualificado.");
      setAiText(`A solucao recomendada pelo Checklist Facil permitira a ${clientNameResolved} automatizar o monitoramento de conformidade. Com tecnologia offline e abertura de Planos de Acao em tempo real, as falhas de comunicacao serao eliminadas e relatorios serao distribuidos automaticamente.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || customClientName) : customClientName;
    if (!clientNameResolved || !title) return;

    const proposalContent: ProposalContent = {
      clientName: clientNameResolved,
      segment: chosenSector,
      decisorName: accountId ? (accounts.find(a => a.id === accountId)?.decisor || "Diretoria") : "Diretoria",
      challengeSummary: customChallenge || "Eliminar planilhas de papel e otimizar tempo de conferencia.",
      productScope: scopes,
      implementationFee: setupFee,
      monthlyLicenseFee: monthlyFee,
      contractTermMonths: durationMonths,
      customCopywriting: aiText || "Foco em produtividade e controle operacional atraves do Checklist Facil."
    };

    const record: Material = {
      id: `prop-${Date.now()}`,
      title,
      type: "proposta",
      accountId: accountId || undefined,
      clientName: clientNameResolved,
      createdAt: new Date().toISOString().split("T")[0],
      content: { proposal: proposalContent },
      compiledHtml: compileProposalHtml(proposalContent)
    };

    onAddProposal(record);
    setViewState("list");
    
    // reset
    setTitle("");
    setAccountId("");
    setCustomClientName("");
    setAiText("");
  };

  const triggerCopy = (prop: Material) => {
    navigator.clipboard.writeText(prop.compiledHtml);
    setCopiedProposalId(prop.id);
    setTimeout(() => setCopiedProposalId(null), 3000);
  };

  const triggerDownload = (prop: Material) => {
    if (!prop.content.proposal) return;
    const blob = new Blob([prop.compiledHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Proposta_ChecklistFacil_${prop.content.proposal.clientName.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {viewState === "list" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider text-left">Propostas Comerciais Geradas</h3>
            <button
              onClick={() => {
                setAccountId("");
                setViewState("create");
              }}
              className="h-10 px-4 bg-cf-escuro text-white text-xs font-bold transition cf-shape hover:bg-cf-verde cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta Comercial</span>
            </button>
          </div>

          {proposals.length === 0 ? (
            <div className="bg-white border border-cf-surface/20 p-16 rounded-2xl text-center space-y-4">
              <FileText className="w-12 h-12 mx-auto text-cf-escuro/20" />
              <div>
                <h4 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">Nenhuma Proposta Gerada</h4>
                <p className="text-xs text-cf-cinza-dk/55 max-w-xs mx-auto font-light mt-1">
                  Abra o assistente para criar uma nova proposta estruturada com a nossa IA.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposals.map(prop => (
                <div key={prop.id} className="bg-white border border-cf-surface/30 p-5 cf-shape flex flex-col justify-between hover:shadow-sm transition">
                  <div className="text-left space-y-2">
                    <span className="text-[10px] bg-cf-verde/10 text-cf-verde font-semibold px-2 py-0.5 rounded">Proposta Comercial</span>
                    <h4 className="text-[14px] font-bold text-cf-escuro leading-tight">{prop.title}</h4>
                    <p className="text-[11px] text-cf-cinza-dk/70 font-light">Cliente: <strong className="font-semibold text-cf-escuro/85">{prop.clientName}</strong></p>
                    <p className="text-[11px] text-cf-cinza-dk/65 line-clamp-2">{prop.content.proposal?.customCopywriting}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-cf-surface/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onDeleteProposal(prop.id)}
                      className="p-1.5 hover:bg-rose-50 rounded text-rose-500/50 hover:text-rose-600 transition cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProposal(prop);
                          setViewState("preview");
                        }}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-cf-escuro text-xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visualizar</span>
                      </button>
                      <button
                        onClick={() => triggerCopy(prop)}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
                      >
                        {copiedProposalId === prop.id ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-cf-verde" />
                            <span className="text-cf-verde font-semibold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-cf-cinza-dk/60" />
                            <span>Copiar HTML</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => triggerDownload(prop)}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
                        title="Baixar Arquivo HTML"
                      >
                        <Download className="w-3.5 h-3.5 text-cf-cinza-dk/60" />
                        <span>Baixar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewState === "create" && (
        <div className="bg-white border border-cf-surface/20 p-6 cf-shape text-left space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-cf-surface/30">
            <button
              onClick={() => setViewState("list")}
              className="p-1.5 hover:bg-cf-surface rounded text-cf-escuro"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-cf-escuro">Criador de Proposta Digital Inteligente</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Client Account picker */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Vincular a Conta Lead (Opcional)</label>
                <select
                  value={accountId}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-2 text-xs focus:outline-none"
                >
                  <option value="">-- Sem vinculo (Preencher Manualmente) --</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              {/* Titulo */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Titulo da Proposta</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Proposta de Automacao de Processos - Alimentos S.A."
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              {/* Se sem vinculo, dados manuais */}
              {!accountId && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Nome do Cliente</label>
                    <input
                      type="text"
                      value={customClientName}
                      onChange={(e) => setCustomClientName(e.target.value)}
                      placeholder="Ex: Petroquimica Forte"
                      className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Setor de Atuacao</label>
                    <input
                      type="text"
                      value={chosenSector}
                      onChange={(e) => setChosenSector(e.target.value)}
                      placeholder="Ex: Seguranca, Qualidade"
                      className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Custom Challenges descriptor */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Principais Dores Operacionais</label>
                <textarea
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  placeholder="Ex: retrabalho de redigitacao de planilhas de seguranca levam dez dias"
                  rows={2}
                  className="w-full p-2.5 bg-cf-surface/40 border border-cf-surface rounded-lg text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Pricing sand */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-cf-escuro uppercase mb-1">Implantacao (R$)</label>
                  <input
                    type="number"
                    value={setupFee}
                    onChange={(e) => setSetupFee(Number(e.target.value))}
                    className="w-full h-9 bg-cf-surface/40 border border-cf-surface rounded text-xs px-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cf-escuro uppercase mb-1">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full h-9 bg-cf-surface/40 border border-cf-surface rounded text-xs px-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cf-escuro uppercase mb-1">Contrato (Meses)</label>
                  <input
                    type="number"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full h-9 bg-cf-surface/40 border border-cf-surface rounded text-xs px-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Scope select Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Definir Escopo (Modulos Recomendados)</label>
                <div className="border border-cf-surface rounded-xl p-3 space-y-2 bg-cf-surface/20 max-h-48 overflow-y-auto">
                  {availableModules.map(mod => (
                    <label key={mod} className="flex items-start gap-2 text-xs text-cf-cinza-dk/85 hover:text-cf-escuro cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scopes.includes(mod)}
                        onChange={() => toggleScope(mod)}
                        className="mt-0.5 accent-cf-verde"
                      />
                      <span>{mod}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* AI generator block */}
              <div className="border border-cf-verde-claro/40 bg-cf-verde-claro/5 p-4 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cf-escuro uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cf-verde animate-pulse" />
                    <span>Copywriting Comercial Autônomo IA</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAiCopywrite}
                    disabled={isAiLoading}
                    className="h-8 px-3 bg-cf-verde hover:bg-cf-verde/95 text-white font-bold rounded-lg text-[10px] uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Gerar Copia Comercial</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && <p className="text-[10px] text-rose-500 font-semibold">{errorMsg}</p>}

                <textarea
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Texto gerado com IA aparecera aqui para revisao, livre de emojis. Voce tambem pode editar manualmente a copia comercial recomendada para o cliente."
                  rows={4}
                  className="w-full p-2.5 bg-white border border-cf-surface rounded-lg text-xs leading-relaxed font-light text-cf-cinza-dk focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cf-surface/20">
            <button
              onClick={() => setViewState("list")}
              className="h-10 px-4 text-xs font-semibold text-cf-escuro/60 hover:text-cf-escuro"
            >
              Voltar
            </button>
            <button
              onClick={handleSave}
              disabled={!title || !(accountId || customClientName)}
              className="h-10 px-6 bg-cf-escuro hover:bg-cf-escuro/90 text-white font-bold rounded-xl text-xs transition cf-shape disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Salvar Proposta Comercial
            </button>
          </div>
        </div>
      )}

      {viewState === "preview" && selectedProposal && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-cf-surface/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewState("list")}
                className="p-1 px-3 bg-cf-surface border border-cf-surface text-cf-escuro rounded text-xs"
              >
                Voltar a lista
              </button>
              <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">{selectedProposal.title}</h3>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerCopy(selectedProposal)}
                className="h-8 px-3 bg-cf-escuro text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar HTML</span>
              </button>
              <button
                onClick={() => triggerDownload(selectedProposal)}
                className="h-8 px-3 bg-cf-laranja text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar HTML</span>
              </button>
            </div>
          </div>

          {/* Render IFrame inside to avoid layout spill style */}
          <div className="bg-cf-surface border border-cf-surface rounded-2xl p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-lg border border-cf-surface/70 w-full overflow-hidden flex flex-col h-[520px]">
              <iframe
                title="Mock Preview Proposal"
                srcDoc={selectedProposal.compiledHtml}
                className="w-full flex-1 border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
