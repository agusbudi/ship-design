/* ============================================================
   ShipDesign Scheduler — data, approval system & shared UI
   ============================================================ */

const PHASES = {
  concept:     { label: 'Concept design',     color: '#185FA5', bg: '#E6F1FB', tc: '#0C447C' },
  preliminary: { label: 'Preliminary design', color: '#1D9E75', bg: '#E1F5EE', tc: '#085041' },
  contract:    { label: 'Contract design',    color: '#D85A30', bg: '#FAECE7', tc: '#712B13' },
  functional:  { label: 'Functional design',  color: '#7F77DD', bg: '#EEEDFE', tc: '#3C3489' }
};

const STATUS_CYCLE = ['todo','in-progress','done','overdue'];
const STATUS_CFG = {
  'todo':        { label: 'To do',       chip: 'chip-todo' },
  'in-progress': { label: 'In progress', chip: 'chip-prog' },
  'done':        { label: 'Done',        chip: 'chip-done' },
  'overdue':     { label: 'Overdue',     chip: 'chip-late' }
};

/* ---- Approval roles ---- */
const ROLES = {
  engineer:   { id:'engineer',   label:'Engineer',   level:1, color:'#B5D4F4', tc:'#0C447C' },
  supervisor: { id:'supervisor', label:'Supervisor', level:2, color:'#C0DD97', tc:'#27500A' },
  manager:    { id:'manager',    label:'Manager',    level:3, color:'#FAC775', tc:'#633806' },
  owner:      { id:'owner',      label:'Owner',      level:4, color:'#CECBF6', tc:'#3C3489' }
};

const APPROVAL_STEPS = [
  { role:'engineer',   label:'Engineer review',   desc:'Technical check & document preparation' },
  { role:'supervisor', label:'Supervisor review',  desc:'Quality check & completeness verification' },
  { role:'manager',    label:'Manager approval',   desc:'Project alignment & resource sign-off' },
  { role:'owner',      label:'Owner approval',     desc:'Final acceptance & formal sign-off' }
];

const MIN_ADD_ROLE_LEVEL = 2;

const TEAM_MEMBERS = [
  { id:'user_1', name:'Ahmad Taufik',  initials:'AT', role:'engineer',   dept:'Naval Architecture' },
  { id:'user_2', name:'Budi Santoso',  initials:'BS', role:'engineer',   dept:'Structural' },
  { id:'user_3', name:'Rini Ayu',      initials:'RA', role:'engineer',   dept:'Machinery' },
  { id:'user_4', name:'Eko Prasetyo',  initials:'EP', role:'engineer',   dept:'Electrical' },
  { id:'user_5', name:'Sari Dewi',     initials:'SD', role:'supervisor', dept:'Design' },
  { id:'user_6', name:'Hendra Wijaya', initials:'HW', role:'supervisor', dept:'Production' },
  { id:'user_7', name:'Dewi Rahayu',   initials:'DR', role:'manager',    dept:'Project Mgmt' },
  { id:'user_8', name:'Ir. Santoso',   initials:'IS', role:'owner',      dept:'Owner / Client' }
];

/* ---- Current user ---- */
function getCurrentUser() {
  try { const u = sessionStorage.getItem('sd_user'); if (u) return JSON.parse(u); } catch(e) {}
  return TEAM_MEMBERS[0];
}
function setCurrentUser(u) { try { sessionStorage.setItem('sd_user', JSON.stringify(u)); } catch(e) {} }
function canAddDeliverable()    { return ROLES[getCurrentUser().role].level >= MIN_ADD_ROLE_LEVEL; }
function canApproveStep(srole)  { return ROLES[getCurrentUser().role].level >= ROLES[srole].level; }

/* ---- Raw deliverable data ---- */
const RAW_DATA = [
  { phase:'concept', cat:'hull', items:[
    'Performance specification (initial draft)','Body plan and appendage sketch',
    'Area/volume summary','Concept GA drawings','Topside arrangement sketch',
    'Payload definition','Description of mission-critical systems','Weight estimate',
    'Concept midship section','Propulsion plant description','Machinery arrangement sketch',
    'Electric load analysis','Simplified one line diagrams','Master equipment list (MEL)',
    'Speed-power curve','Manning estimate','Endurance fuel analysis',
    'Estimates of critical performance aspects','Cost estimate','Technical risk assessment plan'
  ]},
  { phase:'preliminary', cat:'hull', items:[
    'Performance specification','Lines drawing and appendage sketch',
    'Area/volume report','GA drawings (individual compartment)','Topside arrangement drawing',
    'Payload definition','Lines of sight analysis','Descriptions of principal ship systems',
    'Weight report (3-digit level)','Structural midship section','Machinery arrangement drawings',
    'Electric load analysis','One line diagrams','Preliminary MEL','Speed-power curve',
    'Propulsion system analysis','Endurance fuel analysis','Preliminary scantling drawings',
    'Cost estimate','Technical risk assessment plan','Ship control and communications analysis',
    'Shafting arrangement','Preliminary ship manning analysis',
    'Stability analysis (intact & damaged)','Preliminary propulsor design',
    'HVAC load analysis','Seakeeping and maneuvering analysis','Model test plan',
    'Other performance estimates','Preliminary availability analysis','Maintenance concept',
    'Supportability concept','T&E plan (draft)','Preliminary safety analysis',
    'Build strategy (draft)','Shipyard production specification',
    'Typical space arrangements','Deck systems arrangements'
  ]},
  { phase:'contract', cat:'hull', items:[
    'Ship specification','Lines plan drawing','Appendage drawing','General arrangements',
    'Topside arrangement','Capacity plan','Steel scantling drawings',
    'Structural design criteria manual','Weight report','Midship section',
    'Machinery control system diagrams','Electric load analysis',
    'Propulsion shafting arrangement','Master Equipment List',
    'Propulsion and auxiliary machinery arrangement drawings',
    'Electric power and lighting systems one line diagrams','Fault current analysis',
    'Navigation system diagram','Cost estimate','Technical risk assessment plan',
    'Piping systems analysis','Diagrammatic arrangements of all piping systems',
    'Fire control diagram','Mechanical systems arrangements','Living space arrangements',
    'HVAC load analysis and design criteria','Pilot house and chart room arrangements',
    'Interior communications system diagram','Propeller design',
    'Preliminary ship manning document','Pollution control systems report',
    'Loading conditions','T&E plan','Trim and stability booklet',
    'Damage stability analysis','Endurance fuel analysis','Hydrodynamic model test results',
    'Stack gas flow analysis','Evaluations of other performance aspects',
    'Availability analysis (Ao)','Maintenance plan','Supportability plan',
    'Crew training plan','Floodable length curves','Safety analysis',
    'Procurement specifications for long-lead items','Models and mockups',
    'Commissary space arrangements','Ventilation and air conditioning diagrams',
    'Initial regulatory body review','Building plan','Budget control list','Production plan'
  ]},
  { phase:'functional', cat:'hull', items:[
    'Lines plan drawing','Outboard profile','GA — compartment and access drawings',
    'N.A. drawings (hydrostatics, cross curves)','Block arrangement and list',
    'Frame body plan','Structural block drawings with scantlings','Major foundation drawings',
    'Welding plan','Hull fitting drawings','Hull weights and block lifting data',
    'Lists of hull outfit','Lists of hull fittings','Nameplates and notices',
    'Summary paint schedule','Summary deck covering schedule','Summary hull insulation schedule',
    'Furniture list','Plumbing and fixture list','Galley arrangement',
    'Accommodation arrangement','Steering gear arrangement','Rudder and rudder stock arrangement',
    'Rudder and propeller lifting gear arrangement','Anchor handling arrangement',
    'Mooring arrangement','Life-saving equipment arrangement','Hull piping system diagrammatics',
    'Purchase technical specifications (PTS)','Advance material ordering (AMO) list',
    'Steel list per block'
  ]},
  { phase:'functional', cat:'machinery', items:[
    'Machinery arrangement','Shafting arrangement','Stern tube arrangement',
    'Machinery space and wheelhouse control console arrangement',
    'Machinery piping system diagrammatics','Diesel exhaust arrangement',
    'Lifting gear in machinery space','Machinery and pipe insulation schedule',
    'Unit and equipment foundations','Machinery and foundation weights',
    'Purchase technical specifications (PTS)','Advanced material ordering (AMO) lists'
  ]},
  { phase:'functional', cat:'electrical', items:[
    'Electrical load analysis','One-line diagram','Short circuit analysis',
    'List of motors and controllers','List of feeders and mains',
    'Electrical equipment and installation diagrams','Switchboard drawings',
    'List of portable electrical equipment','Electrical system weights',
    'Purchase technical specifications (PTS)','Advance material ordering (AMO) list'
  ]},
  { phase:'functional', cat:'hvac', items:[
    'Heating and cooling analysis','HVAC diagram and equipment list',
    'HVAC insulation schedule','HVAC system weights',
    'Purchase technical specifications (PTS)','Advance material ordering (AMO) list'
  ]},
  { phase:'functional', cat:'production', items:[
    'Work station information plan and schedule','Block outfitting and erection schedule',
    'Zone outfitting schedule','Tests and trials schedule'
  ]}
];

function makeApproval(status, seed) {
  const steps = APPROVAL_STEPS.map(s => ({ role:s.role, approved:false, by:null, time:null, note:'' }));
  const approvers = [
    { by:'Ahmad Taufik', time:'2 hari lalu' },{ by:'Sari Dewi',   time:'1 hari lalu' },
    { by:'Dewi Rahayu',  time:'18 jam lalu' },{ by:'Ir. Santoso', time:'12 jam lalu' }
  ];
  if (status === 'done') {
    steps.forEach((s,i) => { s.approved=true; s.by=approvers[i].by; s.time=approvers[i].time; });
  } else if (status === 'in-progress') {
    const n = seed % 3;
    if (n >= 1) { steps[0].approved=true; steps[0].by=approvers[0].by; steps[0].time='3 jam lalu'; }
    if (n >= 2) { steps[1].approved=true; steps[1].by=approvers[1].by; steps[1].time='1 jam lalu'; }
  }
  return { steps };
}

function buildTasks() {
  const tasks = []; let id = 0;
  RAW_DATA.forEach(g => g.items.forEach(label => {
    const r = Math.random();
    const status = r<0.25?'done':r<0.5?'in-progress':r<0.65?'overdue':'todo';
    tasks.push({ id:id++, phase:g.phase, cat:g.cat, label, status, approval:makeApproval(status,id), custom:false });
  }));
  return tasks;
}

function getTasks() {
  try { const s = sessionStorage.getItem('sd_tasks'); if (s) return JSON.parse(s); } catch(e) {}
  const t = buildTasks(); saveTasks(t); return t;
}
function saveTasks(t) { try { sessionStorage.setItem('sd_tasks', JSON.stringify(t)); } catch(e) {} }

/* ---- Approval actions ---- */
function getApprovalStatus(task) {
  if (!task.approval) return { label:'—', level:0 };
  const done = task.approval.steps.filter(s=>s.approved).length;
  if (done === 4) return { label:'Fully approved', level:4, chip:'chip-done' };
  if (done === 0) return { label:'Pending approval', level:0, chip:'chip-todo' };
  return { label:`Step ${done}/4 approved`, level:done, chip:'chip-prog' };
}

function doApprove(tasks, taskId, note) {
  const t = tasks.find(t => t.id == taskId); if (!t) return false;
  const steps = t.approval.steps;
  const ni = steps.findIndex(s => !s.approved); if (ni === -1) return false;
  if (!canApproveStep(steps[ni].role)) return false;
  const u = getCurrentUser();
  steps[ni].approved = true; steps[ni].by = u.name; steps[ni].time = 'Baru saja'; steps[ni].note = note||'';
  if (steps.every(s => s.approved)) t.status = 'done';
  saveTasks(tasks); return true;
}

function doReject(tasks, taskId, note) {
  const t = tasks.find(t => t.id == taskId); if (!t) return false;
  t.approval.steps.forEach(s => { s.approved=false; s.by=null; s.time=null; s.note=''; });
  t.status = 'in-progress';
  const u = getCurrentUser();
  const c = getComments(); if (!c[taskId]) c[taskId]=[];
  c[taskId].unshift({ id:Date.now(), author:u.name, ini:u.initials,
    col:ROLES[u.role].color, tc:ROLES[u.role].tc, time:'Baru saja', isReject:true,
    text:`Approval ditolak — semua langkah direset. ${note?'Alasan: '+note:''}`, replies:[] });
  saveComments(c); saveTasks(tasks); return true;
}

function addDeliverable(tasks, label, phase, cat) {
  if (!canAddDeliverable()) return null;
  const u = getCurrentUser();
  const t = { id:Date.now(), phase, cat, label, status:'todo',
    approval:makeApproval('todo',0), custom:true, addedBy:u.name,
    addedAt:new Date().toLocaleDateString('id-ID') };
  tasks.push(t); saveTasks(tasks); return t;
}

/* ---- Comments ---- */
function getComments() { try { const s=sessionStorage.getItem('sd_comments'); return s?JSON.parse(s):{}; } catch(e){return{};} }
function saveComments(c) { try { sessionStorage.setItem('sd_comments',JSON.stringify(c)); } catch(e){} }

(function seedComments() {
  if (Object.keys(getComments()).length > 0) return;
  const demo = {};
  [{id:3,col:'#B5D4F4',tc:'#0C447C',author:'Budi S.',ini:'BS',time:'2 jam lalu',
    text:'Draft GA drawing sudah dibuat, menunggu review Naval Architect.',
    replies:[
      {author:'Rini A.',ini:'RA',col:'#9FE1CB',tc:'#085041',time:'1 jam lalu',text:'Ada koreksi minor di accommodation deck.'},
      {author:'Budi S.',ini:'BS',col:'#B5D4F4',tc:'#0C447C',time:'45 mnt lalu',text:'Siap, akan direvisi besok pagi.'}
    ]},
   {id:7,col:'#CECBF6',tc:'#3C3489',author:'Sari D.',ini:'SD',time:'3 jam lalu',
    text:'Structural criteria sudah mengacu BKI 2023.',
    replies:[{author:'Ahmad T.',ini:'AT',col:'#C0DD97',tc:'#27500A',time:'2 jam lalu',text:'Sesuai. Lanjutkan ke scantling calculation.'}]}
  ].forEach(d => { if(!demo[d.id])demo[d.id]=[]; demo[d.id].push({id:Date.now()+Math.random(),author:d.author,ini:d.ini,col:d.col,tc:d.tc,time:d.time,text:d.text,replies:d.replies}); });
  saveComments(demo);
})();

/* ---- Shared approval track widget ---- */
function approvalTrackHtml(task) {
  if (!task.approval) return '';
  const steps = task.approval.steps;
  return `<div class="appr-track">${steps.map((s,i) => {
    const cfg = APPROVAL_STEPS[i];
    const isNext = !s.approved && (i===0 || steps[i-1].approved);
    const cls = s.approved?'done':isNext?'next':'wait';
    return `<div class="appr-step ${cls}">
      <div class="appr-dot">${s.approved
        ?`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`
        :`<span style="font-size:9px;font-weight:600;color:inherit">${i+1}</span>`}
      </div>
      <div class="appr-info">
        <div class="appr-role-lbl">${cfg.label}</div>
        ${s.approved
          ?`<div class="appr-by">&#10003; ${s.by} &middot; ${s.time}${s.note?` &mdash; "${s.note}"`:''}</div>`
          :isNext?`<div class="appr-by next-lbl">Menunggu tindakan</div>`
          :`<div class="appr-by">Belum dimulai</div>`}
      </div>
      ${i<3?`<div class="appr-arrow">&#8250;</div>`:''}
    </div>`;
  }).join('')}</div>`;
}

function approvalActionsHtml(task) {
  if (!task.approval) return '';
  const steps = task.approval.steps;
  const ni = steps.findIndex(s=>!s.approved);
  if (ni===-1) return `<div class="appr-complete"><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#3B6D11" opacity=".15"/><path d="M4 7l2 2 4-4" stroke="#3B6D11" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg> Semua tahap telah disetujui</div>`;
  const step = APPROVAL_STEPS[ni];
  if (!canApproveStep(step.role)) return `<div class="appr-locked"><svg width="13" height="13" viewBox="0 0 14 14"><rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" stroke-width="1.2" fill="none"/></svg> Butuh role <strong>${ROLES[step.role].label}</strong> untuk menyetujui tahap ini. Login sebagai ${ROLES[step.role].label} untuk melanjutkan.</div>`;
  return `<div class="appr-actions">
    <textarea id="appr-note-${task.id}" placeholder="Catatan persetujuan (opsional)…" rows="2"></textarea>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-approve" onclick="handleApprove(${task.id})">&#10003; Setujui — ${step.label}</button>
      <button class="btn btn-reject-sm" onclick="handleReject(${task.id})">&#10005; Tolak &amp; Reset</button>
    </div>
  </div>`;
}

/* ---- Shared shell ---- */
function renderShell(activePage) {
  const pages=[
    {id:'tree',  href:'tree.html',      label:'Hierarchy tree', icon:treeIcon()},
    {id:'gantt', href:'gantt.html',      label:'Gantt chart',    icon:ganttIcon()},
    {id:'kanban',href:'kanban.html',     label:'Kanban board',   icon:kanbanIcon()},
    {id:'dash',  href:'dashboard.html',  label:'Dashboard',      icon:dashIcon()}
  ];
  const u = getCurrentUser(); const r = ROLES[u.role];
  return `<div class="app">
  <div class="topbar">
    <div class="logo-box"><svg viewBox="0 0 18 18" fill="none"><path d="M9 2L2 6v6l7 4 7-4V6L9 2z" stroke="#fff" stroke-width="1.4"/><path d="M9 7v4M6.5 8.5l2.5 2.5 2.5-2.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg></div>
    <span class="logo-name">ShipDesign</span><span class="logo-sub">/ KRI Nusantara — Basic Design</span>
    <div class="topbar-right">
      <div class="user-pill" id="user-pill" onclick="toggleUserMenu()">
        <div class="av" style="background:${r.color};color:${r.tc}">${u.initials}</div>
        <div style="display:flex;flex-direction:column;gap:1px">
          <span style="font-size:12px;font-weight:500;line-height:1">${u.name}</span>
          <span style="font-size:10px;color:var(--text-tertiary);line-height:1">${r.label} &middot; ${(TEAM_MEMBERS.find(m=>m.id===u.id)||{dept:''}).dept}</span>
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </div>
      <div class="user-menu" id="user-menu">
        <div class="menu-label">Switch user (demo)</div>
        ${TEAM_MEMBERS.map(m=>{ const mr=ROLES[m.role]; return `<div class="menu-item${m.id===u.id?' active':''}" onclick="switchUser('${m.id}')">
          <div class="av" style="background:${mr.color};color:${mr.tc};width:24px;height:24px;font-size:9px">${m.initials}</div>
          <div><div style="font-size:12px;font-weight:500">${m.name}</div><div style="font-size:10px;color:var(--text-tertiary)">${mr.label} &middot; ${m.dept}</div></div>
        </div>`; }).join('')}
      </div>
    </div>
  </div>
  <div class="layout">
    <div class="sidebar">
      <div class="nav-label">Navigation</div>
      ${pages.map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${p.icon}${p.label}</a>`).join('')}
      <div class="nav-label" style="margin-top:8px">Phases</div>
      ${Object.entries(PHASES).map(([k,p])=>`<a class="nav-item" href="tree.html?phase=${k}"><span class="nav-dot" style="background:${p.color}"></span>${p.label}</a>`).join('')}
    </div>
    <div class="content" id="content">`;
}
function closeShell() { return `</div></div></div>`; }

function switchUser(id) {
  const m = TEAM_MEMBERS.find(m=>m.id===id); if(!m) return;
  setCurrentUser(m); location.reload();
}
function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('open');
}
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const pill = document.getElementById('user-pill');
    const menu = document.getElementById('user-menu');
    if (pill && menu && !pill.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open');
  });
}

function treeIcon()   { return `<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="11" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="10" y="6.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5h2.5V8H6M8.5 8H10M6 12.5h2.5V8" stroke="currentColor" stroke-width="1.2"/></svg>`; }
function ganttIcon()  { return `<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="8" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="4" y="6.8" width="10" height="2.5" rx="1" fill="currentColor" opacity=".6"/><rect x="2" y="10.5" width="6" height="2.5" rx="1" fill="currentColor" opacity=".4"/></svg>`; }
function kanbanIcon() { return `<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="6" y="2" width="4" height="8" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="11" y="2" width="4" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>`; }
function dashIcon()   { return `<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>`; }
