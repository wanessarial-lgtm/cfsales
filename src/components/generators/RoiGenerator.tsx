import React, { useState, useEffect } from "react";
import { CommercialAccount, Material, BusinessCaseContent } from "../../types";
import { compileBusinessCaseHtml } from "../../utils/generators";
import { generateText } from "../../utils/ai";
import { X, Sparkles, ExternalLink, Save, Loader } from "lucide-react";

interface Props {
  client: CommercialAccount;
  onClose: () => void;
  onSave: (m: Material) => void;
}

export default function RoiGenerator({ client, onClose, onSave }: Props) {
  const [workers, setWorkers] = useState(20);
  const [wasteHours, setWasteHours] = useState(3);
  const [hourlyCost, setHourlyCost] = useState(30);
  const [paperForms, setPaperForms] = useState(40);
  const [auditsYear, setAuditsYear] = useState(12);
  const [monthlyLicense, setMonthlyLicense] = useState(1500);
  const [summary, setSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [calc, setCalc] = useState({ monthly: 0, yearly: 0, paper: 0, payback: 0 });

  useEffect(() => {
    const yearlyHours = workers * 52 * wasteHours;
    const yearly = yearlyHours * hourlyCost;
    const monthly = yearly / 12;
    const paper = paperForms * 260;
    const payback = yearly > 0 ? (monthlyLicense / monthly) : 0;
    setCalc({ monthly, yearly, paper, payback });
  }, [workers, wasteHours, hourlyCost, paperForms, monthlyLicense]);

  async function generate() {
    setGenerating(true);
    let s = summary;
    if (!s) {
      s = await generateText(
        "Você é um analista financeiro B2B sênior. Escreva em pt-BR. Seja objetivo, use os números fornecidos, máximo 4 frases.",
        `Escreva uma justificativa executiva de ROI para ${client.name} (${client.sector}). ${workers} colaboradores perdem ${wasteHours}h/semana. Custo da hora: R$ ${hourlyCost}. Economia anual calculada: R$ ${Math.round(calc.yearly).toLocaleString("pt-BR")}. Payback: ${calc.payback.toFixed(1)} meses.`
      );
      if (!s) s = `Com ${workers} colaboradores perdendo ${wasteHours} horas semanais em processos manuais, a ${client.name} tem uma perda anual estimada de R$ ${Math.round(calc.yearly).toLocaleString("pt-BR")}. A digitalização via Checklist Fácil recupera essa produtividade com payback em apenas ${calc.payback.toFixed(1)} meses.`;
      setSummary(s);
    }
    const content: BusinessCaseContent = {
      clientName: client.name,
      segment: client.sector,
      workersCount: workers,
      wasteHoursPerWeek: wasteHours,
      workerHourlyCost: hourlyCost,
      paperFormsPerDay: paperForms,
      auditsPerYear: auditsYear,
      monthlyLicensePrice: monthlyLicense,
      calculatedEconomyYearly: calc.yearly,
      calculatedEconomyMonthly: calc.monthly,
      calculatedPaperSavedYearly: calc.paper,
      calculatedPaybackMonths: calc.payback,
      aiExecutiveSummary: s,
    };
    setPreview(compileBusinessCaseHtml(content));
    setGenerating(false);
  }

  function save() {
    if (!preview) return;
    const content: BusinessCaseContent = {
      clientName: client.name, segment: client.sector, workersCount: workers,
      wasteHoursPerWeek: wasteHours, workerHourlyCost: hourlyCost, paperFormsPerDay: paperForms,
      auditsPerYear: auditsYear, monthlyLicensePrice: monthlyLicense,
      calculatedEconomyYearly: calc.yearly, calculatedEconomyMonthly: calc.monthly,
      calculatedPaperSavedYearly: calc.paper, calculatedPaybackMonths: calc.payback,
      aiExecutiveSummary: summary,
    };
    onSave({
      id: `mat-${Date.now()}`,
      title: `Estudo de ROI — ${client.name}`,
      type: "business_case",
      accountId: client.id,
      clientName: client.name,
      createdAt: new Date().toISOString().split("T")[0],
      content: { businessCase: content },
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
      <div className="ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(24,75,68,.08)] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[14px] font-semibold text-[#184B44]">Estudo de ROI</h2>
            <p className="text-[11px] text-[#9299B0] mt-0.5">{client.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9299B0] hover:bg-[#F1F2F7] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* LIVE CALC STRIP */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Economia Mensal", value: `R$ ${Math.round(calc.monthly).toLocaleString("pt-BR")}`, color: "text-[#00AC69]" },
              { label: "Economia Anual", value: `R$ ${Math.round(calc.yearly).toLocaleString("pt-BR")}`, color: "text-[#00AC69]" },
              { label: "Payback", value: `${calc.payback.toFixed(1)} meses`, color: "text-[#FF7133]" },
              { label: "Formulários/ano", value: Math.round(calc.paper).toLocaleString("pt-BR"), color: "text-[#469DE2]" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#F1F2F7] rounded-[10px_10px_10px_2px] p-3">
                <span className="text-[10px] text-[#5A6073] uppercase tracking-wider font-medium block">{label}</span>
                <span className={`text-lg font-bold ${color} block mt-0.5`}>{value}</span>
              </div>
            ))}
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Colaboradores em campo", val: workers, set: setWorkers, min: 1 },
              { label: "Horas perdidas / semana / colaborador", val: wasteHours, set: setWasteHours, min: 0.5 },
              { label: "Custo médio da hora (R$)", val: hourlyCost, set: setHourlyCost, min: 1 },
              { label: "Formulários em papel / dia", val: paperForms, set: setPaperForms, min: 0 },
              { label: "Auditorias por ano", val: auditsYear, set: setAuditsYear, min: 0 },
              { label: "Licença mensal estimada (R$)", val: monthlyLicense, set: setMonthlyLicense, min: 100 },
            ].map(({ label, val, set, min }) => (
              <div key={label}>
                <label className="gen-label">{label}</label>
                <input
                  type="number"
                  min={min}
                  step={label.includes("hora") ? 0.5 : 1}
                  className="gen-input"
                  value={val}
                  onChange={e => set(Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="gen-label">Justificativa executiva (deixe vazio para gerar com IA)</label>
            <textarea
              className="gen-input resize-none"
              rows={3}
              placeholder="Será gerado automaticamente..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
            />
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF7133] text-white text-[13px] font-semibold rounded-[999px] hover:bg-[#e85e1a] transition-all disabled:opacity-60"
          >
            {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Calculando e gerando..." : "Gerar Relatório de ROI"}
          </button>

          {preview && (
            <div className="border border-[rgba(255,113,51,.25)] bg-[#FFF0E8] rounded-[12px_12px_12px_2px] px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[#8a3a10] font-medium">Relatório gerado com sucesso.</span>
              <button onClick={openPreview} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8a3a10] hover:text-[#FF7133]">
                <ExternalLink className="w-3.5 h-3.5" />Visualizar
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[rgba(24,75,68,.08)] flex gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px]">Cancelar</button>
          <button onClick={save} disabled={!preview} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-[#184B44] rounded-[999px] disabled:opacity-40">
            <Save className="w-3.5 h-3.5" />Salvar ROI
          </button>
        </div>
      </div>

      <style>{`
        .gen-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#5A6073;margin-bottom:5px}
        .gen-input{width:100%;padding:9px 12px;background:#F1F2F7;border:1px solid rgba(24,75,68,.08);border-radius:10px 10px 10px 2px;font-family:inherit;font-size:13px;color:#1E2235;outline:none;transition:border-color .2s}
        .gen-input:focus{border-color:#FF7133;background:white}
      `}</style>
    </div>
  );
}
