import React, { useState } from "react";
import { CommercialAccount, Material } from "../types";
import { Plus, Search, Building2, User, Trash2, ChevronRight, FileText, BarChart2, Layers } from "lucide-react";
import ClientModal from "./ClientModal";

interface Props {
  accounts: CommercialAccount[];
  materials: Material[];
  onSelectClient: (a: CommercialAccount) => void;
  onAddAccount: (a: CommercialAccount) => void;
  onEditAccount: (a: CommercialAccount) => void;
  onDeleteAccount: (id: string) => void;
}

const SECTOR_COLOR: Record<string, string> = {
  "Qualidade": "bg-[#E6F9F1] text-[#184B44]",
  "Logística": "bg-[#EAF4FC] text-[#1a5280]",
  "SSMA": "bg-[#FFF0E8] text-[#8a3a10]",
  "Operações": "bg-[#EFE7F8] text-[#4a2080]",
  "Construção": "bg-[#F8F0E8] text-[#7a4a10]",
  "Outro": "bg-[#F1F2F7] text-[#5A6073]",
};

export default function ClientList({ accounts, materials, onSelectClient, onAddAccount, onEditAccount, onDeleteAccount }: Props) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CommercialAccount | null>(null);

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.decisor.toLowerCase().includes(search.toLowerCase()) ||
    a.sector.toLowerCase().includes(search.toLowerCase())
  );

  const totalMaterials = materials.length;
  const totalEconomy = materials.reduce((acc, m) => acc + (m.content.businessCase?.calculatedEconomyYearly || 0), 0);

  function handleEdit(e: React.MouseEvent, a: CommercialAccount) {
    e.stopPropagation();
    setEditingAccount(a);
    setIsModalOpen(true);
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    onDeleteAccount(id);
  }

  function countMaterials(id: string) {
    return materials.filter(m => m.accountId === id).length;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#184B44] tracking-tight">Leads Comerciais</h1>
          <p className="text-sm text-[#5A6073] font-light mt-0.5">Selecione um cliente para gerar propostas, materiais e estudos de ROI.</p>
        </div>
        <button
          onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00AC69] text-white text-sm font-semibold px-5 py-2.5 rounded-[999px] hover:bg-[#009a5e] transition-all shadow-[0_4px_16px_rgba(0,172,105,.3)] hover:shadow-[0_6px_20px_rgba(0,172,105,.4)] hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Lead
        </button>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[rgba(24,75,68,.08)] rounded-[12px_12px_12px_2px] p-4">
          <span className="text-[10px] text-[#5A6073] uppercase tracking-wider font-medium block">Leads Ativos</span>
          <span className="text-2xl font-bold text-[#184B44] block mt-1">{accounts.length}</span>
        </div>
        <div className="bg-white border border-[rgba(24,75,68,.08)] rounded-[12px_12px_12px_2px] p-4">
          <span className="text-[10px] text-[#5A6073] uppercase tracking-wider font-medium block">Materiais Gerados</span>
          <span className="text-2xl font-bold text-[#184B44] block mt-1">{totalMaterials}</span>
        </div>
        <div className="bg-white border border-[rgba(24,75,68,.08)] rounded-[12px_12px_12px_2px] p-4">
          <span className="text-[10px] text-[#5A6073] uppercase tracking-wider font-medium block">Economia Mapeada</span>
          <span className="text-2xl font-bold text-[#00AC69] block mt-1">
            {totalEconomy > 0 ? `R$ ${Math.round(totalEconomy / 1000)}k` : "—"}
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9299B0]" />
        <input
          type="text"
          placeholder="Buscar por empresa, decisor ou setor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(24,75,68,.1)] rounded-[12px_12px_12px_2px] text-sm text-[#1E2235] placeholder-[#9299B0] outline-none focus:border-[#00AC69] transition-colors"
        />
      </div>

      {/* CLIENT GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#9299B0]">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Nenhum lead encontrado.</p>
          <p className="text-xs mt-1">Adicione seu primeiro cliente clicando em "Novo Lead".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(account => {
            const mCount = countMaterials(account.id);
            const sectorClass = SECTOR_COLOR[account.sector] || SECTOR_COLOR["Outro"];
            return (
              <div
                key={account.id}
                onClick={() => onSelectClient(account)}
                className="group bg-white border border-[rgba(24,75,68,.08)] rounded-[12px_12px_12px_2px] p-5 cursor-pointer hover:border-[#00AC69] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,172,105,.1)] transition-all duration-200"
              >
                {/* TOP ROW */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-[#184B44] text-[15px] leading-tight truncate">{account.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px_6px_6px_2px] ${sectorClass}`}>{account.sector}</span>
                      <span className="text-[10px] text-[#9299B0] font-light">{account.porte}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9299B0] group-hover:text-[#00AC69] transition-colors shrink-0 mt-1" />
                </div>

                {/* DECISOR */}
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-3.5 h-3.5 text-[#9299B0] shrink-0" />
                  <span className="text-[12px] text-[#5A6073] font-light truncate">{account.decisor}</span>
                  {account.cargo && <span className="text-[10px] text-[#9299B0] truncate">· {account.cargo}</span>}
                </div>

                {/* CHALLENGES */}
                <p className="text-[11px] text-[#9299B0] font-light line-clamp-2 leading-relaxed mb-4">
                  {account.challenges}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-[rgba(24,75,68,.06)] pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-[#9299B0]">
                      <FileText className="w-3 h-3" />
                      {mCount} {mCount === 1 ? "material" : "materiais"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleEdit(e, account)}
                      className="p-1.5 rounded-[6px_6px_6px_2px] text-[#9299B0] hover:text-[#184B44] hover:bg-[#F1F2F7] transition-all"
                      title="Editar"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, account.id)}
                      className="p-1.5 rounded-[6px_6px_6px_2px] text-[#9299B0] hover:text-[#FF7133] hover:bg-[#FFF0E8] transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3 ACTION CHIPS */}
                <div className="flex gap-1.5 mt-3">
                  {[
                    { label: "Proposta", icon: FileText },
                    { label: "Material", icon: Layers },
                    { label: "ROI", icon: BarChart2 },
                  ].map(({ label, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-1 text-[9px] font-semibold text-[#9299B0] bg-[#F1F2F7] px-2 py-1 rounded-[999px] uppercase tracking-wider">
                      <Icon className="w-2.5 h-2.5" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <ClientModal
          account={editingAccount}
          onSave={(a) => {
            if (editingAccount) onEditAccount(a);
            else onAddAccount(a);
            setIsModalOpen(false);
            setEditingAccount(null);
          }}
          onClose={() => { setIsModalOpen(false); setEditingAccount(null); }}
        />
      )}
    </div>
  );
}
