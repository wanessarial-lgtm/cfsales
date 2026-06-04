import React, { useState } from "react";
import { CommercialAccount } from "../types";
import { X } from "lucide-react";

interface Props {
  account: CommercialAccount | null;
  onSave: (a: CommercialAccount) => void;
  onClose: () => void;
}

const SECTORS = ["Qualidade", "Logística", "SSMA", "Operações", "Construção", "Outro"];
const SIZES = ["Pequena", "Média", "Grande", "Enterprise"];

export default function ClientModal({ account, onSave, onClose }: Props) {
  const [name, setName] = useState(account?.name || "");
  const [sector, setSector] = useState(account?.sector || "Qualidade");
  const [porte, setPorte] = useState(account?.porte || "Grande");
  const [decisor, setDecisor] = useState(account?.decisor || "");
  const [cargo, setCargo] = useState(account?.cargo || "");
  const [whatsapp, setWhatsapp] = useState(account?.whatsapp || "");
  const [email, setEmail] = useState(account?.email || "");
  const [challenges, setChallenges] = useState(account?.challenges || "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !decisor.trim()) { setError("Empresa e nome do decisor são obrigatórios."); return; }
    onSave({
      id: account?.id || `acc-${Date.now()}`,
      name: name.trim(),
      sector, porte,
      decisor: decisor.trim(),
      cargo: cargo.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      challenges: challenges.trim() || "Processos manuais de inspeção e auditoria.",
      createdAt: account?.createdAt || new Date().toISOString().split("T")[0],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,17,23,.65)] backdrop-blur-sm">
      <div className="bg-white rounded-[20px_20px_20px_4px] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(24,75,68,.08)]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#184B44]">{account ? "Editar Lead" : "Novo Lead"}</h2>
            <p className="text-[11px] text-[#9299B0] mt-0.5 font-light">Preencha os dados do prospect</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9299B0] hover:bg-[#F1F2F7] hover:text-[#184B44] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          {error && <p className="text-[12px] text-[#FF7133] font-medium bg-[#FFF0E8] px-3 py-2 rounded-lg">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label-sm">Empresa *</label>
              <input className="cf-input" placeholder="Nome da empresa" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label-sm">Setor</label>
              <select className="cf-input" value={sector} onChange={e => setSector(e.target.value)}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Porte</label>
              <select className="cf-input" value={porte} onChange={e => setPorte(e.target.value)}>
                {SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Decisor principal *</label>
              <input className="cf-input" placeholder="Nome completo" value={decisor} onChange={e => setDecisor(e.target.value)} required />
            </div>
            <div>
              <label className="label-sm">Cargo</label>
              <input className="cf-input" placeholder="Ex: Gerente de Qualidade" value={cargo} onChange={e => setCargo(e.target.value)} />
            </div>
            <div>
              <label className="label-sm">WhatsApp</label>
              <input className="cf-input" placeholder="55 11 99999-9999" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
            <div>
              <label className="label-sm">E-mail</label>
              <input className="cf-input" type="email" placeholder="email@empresa.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="label-sm">Principais dores / desafios</label>
              <textarea
                className="cf-input resize-none"
                rows={3}
                placeholder="Descreva os principais problemas e gargalos operacionais que este lead enfrenta..."
                value={challenges}
                onChange={e => setChallenges(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-[#5A6073] bg-[#F1F2F7] rounded-[999px] hover:bg-[#E8E9F0] transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00AC69] rounded-[999px] hover:bg-[#009a5e] transition-all shadow-[0_4px_16px_rgba(0,172,105,.3)]">
              {account ? "Salvar alterações" : "Adicionar lead"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .label-sm { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #5A6073; margin-bottom: 5px; }
        .cf-input { width: 100%; padding: 9px 12px; background: #F1F2F7; border: 1px solid rgba(24,75,68,.08); border-radius: 10px 10px 10px 2px; font-family: inherit; font-size: 13px; color: #1E2235; outline: none; transition: border-color .2s; }
        .cf-input:focus { border-color: #00AC69; background: white; }
        .cf-input::placeholder { color: #9299B0; }
      `}</style>
    </div>
  );
}
