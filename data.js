/* ─────────────────────────────────────────────────────────────
 * data.js — Tubo Gipson portfolio
 * Edit IDENTITY, PROJECTS, and BUILD_LOG to keep it current.
 * ───────────────────────────────────────────────────────────── */

const PROJECTS = [

  /* ── WEB APPS ──────────────────────────────────────────────── */

  {
    id: 'elixirayur',
    name: 'ElixirAyur',
    kind: 'webapp',
    status: 'live',
    blurb: 'Full-stack Ayurvedic e-commerce platform. Dosha quiz with personalized email, Stripe-powered product store, Clerk auth, Telegram bot, WhatsApp bot via Twilio, and n8n automation backend.',
    tech: ['Next.js 15', 'Prisma', 'PostgreSQL', 'Stripe', 'Clerk', 'Tailwind', 'n8n', 'Twilio'],
    deployedAt: 'Vercel · elixirayur.com',
    url: 'https://elixirayur.com',
    accent: 'shopping-bag',
  },

  {
    id: 'dalc',
    name: 'Digital Alchemist Connection',
    kind: 'webapp',
    status: 'live',
    blurb: 'Web3 NFT membership platform on the XRP Ledger. Dual minting: wallet-connect via Xaman/Crossmark for crypto natives, or Stripe-to-XRPL for non-crypto users. Three tiers, artist gallery, onboarding.',
    tech: ['XRPL', 'Cloudflare Worker', 'Xaman SDK', 'Stripe', 'n8n', 'Pinata', 'HTML/CSS/JS'],
    deployedAt: 'thedigitalalchemistconnection.com',
    url: 'https://thedigitalalchemistconnection.com',
    accent: 'layers',
  },

  {
    id: 'ledger-sovereignty',
    name: 'Ledger Sovereignty',
    kind: 'webapp',
    status: 'live',
    blurb: 'Crypto sovereignty education and consulting platform. XRPL-native payment flow: clients pay in XRP, n8n validates on-chain, Cloudflare Worker gates session access and sends the link.',
    tech: ['XRPL', 'Cloudflare Worker', 'n8n', 'HTML/CSS/JS'],
    deployedAt: 'live',
    url: 'https://tagenterprise.net',
    accent: 'shield',
  },

  {
    id: 'stayblink',
    name: 'StayBlink',
    kind: 'webapp',
    status: 'live',
    blurb: 'Full-stack vacation rental marketplace. Property search, filter & availability calendar, host dashboard, PayPal Live checkout, guest reviews, Supabase Storage for images, email confirmations via Resend.',
    tech: ['React', 'Vite', 'Supabase', 'PayPal', 'Resend', 'Tailwind'],
    deployedAt: 'Vercel',
    url: 'https://stayblink.vercel.app',
    accent: 'map-pin',
  },

  {
    id: 'estateiq',
    name: 'EstatelQ',
    kind: 'webapp',
    status: 'wip',
    blurb: 'AI-powered real estate analysis platform. Connects property data with language models to surface comparables, investment signals, and market insights through a clean SaaS dashboard.',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'OpenAI', 'Tailwind'],
    deployedAt: 'in progress',
    accent: 'home',
  },

  {
    id: 'trade-tech',
    name: 'Trade-Tech Automations',
    kind: 'webapp',
    status: 'wip',
    blurb: 'SaaS for electricians and plumbers. Upload a blueprint photo — AI identifies wiring symbols, cross-references NEC/IPC codes, and outputs a formatted estimate + material list. Built from 40 years of trade experience.',
    tech: ['WordPress', 'n8n', 'OpenAI Vision', 'Stripe', 'Supabase'],
    deployedAt: 'in development',
    accent: 'zap',
  },

  {
    id: 'tubo-ecosystem',
    name: 'Tubo Ecosystem',
    kind: 'webapp',
    status: 'wip',
    blurb: 'Modular monorepo spanning web, mobile, and backend services. Unified design system with a gold-on-black visual identity. Ayurvedic principles woven into the UX architecture.',
    tech: ['Next.js', 'React Native', 'Turborepo', 'TypeScript', 'Tailwind'],
    deployedAt: 'in progress',
    accent: 'box',
  },

  {
    id: 'astrology-portal',
    name: 'Astrology Portal',
    kind: 'webapp',
    status: 'wip',
    blurb: 'Interactive astrology platform with a full zodiac data engine, birth-chart logic, and animated celestial UI — all in vanilla HTML/CSS/JS, zero dependencies, zero build step.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    deployedAt: 'live',
    // url: 'https://your-astrology-site.com',   ← add your live URL
    accent: 'star',
  },

  {
    id: 'decode-cosmic',
    name: 'Decode the Cosmic Algorithm',
    kind: 'webapp',
    status: 'wip',
    blurb: 'Educational platform exploring consciousness, systems, and symbolism. Landing page, embedded resource hub, and Mailchimp newsletter integration. Published and live.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Mailchimp'],
    deployedAt: 'live',
    // url: 'https://your-decode-cosmic-site.com',   ← add your live URL
    accent: 'activity',
  },


  /* ── n8n WORKFLOWS ─────────────────────────────────────────── */

  {
    id: 'dalc-stripe-xrpl',
    name: 'DALC: Stripe → XRPL Mint',
    kind: 'workflow',
    status: 'live',
    blurb: 'Stripe payment triggers automatic NFT minting on the XRP Ledger. Validates the charge, selects the tier, mints via XRPL platform wallet, emails a claim link, and logs everything to Google Sheets — no crypto wallet required from the buyer.',
    tech: ['n8n', 'Stripe', 'XRPL', 'Cloudflare Worker', 'Gmail', 'Google Sheets'],
    deployedAt: 'n8n Cloud · dalc-proxy.tagenterprise.workers.dev',
    runs: 47,
    workflow: {
      name: 'DALC: Stripe → XRPL Mint',
      nodes: [
        { id: '1', name: 'Stripe Webhook',    type: 'n8n-nodes-base.webhook',          position: [200, 300] },
        { id: '2', name: 'Validate Payment',  type: 'n8n-nodes-base.code',             position: [420, 300] },
        { id: '3', name: 'Select Tier',       type: 'n8n-nodes-base.if',               position: [640, 300] },
        { id: '4', name: 'Mint on XRPL',      type: 'n8n-nodes-base.httpRequest',      position: [860, 200] },
        { id: '5', name: 'Email Claim Link',  type: 'n8n-nodes-base.gmail',            position: [1080, 200] },
        { id: '6', name: 'Log to Sheets',     type: 'n8n-nodes-base.googleSheets',     position: [860, 400] },
        { id: '7', name: 'Respond OK',        type: 'n8n-nodes-base.respondToWebhook', position: [1300, 300] },
      ],
      connections: {
        'Stripe Webhook':   { main: [[{ node: 'Validate Payment', type: 'main', index: 0 }]] },
        'Validate Payment': { main: [[{ node: 'Select Tier',      type: 'main', index: 0 }]] },
        'Select Tier':      { main: [[{ node: 'Mint on XRPL',     type: 'main', index: 0 }]] },
        'Mint on XRPL':     { main: [[
          { node: 'Email Claim Link', type: 'main', index: 0 },
          { node: 'Log to Sheets',    type: 'main', index: 0 },
        ]] },
        'Email Claim Link': { main: [[{ node: 'Respond OK', type: 'main', index: 0 }]] },
        'Log to Sheets':    { main: [[{ node: 'Respond OK', type: 'main', index: 0 }]] },
      },
    },
  },

  {
    id: 'elixirayur-dosha-pipeline',
    name: 'ElixirAyur: Dosha Pipeline',
    kind: 'workflow',
    status: 'live',
    blurb: 'Quiz completion triggers a personalized dosha report. n8n receives quiz answers, calls OpenAI to generate custom herbal recommendations keyed to the user\'s constitution, then delivers the result via SMTP.',
    tech: ['n8n', 'OpenAI', 'Hostinger SMTP', 'Next.js'],
    deployedAt: 'n8n Cloud',
    runs: 134,
    workflow: {
      name: 'ElixirAyur: Dosha Pipeline',
      nodes: [
        { id: '1', name: 'Quiz Webhook',     type: 'n8n-nodes-base.webhook',          position: [200, 300] },
        { id: '2', name: 'Validate Email',   type: 'n8n-nodes-base.code',             position: [420, 300] },
        { id: '3', name: 'Generate Report',  type: 'n8n-nodes-base.openAi',           position: [640, 300] },
        { id: '4', name: 'Send Email',       type: 'n8n-nodes-base.gmail',            position: [860, 300] },
        { id: '5', name: 'Log to DB',        type: 'n8n-nodes-base.httpRequest',      position: [1080, 300] },
        { id: '6', name: 'Respond',          type: 'n8n-nodes-base.respondToWebhook', position: [1300, 300] },
      ],
      connections: {
        'Quiz Webhook':    { main: [[{ node: 'Validate Email',  type: 'main', index: 0 }]] },
        'Validate Email':  { main: [[{ node: 'Generate Report', type: 'main', index: 0 }]] },
        'Generate Report': { main: [[{ node: 'Send Email',      type: 'main', index: 0 }]] },
        'Send Email':      { main: [[{ node: 'Log to DB',       type: 'main', index: 0 }]] },
        'Log to DB':       { main: [[{ node: 'Respond',         type: 'main', index: 0 }]] },
      },
    },
  },

  {
    id: 'dalc-artist-onboard',
    name: 'DALC: Artist Onboard',
    kind: 'workflow',
    status: 'live',
    blurb: 'Artist submits profile + artwork upload. Cloudflare Worker proxies to n8n: image stored in R2 bucket, metadata written to Google Sheets, confirmation email sent. Fully automated pipeline.',
    tech: ['n8n', 'Cloudflare R2', 'Google Sheets', 'Gmail'],
    deployedAt: 'n8n Cloud',
    runs: 12,
    workflow: {
      name: 'DALC: Artist Onboard',
      nodes: [
        { id: '1', name: 'Artist Webhook',     type: 'n8n-nodes-base.webhook',          position: [200, 300] },
        { id: '2', name: 'Extract Fields',     type: 'n8n-nodes-base.set',              position: [420, 300] },
        { id: '3', name: 'Store Image → R2',   type: 'n8n-nodes-base.httpRequest',      position: [640, 300] },
        { id: '4', name: 'Log Artist',         type: 'n8n-nodes-base.googleSheets',     position: [860, 200] },
        { id: '5', name: 'Welcome Email',      type: 'n8n-nodes-base.gmail',            position: [860, 400] },
        { id: '6', name: 'Respond',            type: 'n8n-nodes-base.respondToWebhook', position: [1080, 300] },
      ],
      connections: {
        'Artist Webhook':   { main: [[{ node: 'Extract Fields',   type: 'main', index: 0 }]] },
        'Extract Fields':   { main: [[{ node: 'Store Image → R2', type: 'main', index: 0 }]] },
        'Store Image → R2': { main: [[
          { node: 'Log Artist',    type: 'main', index: 0 },
          { node: 'Welcome Email', type: 'main', index: 0 },
        ]] },
        'Log Artist':    { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
        'Welcome Email': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
      },
    },
  },

  {
    id: 'dalc-claim',
    name: 'DALC: NFT Claim Flow',
    kind: 'workflow',
    status: 'live',
    blurb: 'After a Stripe mint, the buyer submits their XRP wallet address via the claim link. n8n validates the token, fetches the assigned NFT from Sheets, creates an on-chain transfer offer via the platform wallet, executes the transfer, then updates the claim log and sends a confirmation email.',
    tech: ['n8n', 'XRPL', 'Google Sheets', 'Gmail', 'Cloudflare Worker'],
    deployedAt: 'n8n Cloud',
    runs: 31,
    workflow: {
      name: 'DALC: NFT Claim Flow',
      nodes: [
        { id: '1', name: 'Claim Webhook',       type: 'n8n-nodes-base.webhook',          position: [200,  300] },
        { id: '2', name: 'Validate Token',       type: 'n8n-nodes-base.code',             position: [420,  300] },
        { id: '3', name: 'Fetch NFT Assignment', type: 'n8n-nodes-base.googleSheets',     position: [640,  300] },
        { id: '4', name: 'Create Transfer Offer',type: 'n8n-nodes-base.httpRequest',      position: [880,  300] },
        { id: '5', name: 'Execute Transfer',     type: 'n8n-nodes-base.httpRequest',      position: [1100, 300] },
        { id: '6', name: 'Update Claim Log',     type: 'n8n-nodes-base.googleSheets',     position: [1320, 200] },
        { id: '7', name: 'Send Confirmation',    type: 'n8n-nodes-base.gmail',            position: [1320, 400] },
        { id: '8', name: 'Respond',              type: 'n8n-nodes-base.respondToWebhook', position: [1540, 300] },
      ],
      connections: {
        'Claim Webhook':        { main: [[{ node: 'Validate Token',        type: 'main', index: 0 }]] },
        'Validate Token':       { main: [[{ node: 'Fetch NFT Assignment',  type: 'main', index: 0 }]] },
        'Fetch NFT Assignment': { main: [[{ node: 'Create Transfer Offer', type: 'main', index: 0 }]] },
        'Create Transfer Offer':{ main: [[{ node: 'Execute Transfer',      type: 'main', index: 0 }]] },
        'Execute Transfer':     { main: [[
          { node: 'Update Claim Log',   type: 'main', index: 0 },
          { node: 'Send Confirmation',  type: 'main', index: 0 },
        ]] },
        'Update Claim Log':  { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
        'Send Confirmation': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
      },
    },
  },

  {
    id: 'dalc-mint-notify',
    name: 'DALC: Wallet Mint Verify',
    kind: 'workflow',
    status: 'live',
    blurb: 'When a member mints directly via Xaman or Crossmark wallet, this workflow fires. It verifies the NFTokenMint transaction on-chain against the XRPL ledger, resolves the tier from the transfer fee, logs the mint to Sheets, and pings admin.',
    tech: ['n8n', 'XRPL', 'Google Sheets', 'Gmail', 'Cloudflare Worker'],
    deployedAt: 'n8n Cloud',
    runs: 16,
    workflow: {
      name: 'DALC: Wallet Mint Verify',
      nodes: [
        { id: '1', name: 'Mint Webhook',       type: 'n8n-nodes-base.webhook',          position: [200,  300] },
        { id: '2', name: 'Extract Tx Hash',    type: 'n8n-nodes-base.set',              position: [420,  300] },
        { id: '3', name: 'Verify on XRPL',     type: 'n8n-nodes-base.httpRequest',      position: [640,  300] },
        { id: '4', name: 'Resolve Tier',       type: 'n8n-nodes-base.code',             position: [860,  300] },
        { id: '5', name: 'Valid Mint?',        type: 'n8n-nodes-base.if',               position: [1080, 300] },
        { id: '6', name: 'Log Mint Activity',  type: 'n8n-nodes-base.googleSheets',     position: [1300, 200] },
        { id: '7', name: 'Notify Admin',       type: 'n8n-nodes-base.gmail',            position: [1300, 400] },
        { id: '8', name: 'Respond',            type: 'n8n-nodes-base.respondToWebhook', position: [1520, 300] },
      ],
      connections: {
        'Mint Webhook':     { main: [[{ node: 'Extract Tx Hash',  type: 'main', index: 0 }]] },
        'Extract Tx Hash':  { main: [[{ node: 'Verify on XRPL',   type: 'main', index: 0 }]] },
        'Verify on XRPL':   { main: [[{ node: 'Resolve Tier',     type: 'main', index: 0 }]] },
        'Resolve Tier':     { main: [[{ node: 'Valid Mint?',       type: 'main', index: 0 }]] },
        'Valid Mint?':      { main: [
          [{ node: 'Log Mint Activity', type: 'main', index: 0 }],
          [{ node: 'Notify Admin',      type: 'main', index: 0 }],
        ]},
        'Log Mint Activity': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
        'Notify Admin':      { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
      },
    },
  },

  {
    id: 'ledger-session-flow',
    name: 'Ledger Sovereignty: Session Flow',
    kind: 'workflow',
    status: 'live',
    blurb: 'Four-workflow system powering Ledger Sovereignty bookings end-to-end: payment initiation → XRPL confirmation polling → session access grant → session validation. Clients pay in XRP; the system handles everything else.',
    tech: ['n8n', 'XRPL', 'Cloudflare Worker', 'SMTP', 'Google Sheets'],
    deployedAt: 'n8n Cloud',
    runs: 89,
    workflow: {
      name: 'Ledger Sovereignty: Session Flow',
      nodes: [
        { id: '1', name: 'Session Request',       type: 'n8n-nodes-base.webhook',      position: [200, 300] },
        { id: '2', name: 'Build XRP Invoice',     type: 'n8n-nodes-base.code',         position: [420, 300] },
        { id: '3', name: 'Poll XRPL Ledger',      type: 'n8n-nodes-base.httpRequest',  position: [640, 300] },
        { id: '4', name: 'Payment Confirmed?',    type: 'n8n-nodes-base.if',           position: [880, 300] },
        { id: '5', name: 'Grant Session',         type: 'n8n-nodes-base.set',          position: [1100, 200] },
        { id: '6', name: 'Email Access Link',     type: 'n8n-nodes-base.gmail',        position: [1320, 200] },
        { id: '7', name: 'Log to Sheets',         type: 'n8n-nodes-base.googleSheets', position: [1100, 400] },
      ],
      connections: {
        'Session Request':    { main: [[{ node: 'Build XRP Invoice',  type: 'main', index: 0 }]] },
        'Build XRP Invoice':  { main: [[{ node: 'Poll XRPL Ledger',   type: 'main', index: 0 }]] },
        'Poll XRPL Ledger':   { main: [[{ node: 'Payment Confirmed?', type: 'main', index: 0 }]] },
        'Payment Confirmed?': { main: [
          [{ node: 'Grant Session',  type: 'main', index: 0 }],
          [{ node: 'Log to Sheets',  type: 'main', index: 0 }],
        ]},
        'Grant Session': { main: [[{ node: 'Email Access Link', type: 'main', index: 0 }]] },
      },
    },
  },

];


/* ─── Identity ───────────────────────────────────────────────── */
const IDENTITY = {
  name: 'Tubo Gipson',
  tagline: 'Web apps · Web3 · AI automation',
  available: true,
};


/* ─── Build log (sidebar terminal feed) ─────────────────────── */
const BUILD_LOG = [
  { t: '0m',  msg: 'portfolio · deployed',               tone: 'live' },
  { t: '2h',  msg: 'dalc · artist-onboard ok',           tone: 'live' },
  { t: '1d',  msg: 'elixirayur · quiz pipeline ok',      tone: 'live' },
  { t: '3d',  msg: 'dalc · xrpl testnet mint ok',        tone: 'live' },
  { t: '1w',  msg: 'estateiq · ai build in progress',    tone: 'wip'  },
  { t: '2w',  msg: 'stayblink · live on vercel',         tone: 'live' },
];
