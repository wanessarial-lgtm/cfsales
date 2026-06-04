import React, { useState } from "react";
import { X, Eye, EyeOff, Check } from "lucide-react";
import { getGeminiKey } from "../utils/ai";

interface Props { onClose: () => void; }

export default function SettingsModal({ onClose }: Props) {
  const [key, setKey] = useState(localStorage.getItem("cf_gemini_key") || "");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    if (key.trim()) localStorage.setItem("cf_gemini_key", key.trim());
    else localStorage.removeItem("cf_gemini_key");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentKey = getGeminiKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,17,23,.65)] backdrop-blur-sm">
      <div className="bg-white rounded-[20px_20px_20px_4px] w-full max-w-md shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(24,75,68,.08)]">
          <h2 className="text-[14px] font-semibold text-[#184B44]">Configurações</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9299B0] hover:bg-[#F1F2F7] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A6073] mb-1.5">Chave API Gemini (Google AI)</label>
            <p className="text-[11px] text-[#9299B0] font-light mb-3 leading-relaxed">
              Necessária para geração de textos com IA (copywriting de propostas e justificativas de ROI). Obtenha em{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#00AC69] underline">aistudio.google.com</a>.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={show ? "text" : "password"}
                  className="w-full pl-3 pr-10 py-2.5 bg-[#F1F2F7] border border-[rgba(24,75,68,.08)] rounded-[10px_10px_10px_2px] text-[13px] text-[#1E2235] outline-none focus:border-[#00AC69] font-mono"
                  placeholder="AIza..."
                  value={key}
                  onChange={e => setKey(e.target.value)}
                />
                <button
                  onClick={() => setShow(!show)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9299B0] hover:text-[#184B44]"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={save}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#00AC69] text-white text-[12px] font-semibold rounded-[999px] hover:bg-[#009a5e] transition-all"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                {saved ? "Salvo!" : "Salvar"}
              </button>
            </div>
            {currentKey && (
              <p className="text-[10px] text-[#00AC69] mt-2 font-medium">Chave configurada. Geração com IA habilitada.</p>
            )}
            {!currentKey && (
              <p className="text-[10px] text-[#9299B0] mt-2">Sem chave configurada. Textos usarão templates padrão.</p>
            )}
          </div>

          <div className="pt-2 border-t border-[rgba(24,75,68,.06)]">
            <p className="text-[10px] text-[#9299B0] font-light leading-relaxed">
              A chave é armazenada apenas no seu navegador (localStorage). Nenhum dado é enviado a servidores terceiros além da API do Google.
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[rgba(24,75,68,.08)]">
          <button onClick={onClose} className="w-full py-2.5 text-[13px] font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px] hover:bg-[#E8E9F0] transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
