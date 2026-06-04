import React, { useState, useRef } from "react";
import { CommercialAccount, Material, CustomMaterialContent, CustomSection } from "../../types";
import { compileCustomMaterialHtml } from "../../utils/generators";
import { generateText, getGeminiKey } from "../../utils/ai";
import { X, Plus, Trash2, ExternalLink, Save, GripVertical, Sparkles, Upload, Code2, Loader, Info } from "lucide-react";

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

const EFFECT_EXAMPLES = [
  { label: "Aurora suave", code: `/* Aurora — gradiente que respira */\n.cover-extra-style {\n  background: linear-gradient(125deg, #0D1117 0%, #184B44 40%, #0a1520 100%);\n}\n.aurora {\n  position: absolute; inset: 0; overflow: hidden; pointer-events: none;\n}\n.aurora-band {\n  position: absolute; left: -20%; width: 140%; height: 60%;\n  background: linear-gradient(180deg, transparent 0%, rgba(ACCENT_RGB, .18) 50%, transparent 100%);\n  border-radius: 50%;\n  animation: aurora-move 8s ease-in-out infinite;\n}\n.aurora-band:nth-child(2) { top: 20%; animation-delay: -3s; animation-duration: 11s; opacity: .6; }\n.aurora-band:nth-child(3) { top: 40%; animation-delay: -6s; animation-duration: 14s; opacity: .4; }\n@keyframes aurora-move {\n  0%,100% { transform: translateY(0) scaleX(1); }\n  50% { transform: translateY(-30px) scaleX(1.05); }\n}` },
  { label: "Grid brilhante", code: `/* Grid com pontos brilhantes nos cruzamentos */\n.cover-grid-effect {\n  background-image:\n    radial-gradient(circle, rgba(ACCENT_RGB, .6) 1px, transparent 1px),\n    linear-gradient(rgba(ACCENT_RGB, .04) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(ACCENT_RGB, .04) 1px, transparent 1px);\n  background-size: 48px 48px, 48px 48px, 48px 48px;\n  position: absolute; inset: 0; pointer-events: none;\n}` },
  { label: "Meteoros", code: `/* Shooting stars em canvas */\n// Cole este bloco no campo de efeito JS\nconst meteors = [];\nfor(let i=0;i<8;i++) meteors.push(resetMeteor({}));\nfunction resetMeteor(m) {\n  m.x = Math.random()*canvas.width;\n  m.y = -50;\n  m.len = Math.random()*120+60;\n  m.speed = Math.random()*6+4;\n  m.opacity = Math.random()*.6+.3;\n  m.angle = Math.PI/4;\n  return m;\n}\nfunction drawMeteors() {\n  for(const m of meteors) {\n    ctx.save();\n    ctx.translate(m.x, m.y);\n    ctx.rotate(m.angle);\n    const grad = ctx.createLinearGradient(0,0,0,m.len);\n    grad.addColorStop(0,'rgba(255,255,255,0)');\n    grad.addColorStop(1,\`rgba(255,255,255,\${m.opacity})\`);\n    ctx.strokeStyle=grad;\n    ctx.lineWidth=1.5;\n    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,m.len);ctx.stroke();\n    ctx.restore();\n    m.x+=m.speed*Math.cos(m.angle);\n    m.y+=m.speed*Math.sin(m.angle);\n    if(m.y>canvas.height+100) resetMeteor(m);\n  }\n}` },
];

export default function MaterialGenerator({ client, onClose, onSave }: Props) {
  const [mode, setMode] = useState<"padrao" | "personalizado">("padrao");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [accent, setAccent] = useState<"verde" | "azul" | "laranja">("verde");
  const [sections, setSections] = useState<CustomSection[]>([{ heading: "", body: "" }]);

  // Personalizado mode
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [effectCode, setEffectCode] = useState("");
  const [interpretedBlock, setInterpretedBlock] = useState<string>("");
  const [interpreting, setInterpreting] = useState(false);
  const [interpretError, setInterpretError] = useState("");

  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const accentColorMap = { verde: "#00AC69", azul: "#469DE2", laranja: "#FF7133" };
  const accentRgbMap = { verde: "0,172,105", azul: "70,157,226", laranja: "255,113,51" };

  function updateSection(i: number, field: "heading" | "body", val: string) {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }
  function addSection() { setSections(prev => [...prev, { heading: "", body: "" }]); }
  function removeSection(i: number) { setSections(prev => prev.filter((_, idx) => idx !== i)); }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoBase64(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function interpretEffect() {
    if (!effectCode.trim()) return;
    setInterpreting(true);
    setInterpretError("");
    const accentHex = accentColorMap[accent];
    const accentRgb = accentRgbMap[accent];
    const hasKey = !!getGeminiKey();

    if (!hasKey) {
      // Fallback: substituição simples de cores + injeção direta
      const adapted = effectCode
        .replace(/ACCENT_HEX/g, accentHex)
        .replace(/ACCENT_RGB/g, accentRgb)
        .replace(/#00AC69/g, accentHex)
        .replace(/0,172,105/g, accentRgb);
      setInterpretedBlock(adapted);
      setInterpreting(false);
      return;
    }

    const systemPrompt = `Você é um especialista em HTML/CSS/JS standalone. Converta qualquer código (React, CSS-in-JS, Tailwind, Canvas JS) para um bloco vanilla puro que funcione em um único arquivo HTML sem dependências externas.

Regras:
- Retorne APENAS o código convertido, sem explicações
- CSS vai dentro de uma tag <style>...</style>
- JS vai dentro de uma tag <script>...</script>
- Substitua ACCENT_HEX por ${accentHex}
- Substitua ACCENT_RGB por ${accentRgb}
- O efeito deve ser aplicado ao elemento com id="cover-effect-container" que fica position:absolute;inset:0;overflow:hidden;pointer-events:none no cover hero
- Preserve animações e efeitos visuais do código original
- Adapte quaisquer referências a canvas para o elemento canvas com id="effect-canvas"
- Não use React, Vue, ou qualquer framework`;

    const userMsg = `Converta este código para vanilla HTML/CSS/JS standalone, adaptando para a paleta: acento principal ${accentHex} (rgb ${accentRgb}), fundo do cover #0D1117, verde escuro #184B44. Cliente: ${client.name}.\n\n${effectCode}`;

    const result = await generateText(systemPrompt, userMsg);
    if (result) {
      setInterpretedBlock(result);
    } else {
      // Fallback se Gemini falhar
      const adapted = effectCode
        .replace(/ACCENT_HEX/g, accentHex)
        .replace(/ACCENT_RGB/g, accentRgb);
      setInterpretedBlock(adapted);
      setInterpretError("Gemini não respondeu. Código injetado com substituição simples de cores.");
    }
    setInterpreting(false);
  }

  async function generate() {
    if (!title.trim()) return;
    setGenerating(true);
    const content: CustomMaterialContent = {
      clientName: client.name,
      documentTitle: title,
      documentSubtitle: subtitle || `Preparado especialmente para ${client.name}`,
      accentColor: accent,
      sections: sections.filter(s => s.heading.trim()),
      mode,
      logoBase64: logoBase64 || undefined,
      customCss: mode === "personalizado" && interpretedBlock ? interpretedBlock : undefined,
    };
    setPreview(compileCustomMaterialHtml(content));
    setGenerating(false);
  }

  function save() {
    if (!preview) return;
    const content: CustomMaterialContent = {
      clientName: client.name,
      documentTitle: title,
      documentSubtitle: subtitle,
      accentColor: accent,
      sections,
      mode,
      logoBase64: logoBase64 || undefined,
      customCss: interpretedBlock || undefined,
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

  const hasKey = !!getGeminiKey();

  return (
    <div className="fixed inset-0 z-50 flex bg-[rgba(13,17,23,.7)] backdrop-blur-sm">
      <div className="ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-fade-in-up">

        {/* HEADER */}
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

          {/* MODE TOGGLE */}
          <div className="flex bg-[#F1F2F7] rounded-[12px_12px_12px_2px] p-1 gap-1">
            {(["padrao", "personalizado"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-[12px] font-semibold rounded-[9px_9px_9px_2px] transition-all ${mode === m ? "bg-white text-[#184B44] shadow-sm" : "text-[#9299B0]"}`}
              >
                {m === "padrao" ? <><Sparkles className="w-3.5 h-3.5" />Padrão</> : <><Code2 className="w-3.5 h-3.5" />Personalizado</>}
              </button>
            ))}
          </div>

          {/* DOCUMENT INFO */}
          <div className="space-y-3">
            <div>
              <label className="gen-label">Título do documento *</label>
              <input className="gen-input" placeholder="Ex: Apresentação de Soluções..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="gen-label">Subtítulo</label>
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

          {/* ── PERSONALIZADO FIELDS ── */}
          {mode === "personalizado" && (
            <div className="space-y-4 border border-[rgba(70,157,226,.2)] bg-[#EAF4FC]/40 rounded-[14px_14px_14px_4px] p-4">
              <div className="flex items-center gap-2 text-[11px] text-[#1a5280] font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                Modo personalizado
              </div>

              {/* LOGO UPLOAD */}
              <div>
                <label className="gen-label">Logo do cliente (opcional)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-[rgba(24,75,68,.1)] rounded-[8px_8px_8px_2px] text-[12px] font-medium text-[#5A6073] hover:border-[#469DE2] hover:text-[#1a5280] transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {logoBase64 ? "Trocar imagem" : "Carregar logo"}
                  </button>
                  {logoBase64 && (
                    <div className="flex items-center gap-2">
                      <img src={logoBase64} alt="Logo" className="h-8 w-auto rounded object-contain border border-[rgba(24,75,68,.1)]" />
                      <button onClick={() => setLogoBase64("")} className="text-[#9299B0] hover:text-[#FF7133]"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <p className="text-[10px] text-[#9299B0] mt-1.5">PNG, SVG ou JPG. Aparece no cover do documento.</p>
              </div>

              {/* EFFECT CODE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="gen-label mb-0">Código do efeito visual</label>
                  <div className="flex items-center gap-1">
                    {!hasKey && (
                      <span className="flex items-center gap-1 text-[9px] text-[#FF7133] font-medium bg-[#FFF0E8] px-2 py-0.5 rounded-full">
                        <Info className="w-2.5 h-2.5" />Sem chave Gemini — substituição simples
                      </span>
                    )}
                  </div>
                </div>

                {/* EXAMPLES */}
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {EFFECT_EXAMPLES.map(ex => (
                    <button
                      key={ex.label}
                      onClick={() => setEffectCode(ex.code)}
                      className="text-[10px] font-medium text-[#5A6073] bg-white border border-[rgba(24,75,68,.1)] px-2 py-1 rounded-full hover:border-[#469DE2] hover:text-[#1a5280] transition-all"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="gen-input resize-none font-mono text-[11px] leading-relaxed"
                  rows={8}
                  placeholder={`Cole aqui o código do efeito (React, CSS, Vanilla JS, Canvas...).\n\nUse ACCENT_HEX e ACCENT_RGB como placeholders — serão substituídos pela cor de destaque escolhida.\n\nExemplo: rgba(ACCENT_RGB, .3) ou color: ACCENT_HEX`}
                  value={effectCode}
                  onChange={e => setEffectCode(e.target.value)}
                />

                <button
                  onClick={interpretEffect}
                  disabled={!effectCode.trim() || interpreting}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-[#1a5280] text-white text-[12px] font-semibold rounded-[999px] hover:bg-[#154268] transition-all disabled:opacity-50"
                >
                  {interpreting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {interpreting ? "Interpretando com Gemini..." : hasKey ? "Interpretar e adaptar com IA" : "Aplicar (substituição simples)"}
                </button>

                {interpretError && (
                  <p className="text-[10px] text-[#FF7133] mt-1.5 bg-[#FFF0E8] px-3 py-2 rounded-lg">{interpretError}</p>
                )}

                {interpretedBlock && !interpreting && (
                  <div className="mt-2 bg-[#0D1117] rounded-[8px_8px_8px_2px] p-3 max-h-32 overflow-y-auto">
                    <p className="text-[9px] text-[#00AC69] font-bold uppercase tracking-wider mb-1">Código adaptado</p>
                    <pre className="text-[10px] text-[rgba(255,255,255,.6)] whitespace-pre-wrap break-all leading-relaxed">{interpretedBlock.slice(0, 400)}{interpretedBlock.length > 400 ? "..." : ""}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTIONS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="gen-label mb-0">Tópicos / Seções</label>
              <button onClick={addSection} className="flex items-center gap-1 text-[11px] font-semibold text-[#00AC69] hover:text-[#184B44] transition-colors">
                <Plus className="w-3.5 h-3.5" />Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {sections.map((sec, i) => (
                <div key={i} className="bg-[#F1F2F7] rounded-[12px_12px_12px_2px] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-[#9299B0] shrink-0" />
                    <input className="gen-input-flat flex-1" placeholder={`Título do tópico ${i + 1}...`} value={sec.heading} onChange={e => updateSection(i, "heading", e.target.value)} />
                    <button onClick={() => removeSection(i)} className="p-1 text-[#9299B0] hover:text-[#FF7133]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <textarea className="gen-input-flat w-full resize-none" rows={3} placeholder="Conteúdo deste tópico..." value={sec.body} onChange={e => updateSection(i, "body", e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* GENERATE */}
          <button
            onClick={generate}
            disabled={generating || !title.trim() || sections.filter(s => s.heading.trim()).length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#469DE2] text-white text-[13px] font-semibold rounded-[999px] hover:bg-[#2e87d4] transition-all disabled:opacity-50"
          >
            {generating ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {generating ? "Gerando..." : "Gerar Material"}
          </button>

          {preview && (
            <div className="border border-[rgba(70,157,226,.25)] bg-[#EAF4FC] rounded-[12px_12px_12px_2px] px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[#1a5280] font-medium">Material gerado.</span>
              <button onClick={openPreview} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1a5280] hover:text-[#469DE2]">
                <ExternalLink className="w-3.5 h-3.5" />Visualizar
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[rgba(24,75,68,.08)] flex gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px]">Cancelar</button>
          <button onClick={save} disabled={!preview} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-[#184B44] rounded-[999px] disabled:opacity-40">
            <Save className="w-3.5 h-3.5" />Salvar
          </button>
        </div>
      </div>

      <style>{`
        .gen-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#5A6073;margin-bottom:6px}
        .gen-input{width:100%;padding:9px 12px;background:#F1F2F7;border:1px solid rgba(24,75,68,.08);border-radius:10px 10px 10px 2px;font-family:inherit;font-size:13px;color:#1E2235;outline:none;transition:border-color .2s}
        .gen-input:focus{border-color:#469DE2;background:white}
        .gen-input::placeholder{color:#9299B0}
        .gen-input-flat{padding:7px 10px;background:white;border:1px solid rgba(24,75,68,.08);border-radius:8px 8px 8px 2px;font-family:inherit;font-size:12px;color:#1E2235;outline:none;transition:border-color .2s}
        .gen-input-flat:focus{border-color:#469DE2}
        .gen-input-flat::placeholder{color:#9299B0}
      `}</style>
    </div>
  );
}
