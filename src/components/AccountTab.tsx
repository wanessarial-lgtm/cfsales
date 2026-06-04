import React, { useState } from "react";
import { CommercialAccount } from "../types";
import { Search, Plus, Trash2, Edit2, Building2, User, Mail, Phone, Briefcase, FileText, Sliders, Play } from "lucide-react";

interface AccountTabProps {
  accounts: CommercialAccount[];
  onAddAccount: (acc: CommercialAccount) => void;
  onEditAccount: (acc: CommercialAccount) => void;
  onDeleteAccount: (id: string) => void;
  onQuickGenerate: (acc: CommercialAccount, type: "proposal" | "business_case" | "presentation") => void;
}

export default function AccountTab({
  accounts,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onQuickGenerate
}: AccountTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [sector, setSector] = useState("Qualidade");
  const [porte, setPorte] = useState("Grande");
  const [decisor, setDecisor] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [challenges, setChallenges] = useState("");

  const sectors = ["Qualidade", "Logística", "SSMA", "Operações", "Construção", "Outro"];
  const sizes = ["Pequena", "Média", "Grande", "Enterprise"];

  const handleOpenNew = () => {
    setEditingId(null);
    setName("");
    setSector("Qualidade");
    setPorte("Grande");
    setDecisor("");
    setCargo("");
    setEmail("");
    setWhatsapp("");
    setChallenges("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (acc: CommercialAccount) => {
    setEditingId(acc.id);
    setName(acc.name);
    setSector(acc.sector);
    setPorte(acc.porte);
    setDecisor(acc.decisor);
    setCargo(acc.cargo);
    setEmail(acc.email);
    setWhatsapp(acc.whatsapp);
    setChallenges(acc.challenges);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !decisor) return;

    const record: CommercialAccount = {
      id: editingId || `acc-${Date.now()}`,
      name,
      sector,
      porte,
      decisor,
      cargo,
      email,
      whatsapp,
      challenges: challenges || "Utilizacao de controles manuais e relatorios fisicos de inspecao.",
      createdAt: new Date().toISOString().split("T")[0]
    };

    if (editingId) {
      onEditAccount(record);
    } else {
      onAddAccount(record);
    }
    setIsFormOpen(false);
  };

  const filtered = accounts.filter(acc =>
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.decisor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header operations Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cf-escuro/40" />
          <input
            type="text"
            placeholder="Buscar contas por nome, setor ou decisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white text-xs text-cf-cinza-dk border border-cf-surface rounded-xl pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-cf-verde/40 transition"
          />
        </div>
        <button
          onClick={handleOpenNew}
          className="h-11 px-5 bg-cf-verde hover:bg-cf-verde/95 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cf-shape cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Conta Lead</span>
        </button>
      </div>

      {/* Account form toggle block */}
      {isFormOpen && (
        <div className="bg-white border border-cf-surface/20 shadow-md p-6 cf-shape animate-fade-in-up">
          <h3 className="text-sm font-bold text-cf-escuro mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cf-verde" />
            <span>{editingId ? "Editar Informacoes da Conta" : "Cadastrar Nova Conta Lead"}</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fabricas Unidas S.A."
                  className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              {/* Setores */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Setor Principal</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-2 text-xs focus:outline-none"
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Porte da Empresa</label>
                  <select
                    value={porte}
                    onChange={(e) => setPorte(e.target.value)}
                    className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-2 text-xs focus:outline-none"
                  >
                    {sizes.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                </div>
              </div>

              {/* Decisor */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Contato do Decisor</label>
                <input
                  type="text"
                  required
                  value={decisor}
                  onChange={(e) => setDecisor(e.target.value)}
                  placeholder="Ex: Carlos Albuquerque"
                  className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              {/* Cargo Decisor */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Cargo do Contato</label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Diretor de Compliance / Supervisor de SSMA"
                  className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Email Corporativo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: decisor@empresa.com.br"
                  className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none"
                />
              </div>

              {/* Whatsapp */}
              <div>
                <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Whatsapp Comercial</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 11988887777"
                  className="w-full h-10 bg-cf-surface/50 border border-cf-surface rounded-lg px-3 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Desafios */}
            <div>
              <label className="block text-[11px] font-bold text-cf-escuro uppercase tracking-wide mb-1.5">Principais Desafios / Dores Operacionais</label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Descreva as dores operacionais (ex: checklists em papel, demora para gerar planilhas no Excel, falha de rastreabilidade de nao-conformidades)"
                rows={3}
                className="w-full p-3 bg-cf-surface/50 border border-cf-surface rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cf-verde resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="h-9 px-4 text-xs font-semibold text-cf-escuro/60 hover:text-cf-escuro hover:bg-cf-surface rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-9 px-5 bg-cf-escuro hover:bg-cf-escuro/95 text-white font-bold rounded-lg text-xs transition cf-shape"
              >
                {editingId ? "Atualizar Conta" : "Salvar Conta"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Accounts List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-cf-surface/20 rounded-2xl p-16 text-center space-y-4">
          <Building2 className="w-12 h-12 mx-auto text-cf-escuro/25" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-cf-escuro uppercase tracking-wider">Nenhuma Conta Encontrada</h4>
            <p className="text-xs text-cf-cinza-dk/60 max-w-xs mx-auto font-light">
              Cadastre novos clientes potenciais para iniciar as simulacoes de materiais comerciais.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(acc => (
            <div
              key={acc.id}
              className="bg-white border border-cf-surface/30 p-5 cf-shape flex flex-col justify-between hover:shadow-md transition relative bg-pattern-light"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(acc)}
                  className="p-1.5 hover:bg-cf-surface rounded text-cf-escuro/50 hover:text-cf-escuro transition cursor-pointer"
                  title="Editar Conta"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteAccount(acc.id)}
                  className="p-1.5 hover:bg-rose-50 rounded text-rose-500/50 hover:text-rose-600 transition cursor-pointer"
                  title="Excluir Conta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Header */}
                <div className="pr-12 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-cf-escuro/10 text-cf-escuro text-[9px] font-bold uppercase tracking-wider rounded">
                      {acc.sector}
                    </span>
                    <span className="text-[10px] text-cf-escuro/65 font-semibold">
                      {acc.porte}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-cf-escuro tracking-tight mt-1">
                    {acc.name}
                  </h4>
                </div>

                {/* Info contact */}
                <div className="space-y-1.5 text-xs text-cf-cinza-dk/75 text-left font-light">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cf-verde shrink-0" />
                    <span>{acc.decisor} <strong className="text-cf-escuro/80">({acc.cargo || "Responsável"})</strong></span>
                  </div>
                  {(acc.email || acc.whatsapp) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-cf-cinza-dk/65">
                      {acc.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{acc.email}</span>
                        </span>
                      )}
                      {acc.whatsapp && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{acc.whatsapp}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Challenges */}
                <div className="bg-cf-surface/40 p-3 rounded-lg text-left">
                  <span className="text-[9px] font-bold text-cf-escuro uppercase tracking-wide block mb-1">Dores Operais</span>
                  <p className="text-xs text-cf-cinza-dk/80 font-light line-clamp-2">
                    {acc.challenges}
                  </p>
                </div>
              </div>

              {/* Prompt actions panel */}
              <div className="mt-5 pt-3 border-t border-cf-surface/30 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-cf-cinza-dk/40">Criado em: {acc.createdAt}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onQuickGenerate(acc, "proposal")}
                    className="h-8 px-2.5 bg-cf-escuro/5 hover:bg-cf-escuro hover:text-white rounded text-[10px] font-bold uppercase transition flex items-center gap-1 text-cf-escuro"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Proposta</span>
                  </button>
                  <button
                    onClick={() => onQuickGenerate(acc, "business_case")}
                    className="h-8 px-2.5 bg-cf-laranja/10 hover:bg-cf-laranja hover:text-white rounded text-[10px] font-bold uppercase transition flex items-center gap-1 text-cf-laranja"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Estudo ROI</span>
                  </button>
                  <button
                    onClick={() => onQuickGenerate(acc, "presentation")}
                    className="h-8 px-2.5 bg-cf-verde/10 hover:bg-cf-verde hover:text-white rounded text-[10px] font-bold uppercase transition flex items-center gap-1 text-cf-verde"
                  >
                    <Play className="w-3 h-3" />
                    <span>Slides</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
