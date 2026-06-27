/* ─── n8n node visual config ────────────────────────────────── */
const NODE_CONFIG = {
  'n8n-nodes-base.webhook':           { color: '#3B7A3A', label: 'Webhook' },
  'n8n-nodes-base.cron':              { color: '#5C574E', label: 'Schedule' },
  'n8n-nodes-base.scheduleTrigger':   { color: '#5C574E', label: 'Schedule' },
  'n8n-nodes-base.httpRequest':       { color: '#1F3FE0', label: 'HTTP' },
  'n8n-nodes-base.openAi':            { color: '#6E3FB8', label: 'OpenAI' },
  'n8n-nodes-base.function':          { color: '#5C574E', label: 'Function' },
  'n8n-nodes-base.code':              { color: '#5C574E', label: 'Code' },
  'n8n-nodes-base.if':                { color: '#5C574E', label: 'If' },
  'n8n-nodes-base.set':               { color: '#5C574E', label: 'Set' },
  'n8n-nodes-base.merge':             { color: '#5C574E', label: 'Merge' },
  'n8n-nodes-base.hubspot':           { color: '#E8763A', label: 'HubSpot' },
  'n8n-nodes-base.airtable':          { color: '#E8763A', label: 'Airtable' },
  'n8n-nodes-base.slack':             { color: '#B8377E', label: 'Slack' },
  'n8n-nodes-base.gmail':             { color: '#C04A3A', label: 'Gmail' },
  'n8n-nodes-base.googleSheets':      { color: '#3B7A3A', label: 'Sheets' },
  'n8n-nodes-base.googleCalendar':    { color: '#1F3FE0', label: 'GCal' },
  'n8n-nodes-base.telegram':          { color: '#1F3FE0', label: 'Telegram' },
  'n8n-nodes-base.notion':            { color: '#161514', label: 'Notion' },
  'n8n-nodes-base.discord':           { color: '#6E3FB8', label: 'Discord' },
  'n8n-nodes-base.respondToWebhook':  { color: '#3B7A3A', label: 'Respond' },
};
const FALLBACK_NODE = { color: '#5C574E', label: 'Node' };

/* ─── State ─────────────────────────────────────────────────── */
const state = {
  filter: 'all',
  search: '',
  selected: null,
};

function setState(updates) {
  Object.assign(state, updates);
  renderSidebar();
  renderMain();
}

/* ─── Utils ─────────────────────────────────────────────────── */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function icon(name, attrs = '') {
  return `<i data-lucide="${name}" ${attrs}></i>`;
}

function filterProjects() {
  const q = state.search.trim().toLowerCase();
  return PROJECTS.filter(p => {
    if (state.filter === 'webapp' && p.kind !== 'webapp') return false;
    if (state.filter === 'workflow' && p.kind !== 'workflow') return false;
    if (q && !p.name.toLowerCase().includes(q)
         && !p.tech.join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
}

/* ─── n8n JSON → graph ──────────────────────────────────────── */
function parseWorkflow(wf) {
  const nodes = wf.nodes.map(n => ({
    id: n.id || n.name,
    name: n.name,
    type: n.type,
    x: n.position[0],
    y: n.position[1],
  }));
  const byName = Object.fromEntries(nodes.map(n => [n.name, n]));
  const edges = [];
  for (const [src, conns] of Object.entries(wf.connections || {})) {
    for (const outputs of (conns.main || [])) {
      for (const tgt of (outputs || [])) {
        if (byName[src] && byName[tgt.node]) {
          edges.push({ from: src, to: tgt.node });
        }
      }
    }
  }
  return { nodes, edges, byName };
}

function workflowSVG(workflow, opts = {}) {
  const { nodes, edges, byName } = parseWorkflow(workflow);
  const nodeW = opts.nodeW ?? 168;
  const nodeH = opts.nodeH ?? 64;
  const pad = opts.pad ?? 40;
  const showLabels = opts.showLabels ?? true;
  const showGrid = opts.showGrid ?? true;

  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + nodeW + pad;
  const maxY = Math.max(...ys) + nodeH + pad;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  const gridDef = showGrid ? `
    <defs>
      <pattern id="grid-${opts.uid || 'main'}" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#C9C2B1" opacity="0.4" />
      </pattern>
    </defs>
    <rect x="${minX}" y="${minY}" width="${vbW}" height="${vbH}" fill="url(#grid-${opts.uid || 'main'})" />
  ` : '';

  const edgeMarkup = edges.map(e => {
    const from = byName[e.from], to = byName[e.to];
    const x1 = from.x + nodeW;
    const y1 = from.y + nodeH / 2;
    const x2 = to.x;
    const y2 = to.y + nodeH / 2;
    const dx = Math.max(40, (x2 - x1) * 0.45);
    const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    return `
      <path d="${d}" stroke="#C9C2B1" stroke-width="2" fill="none" />
      <circle cx="${x2}" cy="${y2}" r="3" fill="#161514" />
    `;
  }).join('');

  const nodeMarkup = nodes.map(n => {
    const cfg = NODE_CONFIG[n.type] || FALLBACK_NODE;
    const nameText = n.name.length > 22 ? n.name.slice(0, 21) + '…' : n.name;
    const labels = showLabels ? `
      <text x="18" y="24" font-size="10" fill="#5C574E"
            style="font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; text-transform: uppercase;">
        ${escapeHtml(cfg.label)}
      </text>
      <text x="18" y="46" font-size="13" fill="#161514" font-weight="500">
        ${escapeHtml(nameText)}
      </text>
    ` : '';
    return `
      <g transform="translate(${n.x} ${n.y})">
        <rect width="${nodeW}" height="${nodeH}" rx="8" fill="white" stroke="#E4DFD3" stroke-width="1" />
        <rect width="4" height="${nodeH}" rx="2" fill="${cfg.color}" />
        ${labels}
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="${minX} ${minY} ${vbW} ${vbH}" style="width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg">
      ${gridDef}
      ${edgeMarkup}
      ${nodeMarkup}
    </svg>
  `;
}

function miniWorkflowSVG(workflow, uid) {
  return workflowSVG(workflow, {
    nodeW: 100, nodeH: 40, pad: 20,
    showLabels: false, showGrid: false, uid,
  });
}

function edgeCount(workflow) {
  return Object.values(workflow.connections || {})
    .reduce((acc, c) => acc + (c.main || []).reduce((a, o) => a + (o ? o.length : 0), 0), 0);
}

/* ─── HTML builders ─────────────────────────────────────────── */
function statusHTML(status) {
  return `
    <span class="status ${status}">
      <span class="dot"></span>
      <span class="label">${escapeHtml(status)}</span>
    </span>
  `;
}

function techTagsHTML(techArr, limit) {
  const arr = limit ? techArr.slice(0, limit) : techArr;
  return arr.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
}

function cardHTML(p) {
  const isWorkflow = p.kind === 'workflow';
  const previewClass = isWorkflow ? 'workflow' : 'webapp';
  const previewInner = isWorkflow && p.workflow
    ? `<div style="width: 92%; height: 78%; opacity: 0.85;">${miniWorkflowSVG(p.workflow, p.id)}</div>`
    : `${icon(p.accent || 'workflow', 'class="accent-icon"')}`;

  return `
    <button class="card" data-project-id="${escapeHtml(p.id)}">
      <div class="card-preview ${previewClass}">
        ${previewInner}
        <span class="card-kind-tag">${isWorkflow ? 'n8n' : 'web'}</span>
      </div>
      <div class="card-body">
        <div class="card-head">
          <span class="card-name">${escapeHtml(p.name)}</span>
          ${statusHTML(p.status)}
        </div>
        <p class="card-blurb">${escapeHtml(p.blurb)}</p>
        <div class="tech-row">${techTagsHTML(p.tech, 4)}</div>
      </div>
    </button>
  `;
}

function statsHTML() {
  const live = PROJECTS.filter(p => p.status === 'live').length;
  const workflows = PROJECTS.filter(p => p.kind === 'workflow').length;
  const totalRuns = PROJECTS.reduce((acc, p) => acc + (p.runs || 0), 0);
  const techs = new Set(PROJECTS.flatMap(p => p.tech)).size;

  const stats = [
    { label: 'Total projects', value: PROJECTS.length, sub: `${live} live · ${PROJECTS.length - live} other` },
    { label: 'n8n workflows', value: workflows, sub: `${totalRuns.toLocaleString()} runs all-time` },
    { label: 'Web apps', value: PROJECTS.length - workflows, sub: 'shipped & maintained' },
    { label: 'Technologies', value: techs, sub: 'across the stack' },
  ];

  return `
    <div class="stats">
      ${stats.map(s => `
        <div class="stat">
          <div class="label">${escapeHtml(s.label)}</div>
          <div class="value">${s.value}</div>
          <div class="sub">${escapeHtml(s.sub)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function overviewHTML() {
  const filtered = filterProjects();
  const sectionLabel = state.filter === 'all' ? 'overview' : state.filter;

  return `
    <div class="page-header">
      <div class="breadcrumb">/${escapeHtml(sectionLabel)}</div>
      <h1 class="page-title">What I Enjoy Doing!</h1>
      <p class="page-subtitle">
        Full-stack web apps, Web3 platforms on the XRP Ledger, and n8n automation workflows.
        Click any project to go deeper.
      </p>
    </div>

    ${statsHTML()}

    <div class="search-row">
      <div class="search-box">
        ${icon('search')}
        <input
          id="search-input"
          type="text"
          data-input="search"
          placeholder="Search projects or tech stack…"
          value="${escapeHtml(state.search)}"
        />
        ${state.search ? `<button class="search-clear" data-action="clear-search">${icon('x')}</button>` : ''}
      </div>
      <div class="result-count" id="result-count">
        ${filtered.length} of ${PROJECTS.length}
      </div>
    </div>

    <div class="grid" id="project-grid">
      ${filtered.length
        ? filtered.map(cardHTML).join('')
        : `<div class="empty" style="grid-column: 1 / -1;">Nothing matches that filter yet.</div>`
      }
    </div>
  `;
}

function detailHTML(p) {
  const metaRunsBlock = p.runs ? `
    <div>
      <div class="meta-label">Total runs</div>
      <div class="meta-value">${p.runs.toLocaleString()}</div>
    </div>
  ` : '';

  const workflowBlock = p.workflow ? `
    <div>
      <div class="workflow-header">
        <h2>Workflow · parsed from n8n export</h2>
        <span class="meta">${p.workflow.nodes.length} nodes · ${edgeCount(p.workflow)} edges</span>
      </div>
      <div class="workflow-frame">
        ${workflowSVG(p.workflow, { uid: p.id })}
      </div>
    </div>
  ` : '';

  return `
    <button class="back-btn" data-action="back">
      ${icon('chevron-right')}
      BACK TO OVERVIEW
    </button>

    <div class="detail-head">
      <h1 class="detail-title">${escapeHtml(p.name)}</h1>
      ${statusHTML(p.status)}
    </div>
    <p class="detail-blurb">${escapeHtml(p.blurb)}</p>

    <div class="meta-strip">
      ${p.repo ? `
        <div>
          <div class="meta-label">Repo</div>
          <div class="meta-value">${icon('github')} ${escapeHtml(p.repo)}</div>
        </div>
      ` : ''}
      ${p.deployedAt ? `
        <div>
          <div class="meta-label">Last deploy</div>
          <div class="meta-value">${escapeHtml(p.deployedAt)}</div>
        </div>
      ` : ''}
      ${metaRunsBlock}
      <div class="meta-actions">
        ${p.url
          ? `<a class="meta-action" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${icon('external-link')} Live</a>`
          : ''}
        ${p.repo
          ? `<a class="meta-action" href="https://github.com/${escapeHtml(p.repo)}" target="_blank" rel="noopener">${icon('github')} Source</a>`
          : ''}
      </div>
    </div>

    ${workflowBlock}
  `;
}

function sidebarHTML() {
  const counts = {
    all: PROJECTS.length,
    webapp: PROJECTS.filter(p => p.kind === 'webapp').length,
    workflow: PROJECTS.filter(p => p.kind === 'workflow').length,
  };

  const items = [
    { key: 'all',      label: 'Overview',     icon: 'layers',   count: counts.all },
    { key: 'webapp',   label: 'Web apps',     icon: 'globe',    count: counts.webapp },
    { key: 'workflow', label: 'Workflows',    icon: 'workflow', count: counts.workflow },
    { key: 'repos',    label: 'Repositories', icon: 'github',   count: counts.all },
  ];

  return `
    <div class="identity">
      ${IDENTITY.available ? `
        <div class="available-badge">
          <span class="dot"></span>
          <span>AVAILABLE</span>
        </div>
      ` : ''}
      <div class="name">${escapeHtml(IDENTITY.name)}</div>
      <div class="tagline">${escapeHtml(IDENTITY.tagline)}</div>
    </div>

    <nav class="nav">
      ${items.map(item => `
        <button class="nav-item ${state.filter === item.key ? 'active' : ''}" data-filter="${item.key}">
          ${icon(item.icon)}
          <span class="label">${escapeHtml(item.label)}</span>
          <span class="count">${item.count}</span>
        </button>
      `).join('')}
    </nav>

    <div class="build-log-wrap">
      <div class="build-log-header">
        ${icon('terminal')}
        <span>Build log</span>
        <div class="rule"></div>
      </div>
      <div class="build-log">
        ${BUILD_LOG.map((e, i) => `
          <div class="build-log-entry ${e.tone}" style="opacity: ${1 - (i * 0.08)};">
            <span class="t">${escapeHtml(e.t)}</span>
            <span class="indicator">●</span>
            <span class="msg">${escapeHtml(e.msg)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─── Render functions ──────────────────────────────────────── */
function renderSidebar() {
  document.getElementById('sidebar').innerHTML = sidebarHTML();
  refreshIcons();
}

function renderMain() {
  const mainEl = document.getElementById('main');
  mainEl.innerHTML = state.selected ? detailHTML(state.selected) : overviewHTML();
  refreshIcons();
}

function renderGrid() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  const filtered = filterProjects();
  grid.innerHTML = filtered.length
    ? filtered.map(cardHTML).join('')
    : `<div class="empty" style="grid-column: 1 / -1;">Nothing matches that filter yet.</div>`;
  const count = document.getElementById('result-count');
  if (count) count.textContent = `${filtered.length} of ${PROJECTS.length}`;
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

/* ─── Event handling (delegated) ────────────────────────────── */
document.addEventListener('click', (e) => {
  const filterBtn = e.target.closest('[data-filter]');
  if (filterBtn) {
    setState({ filter: filterBtn.dataset.filter, selected: null });
    return;
  }

  const projectCard = e.target.closest('[data-project-id]');
  if (projectCard) {
    const id = projectCard.dataset.projectId;
    const project = PROJECTS.find(p => p.id === id);
    if (project) setState({ selected: project });
    return;
  }

  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'back') setState({ selected: null });
  if (action === 'clear-search') setState({ search: '' });
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-input="search"]')) {
    state.search = e.target.value;
    renderGrid();
    // Show/hide the clear button — only the icon needs adding/removing
    const box = e.target.closest('.search-box');
    const hasClear = box.querySelector('.search-clear');
    if (state.search && !hasClear) {
      const btn = document.createElement('button');
      btn.className = 'search-clear';
      btn.dataset.action = 'clear-search';
      btn.innerHTML = icon('x');
      box.appendChild(btn);
      refreshIcons();
    } else if (!state.search && hasClear) {
      hasClear.remove();
    }
  }
});

/* ─── Boot ──────────────────────────────────────────────────── */
renderSidebar();
renderMain();
