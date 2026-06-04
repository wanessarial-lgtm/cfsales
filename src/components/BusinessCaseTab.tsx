import React, { useState, useMemo } from "react";
import { Material, CommercialAccount, BusinessCaseContent } from "../types";
import { compileBusinessCaseHtml } from "../utils/generators";
import { Sliders, Plus, Sparkles, Eye, Copy, Download, Trash2, ArrowLeft, Loader2, CheckCircle, HelpCircle } from "lucide-react";

interface BusinessCaseTabProps {
  businessCases: Material[];
  accounts: CommercialAccount[];
  onAddBusinessCase: (study: Material) => void;
  onDeleteBusinessCase: (id: string) => void;
  selectedAccountPreset?: CommercialAccount | null;
}

export default function BusinessCaseTab({
  businessCases,
  accounts,
  onAddBusinessCase,
  onDeleteBusinessCase,
  selectedAccountPreset
}: BusinessCaseTabProps) {
  const [viewState, setViewState] = useState<"list" | "calculator" | "preview">("list");
  const [selectedCase, setSelectedCase] = useState<Material | null>(null);

  // Math Sandbox Slider States
  const [title, setTitle] = useState("");
  const [accountId, setAccountId] = useState(selectedAccountPreset?.id || "");
  const [clientName, setClientName] = useState("");
  const [chosenSector, setChosenSector] = useState("Qualidade");

  const [workersCount, setWorkersCount] = useState<number>(20);
  const [wasteHoursPerWeek, setWasteHoursPerWeek] = useState<number>(4);
  const [workerHourlyCost, setWorkerHourlyCost] = useState<number>(30);
  const [paperFormsPerDay, setPaperFormsPerDay] = useState<number>(40);
  const [auditsPerYear, setAuditsPerYear] = useState<number>(12);
  const [monthlyLicensePrice, setMonthlyLicensePrice] = useState<number>(1500);
  
  const [aiExecutiveSummary, setAiExecutiveSummary] = useState("");

  // UI state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedCaseId, setCopiedCaseId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedAccountPreset) {
      setAccountId(selectedAccountPreset.id);
      setClientName(selectedAccountPreset.name);
      setChosenSector(selectedAccountPreset.sector);
      setTitle(`Estudo de ROI Business Case - ${selectedAccountPreset.name}`);
      setViewState("calculator");
    }
  }, [selectedAccountPreset]);

  // Autofill if account is chosen
  const handleAccountChange = (id: string) => {
    setAccountId(id);
    if (id) {
      const match = accounts.find(a => a.id === id);
      if (match) {
        setClientName(match.name);
        setChosenSector(match.sector);
        setTitle(`Estudo de ROI Business Case - ${match.name}`);
      }
    } else {
      setClientName("");
      setTitle("");
    }
  };

  // Perform operational metrics in real-time
  const metrics = useMemo(() => {
    // 1. Time wasted yearly (hours)
    const hoursWastedYearly = workersCount * 52 * wasteHoursPerWeek;
    
    // 2. Financial cost of hours wasted yearly (R$)
    const timeFinancialLossYearly = hoursWastedYearly * workerHourlyCost;
    
    // 3. Paper sheets wasted yearly
    const paperSheetsYearly = paperFormsPerDay * 365;
    
    // 4. Financial cost of paper sheets (printing, logistics, average R$ 0.15/sheet)
    const paperFinancialLossYearly = paperSheetsYearly * 0.15;
    
    // 5. Total operational bleed yearly
    const totalBleedYearly = timeFinancialLossYearly + paperFinancialLossYearly;

    // 6. Savings generated with Checklist Fácil (90% reduction in time waste, 98% reduction in paper spend)
    const timeSavedYearly = timeFinancialLossYearly * 0.90;
    const paperSavedYearly = paperFinancialLossYearly * 0.98;
    const calculatedEconomyYearly = timeSavedYearly + paperSavedYearly;
    const calculatedEconomyMonthly = calculatedEconomyYearly / 12;

    const paperSheetsSavedYearly = paperSheetsYearly * 0.98;

    // 7. Dynamic payback (invested monthly license vs savings monthly)
    const calculatedPaybackMonths = calculatedEconomyMonthly > 0 
      ? Math.max(0.1, Number((monthlyLicensePrice / calculatedEconomyMonthly).toFixed(2))) 
      : 0;

    return {
      hoursWastedYearly,
      totalBleedYearly,
      calculatedEconomyYearly,
      calculatedEconomyMonthly,
      paperSheetsSavedYearly,
      calculatedPaybackMonths
    };
  }, [workersCount, wasteHoursPerWeek, workerHourlyCost, paperFormsPerDay, monthlyLicensePrice]);

  // Generate justification with server-side proxy to Gemini
  const handleAiJustification = async () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || clientName) : clientName;
    if (!clientNameResolved) {
      setErrorMsg("Selecione uma conta ou preencha o nome do cliente antes de gerar o diagnostico IA.");
      return;
    }

    setIsAiLoading(true);
    setErrorMsg("");

    const systemPrompt = `Voce e um analista financeiro senior e CFO focado em propor solucoes B2B para o Checklist Facil.
Sua missao e redigir uma carta de justificativa de investimento de alto nivel e altamente analitica para o conselho.
Use as metricas calculadas reais fornecidas na mensagem de entrada.
Sua resposta deve ser estritamente um objeto JSON com a chave "executiveLetter", sem blocos markdown do tipo \`\`\`json ou introducoes.
Sua redacao deve ser corporativa, formal, objetiva e conter ZERO emojis (Regra: Zero emojis).`;

    const userMsg = `Desenvolva a justificativa para a empresa "${clientNameResolved}" no setor "${chosenSector}".
Premissas Calculadas:
- Numero de operadores em campo: ${workersCount} profissionais.
- Desperdicio semanal estimado: ${wasteHoursPerWeek} horas consolidando dados fisicos.
- Custo estimado de hora de trabalho: R$ ${workerHourlyCost} por hora.
- Economia Projetada Mensal: R$ ${Math.round(metrics.calculatedEconomyMonthly).toLocaleString("pt-BR")}
- Economia Projetada Anual: R$ ${Math.round(metrics.calculatedEconomyYearly).toLocaleString("pt-BR")}
- Valor projetado licenca mensal: R$ ${monthlyLicensePrice}
- Retorno de capital (Payback): em apenas ${metrics.calculatedPaybackMonths} meses.
- Reducao ambiental estimada: economizaremos ${Math.round(metrics.paperSheetsSavedYearly).toLocaleString("pt-BR")} folhas de papel anualmente.

Escreva de forma persuasiva mostrando que manter o controle manual e prejuizo operacional.`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userMessage: userMsg })
      });

      if (!res.ok) {
        throw new Error("Erro de processamento no endpoint de IA.");
      }

      const data = await res.json();
      if (data && data.executiveLetter) {
        setAiExecutiveSummary(data.executiveLetter);
      } else if (data && data.text) {
        setAiExecutiveSummary(data.text);
      } else {
        setAiExecutiveSummary(`Após análise detalhada do cenário operacional da ${clientNameResolved}, constatou-se que o desperdício com controle manual de checklists em papel consome recursos cruciais. Ao implementar a licença do Checklist Fácil por R$ ${monthlyLicensePrice}/mês, obteremos uma economia mensal de R$ ${Math.round(metrics.calculatedEconomyMonthly).toLocaleString("pt-BR")}, atingindo o ponto de equilíbrio financeiro do investimento em apenas ${metrics.calculatedPaybackMonths} meses.`);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Conexao de IA falhou. Injetamos uma sintese de ROI estruturada.");
      setAiExecutiveSummary(`A analise financeira para a operacao de ${clientNameResolved} comprova a viabilidade do projeto. Atualmente, os processos manuais de auditoria acarretam num desperdicio severo de recursos de pessoal. Com uma economia projetada anual de R$ ${Math.round(metrics.calculatedEconomyYearly).toLocaleString("pt-BR")}, as licensas mensais propostas trazem retorno financeiro (payback) imediato de ${metrics.calculatedPaybackMonths} meses.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || clientName) : clientName;
    if (!clientNameResolved || !title) return;

    const bcContent: BusinessCaseContent = {
      clientName: clientNameResolved,
      segment: chosenSector,
      workersCount,
      wasteHoursPerWeek,
      workerHourlyCost,
      paperFormsPerDay,
      auditsPerYear,
      monthlyLicensePrice,
      calculatedEconomyYearly: metrics.calculatedEconomyYearly,
      calculatedEconomyMonthly: metrics.calculatedEconomyMonthly,
      calculatedPaperSavedYearly: metrics.paperSheetsSavedYearly,
      calculatedPaybackMonths: metrics.calculatedPaybackMonths,
      aiExecutiveSummary: aiExecutiveSummary || "Retorno de investimento verificado sob premissas de aumento de performance operacional."
    };

    const record: Material = {
      id: `bc-${Date.now()}`,
      title,
      type: "business_case",
      accountId: accountId || undefined,
      clientName: clientNameResolved,
      createdAt: new Date().toISOString().split("T")[0],
      content: { businessCase: bcContent },
      compiledHtml: compileBusinessCaseHtml(bcContent)
    };

    onAddBusinessCase(record);
    setViewState("list");

    // reset
    setTitle("");
    setAccountId("");
    setClientName("");
    setAiExecutiveSummary("");
  };

  const triggerCopy = (m: Material) => {
    navigator.clipboard.writeText(m.compiledHtml);
    setCopiedCaseId(m.id);
    setTimeout(() => setCopiedCaseId(null), 3000);
  };

  const triggerDownload = (m: Material) => {
    if (!m.content.businessCase) return;
    const blob = new Blob([m.compiledHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ROI_ChecklistFacil_${m.content.businessCase.clientName.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {viewState === "list" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider text-left">Casos de ROI Salvos</h3>
            <button
              onClick={() => {
                setAccountId("");
                setViewState("calculator");
              }}
              className="h-10 px-4 bg-cf-escuro hover:bg-cf-verde text-white text-xs font-bold transition cf-shape cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Estudo de ROI</span>
            </button>
          </div>

          {businessCases.length === 0 ? (
            <div className="bg-white border border-cf-surface/20 p-16 rounded-2xl text-center space-y-4">
              <Sliders className="w-12 h-12 mx-auto text-cf-escuro/20" />
              <div>
                <h4 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">Nenhum Estudo de ROI</h4>
                <p className="text-xs text-cf-cinza-dk/55 max-w-xs mx-auto font-light mt-1">
                  Abra a calculadora inteligente para simular paybacks e gerar relatorios estruturados.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessCases.map(bc => {
                const values = bc.content.businessCase;
                return (
                  <div key={bc.id} className="bg-white border border-cf-surface/30 p-5 cf-shape flex flex-col justify-between hover:shadow-sm transition">
                    <div className="text-left space-y-2">
                      <span className="text-[10px] bg-cf-laranja/10 text-cf-laranja font-semibold px-2 py-0.5 rounded">Estudo de Viabilidade</span>
                      <h4 className="text-[14px] font-bold text-cf-escuro leading-tight">{bc.title}</h4>
                      <p className="text-[11px] text-cf-cinza-dk/70 font-light">Cliente: <strong className="font-semibold text-cf-escuro/85">{bc.clientName}</strong></p>
                      
                      {values && (
                        <div className="grid grid-cols-2 gap-2 bg-cf-surface/30 p-2.5 rounded-lg border border-cf-surface/40 text-[11px] font-medium mt-2">
                          <div>
                            <span className="text-cf-cinza-dk/50 font-light block">Econ. Anual</span>
                            <span className="text-cf-verde font-bold">R$ {Math.round(values.calculatedEconomyYearly).toLocaleString("pt-BR")}</span>
                          </div>
                          <div>
                            <span className="text-cf-cinza-dk/50 font-light block">Payback</span>
                            <span className="text-cf-laranja font-bold">{values.calculatedPaybackMonths} Meses</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-cf-surface/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onDeleteBusinessCase(bc.id)}
                        className="p-1.5 hover:bg-rose-50 rounded text-rose-500/50 hover:text-rose-600 transition cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedCase(bc);
                            setViewState("preview");
                          }}
                          className="h-8 px-3 hover:bg-cf-surface rounded text-cf-escuro text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visualizar</span>
                        </button>
                        <button
                          onClick={() => triggerCopy(bc)}
                          className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
                        >
                          {copiedCaseId === bc.id ? (
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
                          onClick={() => triggerDownload(bc)}
                          className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5 text-cf-cinza-dk/60" />
                          <span>Baixar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {viewState === "calculator" && (
        <div className="bg-white border border-cf-surface/25 p-6 cf-shape text-left space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-cf-surface/30">
            <button
              onClick={() => setViewState("list")}
              className="p-1.5 hover:bg-cf-surface rounded text-cf-escuro"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-cf-escuro">Calculadora de ROI & Business Case Financeiro</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left sliders sand */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Vincular Conta de Lead (Opcional)</label>
                <select
                  value={accountId}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-2 text-xs focus:outline-none"
                >
                  <option value="">-- Sem vinculo (Preencher Manualmente) --</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wider mb-1.5">Nome do Estudo / Cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setTitle(`Estudo de ROI Business Case - ${e.target.value}`);
                  }}
                  placeholder="Ex: Alimentos do Brasil S/A"
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              {/* Sliders loop */}
              <div className="space-y-3.5 pt-2">
                {/* WorkersCount */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-cf-escuro mb-1">
                    <span>Colaboradores em campo:</span>
                    <span className="text-cf-verde">{workersCount} profissionais</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={workersCount}
                    onChange={(e) => setWorkersCount(Number(e.target.value))}
                    className="w-full h-2 bg-cf-surface rounded-lg appearance-none cursor-pointer accent-cf-verde"
                  />
                </div>

                {/* WasteHoursPerWeek */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-cf-escuro mb-1">
                    <span>Horas desperdiçadas / semana por técnico:</span>
                    <span className="text-cf-verde">{wasteHoursPerWeek} horas</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={wasteHoursPerWeek}
                    onChange={(e) => setWasteHoursPerWeek(Number(e.target.value))}
                    className="w-full h-2 bg-cf-surface rounded-lg appearance-none cursor-pointer accent-cf-verde"
                  />
                  <span className="text-[10px] text-cf-cinza-dk/45 block mt-0.5">Tempo gasto consolidando pranchetas ou compilando Excel.</span>
                </div>

                {/* WorkerHourlyCost */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-cf-escuro mb-1">
                    <span>Custo médio de hora (com encargos):</span>
                    <span className="text-cf-verde">R$ {workerHourlyCost} por hora</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={workerHourlyCost}
                    onChange={(e) => setWorkerHourlyCost(Number(e.target.value))}
                    className="w-full h-2 bg-cf-surface rounded-lg appearance-none cursor-pointer accent-cf-verde"
                  />
                </div>

                {/* PaperFormsPerDay */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-cf-escuro mb-1">
                    <span>Folhas de papel checklists / dia colecionadas:</span>
                    <span className="text-cf-verde">{paperFormsPerDay} formulários</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={paperFormsPerDay}
                    onChange={(e) => setPaperFormsPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-cf-surface rounded-lg appearance-none cursor-pointer accent-cf-verde"
                  />
                </div>

                {/* MonthlyLicensePrice */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-cf-escuro mb-1">
                    <span>Licenciamento Checklist Fácil (Venda SaaS):</span>
                    <span className="text-cf-laranja">R$ {monthlyLicensePrice} / mensal</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="8000"
                    step="100"
                    value={monthlyLicensePrice}
                    onChange={(e) => setMonthlyLicensePrice(Number(e.target.value))}
                    className="w-full h-2 bg-cf-surface rounded-lg appearance-none cursor-pointer accent-cf-laranja"
                  />
                </div>
              </div>
            </div>

            {/* Calculations results right column */}
            <div className="space-y-4">
              <div className="bg-cf-surface/40 p-5 rounded-2xl border border-cf-surface flex flex-col justify-between">
                <h4 className="text-xs font-bold text-cf-escuro uppercase tracking-wider mb-3">Métricas Estimadas por IA e Cálculos</h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-cf-surface shadow-3xs">
                    <span className="text-[10px] text-cf-cinza-dk/55 uppercase font-medium block">Retorno Anual</span>
                    <span className="text-xs text-cf-verde font-bold block mt-1">R$ {Math.round(metrics.calculatedEconomyYearly).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-cf-surface shadow-3xs">
                    <span className="text-[10px] text-cf-cinza-dk/55 uppercase font-medium block">Ponto de Equilíbrio</span>
                    <span className="text-xs text-cf-laranja font-bold block mt-1">{metrics.calculatedPaybackMonths} Meses</span>
                  </div>
                </div>

                <div className="text-xs text-cf-cinza-dk/70 space-y-2 pt-1 font-light">
                  <p>• Total de horas de retrabalho neutralizadas: <strong>{metrics.hoursWastedYearly.toLocaleString("pt-BR")} h/ano</strong></p>
                  <p>• Redução direta na pegada de papel ecológica: <strong>{Math.round(metrics.paperSheetsSavedYearly).toLocaleString("pt-BR")} folhas/ano</strong></p>
                  <p>• Economia financeira potencial mensal líquida: <strong>R$ {Math.round(metrics.calculatedEconomyMonthly).toLocaleString("pt-BR")} /mês</strong></p>
                </div>
              </div>

              {/* Justification generation bar */}
              <div className="border border-cf-laranja/30 bg-cf-laranja/5 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cf-escuro uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cf-laranja animate-pulse" />
                    <span>Parecer Executivo CFO por IA</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAiJustification}
                    disabled={isAiLoading}
                    className="h-8 px-3 bg-cf-laranja hover:bg-cf-laranja/95 text-white font-bold rounded-lg text-[10px] uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Gerar Carta B2B</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && <p className="text-[10px] text-rose-500 font-semibold">{errorMsg}</p>}

                <textarea
                  value={aiExecutiveSummary}
                  onChange={(e) => setAiExecutiveSummary(e.target.value)}
                  placeholder="Seu sumario analitico de justificativa CFO para o cliente, livre de emojis, aparecera aqui após cliques rápidos no robô acima."
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
              disabled={!clientName}
              className="h-10 px-6 bg-cf-escuro hover:bg-cf-escuro/90 text-white font-bold rounded-xl text-xs transition cf-shape disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Salvar Estudo de ROI
            </button>
          </div>
        </div>
      )}

      {viewState === "preview" && selectedCase && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-cf-surface/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewState("list")}
                className="p-1 px-3 bg-cf-surface border border-cf-surface text-cf-escuro rounded text-xs"
              >
                Voltar a lista
              </button>
              <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">{selectedCase.title}</h3>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerCopy(selectedCase)}
                className="h-8 px-3 bg-cf-escuro text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar HTML</span>
              </button>
              <button
                onClick={() => triggerDownload(selectedCase)}
                className="h-8 px-3 bg-cf-laranja text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar HTML</span>
              </button>
            </div>
          </div>

          <div className="bg-cf-surface border border-cf-surface rounded-2xl p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-lg border border-cf-surface/70 w-full overflow-hidden flex flex-col h-[520px]">
              <iframe
                title="Mock Preview Business Case"
                srcDoc={selectedCase.compiledHtml}
                className="w-full flex-1 border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
