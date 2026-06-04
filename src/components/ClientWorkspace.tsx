import React, { useState } from "react";
import { CommercialAccount, Material } from "../types";
import { ArrowLeft, FileText, BarChart2, Layers, ExternalLink, Trash2, Download, Edit2 } from "lucide-react";
import ProposalGenerator from "./generators/ProposalGenerator";
import MaterialGenerator from "./generators/MaterialGenerator";
import RoiGenerator from "./generators/RoiGenerator";
import ClientModal from "./ClientModal";

interface Props {
  client: CommercialAccount;
  materials: Material[];
  onBack: () => void;
  onSaveMaterial: (m: Material) => void;
  onDeleteMaterial: (id: string) => void;
  onUpdateClient: (a: CommercialAccount) => void;
}

type GeneratorType = "proposta" | "material" | "roi" | null;

const TYPE_LABEL: Record<string, string> = {
  proposta: "Proposta Comercial",
  business_case: "Estudo de ROI",
  material_customizado: "Material Personalizado",
};

const TYPE_COLOR: Record<string, string> = {
  proposta: "bg-[#E6F9F1] text-[#184B44]",
  business_case: "bg-[#FFF0E8] text-[#8a3a10]",
  material_customizado: "bg-[#EAF4FC] text-[#1a5280]",
};

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function openPreview(html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  window.open(URL.createObjectURL(blob), "_blank");
}

export default function ClientWorkspace({ client, materials, onBack, onSaveMaterial, onDeleteMaterial, onUpdateClient }: Props) {
  const [activeGenerator, setActiveGenerator] = useState<GeneratorType>(null);
  const [editingClient, setEditingClient] = useState(false);

  const generators = [
    {
      id: "proposta" as const,
      label: "Proposta Comercial",
      desc: "Gere uma proposta enterprise completa, no estilo landing page da Checklist Fácil, pronta para enviar ao cliente.",
      icon: FileText,
      accent: "hover:border-[#00AC69] hover:shadow-[0_8px_24px_rgba(0,172,105,.12)]",
      badge: "bg-[#E6F9F1] text-[#184B44]",
      badgeText: "HTML interativo",
    },
    {
      id: "material" as const,
      label: "Material Personalizado",
      desc: "Crie documentos com tópicos e textos definidos por você, gerados no mesmo layout profissional da proposta.",
      icon: Layers,
      accent: "hover:border-[#469DE2] hover:shadow-[0_8px_24px_rgba(70,157,226,.12)]",
      badge: "bg-[#EAF4FC] text-[#1a5280]",
      badgeText: "Conteúdo livre",
    },
    {
      id: "roi" as const,
      label: "Estudo de ROI",
      desc: "Insira os dados operacionais do cliente, calcule a economia anual e gere um relatório financeiro para apresentação.",
      icon: BarChart2,
      accent: "hover:border-[#FF7133] hover:shadow-[0_8px_24px_rgba(255,113,51,.12)]",
      badge: "bg-[#FFF0E8] text-[#8a3a10]",
      badgeText: "Calculadora + relatório",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

      {/* BACK + CLIENT HEADER */}
      <div className="flex items-start gap-4">
        <button onClick={onBack} className="mt-1 flex items-center gap-1.5 text-[12px] text-[#5A6073] hover:text-[#184B44] transition-colors font-medium shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" />
          Leads
        </button>
        <div className="flex-1 bg-white border border-[rgba(24,75,68,.08)] rounded-[14px_14px_14px_2px] px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-[#184B44] tracking-tight">{client.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[11px] text-[#5A6073]">{client.decisor}</span>
              {client.cargo && <span className="text-[10px] text-[#9299B0]">· {client.cargo}</span>}
              <span className="text-[10px] bg-[#E6F9F1] text-[#184B44] font-semibold px-2 py-0.5 rounded-[6px_6px_6px_2px]">{client.sector}</span>
              <span className="text-[10px] text-[#9299B0]">{client.porte}</span>
            </div>
            {client.challenges && (
              <p className="text-[11px] text-[#9299B0] font-light mt-1.5 max-w-xl line-clamp-1">{client.challenges}</p>
            )}
          </div>
          <button
            onClick={() => setEditingClient(true)}
            className="flex items-center gap-1.5 text-[11px] text-[#5A6073] hover:text-[#184B44] font-medium border border-[rgba(24,75,68,.1)] px-3 py-1.5 rounded-[8px_8px_8px_2px] hover:bg-[#F1F2F7] transition-all shrink-0"
          >
            <Edit2 className="w-3 h-3" />
            Editar
          </button>
        </div>
      </div>

      {/* 3 GENERATOR CARDS */}
      <div>
        <h2 className="text-[11px] font-semibold text-[#9299B0] uppercase tracking-wider mb-3">Gerar material para {client.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generators.map(gen => {
            const Icon = gen.icon;
            const count = materials.filter(m => {
              if (gen.id === "proposta") return m.type === "proposta";
              if (gen.id === "roi") return m.type === "business_case";
              return m.type === "material_customizado";
            }).length;
            return (
              <button
                key={gen.id}
                onClick={() => setActiveGenerator(gen.id)}
                className={`bg-white border-2 border-[rgba(24,75,68,.07)] rounded-[16px_16px_16px_4px] p-6 text-left transition-all duration-200 ${gen.accent} group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-[12px_12px_12px_2px] bg-[#F1F2F7] group-hover:bg-[#E6F9F1] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-[#184B44]" />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-[999px] ${gen.badge}`}>{gen.badgeText}</span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#184B44] mb-2">{gen.label}</h3>
                <p className="text-[12px] text-[#5A6073] font-light leading-relaxed">{gen.desc}</p>
                {count > 0 && (
                  <div className="mt-4 text-[10px] text-[#9299B0] font-medium">
                    {count} {count === 1 ? "gerado" : "gerados"} anteriormente
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERATED MATERIALS LIST */}
      {materials.length > 0 && (
        <div>
          <h2 className="text-[11px] font-semibold text-[#9299B0] uppercase tracking-wider mb-3">Materiais gerados</h2>
          <div className="space-y-2">
            {materials.map(mat => (
              <div key={mat.id} className="bg-white border border-[rgba(24,75,68,.08)] rounded-[12px_12px_12px_2px] px-4 py-3 flex items-center gap-3">
                <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-[6px_6px_6px_2px] shrink-0 ${TYPE_COLOR[mat.type] || "bg-[#F1F2F7] text-[#5A6073]"}`}>
                  {TYPE_LABEL[mat.type] || mat.type}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-[#184B44] truncate block">{mat.title}</span>
                  <span className="text-[10px] text-[#9299B0] font-light">{mat.createdAt}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openPreview(mat.compiledHtml)}
                    className="p-1.5 rounded-lg text-[#9299B0] hover:text-[#184B44] hover:bg-[#F1F2F7] transition-all"
                    title="Visualizar"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => downloadHtml(mat.compiledHtml, `${mat.type}-${client.name.replace(/\s+/g, "-")}.html`)}
                    className="p-1.5 rounded-lg text-[#9299B0] hover:text-[#184B44] hover:bg-[#F1F2F7] transition-all"
                    title="Baixar HTML"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMaterial(mat.id)}
                    className="p-1.5 rounded-lg text-[#9299B0] hover:text-[#FF7133] hover:bg-[#FFF0E8] transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GENERATORS (slide-in panels) */}
      {activeGenerator === "proposta" && (
        <ProposalGenerator
          client={client}
          onClose={() => setActiveGenerator(null)}
          onSave={(m) => { onSaveMaterial(m); setActiveGenerator(null); }}
        />
      )}
      {activeGenerator === "material" && (
        <MaterialGenerator
          client={client}
          onClose={() => setActiveGenerator(null)}
          onSave={(m) => { onSaveMaterial(m); setActiveGenerator(null); }}
        />
      )}
      {activeGenerator === "roi" && (
        <RoiGenerator
          client={client}
          onClose={() => setActiveGenerator(null)}
          onSave={(m) => { onSaveMaterial(m); setActiveGenerator(null); }}
        />
      )}

      {editingClient && (
        <ClientModal
          account={client}
          onSave={(updated) => { onUpdateClient(updated); setEditingClient(false); }}
          onClose={() => setEditingClient(false)}
        />
      )}
    </div>
  );
}
