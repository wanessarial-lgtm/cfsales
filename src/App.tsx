import React, { useState, useEffect } from "react";
import { CommercialAccount, Material } from "./types";
import { INITIAL_ACCOUNTS, INITIAL_MATERIALS } from "./utils/initialData";
import ClientList from "./components/ClientList";
import ClientWorkspace from "./components/ClientWorkspace";
import SettingsModal from "./components/SettingsModal";
import { Settings } from "lucide-react";

export default function App() {
  const [accounts, setAccounts] = useState<CommercialAccount[]>(() => {
    try { const r = localStorage.getItem("cf_accounts"); return r ? JSON.parse(r) : INITIAL_ACCOUNTS; } catch { return INITIAL_ACCOUNTS; }
  });
  const [materials, setMaterials] = useState<Material[]>(() => {
    try { const r = localStorage.getItem("cf_materials"); return r ? JSON.parse(r) : INITIAL_MATERIALS; } catch { return INITIAL_MATERIALS; }
  });
  const [selectedClient, setSelectedClient] = useState<CommercialAccount | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { localStorage.setItem("cf_accounts", JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem("cf_materials", JSON.stringify(materials)); }, [materials]);

  const materialsForClient = (id: string) => materials.filter(m => m.accountId === id);

  return (
    <div className="min-h-screen bg-[var(--color-cf-surface)] font-sans flex flex-col overflow-x-hidden">

      {/* TOPBAR */}
      <header className="w-full h-14 bg-[var(--color-cf-cinza-dk)] px-5 flex items-center justify-between shadow-md z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AC69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00AC69]"></span>
          </span>
          <button
            onClick={() => setSelectedClient(null)}
            className="text-white text-[15px] font-semibold tracking-tight hover:text-[#93EEAA] transition-colors"
          >
            CF Sales <span className="text-[#93EEAA] font-normal">· Checklist Fácil</span>
          </button>
          {selectedClient && (
            <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-white/40 font-normal">
              <span>/</span>
              <span className="text-white/70 truncate max-w-[200px]">{selectedClient.name}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#184B44] text-[#93EEAA] font-bold text-xs flex items-center justify-center border border-white/10 select-none">
            W
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        {selectedClient === null ? (
          <ClientList
            accounts={accounts}
            materials={materials}
            onSelectClient={setSelectedClient}
            onAddAccount={(a) => setAccounts(prev => [a, ...prev])}
            onEditAccount={(a) => setAccounts(prev => prev.map(x => x.id === a.id ? a : x))}
            onDeleteAccount={(id) => {
              if (confirm("Excluir este lead? Os materiais gerados serão mantidos.")) {
                setAccounts(prev => prev.filter(x => x.id !== id));
              }
            }}
          />
        ) : (
          <ClientWorkspace
            client={selectedClient}
            materials={materialsForClient(selectedClient.id)}
            onBack={() => setSelectedClient(null)}
            onSaveMaterial={(m) => setMaterials(prev => [m, ...prev])}
            onDeleteMaterial={(id) => {
              if (confirm("Excluir este material definitivamente?")) {
                setMaterials(prev => prev.filter(m => m.id !== id));
              }
            }}
            onUpdateClient={(updated) => {
              setAccounts(prev => prev.map(x => x.id === updated.id ? updated : x));
              setSelectedClient(updated);
            }}
          />
        )}
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
