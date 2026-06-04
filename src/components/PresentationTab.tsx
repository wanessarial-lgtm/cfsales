import React, { useState } from "react";
import { Material, CommercialAccount, SlideItem, PresentationContent } from "../types";
import { compilePresentationHtml } from "../utils/generators";
import { Tv, Plus, Sparkles, Eye, Copy, Download, Trash2, ArrowLeft, Loader2, CheckCircle, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";

interface PresentationTabProps {
  presentations: Material[];
  accounts: CommercialAccount[];
  onAddPresentation: (pres: Material) => void;
  onDeletePresentation: (id: string) => void;
  selectedAccountPreset?: CommercialAccount | null;
}

export default function PresentationTab({
  presentations,
  accounts,
  onAddPresentation,
  onDeletePresentation,
  selectedAccountPreset
}: PresentationTabProps) {
  const [viewState, setViewState] = useState<"list" | "builder" | "preview">("list");
  const [selectedPres, setSelectedPres] = useState<Material | null>(null);

  // Presentation States
  const [title, setTitle] = useState("");
  const [accountId, setAccountId] = useState(selectedAccountPreset?.id || "");
  const [clientName, setClientName] = useState("");
  const [chosenSector, setChosenSector] = useState("Qualidade");
  const [themeStyle, setThemeStyle] = useState<"standard" | "dark" | "bold">("standard");
  const [customFocusArea, setCustomFocusArea] = useState("Auditorias de Processo");

  // Slides array structured
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: "slide-1",
      title: "Eliminando o Papel e o Atraso Operacional",
      subtitle: "A Solucao Digital Checklist Facil",
      bullets: [
        "Transicoes rapidas do preenchimento manual de checklists de campo",
        "Acesso e preenchimento 100% offline atraves de tablets e celulares",
        "Padronizacao e conformidade automatica no chao de fabrica"
      ]
    },
    {
      id: "slide-2",
      title: "O Diagnostico dos Desafios Operacionais",
      subtitle: "Tempo desperdicado com consolidacao manual",
      bullets: [
        "Perda de informacoes operacionais devido ao extravio de folhas",
        "Conferencia e digitacao manual de pranchetas consome horas produtivas",
        "Falta de visibilidade analitica consolidada para a alta gerencia"
      ]
    },
    {
      id: "slide-3",
      title: "A Solucao Checklist Facil Ativa",
      subtitle: "Centralizacao, Agilidade e Seguranca",
      bullets: [
        "Inspecao fotografica integrada com registros e anotacoes de evidencias",
        "Abertura automatica e instantanea de Planos de Acao corretivos",
        "Assinatura digital direta na tela do dispositivo movel"
      ]
    },
    {
      id: "slide-4",
      title: "Indicadores e Resultados de Negocio",
      subtitle: "Informacao analitica instantanea",
      bullets: [
        "Dashboard gerencial atualizado automaticamente apos cada envio",
        "Mapeamento inteligente de nao-conformidades recorrentes por setor",
        "Reducao de ate 80% no tempo gasto na geracao de relatorios de auditoria"
      ]
    },
    {
      id: "slide-5",
      title: "Proximos Passos e Onboarding operacional",
      subtitle: "Parceria estrategica de longo prazo",
      bullets: [
        "Fase Piloto focada nas principais frentes de trabalho da equipe",
        "Treinamento dedicado dos operadores e lideres operacionais",
        "Liberacao das licensas de producao em ate dez dias"
      ]
    }
  ]);

  // Editing current active slide index in builder preview
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedPresId, setCopiedPresId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedAccountPreset) {
      setAccountId(selectedAccountPreset.id);
      setClientName(selectedAccountPreset.name);
      setChosenSector(selectedAccountPreset.sector);
      setTitle(`Apresentacao de Ativacao - ${selectedAccountPreset.name}`);
      setViewState("builder");
    }
  }, [selectedAccountPreset]);

  // Autofill account
  const handleAccountChange = (id: string) => {
    setAccountId(id);
    if (id) {
      const match = accounts.find(a => a.id === id);
      if (match) {
        setClientName(match.name);
        setChosenSector(match.sector);
        setTitle(`Apresentacao de Ativacao - ${match.name}`);
      }
    } else {
      setClientName("");
      setTitle("");
    }
  };

  // Generate specialized customized slides using Gemini on express backend
  const handleAiSlidesGenerate = async () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || clientName) : clientName;
    if (!clientNameResolved) {
      setErrorMsg("Selecione um cliente antes de disparar o robô de IA.");
      return;
    }

    setIsAiLoading(true);
    setErrorMsg("");

    const systemPrompt = `Voce e o designer de roteiros de apresentacao comercial senior do Checklist Facil.
Sua missao e compilar um roteiro focado em 5 slides (Capa, Problema, Solucao, Impacto/Dashboard, Proximos Passos).
Personalize os titulos, subtitulos e bullet points de cada slide de acordo com as particularidades operacionais do segmento do cliente.
Sua resposta deve ser estritamente um objeto JSON com a chave "slides" contendo uma array de 5 objetos com formato { "id": "slide-... ", "title": "...", "subtitle": "...", "bullets": ["...", "...", "..."] }.
Nao envie blocos markdown do tipo \`\`\`json ou introducoes explicativas.
Nao use absolutamente NENHUM emoji (Regra: Zero emojis).`;

    const userMsg = `Crie a apresentacao para o cliente "${clientNameResolved}" no setor "${chosenSector}".
Foco central solicitado nas frentes: "${customFocusArea}".
O cliente sofre com problemas de papelada ou checklists analogicos.
Gere frases corporativas impactantes e de excelente design textual em portugues.`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userMessage: userMsg })
      });

      if (!res.ok) {
        throw new Error("Falha ao comunicar com o servidor proxy do Gemini.");
      }

      const data = await res.json();
      if (data && data.slides && Array.isArray(data.slides)) {
        setSlides(data.slides);
        setActiveSlideIdx(0);
      } else if (data && data.text) {
        // Fallback or string try-parse
        setErrorMsg("IA retornou formato complexo. Carregamos o roteiro base otimizado.");
      } else {
        setErrorMsg("Formato de retorno anômalo. Mantivemos os slides estruturados de Checklist Fácil.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Ocorreu uma instabilidade na conexao. Mantivemos os slides base otimizados para voce.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUpdateSlideField = (index: number, field: "title" | "subtitle", value: string) => {
    setSlides(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleUpdateSlideBullet = (slideIdx: number, bulletIdx: number, value: string) => {
    setSlides(prev => {
      const copy = [...prev];
      const bulletCopy = [...copy[slideIdx].bullets];
      bulletCopy[bulletIdx] = value;
      copy[slideIdx] = { ...copy[slideIdx], bullets: bulletCopy };
      return copy;
    });
  };

  const handleSave = () => {
    const clientNameResolved = accountId ? (accounts.find(a => a.id === accountId)?.name || clientName) : clientName;
    if (!clientNameResolved || !title) return;

    const presContent: PresentationContent = {
      clientName: clientNameResolved,
      segment: chosenSector,
      themeStyle,
      customFocusArea,
      slides
    };

    const record: Material = {
      id: `pres-${Date.now()}`,
      title,
      type: "apresentacao",
      accountId: accountId || undefined,
      clientName: clientNameResolved,
      createdAt: new Date().toISOString().split("T")[0],
      content: { presentation: presContent },
      compiledHtml: compilePresentationHtml(presContent)
    };

    onAddPresentation(record);
    setViewState("list");

    // reset
    setTitle("");
    setAccountId("");
    setClientName("");
    setCustomFocusArea("Auditorias de Processo");
    setActiveSlideIdx(0);
  };

  const triggerCopy = (pres: Material) => {
    navigator.clipboard.writeText(pres.compiledHtml);
    setCopiedPresId(pres.id);
    setTimeout(() => setCopiedPresId(null), 3000);
  };

  const triggerDownload = (pres: Material) => {
    if (!pres.content.presentation) return;
    const blob = new Blob([pres.compiledHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Apresentacao_ChecklistFacil_${pres.content.presentation.clientName.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {viewState === "list" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider text-left">Apresentações em HTML Salvas</h3>
            <button
              onClick={() => {
                setAccountId("");
                setViewState("builder");
              }}
              className="h-10 px-4 bg-cf-escuro hover:bg-cf-verde text-white text-xs font-bold transition cf-shape cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Apresentação</span>
            </button>
          </div>

          {presentations.length === 0 ? (
            <div className="bg-white border border-cf-surface/20 p-16 rounded-2xl text-center space-y-4">
              <Tv className="w-12 h-12 mx-auto text-cf-escuro/20" />
              <div>
                <h4 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">Nenhuma Apresentação Criada</h4>
                <p className="text-xs text-cf-cinza-dk/55 max-w-xs mx-auto font-light mt-1">
                  Abra o criador de slides para desenhar uma apresentacao em HTML customizada e interativa.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presentations.map(pres => (
                <div key={pres.id} className="bg-white border border-cf-surface/30 p-5 cf-shape flex flex-col justify-between hover:shadow-sm transition">
                  <div className="text-left space-y-2">
                    <span className="text-[10px] bg-cf-azul/10 text-cf-azul font-semibold px-2 py-0.5 rounded">Slides Interativos HTML</span>
                    <h4 className="text-[14px] font-bold text-cf-escuro leading-tight">{pres.title}</h4>
                    <p className="text-[11px] text-cf-cinza-dk/70 font-light">Cliente: <strong className="font-semibold text-cf-escuro/85">{pres.clientName}</strong></p>
                    <p className="text-[11px] text-cf-cinza-dk/60">Tema Visual: <span className="font-semibold">{pres.content.presentation?.themeStyle}</span> · Quantidade: 5 slides</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-cf-surface/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onDeletePresentation(pres.id)}
                      className="p-1.5 hover:bg-rose-50 rounded text-rose-500/50 hover:text-rose-600 transition cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedPres(pres);
                          setViewState("preview");
                        }}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-cf-escuro text-xs flex items-center gap-1 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visualizar Slides</span>
                      </button>
                      <button
                        onClick={() => triggerCopy(pres)}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
                      >
                        {copiedPresId === pres.id ? (
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
                        onClick={() => triggerDownload(pres)}
                        className="h-8 px-3 hover:bg-cf-surface rounded text-xs flex items-center gap-1"
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

      {viewState === "builder" && (
        <div className="bg-white border border-cf-surface/20 p-6 cf-shape text-left space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-cf-surface/30">
            <button
              onClick={() => setViewState("list")}
              className="p-1.5 hover:bg-cf-surface rounded text-cf-escuro animate-pulse"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-cf-escuro">Criador de Slides e Apresentacoes em HTML</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input fields form: Col-span 5 */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase mb-1.5">Cliente Vinculador (Opcional)</label>
                <select
                  value={accountId}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-2 text-xs focus:outline-none"
                >
                  <option value="">-- Sem vinculo --</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase mb-1.5">Nome do Cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setTitle(`Apresentacao de Ativacao - ${e.target.value}`);
                  }}
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase mb-1.5">Foco Comercial da Apresentação</label>
                <input
                  type="text"
                  value={customFocusArea}
                  onChange={(e) => setCustomFocusArea(e.target.value)}
                  placeholder="Ex: Auditoria de SSMA e NR-35"
                  className="w-full h-10 bg-cf-surface/40 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-cf-escuro uppercase mb-1">Setor</label>
                  <input
                    type="text"
                    value={chosenSector}
                    onChange={(e) => setChosenSector(e.target.value)}
                    className="w-full h-9 bg-cf-surface/40 border border-cf-surface rounded-lg px-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-cf-escuro uppercase mb-1">Cores/Tema</label>
                  <select
                    value={themeStyle}
                    onChange={(e) => setThemeStyle(e.target.value as any)}
                    className="w-full h-9 bg-cf-surface/40 border border-cf-surface rounded-lg px-1.5 text-xs focus:outline-none"
                  >
                    <option value="standard">Standard (Claro)</option>
                    <option value="dark">Escuro de Marca</option>
                    <option value="bold">Bold (Esmeralda)</option>
                  </select>
                </div>
              </div>

              {/* AI generator block inside Presentation */}
              <div className="border border-cf-azul/30 bg-cf-azul/5 p-4 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cf-escuro uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cf-azul animate-pulse" />
                    <span>Gerar Roteiro do Setor por IA</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAiSlidesGenerate}
                    disabled={isAiLoading}
                    className="h-8 px-3 bg-cf-azul hover:bg-cf-azul/95 text-white font-bold rounded-lg text-[10px] uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50 animate-pulse"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Fazendo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Personalizar</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && <p className="text-[10px] text-rose-500 font-semibold">{errorMsg}</p>}
                <p className="text-[10px] text-cf-cinza-dk/55 leading-relaxed font-light">
                  A nossa IA customizara os titulos e bullet points dos 5 slides baseado nas dores reais do segmento de de {chosenSector}. Livre de emojis.
                </p>
              </div>
            </div>

            {/* Slide Editor and Preview: Col-span 8 */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Desktop slide viewport preview box */}
              <div className={`p-8 cf-shape shadow-inner flex flex-col justify-between h-[300px] border relative overflow-hidden transition-all duration-300
                ${themeStyle === "dark" 
                  ? "bg-cf-cinza-dk text-white border-cf-surface/10" 
                  : themeStyle === "bold" 
                    ? "bg-cf-escuro text-white border-cf-verde/20" 
                    : "bg-white text-cf-cinza-dk border-cf-surface"
                }`}
              >
                {/* Visual Watermark decoration */}
                <div className="absolute right-0 bottom-0 text-9xl font-bold opacity-5 pointer-events-none tracking-tighter select-none font-sans">
                  CF
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-cf-verde text-[10px] font-bold uppercase tracking-widest block">CHECKLIST FÁCIL | SLIDE {activeSlideIdx + 1}</span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight mt-1">
                      {slides[activeSlideIdx].title}
                    </h3>
                    <p className={`text-xs mt-1 ${themeStyle === "standard" ? "text-cf-cinza-dk/60" : "text-cf-verde-claro/80"}`}>
                      {slides[activeSlideIdx].subtitle}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs font-light">
                    {slides[activeSlideIdx].bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-cf-laranja rounded-full shrink-0 mt-1.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Local Nav indicators */}
                <div className="flex items-center justify-between border-t border-cf-surface/10 pt-3 z-10 mt-4">
                  <span className="text-[10px] text-cf-cinza-dk/40 uppercase">Apresentacao de Impacto</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSlideIdx(prev => Math.max(0, prev - 1))}
                      disabled={activeSlideIdx === 0}
                      className="p-1 hover:bg-cf-surface/20 rounded disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold font-mono">{activeSlideIdx + 1} / 5</span>
                    <button
                      type="button"
                      onClick={() => setActiveSlideIdx(prev => Math.min(4, prev + 1))}
                      disabled={activeSlideIdx === 4}
                      className="p-1 hover:bg-cf-surface/20 rounded disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline inputs to modify active slide data on-the-fly */}
              <div className="bg-cf-surface/30 p-4 rounded-xl border border-cf-surface space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cf-escuro uppercase">
                  <Edit3 className="w-4 h-4 text-cf-verde" />
                  <span>Edição Direta do Texto do Slide Ativo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Título do Slide</label>
                    <input
                      type="text"
                      value={slides[activeSlideIdx].title}
                      onChange={(e) => handleUpdateSlideField(activeSlideIdx, "title", e.target.value)}
                      className="w-full h-8 bg-white border border-cf-surface rounded px-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Subtítulo do Slide</label>
                    <input
                      type="text"
                      value={slides[activeSlideIdx].subtitle || ""}
                      onChange={(e) => handleUpdateSlideField(activeSlideIdx, "subtitle", e.target.value)}
                      className="w-full h-8 bg-white border border-cf-surface rounded px-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold">Tópicos (Marcadores)</label>
                  {slides[activeSlideIdx].bullets.map((b, bIdx) => (
                    <input
                      key={bIdx}
                      type="text"
                      value={b}
                      onChange={(e) => handleUpdateSlideBullet(activeSlideIdx, bIdx, e.target.value)}
                      className="w-full h-8 bg-white border border-cf-surface rounded px-2 text-xs"
                    />
                  ))}
                </div>
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
              disabled={!clientName || !title}
              className="h-10 px-6 bg-cf-escuro hover:bg-cf-escuro/90 text-white font-bold rounded-xl text-xs transition cf-shape cursor-pointer disabled:opacity-40"
            >
              Salvar Roteiro de Apresentação
            </button>
          </div>
        </div>
      )}

      {viewState === "preview" && selectedPres && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-cf-surface/25">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewState("list")}
                className="p-1 px-3 bg-cf-surface border border-cf-surface text-cf-escuro rounded text-xs"
              >
                Voltar a lista
              </button>
              <h3 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">{selectedPres.title}</h3>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerCopy(selectedPres)}
                className="h-8 px-3 bg-cf-escuro text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar HTML</span>
              </button>
              <button
                onClick={() => triggerDownload(selectedPres)}
                className="h-8 px-3 bg-cf-laranja text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar HTML</span>
              </button>
            </div>
          </div>

          {/* IFrame slide screen preview container */}
          <div className="bg-cf-surface border border-cf-surface rounded-2xl p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-lg border border-cf-surface/70 w-full overflow-hidden flex flex-col h-[520px]">
              <iframe
                title="Standalone HTML slide presentation"
                srcDoc={selectedPres.compiledHtml}
                className="w-full flex-1 border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
