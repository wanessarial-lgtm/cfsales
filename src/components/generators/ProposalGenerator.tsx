import React, { useState } from "react";
import { CommercialAccount, Material, ProposalContent } from "../../types";
import { compileProposalHtml } from "../../utils/generators";
import { generateText } from "../../utils/ai";
import { X, Sparkles, ExternalLink, Save, Loader } from "lucide-react";

interface Props {
  client: CommercialAccount;
  onClose: () => void;
  onSave: (m: Material) => void;
}

const DEFAULT_SCOPE = [
  "Módulo Checklist Mobile com Modo Offline",
  "Painel de Indicadores de Conformidade em Tempo Real",
  "Fluxo de Planos de Ação Automatizado",
  "Registro Fotográfico e Assinatura Digital",
];

export default function ProposalGenerator({ client, onClose, onSave }: Props) {
  const [scope, setScope] = useState<string[]>(DEFAULT_SCOPE);
  const [newScope, setNewScope] = useState("");
  const [implFee, setImplFee] = useState(3500);
  const [monthlyFee, setMonthlyFee] = useState(1800);
  const [months, setMonths] = useState(12);
  const [copywriting, setCopywriting] = useState("");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function addScope() {
    if (newScope.trim()) { setScope(prev => [...prev, newScope.trim()]); setNewScope(""); }
  }
  function removeScope(i: number) { setScope(prev => prev.filter((_, idx) => idx !== i)); }

  async function generate() {
    setGenerating(true);
    let copy = copywriting;
    if (!copy) {
      copy = await generateText(
        "Você é um consultor comercial B2B sênior da Checklist Fácil. Escreva em português pt-BR. Seja persuasivo, específico e profissional. Máximo 3 frases.",
        `Escreva um parágrafo de benefício comercial para a proposta destinada à empresa ${client.name} do setor ${client.sector}. O desafio deles é: ${client.challenges}. O escopo inclui: ${scope.join(", ")}.`
      );
      if (!copy) copy = `A solução Checklist Fácil entregará rastreabilidade total e eficiência operacional para ${client.name}, eliminando o retrabalho manual e acelerando as decisões de gestão no setor de ${client.sector}.`;
      setCopywriting(copy);
    }
    const content: ProposalContent = {
      clientName: client.name,
      segment: client.sector,
      decisorName: client.decisor,
      challengeSummary: client.challenges,
      productScope: scope,
      implementationFee: implFee,
      monthlyLicenseFee: monthlyFee,
      contractTermMonths: months,
      customCopywriting: copy,
    };
    setPreview(compileProposalHtml(content));
    setGenerating(false);
  }

  function save() {
    if (!preview) return;
    const content: ProposalContent = {
      clientName: client.name,
      segment: client.sector,
      decisorName: client.decisor,
      challengeSummary: client.challenges,
      productScope: scope,
      implementationFee: implFee,
      monthlyLicenseFee: monthlyFee,
      contractTermMonths: months,
      customCopywriting: copywriting,
    };
    onSave({
      id: `mat-${Date.now()}`,
      title: `Proposta Comercial — ${client.name}`,
      type: "proposta",
      accountId: client.id,
      clientName: client.name,
      createdAt: new Date().toISOString().split("T")[0],
      content: { proposal: content },
      compiledHtml: preview,
    });
  }

  function openPreview() {
    if (!preview) return;
    const blob = new Blob([preview], { type: "text/html;charset=utf-8" });
    window.open(URL.createObjectURL(blob), "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[rgba(13,17,23,.7)] backdrop-blur-sm">
      {/* PANEL */}
      <div className="ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-fade-in-up">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(24,75,68,.08)] bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-[14px] font-semibold text-[#184B44]">Proposta Comercial</h2>
            <p className="text-[11px] text-[#9299B0] mt-0.5">{client.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9299B0] hover:bg-[#F1F2F7] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* SCOPE */}
          <div>
            <label className="gen-label">Escopo / Módulos incluídos</label>
            <div className="space-y-2 mb-3">
              {scope.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#E6F9F1] text-[#184B44] text-[12px] font-medium px-3 py-2 rounded-[8px_8px_8px_2px]">
                  <span className="flex-1">{s}</span>
                  <button onClick={() => removeScope(i)} className="text-[#184B44]/40 hover:text-[#FF7133]"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="gen-input flex-1"
                placeholder="Adicionar módulo..."
                value={newScope}
                onChange={e => setNewScope(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addScope()}
              />
              <button onClick={addScope} className="px-3 py-2 bg-[#F1F2F7] text-[#184B44] text-[12px] font-semibold rounded-[8px_8px_8px_2px] hover:bg-[#E6F9F1] transition-colors">+ Add</button>
            </div>
          </div>

          {/* PRICING */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="gen-label">Implantação (R$)</label>
              <input type="number" className="gen-input" value={implFee} onChange={e => setImplFee(Number(e.target.value))} />
            </div>
            <div>
              <label className="gen-label">Mensal (R$)</label>
              <input type="number" className="gen-input" value={monthlyFee} onChange={e => setMonthlyFee(Number(e.target.value))} />
            </div>
            <div>
              <label className="gen-label">Contrato (meses)</label>
              <input type="number" className="gen-input" value={months} onChange={e => setMonths(Number(e.target.value))} />
            </div>
          </div>

          {/* COPYWRITING */}
          <div>
            <label className="gen-label">Texto de benefício (deixe em branco para gerar com IA)</label>
            <textarea
              className="gen-input resize-none"
              rows={3}
              placeholder="Será gerado automaticamente pela IA se deixado vazio..."
              value={copywriting}
              onChange={e => setCopywriting(e.target.value)}
            />
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00AC69] text-white text-[13px] font-semibold rounded-[999px] hover:bg-[#009a5e] transition-all shadow-[0_4px_16px_rgba(0,172,105,.3)] disabled:opacity-60"
          >
            {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Gerando proposta..." : "Gerar Proposta Enterprise"}
          </button>

          {/* PREVIEW FEEDBACK */}
          {preview && (
            <div className="border border-[rgba(0,172,105,.2)] bg-[#E6F9F1] rounded-[12px_12px_12px_2px] px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[#184B44] font-medium">Proposta gerada com sucesso.</span>
              <button onClick={openPreview} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#184B44] hover:text-[#00AC69] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Visualizar
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[rgba(24,75,68,.08)] flex gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px] hover:bg-[#E8E9F0] transition-colors">
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={!preview}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-[#184B44] rounded-[999px] hover:bg-[#0f3330] transition-all disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar proposta
          </button>
        </div>
      </div>

      <style>{`
        .gen-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #5A6073; margin-bottom: 6px; }
        .gen-input { width: 100%; padding: 9px 12px; background: #F1F2F7; border: 1px solid rgba(24,75,68,.08); border-radius: 10px 10px 10px 2px; font-family: inherit; font-size: 13px; color: #1E2235; outline: none; transition: border-color .2s; }
        .gen-input:focus { border-color: #00AC69; background: white; }
      `}</style>
    </div>
  );
}
