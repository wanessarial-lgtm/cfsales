import React, { useState } from "react";
import { CommercialAccount, Material, CustomMaterialContent, CustomSection } from "../../types";
import { compileCustomMaterialHtml } from "../../utils/generators";
import { X, Plus, Trash2, ExternalLink, Save, GripVertical } from "lucide-react";

interface Props {
  client: CommercialAccount;
  onClose: () => void;
  onSave: (m: Material) => void;
}

const ACCENT_OPTIONS = [
  { value: "verde" as const, label: "Verde", color: "#00AC69" },
  { value: "azul" as const, label: "Azul", color: "#469DE2" },
  { value: "laranja" as const, label: "Laranja", color: "#FF7133" },
];

export default function MaterialGenerator({ client, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [accent, setAccent] = useState<"verde" | "azul" | "laranja">("verde");
  const [sections, setSections] = useState<CustomSection[]>([
    { heading: "", body: "" },
  ]);
  const [preview, setPreview] = useState<string | null>(null);

  function updateSection(i: number, field: "heading" | "body", val: string) {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }
  function addSection() { setSections(prev => [...prev, { heading: "", body: "" }]); }
  function removeSection(i: number) { setSections(prev => prev.filter((_, idx) => idx !== i)); }

  function generate() {
    if (!title.trim()) return;
    const content: CustomMaterialContent = {
      clientName: client.name,
      documentTitle: title,
      documentSubtitle: subtitle || `Preparado especialmente para ${client.name}`,
      accentColor: accent,
      sections: sections.filter(s => s.heading.trim()),
    };
    setPreview(compileCustomMaterialHtml(content));
  }

  function save() {
    if (!preview) return;
    const content: CustomMaterialContent = {
      clientName: client.name,
      documentTitle: title,
      documentSubtitle: subtitle,
      accentColor: accent,
      sections,
    };
    onSave({
      id: `mat-${Date.now()}`,
      title: `${title} — ${client.name}`,
      type: "material_customizado",
      accountId: client.id,
      clientName: client.name,
      createdAt: new Date().toISOString().split("T")[0],
      content: { customMaterial: content },
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
            <h2 className="text-[14px] font-semibold text-[#184B44]">Material Personalizado</h2>
            <p className="text-[11px] text-[#9299B0] mt-0.5">{client.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9299B0] hover:bg-[#F1F2F7] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* DOCUMENT INFO */}
          <div className="space-y-3">
            <div>
              <label className="gen-label">Título do documento *</label>
              <input className="gen-input" placeholder="Ex: Apresentação de Soluções, Guia de Implementação..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="gen-label">Subtítulo / descrição</label>
              <input className="gen-input" placeholder="Uma linha descrevendo o conteúdo..." value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            </div>
          </div>

          {/* ACCENT COLOR */}
          <div>
            <label className="gen-label">Cor de destaque</label>
            <div className="flex gap-2">
              {ACCENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAccent(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[8px_8px_8px_2px] text-[12px] font-semibold border-2 transition-all ${accent === opt.value ? "border-current" : "border-transparent bg-[#F1F2F7]"}`}
                  style={{ color: opt.color, borderColor: accent === opt.value ? opt.color : undefined }}
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: opt.color }}></span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTIONS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="gen-label mb-0">Tópicos / Seções</label>
              <button onClick={addSection} className="flex items-center gap-1 text-[11px] font-semibold text-[#00AC69] hover:text-[#184B44] transition-colors">
                <Plus className="w-3.5 h-3.5" />Adicionar tópico
              </button>
            </div>
            <div className="space-y-3">
              {sections.map((sec, i) => (
                <div key={i} className="bg-[#F1F2F7] rounded-[12px_12px_12px_2px] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-[#9299B0] shrink-0" />
                    <input
                      className="gen-input-flat flex-1"
                      placeholder={`Título do tópico ${i + 1}...`}
                      value={sec.heading}
                      onChange={e => updateSection(i, "heading", e.target.value)}
                    />
                    <button onClick={() => removeSection(i)} className="p-1 text-[#9299B0] hover:text-[#FF7133] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    className="gen-input-flat w-full resize-none"
                    rows={3}
                    placeholder="Conteúdo deste tópico..."
                    value={sec.body}
                    onChange={e => updateSection(i, "body", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!title.trim() || sections.filter(s => s.heading.trim()).length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#469DE2] text-white text-[13px] font-semibold rounded-[999px] hover:bg-[#2e87d4] transition-all disabled:opacity-50"
          >
            Gerar Material
          </button>

          {preview && (
            <div className="border border-[rgba(70,157,226,.25)] bg-[#EAF4FC] rounded-[12px_12px_12px_2px] px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[#1a5280] font-medium">Material gerado com sucesso.</span>
              <button onClick={openPreview} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1a5280] hover:text-[#469DE2]">
                <ExternalLink className="w-3.5 h-3.5" />Visualizar
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[rgba(24,75,68,.08)] flex gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px]">Cancelar</button>
          <button onClick={save} disabled={!preview} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-[#184B44] rounded-[999px] disabled:opacity-40">
            <Save className="w-3.5 h-3.5" />Salvar material
          </button>
        </div>
      </div>

      <style>{`
        .gen-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#5A6073;margin-bottom:6px}
        .gen-input{width:100%;padding:9px 12px;background:#F1F2F7;border:1px solid rgba(24,75,68,.08);border-radius:10px 10px 10px 2px;font-family:inherit;font-size:13px;color:#1E2235;outline:none;transition:border-color .2s}
        .gen-input:focus{border-color:#469DE2;background:white}
        .gen-input-flat{padding:7px 10px;background:white;border:1px solid rgba(24,75,68,.08);border-radius:8px 8px 8px 2px;font-family:inherit;font-size:12px;color:#1E2235;outline:none;transition:border-color .2s}
        .gen-input-flat:focus{border-color:#469DE2}
        .gen-input-flat::placeholder{color:#9299B0}
      `}</style>
    </div>
  );
}
