import { ProposalContent, BusinessCaseContent, CustomMaterialContent } from "../types";

const CF_LOGOS = ["AMBEV","Bradesco","Coca-Cola","Vale","Embraer","Petrobras","JBS","Gerdau","Raízen","Suzano","WEG","Marcopolo","BRF","Itaú","Votorantim"];

function scopeIcon(index: number): string {
  const icons = [
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  ];
  return icons[index % icons.length];
}

export function compileProposalHtml(content: ProposalContent): string {
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const proposalNum = Math.floor(1000 + Math.random() * 9000);
  const implementationFeeStr = content.implementationFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const monthlyFeeStr = content.monthlyLicenseFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  const solutionCards = content.productScope.map((item, i) => `
    <div class="sol-card reveal" style="--delay:${0.1 + i * 0.08}s">
      <div class="sol-icon">${scopeIcon(i)}</div>
      <div class="sol-title">${item}</div>
    </div>`).join("");

  const logoItems = CF_LOGOS.slice(0, 12).map(l =>
    `<span class="logo-pill">${l}</span>`).join("");

  const whatsapp = content.challengeSummary ? "5551999999999" : "5551999999999";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proposta Checklist Fácil — ${content.clientName}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--g:#00AC69;--gdk:#184B44;--glt:#93EEAA;--or:#FF7133;--bl:#469DE2;--dark:#0D1117;--ink:#1E2235;--muted:#5A6073;--surface:#F1F2F7;--white:#fff;--border:rgba(24,75,68,.10)}
body{font-family:'Sora',sans-serif;background:var(--surface);color:var(--ink);overflow-x:hidden}
a{text-decoration:none}
/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(13,17,23,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.06);padding:0 clamp(20px,5vw,72px);height:64px;display:flex;align-items:center;justify-content:space-between;transition:background .3s}
.nav-brand{display:flex;align-items:center;gap:10px;color:white;font-size:14px;font-weight:700;letter-spacing:-.01em}
.nav-mark{width:32px;height:32px;background:var(--g);border-radius:8px 8px 8px 2px;display:flex;align-items:center;justify-content:center}
.nav-mark svg{width:16px;height:16px;stroke:white;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.nav-links{display:flex;gap:24px}
.nav-links a{color:rgba(255,255,255,.65);font-size:13px;font-weight:500;transition:color .2s}
.nav-links a:hover{color:var(--g)}
.nav-pill{background:var(--g);color:white;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:7px 16px;border-radius:999px;white-space:nowrap}
/* HERO */
.hero{min-height:100vh;background:linear-gradient(135deg,#0D1117 0%,#184B44 55%,#0a1a14 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px clamp(20px,5vw,72px) 80px;position:relative;overflow:hidden;text-align:center}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,172,105,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,172,105,.04) 1px,transparent 1px);background-size:48px 48px;pointer-events:none}
.hero-glow{position:absolute;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(0,172,105,.12) 0%,transparent 65%);top:-200px;right:-200px;pointer-events:none}
.hero-glow2{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(70,157,226,.08) 0%,transparent 65%);bottom:-100px;left:-100px;pointer-events:none}
.hero-inner{max-width:860px;position:relative;z-index:1}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(0,172,105,.12);border:1px solid rgba(0,172,105,.3);color:var(--g);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:8px 20px;border-radius:999px;margin-bottom:36px}
.hero-dot{width:6px;height:6px;border-radius:50%;background:var(--g);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.hero-h1{font-size:clamp(36px,5.5vw,68px);font-weight:700;color:white;line-height:1.08;letter-spacing:-.025em;margin-bottom:24px}
.hero-h1 .hl{color:var(--g)}
.hero-sub{font-size:clamp(15px,1.8vw,19px);color:rgba(255,255,255,.6);font-weight:300;line-height:1.65;max-width:580px;margin:0 auto 40px}
.hero-meta{display:flex;justify-content:center;gap:28px;flex-wrap:wrap;margin-bottom:48px}
.hero-meta-item{display:flex;align-items:center;gap:7px;color:rgba(255,255,255,.45);font-size:12px;font-weight:400}
.hero-meta-item svg{width:14px;height:14px;stroke:var(--g);fill:none;stroke-width:2;stroke-linecap:round}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-cta{background:var(--g);color:white;border:none;padding:15px 32px;border-radius:999px;font-size:14px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .25s;box-shadow:0 4px 24px rgba(0,172,105,.4)}
.btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,172,105,.5)}
.btn-ghost{background:transparent;color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.2);padding:15px 32px;border-radius:999px;font-size:14px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .25s}
.btn-ghost:hover{border-color:var(--g);color:var(--g)}
.scroll-cue{margin-top:64px;display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,.25);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.arrow-down{width:18px;height:18px;border-right:2px solid rgba(255,255,255,.25);border-bottom:2px solid rgba(255,255,255,.25);transform:rotate(45deg);animation:bob 2s ease-in-out infinite}
@keyframes bob{0%,100%{transform:rotate(45deg)}50%{transform:rotate(45deg) translateY(5px)}}
/* STATS */
.stats{background:var(--gdk);padding:28px clamp(20px,5vw,72px)}
.stats-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.stat{text-align:center;padding:16px 12px;border-right:1px solid rgba(255,255,255,.08)}
.stat:last-child{border-right:none}
.stat-n{font-size:clamp(22px,3vw,34px);font-weight:700;color:var(--g);display:block;line-height:1}
.stat-l{font-size:11px;color:rgba(255,255,255,.5);font-weight:400;display:block;margin-top:6px;letter-spacing:.04em}
/* SECTIONS */
.sec{padding:clamp(72px,8vw,120px) clamp(20px,5vw,72px)}
.sec--white{background:var(--white)}
.sec--surf{background:var(--surface)}
.sec--dark{background:#0D1117}
.sec--gdk{background:var(--gdk)}
.ctr{max-width:1100px;margin:0 auto}
.eyebrow{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:14px}
.h2{font-size:clamp(26px,3.5vw,44px);font-weight:700;color:var(--gdk);line-height:1.12;letter-spacing:-.02em;margin-bottom:14px}
.h2--lt{color:white}
.lede{font-size:clamp(14px,1.5vw,17px);color:var(--muted);font-weight:300;line-height:1.7;max-width:600px;margin-bottom:48px}
.lede--lt{color:rgba(255,255,255,.6)}
/* CHALLENGE */
.split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.quote{font-size:clamp(15px,1.6vw,20px);font-weight:300;font-style:italic;color:var(--ink);line-height:1.7;border-left:4px solid var(--or);padding-left:24px;margin-bottom:32px}
.bullets{list-style:none;display:flex;flex-direction:column;gap:14px}
.bullet{display:flex;align-items:flex-start;gap:12px;font-size:14px;color:var(--muted);line-height:1.55}
.bicon{width:28px;height:28px;border-radius:8px 8px 8px 2px;background:rgba(255,113,51,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.bicon svg{width:14px;height:14px;stroke:var(--or);fill:none;stroke-width:2;stroke-linecap:round}
.visual-box{background:linear-gradient(135deg,rgba(24,75,68,.04) 0%,rgba(0,172,105,.07) 100%);border:1px solid var(--border);border-radius:20px 20px 20px 4px;padding:32px;display:flex;flex-direction:column;gap:14px}
.kpi-row{display:flex;align-items:center;gap:14px;padding:14px 18px;background:white;border-radius:10px 10px 10px 2px;box-shadow:0 2px 8px rgba(24,75,68,.05)}
.kpi-ic{width:38px;height:38px;border-radius:9px 9px 9px 2px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kpi-ic--r{background:rgba(255,113,51,.1)}
.kpi-ic--r svg{stroke:var(--or)}
.kpi-ic--g{background:rgba(0,172,105,.1)}
.kpi-ic--g svg{stroke:var(--g)}
.kpi-ic svg{width:16px;height:16px;fill:none;stroke-width:2;stroke-linecap:round}
.kpi-label{font-size:10px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:.06em;display:block}
.kpi-val{font-size:16px;font-weight:700;color:var(--gdk);display:block}
.kpi-divider{border:none;border-top:1px solid var(--border)}
/* SOLUTION */
.sol-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}
.sol-card{background:white;border:1px solid var(--border);border-radius:16px 16px 16px 4px;padding:26px;transition:transform .2s,box-shadow .2s}
.sol-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,172,105,.1)}
.sol-icon{width:46px;height:46px;border-radius:12px 12px 12px 2px;background:rgba(0,172,105,.08);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.sol-icon svg{width:20px;height:20px;stroke:var(--g);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sol-title{font-size:14px;font-weight:600;color:var(--gdk);line-height:1.4}
/* LOGOS */
.logos-label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);text-align:center;margin-bottom:28px}
.logos-wrap{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.logo-pill{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.65);font-size:12px;font-weight:600;letter-spacing:.04em;padding:9px 18px;border-radius:999px;transition:all .2s}
.logo-pill:hover{background:rgba(0,172,105,.15);border-color:rgba(0,172,105,.4);color:var(--g)}
/* PRICING */
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:820px;margin:0 auto}
.p-card{background:white;border:2px solid var(--border);border-radius:20px 20px 20px 4px;padding:34px;position:relative}
.p-card--hl{border-color:var(--g);box-shadow:0 16px 48px rgba(0,172,105,.14)}
.p-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--g);color:white;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 14px;border-radius:999px;white-space:nowrap}
.p-cat{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g);margin-bottom:6px}
.p-name{font-size:18px;font-weight:700;color:var(--gdk);margin-bottom:4px}
.p-desc{font-size:12px;color:var(--muted);font-weight:300;line-height:1.55;margin-bottom:22px}
.p-price{font-size:30px;font-weight:700;color:var(--gdk);margin-bottom:4px;line-height:1}
.p-price small{font-size:14px;font-weight:600}
.p-price span{font-size:13px;font-weight:400;color:var(--muted)}
.p-div{border:none;border-top:1px solid var(--border);margin:22px 0}
.p-items{list-style:none;display:flex;flex-direction:column;gap:11px}
.p-item{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--ink);font-weight:400}
.p-check{width:17px;height:17px;border-radius:50%;background:rgba(0,172,105,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.p-check svg{width:9px;height:9px;stroke:var(--g);fill:none;stroke-width:3;stroke-linecap:round}
.p-note{font-size:11px;color:var(--muted);font-weight:300;text-align:center;margin-top:28px;line-height:1.6}
/* TIMELINE */
.tl{display:flex;flex-direction:column;gap:0;position:relative;max-width:680px;margin:0 auto}
.tl::before{content:'';position:absolute;left:27px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--g) 0%,rgba(0,172,105,.15) 100%)}
.tl-item{display:flex;gap:28px;padding-bottom:36px;position:relative}
.tl-item:last-child{padding-bottom:0}
.tl-node{width:54px;height:54px;border-radius:14px 14px 14px 4px;background:var(--g);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;font-weight:700;color:white;position:relative;z-index:1;box-shadow:0 4px 16px rgba(0,172,105,.3)}
.tl-body{flex:1;padding-top:6px}
.tl-week{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g);margin-bottom:4px}
.tl-title{font-size:16px;font-weight:600;color:var(--gdk);margin-bottom:5px}
.tl-desc{font-size:13px;color:var(--muted);font-weight:300;line-height:1.6}
/* CONTACT */
.contact-box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px 20px 20px 4px;padding:40px;display:flex;gap:36px;align-items:center;flex-wrap:wrap}
.c-avatar{width:76px;height:76px;border-radius:18px 18px 18px 4px;background:linear-gradient(135deg,var(--g) 0%,var(--gdk) 100%);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0}
.c-info{flex:1}
.c-role{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:5px}
.c-name{font-size:22px;font-weight:700;color:white;margin-bottom:3px}
.c-co{font-size:13px;color:rgba(255,255,255,.5);font-weight:300}
.c-btns{display:flex;flex-direction:column;gap:10px}
.btn-wpp{display:flex;align-items:center;gap:9px;background:#25D366;color:white;padding:13px 22px;border-radius:999px;font-size:13px;font-weight:600;transition:all .2s}
.btn-wpp:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,211,102,.4)}
.btn-wpp svg{width:17px;height:17px;fill:currentColor;flex-shrink:0}
.btn-email{display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:13px 22px;border-radius:999px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,.15);transition:all .2s}
.btn-email:hover{border-color:var(--g);color:var(--g)}
.btn-email svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;flex-shrink:0}
/* FOOTER */
footer{background:#080B0F;padding:28px clamp(20px,5vw,72px);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-top:1px solid rgba(255,255,255,.05)}
.ft-logo{font-size:13px;font-weight:700;color:rgba(255,255,255,.55)}
.ft-meta{font-size:10px;color:rgba(255,255,255,.25);font-weight:300}
/* REVEAL */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1);transition-delay:var(--delay,0s)}
.reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}.hero-dot,.arrow-down{animation:none}}
@media(max-width:768px){.nav-links{display:none}.stats-inner{grid-template-columns:repeat(2,1fr)}.stat:nth-child(2){border-right:none}.split{grid-template-columns:1fr;gap:36px}.p-grid{grid-template-columns:1fr}.contact-box{flex-direction:column}.tl::before{display:none}}
</style>
</head>
<body>

<nav class="nav" id="nav">
  <div class="nav-brand">
    <div class="nav-mark"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg></div>
    Checklist Fácil
  </div>
  <div class="nav-links">
    <a href="#inicio">Início</a>
    <a href="#desafio">Diagnóstico</a>
    <a href="#solucao">Solução</a>
    <a href="#investimento">Investimento</a>
    <a href="#contato">Contato</a>
  </div>
  <div class="nav-pill">Proposta Exclusiva</div>
</nav>

<section id="inicio" class="hero">
  <div class="hero-grid"></div>
  <div class="hero-glow"></div>
  <div class="hero-glow2"></div>
  <div class="hero-inner">
    <div class="hero-eyebrow"><span class="hero-dot"></span>Proposta exclusiva para ${content.clientName}</div>
    <h1 class="hero-h1">O software líder em<br><span class="hl">Inteligência Operacional</span></h1>
    <p class="hero-sub">Desenvolvemos esta proposta personalizada para transformar os processos da <strong style="color:rgba(255,255,255,.9)">${content.clientName}</strong> e eliminar os principais gargalos operacionais do setor de ${content.segment}.</p>
    <div class="hero-meta">
      <div class="hero-meta-item"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Emitida em ${date}</div>
      <div class="hero-meta-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Válida por 30 dias</div>
      <div class="hero-meta-item"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${content.decisorName}</div>
    </div>
    <div class="hero-btns">
      <a href="#investimento" class="btn-cta">Ver Proposta de Investimento</a>
      <a href="#contato" class="btn-ghost">Falar com a Consultora</a>
    </div>
    <div class="scroll-cue"><span>Deslize para ver</span><div class="arrow-down"></div></div>
  </div>
</section>

<div class="stats">
  <div class="stats-inner">
    <div class="stat"><span class="stat-n">130M+</span><span class="stat-l">checklists executados</span></div>
    <div class="stat"><span class="stat-n">2.300+</span><span class="stat-l">clientes ativos</span></div>
    <div class="stat"><span class="stat-n">4</span><span class="stat-l">países de atuação</span></div>
    <div class="stat"><span class="stat-n">R$ 228M</span><span class="stat-l">economizados pelos clientes</span></div>
  </div>
</div>

<section id="desafio" class="sec sec--white">
  <div class="ctr">
    <div class="split">
      <div>
        <span class="eyebrow reveal">Diagnóstico</span>
        <h2 class="h2 reveal" style="--delay:.1s">O desafio identificado em ${content.clientName}</h2>
        <blockquote class="quote reveal" style="--delay:.2s">"${content.challengeSummary}"</blockquote>
        <ul class="bullets">
          <li class="bullet reveal" style="--delay:.3s">
            <div class="bicon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            Processos manuais gerando retrabalho e atraso nas decisões gerenciais
          </li>
          <li class="bullet reveal" style="--delay:.35s">
            <div class="bicon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            Falta de rastreabilidade e evidências formais nas auditorias
          </li>
          <li class="bullet reveal" style="--delay:.4s">
            <div class="bicon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            Tempo desperdiçado consolidando planilhas e relatórios físicos
          </li>
        </ul>
      </div>
      <div class="visual-box reveal" style="--delay:.2s">
        <div class="kpi-row">
          <div class="kpi-ic kpi-ic--r"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
          <div><span class="kpi-label">Cenário Atual</span><span class="kpi-val">Controles manuais</span></div>
        </div>
        <div class="kpi-row">
          <div class="kpi-ic kpi-ic--r"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
          <div><span class="kpi-label">Impacto Operacional</span><span class="kpi-val">Decisões com atraso</span></div>
        </div>
        <hr class="kpi-divider">
        <div class="kpi-row">
          <div class="kpi-ic kpi-ic--g"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div><span class="kpi-label">Com Checklist Fácil</span><span class="kpi-val">100% digital e rastreável</span></div>
        </div>
        <div class="kpi-row">
          <div class="kpi-ic kpi-ic--g"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div><span class="kpi-label">Resultado Esperado</span><span class="kpi-val">Decisões em tempo real</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="solucao" class="sec sec--surf">
  <div class="ctr">
    <div style="text-align:center;max-width:620px;margin:0 auto 44px">
      <span class="eyebrow reveal">Escopo Recomendado</span>
      <h2 class="h2 reveal" style="--delay:.1s">A solução para ${content.clientName}</h2>
      <p class="lede reveal" style="--delay:.2s;margin-bottom:0">${content.customCopywriting || `Módulos selecionados especificamente para o setor de ${content.segment}, garantindo adoção rápida e resultados mensuráveis desde as primeiras semanas.`}</p>
    </div>
    <div class="sol-grid">${solutionCards}</div>
  </div>
</section>

<section class="sec sec--dark">
  <div class="ctr">
    <p class="logos-label reveal">Empresas que confiam na Checklist Fácil</p>
    <div class="logos-wrap reveal" style="--delay:.15s">${logoItems}</div>
  </div>
</section>

<section id="investimento" class="sec sec--white">
  <div class="ctr">
    <div style="text-align:center;max-width:600px;margin:0 auto 48px">
      <span class="eyebrow reveal">Proposta de Investimento</span>
      <h2 class="h2 reveal" style="--delay:.1s">Investimento personalizado para ${content.clientName}</h2>
      <p class="lede reveal" style="--delay:.2s;margin-bottom:0">Proposta válida por 30 dias a partir de ${date}. Nº CF-PR-${proposalNum}.</p>
    </div>
    <div class="p-grid">
      <div class="p-card reveal" style="--delay:.1s">
        <div class="p-cat">Setup Único</div>
        <div class="p-name">Implantação e Treinamento</div>
        <div class="p-desc">Configuração completa, importação de checklists históricos e onboarding presencial ou remoto da equipe.</div>
        <div class="p-price"><small>R$&nbsp;</small>${implementationFeeStr}<span>&nbsp;cobrado uma vez</span></div>
        <div class="p-div"></div>
        <ul class="p-items">
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Configuração e customização inicial</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Importação de checklists históricos</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Treinamento completo da equipe</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Suporte dedicado nos primeiros 30 dias</li>
        </ul>
      </div>
      <div class="p-card p-card--hl reveal" style="--delay:.2s">
        <div class="p-badge">Recomendado</div>
        <div class="p-cat">Assinatura Mensal</div>
        <div class="p-name">Licença SaaS Recorrente</div>
        <div class="p-desc">Acesso completo à plataforma, suporte contínuo, atualizações automáticas e armazenamento em nuvem.</div>
        <div class="p-price"><small>R$&nbsp;</small>${monthlyFeeStr}<span>&nbsp;/mês</span></div>
        <div class="p-div"></div>
        <ul class="p-items">
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Checklists e usuários ilimitados</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Painéis analíticos em tempo real</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Planos de ação automáticos</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>App mobile com modo offline</li>
          <li class="p-item"><div class="p-check"><svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5"/></svg></div>Integrações SAP, Power BI, Oracle</li>
        </ul>
      </div>
    </div>
    <p class="p-note reveal" style="--delay:.3s">* Contrato de ${content.contractTermMonths} meses · Reajuste anual pelo IPCA · Cancelamento com 30 dias de aviso prévio</p>
  </div>
</section>

<section class="sec sec--surf">
  <div class="ctr">
    <div style="text-align:center;max-width:600px;margin:0 auto 52px">
      <span class="eyebrow reveal">Implementação</span>
      <h2 class="h2 reveal" style="--delay:.1s">Implantação em 5 fases estruturadas</h2>
      <p class="lede reveal" style="--delay:.2s;margin-bottom:0">Uma jornada pensada para adoção rápida e resultados desde a primeira semana.</p>
    </div>
    <div class="tl">
      <div class="tl-item reveal"><div class="tl-node">1</div><div class="tl-body"><div class="tl-week">Semana 1</div><div class="tl-title">Kickoff e Configuração</div><div class="tl-desc">Reunião de alinhamento, mapeamento dos processos e setup do ambiente da ${content.clientName} na plataforma.</div></div></div>
      <div class="tl-item reveal" style="--delay:.1s"><div class="tl-node">2</div><div class="tl-body"><div class="tl-week">Semanas 2–3</div><div class="tl-title">Digitalização dos Checklists</div><div class="tl-desc">Criação e importação de todos os formulários existentes, adaptados para preenchimento mobile offline.</div></div></div>
      <div class="tl-item reveal" style="--delay:.2s"><div class="tl-node">3</div><div class="tl-body"><div class="tl-week">Semana 3</div><div class="tl-title">Treinamento da Equipe</div><div class="tl-desc">Capacitação de líderes e operadores com treinamento prático e material de apoio digitalizado.</div></div></div>
      <div class="tl-item reveal" style="--delay:.3s"><div class="tl-node">4</div><div class="tl-body"><div class="tl-week">Semana 4</div><div class="tl-title">Operação Piloto</div><div class="tl-desc">Primeiros checklists em produção com acompanhamento próximo do time Checklist Fácil.</div></div></div>
      <div class="tl-item reveal" style="--delay:.4s"><div class="tl-node">5</div><div class="tl-body"><div class="tl-week">A partir do mês 2</div><div class="tl-title">Expansão e Otimização</div><div class="tl-desc">Ativação de integrações, painéis personalizados e expansão para demais áreas e unidades.</div></div></div>
    </div>
  </div>
</section>

<section id="contato" class="sec sec--dark">
  <div class="ctr">
    <div style="text-align:center;max-width:540px;margin:0 auto 44px">
      <span class="eyebrow reveal" style="color:var(--g)">Próximo Passo</span>
      <h2 class="h2 h2--lt reveal" style="--delay:.1s">Vamos transformar a operação da ${content.clientName}?</h2>
      <p class="lede lede--lt reveal" style="--delay:.2s;margin-bottom:0">Entre em contato agora e dê o primeiro passo rumo à operação 100% digital.</p>
    </div>
    <div class="contact-box reveal" style="--delay:.3s">
      <div class="c-avatar">W</div>
      <div class="c-info">
        <div class="c-role">Consultora de Soluções B2B</div>
        <div class="c-name">Wanessa Alves</div>
        <div class="c-co">Checklist Fácil · Líder em Checklists na América Latina</div>
      </div>
      <div class="c-btns">
        <a href="https://wa.me/${whatsapp}" class="btn-wpp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Falar no WhatsApp</a>
        <a href="mailto:wanessa.alves@checklistfacil.com.br" class="btn-email"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>Enviar E-mail</a>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft-logo">Checklist Fácil</div>
  <div class="ft-meta">Proposta nº CF-PR-${proposalNum} · Válida por 30 dias · Documento confidencial</div>
</footer>

<script>
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.intersectionRatio>.08){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:[0,.08]});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}));
window.addEventListener('scroll',()=>{document.getElementById('nav').style.background=scrollY>20?'rgba(13,17,23,.98)':'rgba(13,17,23,.92)'},{passive:true});
</script>
</body>
</html>`;
}

export function compileBusinessCaseHtml(content: BusinessCaseContent): string {
  const totWastedHourYearly = content.workersCount * 52 * content.wasteHoursPerWeek;
  const financialWasteYearly = totWastedHourYearly * content.workerHourlyCost;
  const roiPercent = content.monthlyLicensePrice > 0
    ? Math.round((content.calculatedEconomyYearly / (content.monthlyLicensePrice * 12)) * 100)
    : 0;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>ROI Checklist Fácil — ${content.clientName}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--g:#00AC69;--gdk:#184B44;--glt:#93EEAA;--or:#FF7133;--bl:#469DE2;--ink:#1E2235;--muted:#5A6073;--surface:#F1F2F7;--white:#fff;--border:rgba(24,75,68,.1)}
body{font-family:'Sora',sans-serif;background:var(--surface);color:var(--ink);min-height:100vh;padding:40px clamp(16px,5vw,60px)}
.doc{max-width:860px;margin:0 auto}
.header{background:linear-gradient(135deg,#0D1117 0%,#184B44 100%);border-radius:20px 20px 20px 4px;padding:40px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px}
.header-left{}
.h-tag{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:8px}
.h-title{font-size:clamp(20px,3vw,28px);font-weight:700;color:white;line-height:1.2;margin-bottom:6px}
.h-sub{font-size:13px;color:rgba(255,255,255,.55);font-weight:300}
.header-right{text-align:right}
.h-client{font-size:15px;font-weight:600;color:white;margin-bottom:3px}
.h-meta{font-size:11px;color:rgba(255,255,255,.4);font-weight:300}
.kpi-band{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.kpi{background:var(--white);border:1px solid var(--border);border-radius:14px 14px 14px 4px;padding:22px;text-align:center}
.kpi--hl{background:linear-gradient(135deg,rgba(0,172,105,.08) 0%,rgba(24,75,68,.05) 100%);border-color:rgba(0,172,105,.2)}
.kpi-n{font-size:clamp(24px,3.5vw,36px);font-weight:700;line-height:1;display:block;margin-bottom:6px}
.kpi-n--g{color:var(--g)}
.kpi-n--or{color:var(--or)}
.kpi-n--b{color:var(--bl)}
.kpi-l{font-size:11px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:.06em;display:block}
.section{background:var(--white);border:1px solid var(--border);border-radius:16px 16px 16px 4px;padding:28px;margin-bottom:20px}
.sec-title{font-size:15px;font-weight:600;color:var(--gdk);margin-bottom:18px;display:flex;align-items:center;gap:10px}
.sec-title-dot{width:8px;height:8px;border-radius:50%;background:var(--g);flex-shrink:0}
.premises-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.premise{background:var(--surface);border-radius:10px 10px 10px 2px;padding:14px 18px}
.p-label{font-size:10px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:4px}
.p-val{font-size:17px;font-weight:700;color:var(--gdk)}
.roi-bar{height:12px;background:var(--surface);border-radius:999px;overflow:hidden;margin-bottom:8px}
.roi-fill{height:100%;background:linear-gradient(90deg,var(--g) 0%,var(--glt) 100%);border-radius:999px;transition:width 1.5s cubic-bezier(.16,1,.3,1)}
.roi-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--muted)}
.summary{font-size:14px;line-height:1.75;color:var(--ink);font-weight:300;border-left:4px solid var(--g);padding-left:20px}
.eco-strip{background:linear-gradient(135deg,rgba(0,172,105,.06) 0%,rgba(147,238,170,.08) 100%);border:1px solid rgba(0,172,105,.18);border-radius:14px 14px 14px 4px;padding:22px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.eco-main{flex:1}
.eco-n{font-size:clamp(28px,4vw,44px);font-weight:700;color:var(--g);line-height:1}
.eco-l{font-size:12px;color:var(--muted);font-weight:400;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.eco-side{display:flex;flex-direction:column;gap:10px}
.eco-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ink)}
.eco-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
footer{text-align:center;margin-top:28px;font-size:11px;color:var(--muted);font-weight:300;padding:20px 0;border-top:1px solid var(--border)}
@media(max-width:640px){.kpi-band{grid-template-columns:1fr 1fr}.kpi:last-child{grid-column:span 2}.premises-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="doc">
  <div class="header">
    <div class="header-left">
      <div class="h-tag">Business Case · ROI</div>
      <div class="h-title">Estudo de Viabilidade Financeira</div>
      <div class="h-sub">Simulação de retorno do investimento · Checklist Fácil</div>
    </div>
    <div class="header-right">
      <div class="h-client">${content.clientName}</div>
      <div class="h-meta">${content.segment} · ${new Date().toLocaleDateString("pt-BR")}</div>
    </div>
  </div>

  <div class="kpi-band">
    <div class="kpi kpi--hl">
      <span class="kpi-n kpi-n--g">R$ ${Math.round(content.calculatedEconomyMonthly).toLocaleString("pt-BR")}</span>
      <span class="kpi-l">Economia por Mês</span>
    </div>
    <div class="kpi kpi--hl">
      <span class="kpi-n kpi-n--g">R$ ${Math.round(content.calculatedEconomyYearly).toLocaleString("pt-BR")}</span>
      <span class="kpi-l">Economia Anual</span>
    </div>
    <div class="kpi">
      <span class="kpi-n kpi-n--or">${content.calculatedPaybackMonths.toFixed(1)} meses</span>
      <span class="kpi-l">Payback</span>
    </div>
  </div>

  <div class="section">
    <div class="sec-title"><span class="sec-title-dot"></span>Premissas Operacionais</div>
    <div class="premises-grid">
      <div class="premise"><span class="p-label">Colaboradores em campo</span><span class="p-val">${content.workersCount} profissionais</span></div>
      <div class="premise"><span class="p-label">Horas perdidas / semana</span><span class="p-val">${content.wasteHoursPerWeek} h/colaborador</span></div>
      <div class="premise"><span class="p-label">Custo médio da hora</span><span class="p-val">R$ ${content.workerHourlyCost.toFixed(2)}</span></div>
      <div class="premise"><span class="p-label">Formulários em papel/dia</span><span class="p-val">${content.paperFormsPerDay} folhas</span></div>
      <div class="premise"><span class="p-label">Licença mensal</span><span class="p-val">R$ ${content.monthlyLicensePrice.toLocaleString("pt-BR")}</span></div>
      <div class="premise"><span class="p-label">Horas desperdiçadas/ano</span><span class="p-val">${Math.round(totWastedHourYearly).toLocaleString("pt-BR")} h</span></div>
    </div>
  </div>

  <div class="section">
    <div class="sec-title"><span class="sec-title-dot"></span>ROI Anual Estimado</div>
    <div class="roi-bar"><div class="roi-fill" style="width:${Math.min(roiPercent, 100)}%"></div></div>
    <div class="roi-labels"><span>Investimento anual</span><span style="color:var(--g);font-weight:600">${roiPercent}% de retorno</span></div>
  </div>

  <div class="section">
    <div class="eco-strip">
      <div class="eco-main">
        <div class="eco-n">R$ ${Math.round(content.calculatedEconomyYearly).toLocaleString("pt-BR")}</div>
        <div class="eco-l">Economia potencial anual total</div>
      </div>
      <div class="eco-side">
        <div class="eco-item"><span class="eco-dot" style="background:var(--g)"></span>R$ ${Math.round(financialWasteYearly).toLocaleString("pt-BR")} em produtividade recuperada</div>
        <div class="eco-item"><span class="eco-dot" style="background:var(--bl)"></span>${Math.round(content.calculatedPaperSavedYearly).toLocaleString("pt-BR")} formulários físicos eliminados/ano</div>
        <div class="eco-item"><span class="eco-dot" style="background:var(--or)"></span>Payback em ${content.calculatedPaybackMonths.toFixed(1)} meses de uso</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="sec-title"><span class="sec-title-dot"></span>Justificativa Executiva</div>
    <p class="summary">${content.aiExecutiveSummary || `Com base nas premissas operacionais coletadas, a digitalização dos processos de inspeção da ${content.clientName} via Checklist Fácil tem potencial de liberar R$ ${Math.round(content.calculatedEconomyYearly).toLocaleString("pt-BR")} em produtividade anualmente, com retorno do investimento em apenas ${content.calculatedPaybackMonths.toFixed(1)} meses.`}</p>
  </div>

  <footer>Simulação baseada nas premissas fornecidas · Checklist Fácil · Líder em Checklists na América Latina</footer>
</div>
<script>
window.addEventListener('load',()=>{const bar=document.querySelector('.roi-fill');if(bar)setTimeout(()=>{bar.style.width='${Math.min(roiPercent,100)}%'},100)});
</script>
</body>
</html>`;
}

export function compileCustomMaterialHtml(content: CustomMaterialContent): string {
  const accentMap = { verde: "#00AC69", azul: "#469DE2", laranja: "#FF7133" };
  const accentRgbMap = { verde: "0,172,105", azul: "70,157,226", laranja: "255,113,51" };
  const accent = accentMap[content.accentColor] || "#00AC69";
  const accentRgb = accentRgbMap[content.accentColor] || "0,172,105";
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const logoHtml = content.logoBase64
    ? `<div class="cover-logo"><img src="${content.logoBase64}" alt="Logo ${content.clientName}" /></div>`
    : "";

  const customStyleBlock = content.customCss?.trim()
    ? `<style id="custom-overrides">\n${content.customCss}\n</style>`
    : "";

  const sectionsHtml = content.sections.map((sec, i) => `
    <div class="sec reveal" style="--i:${i}">
      <div class="sec-accent"></div>
      <div class="sec-inner">
        <div class="sec-header">
          <span class="sec-num">${String(i + 1).padStart(2, "0")}</span>
          <h2 class="sec-h">${sec.heading}</h2>
        </div>
        <div class="sec-text">${sec.body.replace(/\n/g, "<br>")}</div>
      </div>
      <div class="sec-watermark">${String(i + 1).padStart(2, "0")}</div>
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${content.documentTitle} — ${content.clientName}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--a:${accent};--ar:${accentRgb};--gdk:#184B44;--ink:#1E2235;--muted:#5A6073;--surface:#F0F2F7;--white:#fff;--border:rgba(24,75,68,.09)}
html{scroll-behavior:smooth}
body{font-family:'Sora',sans-serif;background:var(--surface);color:var(--ink);min-height:100vh}

/* ── COVER ── */
.cover{position:relative;min-height:72vh;background:#080C10;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(40px,7vw,80px) clamp(24px,6vw,72px)}

/* Canvas sparkles */
#sparkles{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}

/* Gradient blobs */
.blobs{position:absolute;inset:0;overflow:hidden;filter:blur(72px);z-index:0;pointer-events:none}
.blob{position:absolute;border-radius:50%;opacity:.28}
.blob-1{width:clamp(300px,45vw,600px);height:clamp(300px,45vw,600px);background:${accent};top:-15%;right:-10%;animation:b1 18s ease-in-out infinite}
.blob-2{width:clamp(200px,30vw,420px);height:clamp(200px,30vw,420px);background:#469DE2;bottom:-10%;left:5%;animation:b2 22s ease-in-out infinite}
.blob-3{width:clamp(150px,20vw,300px);height:clamp(150px,20vw,300px);background:${accent};top:30%;left:40%;animation:b3 15s ease-in-out infinite;opacity:.15}

@keyframes b1{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(-60px,40px) scale(1.08)}50%{transform:translate(40px,-50px) scale(.94)}75%{transform:translate(70px,30px) scale(1.04)}}
@keyframes b2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-60px) scale(1.1)}66%{transform:translate(-50px,40px) scale(.9)}}
@keyframes b3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-80px,60px) scale(1.15)}}

/* Noise overlay */
.cover::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");opacity:.4;z-index:1;pointer-events:none}

.cover-inner{position:relative;z-index:2;max-width:800px}
.cover-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(${accentRgb},.12);border:1px solid rgba(${accentRgb},.3);color:${accent};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px;margin-bottom:28px}
.cover-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:${accent};animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
.cover-to{font-size:12px;color:rgba(255,255,255,.4);font-weight:300;margin-bottom:16px;letter-spacing:.02em}
.cover-h{font-size:clamp(28px,5vw,56px);font-weight:700;color:#fff;line-height:1.08;letter-spacing:-.025em;margin-bottom:14px}
.cover-h .hl{color:${accent}}
.cover-sub{font-size:clamp(14px,1.6vw,18px);color:rgba(255,255,255,.55);font-weight:300;line-height:1.65;max-width:580px;margin-bottom:36px}
.cover-meta{display:flex;gap:20px;flex-wrap:wrap}
.cover-meta-item{font-size:11px;color:rgba(255,255,255,.35);font-weight:400;display:flex;align-items:center;gap:6px}
.cover-meta-dot{width:4px;height:4px;border-radius:50%;background:${accent};opacity:.7;flex-shrink:0}

/* Scroll hint */
.scroll-hint{margin-top:48px;display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.2);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.scroll-line{width:32px;height:1px;background:rgba(255,255,255,.2)}

/* ── CONTENT ── */
.content{max-width:900px;margin:0 auto;padding:clamp(40px,6vw,72px) clamp(24px,5vw,60px)}

/* ── SECTION CARDS ── */
.sec{position:relative;background:var(--white);border:1px solid var(--border);border-radius:20px 20px 20px 4px;padding:36px 40px;margin-bottom:20px;overflow:hidden;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease}
.sec:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(${accentRgb},.1)}
.sec-accent{position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,${accent} 0%,rgba(${accentRgb},.2) 100%);border-radius:4px 0 0 2px}
.sec-inner{position:relative;z-index:1}
.sec-header{display:flex;align-items:baseline;gap:14px;margin-bottom:16px}
.sec-num{font-size:11px;font-weight:700;letter-spacing:.12em;color:${accent};background:rgba(${accentRgb},.08);border:1px solid rgba(${accentRgb},.18);padding:4px 10px;border-radius:999px;white-space:nowrap;flex-shrink:0}
.sec-h{font-size:clamp(16px,2vw,20px);font-weight:600;color:var(--gdk);line-height:1.3;letter-spacing:-.01em}
.sec-text{font-size:14px;color:var(--muted);font-weight:300;line-height:1.8}
.sec-watermark{position:absolute;right:-8px;bottom:-16px;font-size:96px;font-weight:700;color:rgba(${accentRgb},.04);line-height:1;pointer-events:none;user-select:none;z-index:0}

/* ── FOOTER ── */
.doc-footer{text-align:center;padding:clamp(24px,4vw,48px) 0;margin:0 clamp(24px,5vw,60px)}
.doc-footer-line{width:100%;height:1px;background:linear-gradient(90deg,transparent 0%,var(--border) 20%,var(--border) 80%,transparent 100%);margin-bottom:20px}
.doc-footer-text{font-size:11px;color:#9299B0;font-weight:300;letter-spacing:.03em}
.doc-footer-brand{color:${accent};font-weight:600}

/* ── REVEAL ANIMATION ── */
.reveal{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1);transition-delay:calc(var(--i,0)*80ms)}
.reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}.blob,.cover-eyebrow-dot{animation:none}}

/* ── LOGO ── */
.cover-logo{margin-bottom:24px}
.cover-logo img{height:40px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:.85}

/* ── CUSTOM EFFECT CONTAINER ── */
#cover-effect-container{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
#effect-canvas{position:absolute;inset:0;width:100%;height:100%}

@media(max-width:600px){.cover{min-height:60vh}.sec{padding:28px 24px}.sec-h{font-size:16px}}
</style>
${customStyleBlock}
</head>
<body>

<!-- COVER -->
<div class="cover" id="cover">
  <canvas id="sparkles"></canvas>
  <div id="cover-effect-container"><canvas id="effect-canvas"></canvas></div>
  <div class="blobs" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
  <div class="cover-inner">
    ${logoHtml}
    <div class="cover-eyebrow"><span class="cover-eyebrow-dot"></span>Material Personalizado · Checklist Fácil</div>
    <div class="cover-to">Preparado exclusivamente para <strong style="color:rgba(255,255,255,.8)">${content.clientName}</strong></div>
    <h1 class="cover-h">${content.documentTitle}</h1>
    <p class="cover-sub">${content.documentSubtitle}</p>
    <div class="cover-meta">
      <span class="cover-meta-item"><span class="cover-meta-dot"></span>${date}</span>
      <span class="cover-meta-item"><span class="cover-meta-dot"></span>${content.sections.length} ${content.sections.length === 1 ? "tópico" : "tópicos"}</span>
      <span class="cover-meta-item"><span class="cover-meta-dot"></span>Documento confidencial</span>
    </div>
    <div class="scroll-hint"><span class="scroll-line"></span>Role para ver o conteúdo</div>
  </div>
</div>

<!-- SECTIONS -->
<div class="content">
  ${sectionsHtml}
</div>

<!-- FOOTER -->
<div class="doc-footer">
  <div class="doc-footer-line"></div>
  <div class="doc-footer-text"><span class="doc-footer-brand">Checklist Fácil</span> · Líder em Checklists na América Latina · checklistfacil.com.br</div>
</div>

<script>
// ── SPARKLES (canvas particles) ──
(function(){
  const canvas=document.getElementById('sparkles');
  const ctx=canvas.getContext('2d');
  const cover=document.getElementById('cover');
  function resize(){canvas.width=cover.offsetWidth;canvas.height=cover.offsetHeight}
  resize();
  window.addEventListener('resize',resize,{passive:true});
  const N=180,P=[];
  for(let i=0;i<N;i++){
    P.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*1.4+.3,
      op:Math.random()*.5+.08,
      vx:(Math.random()-.5)*.28,
      vy:(Math.random()-.5)*.28,
      od:(Math.random()<.5?1:-1),
      os:Math.random()*.007+.003,
      minOp:.04,
      maxOp:Math.random()*.5+.15
    });
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of P){
      p.x+=p.vx;p.y+=p.vy;
      p.op+=p.os*p.od;
      if(p.op>=p.maxOp||p.op<=p.minOp)p.od*=-1;
      if(p.x<0)p.x=canvas.width;else if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height;else if(p.y>canvas.height)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+p.op.toFixed(3)+')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ──
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.intersectionRatio>.08){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:[0,.08]});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();
</script>
</body>
</html>`;
}
