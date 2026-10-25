/**
 * MATRIX — AI Operations Map
 * Constellation Graph Renderer, Draggable Nodes, Flowing Bubble Conduits & Plain-English Guide
 */

(function () {
  'use strict';

  // Sizing by Operational Significance (Tiers)
  const NODE_CONFIG = {
    // Tier 1: Central Titans & Heavyweights
    'node-device-laptop': { tier: 1, width: 270, height: 100 },
    'node-coord-hermes-gateway': { tier: 1, width: 260, height: 96 },
    'node-interface-antigravity': { tier: 1, width: 260, height: 96 },
    'node-agent-codex': { tier: 1, width: 250, height: 94 },
    'node-provider-ollama': { tier: 1, width: 250, height: 94 },

    // Tier 2: Major Pipelines & Hubs
    'node-storage-workspace': { tier: 2, width: 230, height: 86 },
    'node-app-prompt-council': { tier: 2, width: 230, height: 86 },
    'node-app-spreadsheet': { tier: 2, width: 230, height: 86 },
    'node-queue-blocked': { tier: 2, width: 230, height: 86 },
    'node-provider-gemini': { tier: 2, width: 220, height: 84 },
    'node-access-tailscale': { tier: 2, width: 220, height: 84 },

    // Tier 3: Auxiliary Coordinators & Routes
    'node-coord-orchestrator': { tier: 3, width: 205, height: 78 },
    'node-storage-wiki': { tier: 3, width: 205, height: 78 },
    'node-model-phi4': { tier: 3, width: 205, height: 78 },
    'node-access-telegram-client': { tier: 3, width: 205, height: 78 },
    'node-coord-antigravity-daemon': { tier: 3, width: 205, height: 78 },
    'node-integ-google-drive': { tier: 3, width: 205, height: 78 },
    'node-app-status-brief': { tier: 3, width: 205, height: 78 },
    'node-agent-agy-cli': { tier: 3, width: 205, height: 78 },

    // Tier 4: Satellite Tools & State Stores
    'node-tool-github-mcp': { tier: 4, width: 180, height: 68 },
    'node-tool-node-repl': { tier: 4, width: 180, height: 68 },
    'node-access-rustdesk': { tier: 4, width: 180, height: 68 },
    'node-access-ssh': { tier: 4, width: 180, height: 68 },
    'node-service-arc-gate': { tier: 4, width: 180, height: 68 },
    'node-interface-hermes-dashboard': { tier: 4, width: 180, height: 68 },
    'node-storage-hermes-dbs': { tier: 4, width: 180, height: 68 },
    'node-storage-codex-dbs': { tier: 4, width: 180, height: 68 },
    'node-output-orchestrations': { tier: 4, width: 180, height: 68 },
    'node-integ-telegram-bot': { tier: 4, width: 180, height: 68 }
  };

  // Curated Organic Constellation Coordinates (Command-Bridge Layout)
  const DEFAULT_CONSTELLATION_LAYOUT = {
    // Central Anchor / Physical Host
    'node-device-laptop': { x: 100, y: 360 },

    // Access Orbit (West)
    'node-access-tailscale': { x: 80, y: 160 },
    'node-access-telegram-client': { x: 80, y: 560 },
    'node-access-rustdesk': { x: 80, y: 720 },
    'node-access-ssh': { x: 280, y: 760 },
    'node-integ-telegram-bot': { x: 280, y: 560 },

    // Central Command Nexus
    'node-coord-antigravity-daemon': { x: 440, y: 70 },
    'node-interface-antigravity': { x: 440, y: 220 },
    'node-coord-hermes-gateway': { x: 440, y: 410 },
    'node-coord-orchestrator': { x: 770, y: 410 },
    'node-interface-hermes-dashboard': { x: 440, y: 610 },
    'node-service-arc-gate': { x: 440, y: 760 },

    // Reasoning Arc (North & Upper Center)
    'node-agent-agy-cli': { x: 770, y: 30 },
    'node-tool-github-mcp': { x: 1020, y: 30 },
    'node-tool-node-repl': { x: 1250, y: 30 },
    'node-agent-codex': { x: 770, y: 180 },
    'node-provider-ollama': { x: 1060, y: 170 },
    'node-model-phi4': { x: 1370, y: 170 },
    'node-provider-gemini': { x: 1060, y: 320 },

    // Memory Citadel (East)
    'node-storage-hermes-dbs': { x: 770, y: 620 },
    'node-storage-wiki': { x: 1060, y: 520 },
    'node-queue-blocked': { x: 1060, y: 670 },
    'node-storage-codex-dbs': { x: 1060, y: 810 },

    // Production Foundry (East / South-East)
    'node-app-prompt-council': { x: 1370, y: 310 },
    'node-storage-workspace': { x: 1370, y: 450 },
    'node-app-spreadsheet': { x: 1650, y: 430 },
    'node-integ-google-drive': { x: 1650, y: 590 },
    'node-app-status-brief': { x: 1370, y: 630 },
    'node-output-orchestrations': { x: 1370, y: 780 }
  };

  // Plain-English Explanations Database (Friendly, Non-Coding Language)
  const PLAIN_ENGLISH_GUIDE = {
    'node-device-laptop': {
      title: 'Acer-AI-Server (Your Laptop)',
      tagline: 'The physical computer on your desk that runs your entire AI setup.',
      plain_english: 'This is your Acer Aspire V3-772G laptop running Linux Mint. It is the physical engine providing all the processing power, 16 GB of memory, and the dedicated graphics card that powers your local AI assistants.',
      why_it_matters: 'Without this laptop powered on, none of your private assistants, local models, or files exist. It is your own private, self-hosted personal cloud.',
      status_simple: '✅ Online and running smoothly (Uptime: 23+ hours, low temperature, 6 GB available RAM).',
      how_to_use: 'Keep it plugged into power. Everything else connects into this machine.'
    },
    'node-coord-hermes-gateway': {
      title: 'Hermes Gateway (AI Chief of Staff)',
      tagline: 'The 24/7 background coordinator that routes messages from your phone to AI agents.',
      plain_english: 'Think of Hermes as your personal AI assistant and switchboard operator. It runs constantly in the background, connects to Telegram, reads incoming requests from your phone, and tells other specialized AI workers what to do.',
      why_it_matters: 'It allows you to control and query your server from your phone while walking outside, without having to type terminal commands or sit at the desk.',
      status_simple: '✅ Active and connected to your Telegram chat right now. Zero crashes.',
      how_to_use: 'Send a message in Telegram to the Agent Tomekk bot, or ask for a server status check.'
    },
    'node-interface-antigravity': {
      title: 'Antigravity IDE (Your AI Workbench)',
      tagline: 'The high-tech developer cockpit where you collaborate with AI assistants.',
      plain_english: 'This is the main desktop app where you are interacting right now! It gives you a smart coding editor, live browser previews, file inspectors, and instant pair-programming with AI models.',
      why_it_matters: 'It gives you complete visual control over your projects, code diffs, and web apps with interactive pair programming.',
      status_simple: '✅ Active and responsive on your screen.',
      how_to_use: 'Type your ideas or requests into the prompt box, review code changes, and test your web applications.'
    },
    'node-agent-codex': {
      title: 'Codex Worker Runner (Surgical Coder)',
      tagline: 'Your deep coding specialist for multi-file repairs and precise edits.',
      plain_english: 'Codex is a dedicated AI coding agent (running GPT-6.1-sol). When you need surgical changes to complex code, Hermes calls Codex to analyze the repository in a safe read-only sandbox before making edits.',
      why_it_matters: 'It is engineered specifically for programming accuracy, preventing messy accidental overwrites across your projects.',
      status_simple: '💤 Idle / Ready on standby (Desktop app is open, waiting for coding tasks).',
      how_to_use: 'Hermes dispatches coding jobs to Codex automatically, or you can launch it via the Prompt Council.'
    },
    'node-provider-ollama': {
      title: 'Ollama Server (100% Private Offline AI)',
      tagline: 'Runs free, private AI models directly inside your laptop memory.',
      plain_english: 'Ollama is your private local AI engine. It stores 10 different AI models on your hard drive and runs them without sending a single byte over the internet or paying monthly subscription fees.',
      why_it_matters: 'Guarantees complete privacy for sensitive tasks, works without an internet connection, and unloads models when not in use so your laptop stays fast.',
      status_simple: '✅ Running in background on port 11434. Models are currently unloaded from VRAM to keep your laptop cool.',
      how_to_use: 'Used automatically whenever local models like Phi-4, Qwen, or DeepSeek are requested.'
    },
    'node-model-phi4': {
      title: 'Phi-4 Mini (Designated Local Draft Worker)',
      tagline: 'Compact, super-fast local model that handles quick drafts for $0.',
      plain_english: 'A 3.8-billion parameter local model built by Microsoft that fits comfortably into your laptop memory. It is your designated quick-worker for reading summaries, drafting short notes, and checking safety boundaries.',
      why_it_matters: 'It runs locally, costs nothing, and saves your paid API tokens for heavy reasoning tasks.',
      status_simple: '⚡ Installed and ready to load in under 2 seconds whenever needed.',
      how_to_use: 'Used as Stage 2 in the Prompt Council and for local offline draft tasks.'
    },
    'node-provider-gemini': {
      title: 'Google Gemini 3.8 Flash (Cloud Brain)',
      tagline: 'Ultra-fast cloud intelligence for planning, architecture, and second opinions.',
      plain_english: 'Google’s state-of-the-art AI model connected securely via your private API key. It acts as your senior architectural advisor—decomposing messy human ideas into clear plans.',
      why_it_matters: 'Provides giant supercomputer intelligence in milliseconds without putting heavy heat or memory strain on your laptop.',
      status_simple: '🔑 Configured with your private API key in ~/.hermes/.env and ready on demand.',
      how_to_use: 'Used in Stage 1 of Prompt Council and when you ask Hermes for an architectural review.'
    },
    'node-access-tailscale': {
      title: 'Tailscale Mesh (Your Private Encrypted Cable)',
      tagline: 'Connects your phone securely to your laptop anywhere in the world.',
      plain_english: 'Tailscale creates an invisible, military-grade encrypted tunnel between your phone and your Acer laptop. It lets you access your server and this live map from anywhere without opening risky router ports.',
      why_it_matters: 'You can check your AI operations map and manage tasks from your phone on mobile data securely.',
      status_simple: '🔒 Active on IP 100.110.148.58. Traffic is encrypted.',
      how_to_use: 'Open http://100.110.148.58:8420 on your phone browser when connected to Tailscale.'
    },
    'node-queue-blocked': {
      title: 'Blocked-Work Queue (Safety Handbrake)',
      tagline: '19 operations paused waiting for your human permission.',
      plain_english: 'This is the safety guardrail of your system. Whenever an AI wants to execute code or make system changes that might have consequences, the system pauses and puts the task here, waiting for your approval.',
      why_it_matters: 'Ensures AI agents never go rogue or modify files without your explicit thumbs up. You currently have 19 past approval reminders logged here.',
      status_simple: '⚠️ 19 items awaiting review (16 approval timeouts + 3 verification items).',
      how_to_use: 'Click this node or the ATTENTION badge in the top bar to inspect each blocked item.'
    },
    'node-app-spreadsheet': {
      title: 'Spreadsheet Explorer (NotebookLM Blueprint Extractor)',
      tagline: 'Turns messy Excel files into structured audit blueprints for NotebookLM.',
      plain_english: 'A custom tool built for your laptop. You give it any Excel spreadsheet (.xlsx), and it safely inspects every formula, broken calculation (#REF!, #DIV/0!), and data link without altering your original file. It creates a blueprint file designed specifically to upload into Google NotebookLM.',
      why_it_matters: 'Once uploaded to NotebookLM, you can click "Generate Audio Overview" and listen to an AI podcast discussing your spreadsheet’s health and risks!',
      status_simple: '✅ Tested, 100% read-only, and verified operational in your Agent-Workspace.',
      how_to_use: 'Run ~/Documents/Agent-Workspace/bin/spreadsheet-blueprint "/path/to/spreadsheet.xlsx" in your terminal.'
    },
    'node-app-prompt-council': {
      title: 'Multi-Model Prompt Council (3-Stage Forge)',
      tagline: 'Turns rough human ideas into foolproof instructions for AI coders.',
      plain_english: 'When humans give vague prompts to coding agents, the agents often guess wrong. The Prompt Council runs your rough idea through 3 models: Gemini designs the architecture, local Phi-4 challenges it for flaws and security risks, and a compiler formats the perfect instruction for Codex or Hermes.',
      why_it_matters: 'Saves you hours of debugging and thousands of wasted tokens by getting prompts right on the first try.',
      status_simple: '✅ Fully configured and operational in ~/Documents/Agent-Workspace/bin/prompt-council.',
      how_to_use: 'Run ~/Documents/Agent-Workspace/bin/prompt-council "Your rough idea" --target codex.'
    },
    'node-storage-workspace': {
      title: 'Agent Workspace (The Central Filesystem)',
      tagline: 'The shared folder where your agents read guides and save completed work.',
      plain_english: 'Located at ~/Documents/Agent-Workspace. It is the shared meeting ground where instructions (BLUEPRINT.md, PROCEDURES.md) live and where outputs (reports, audit spreadsheets, generated tasks) are saved.',
      why_it_matters: 'Gives all your tools a single, organized place to read and write without scattering files across your hard drive.',
      status_simple: '📁 Healthy, synchronized, and backed up.',
      how_to_use: 'Browse files anytime in your file manager under Documents/Agent-Workspace.'
    },
    'node-storage-wiki': {
      title: 'Hermes-Wiki (AI Long-Term Journal)',
      tagline: 'Your AI setup’s personal diary, concepts encyclopedia, and memory bank.',
      plain_english: 'Located at ~/Documents/Hermes-Wiki. Every day, Hermes automatically writes a journal entry (such as today’s 2026-10-24 activity log) recording what conversations happened, what decisions were made, and what lessons were learned.',
      why_it_matters: 'Prevents the AI from forgetting past decisions and gives you a durable audit trail of everything your server has done.',
      status_simple: '📖 Updated today with your recent status briefs and conversations.',
      how_to_use: 'Read the daily activity files in Documents/Hermes-Wiki/journal/.'
    },
    'node-app-status-brief': {
      title: 'Status Brief Helper (Your System Doctor)',
      tagline: 'One-click health snapshot that verifies your server is running properly.',
      plain_english: 'An on-demand script that collects live CPU, RAM, disk usage, active services, and blocker counts, then checks them against hard evidence and outputs a verified plain-English health report.',
      why_it_matters: 'Gives you instant confidence that your server is running well without having to run ten separate diagnostic commands.',
      status_simple: '✅ Verified pass today (Oct 24 at 19:29:56) with zero service restarts.',
      how_to_use: 'Request a status brief from your phone in Telegram or view the latest report in Agent-Workspace/outputs/status-brief/.'
    },
    'node-tool-github-mcp': {
      title: 'GitHub MCP Server (Code Repository Bridge)',
      tagline: 'Docker tool that lets Antigravity inspect and manage GitHub repositories.',
      plain_english: 'A Model Context Protocol server running safely inside a Docker container. It allows your Antigravity assistant to search GitHub code, review pull requests, and manage issues without exposing credentials.',
      why_it_matters: 'Enables your AI to pair-program on real GitHub projects seamlessly.',
      status_simple: '🐳 Active in Docker container ghcr.io/github/github-mcp-server.',
      how_to_use: 'Used automatically by Antigravity during coding sessions.'
    },
    'node-integ-google-drive': {
      title: 'Google Drive Storage (Cloud Vault)',
      tagline: 'Verified cloud mirror backing up your important AI outputs.',
      plain_english: 'An authenticated integration that synchronizes your Agent Workspace outputs, projects, and run logs to your personal Google Drive folder.',
      why_it_matters: 'Protects your reports and blueprints from hardware failure and lets you open them on your tablet or phone.',
      status_simple: '☁️ Transfer verification status: PASSED (Verified with SHA-256 digital fingerprint).',
      how_to_use: 'Configured in workspace.json; files in 03 Results mirror to your Google Drive.'
    },
    'node-coord-orchestrator': {
      title: 'AI Orchestrator (Single-Worker Concurrency Lock)',
      tagline: 'Prevents laptop freezes by scheduling heavy AI jobs one at a time.',
      plain_english: 'A lightweight Python coordinator (worker.py) that strictly enforces a 1-helper limit. Because your laptop has 16 GB RAM and 2 GB VRAM, launching five AI models at once would crash the computer. The orchestrator makes them wait their turn.',
      why_it_matters: 'Guarantees your laptop never runs out of memory or overheats during multi-agent workflows.',
      status_simple: '🟢 Lock is FREE (worker_busy: false). Laptop memory is completely safe.',
      how_to_use: 'Coordinates sequential runs across Codex, Gemini, Antigravity, and local Phi-4.'
    },
    'node-access-telegram-client': {
      title: 'Telegram Mobile Client (Your Pocket Controller)',
      tagline: 'Your phone app for giving commands to your AI server on the go.',
      plain_english: 'The Telegram messenger app on your phone. You can chat with your private bot (Agent Tomekk) to ask for status updates, trigger tasks, and receive alerts while away from home.',
      why_it_matters: 'Turns your Acer laptop into a private Siri/Jarvis that you can reach from your pocket anywhere.',
      status_simple: '📱 Configured for user ID 8343882728.',
      how_to_use: 'Open Telegram on your phone and message the bot.'
    },
    'node-integ-telegram-bot': {
      title: 'Telegram Bot API Bridge',
      tagline: 'The cloud messenger pipeline connecting Telegram to your laptop.',
      plain_english: 'The long-polling HTTPS socket that delivers your phone messages directly into Hermes Gateway in real time.',
      why_it_matters: 'Enables instant two-way communication between mobile Telegram and local server daemons.',
      status_simple: '⚡ Connected and actively listening.',
      how_to_use: 'Runs automatically in the background.'
    },
    'node-coord-antigravity-daemon': {
      title: 'Antigravity CLI Daemon (Background Remote Engine)',
      tagline: 'Keeps Antigravity connected to the cloud for remote management.',
      plain_english: 'A systemd service (agy remote-control serve) running continuously in the background. It registers your laptop as "Acer-AI-Server" with Google Antigravity cloud.',
      why_it_matters: 'Allows headless agent orchestration and remote pair programming.',
      status_simple: '✅ Active (PID 306348) since boot.',
      how_to_use: 'Controlled via agy remote-control status/start/stop.'
    },
    'node-access-rustdesk': {
      title: 'RustDesk Server (Encrypted Remote Screen)',
      tagline: 'Remote desktop display streaming your Linux Mint desktop to other devices.',
      plain_english: 'High-performance open-source remote desktop server listening on port 21118. It lets you view and control the full visual graphical desktop of your Acer laptop from another PC, phone, or tablet.',
      why_it_matters: 'You don’t have to sit directly in front of the laptop screen to see what’s happening.',
      status_simple: '🖥️ Listening on port 21118 (PID 301178).',
      how_to_use: 'Connect using the RustDesk client with your machine ID.'
    },
    'node-access-ssh': {
      title: 'SSH Terminal (Encrypted Shell Gate)',
      tagline: 'Fast command-line terminal access over encrypted port 22.',
      plain_english: 'Standard OpenSSH server that allows you to open a terminal shell into your laptop from anywhere.',
      why_it_matters: 'Fastest way to run terminal commands remotely without transmitting graphical video frames.',
      status_simple: '🔐 OpenSSH listening on port 22.',
      how_to_use: 'ssh agenttomek@100.110.148.58 from any terminal.'
    },
    'node-service-arc-gate': {
      title: 'ARC Lesson Gate (Educational AI Lab Gate)',
      tagline: 'Password-protected Caddy reverse proxy for AI lab workspace lessons.',
      plain_english: 'Guards the ARC educational lesson workspace and synthetic evaluation servers (ports 5070–5073) behind an authenticated password gate.',
      why_it_matters: 'Prevents unauthorized web access to private laboratory lessons and evaluations.',
      status_simple: '🛡️ Active with Caddy reverse proxy.',
      how_to_use: 'Access via https://localhost:5070 with your credentials.'
    },
    'node-interface-hermes-dashboard': {
      title: 'Hermes Private Dashboard (Browser UI)',
      tagline: 'Private web dashboard on port 9119 to inspect agent turns and memories.',
      plain_english: 'A local web interface served at http://127.0.0.1:9119 protected by authentication tokens in ~/.hermes/dashboard-auth.env.',
      why_it_matters: 'Provides a clean visual browser view of all Hermes sessions and kanban cards.',
      status_simple: '🌐 Active on port 9119.',
      how_to_use: 'Open http://127.0.0.1:9119 in your browser.'
    },
    'node-storage-hermes-dbs': {
      title: 'Hermes Relational Databases (SQLite)',
      tagline: 'Durable storage for agent sessions, turns, and kanban cards.',
      plain_english: 'High-speed SQLite databases (state.db, kanban.db) running in write-ahead-logging (WAL) mode to record every prompt and dispatch.',
      why_it_matters: 'Ensures zero data loss even if the server is abruptly shut down.',
      status_simple: '💾 28 MB state.db in WAL mode.',
      how_to_use: 'Managed automatically by Hermes.'
    },
    'node-storage-codex-dbs': {
      title: 'Codex State Databases (SQLite)',
      tagline: 'Stores past coding session histories and indexed project structures.',
      plain_english: 'Houses thread histories (thread_history_1.sqlite, 26 MB) and operation logs for Codex code editing runs.',
      why_it_matters: 'Allows Codex to remember the context of past coding threads.',
      status_simple: '💾 Stored in ~/.codex/ with active session index.',
      how_to_use: 'Managed automatically by Codex.'
    },
    'node-output-orchestrations': {
      title: 'Orchestration Runs (Audit Archive)',
      tagline: 'Historical audit trail of all coordinated agent jobs.',
      plain_english: 'Contains 14 verified run directories under ~/.hermes/orchestration/runs/ with exact task instructions (TASK.md), results (result.json), and answer logs.',
      why_it_matters: 'Gives you complete auditability to see how long each agent took and what code it produced.',
      status_simple: '📁 14 completed runs archived.',
      how_to_use: 'Inspect in ~/.hermes/orchestration/runs/.'
    },
    'node-agent-agy-cli': {
      title: 'Antigravity CLI Agent (Autonomous Refactorer)',
      tagline: 'Command-line execution engine for multi-file workspace refactoring.',
      plain_english: 'The autonomous CLI interface for Antigravity (/home/agenttomek/.local/bin/agy) capable of planning and implementing complex coding changes.',
      why_it_matters: 'Can be invoked headlessly by Hermes to perform IDE-level automated fixes.',
      status_simple: '⚡ Binary installed and verified.',
      how_to_use: 'Run agy --mode plan or agy --mode auto in terminal.'
    },
    'node-tool-node-repl': {
      title: 'Node REPL MCP (Codex CUA Engine)',
      tagline: 'Codex bundled JavaScript execution environment and browser tool.',
      plain_english: 'Local NodeJS sandbox that allows Codex to evaluate scripts, interact with web pages, and test logic safely.',
      why_it_matters: 'Gives Codex a sandboxed execution playground without risking host files.',
      status_simple: '⚙️ Configured in ~/.codex/config.toml.',
      how_to_use: 'Used automatically by Codex.'
    }
  };

  // State Management
  const state = {
    topology: null,
    telemetry: null,
    events: [],
    selectedNodeId: null,
    focusedNodeId: null,
    searchQuery: '',
    activeFilter: 'all',
    followActivity: false,
    matrixRainEnabled: true,
    view: {
      x: 30,
      y: 20,
      scale: 0.82,
      isDragging: false,
      startX: 0,
      startY: 0
    },
    traceActive: null,
    bubbleDensity: 'high',
    flowSpeedMultiplier: 1.0,
    audioEnabled: false,
    bubbles: [],
    surgeEdges: new Set(),
    draggedNode: null,
    dragOffset: { x: 0, y: 0 },
    hasDragged: false,
    nodePositions: {}
  };

  // DOM Elements
  const el = {
    viewport: document.getElementById('viewport'),
    svg: document.getElementById('graph-svg'),
    aurasGroup: document.getElementById('auras-group'),
    pipesJacketGroup: document.getElementById('pipes-jacket-group'),
    connectionsGroup: document.getElementById('connections-group'),
    shockwavesGroup: document.getElementById('shockwaves-group'),
    bubblesGroup: document.getElementById('bubbles-group'),
    particlesGroup: document.getElementById('particles-group'),
    nodesGroup: document.getElementById('nodes-group'),
    minimapSvg: document.getElementById('minimap-svg'),
    minimapViewportRect: document.getElementById('minimap-viewport-rect'),
    zoomIndicator: document.getElementById('zoom-indicator'),
    drawer: document.getElementById('inspector-drawer'),
    drawerContent: document.getElementById('drawer-content'),
    searchInput: document.getElementById('search-input'),
    dock: document.getElementById('bottom-dock'),
    dockBody: document.getElementById('dock-body'),
    toastContainer: document.getElementById('toast-container'),
    // Modals
    plainEnglishModal: document.getElementById('plain-english-modal'),
    traceModal: document.getElementById('trace-modal'),
    coverageModal: document.getElementById('coverage-modal'),
    attentionBadge: document.getElementById('stat-attention-badge'),
    matrixCanvas: document.getElementById('matrix-canvas'),
    // Navigation & Layout Controls
    btnResetLayout: document.getElementById('btn-reset-layout'),
    // Pipe Controls
    btnFlowDensity: document.getElementById('btn-flow-density'),
    btnFlowSpeed: document.getElementById('btn-flow-speed'),
    btnAudioToggle: document.getElementById('btn-audio-toggle')
  };

  /* ==========================================================================
     Smart Typography & Truncation Formatter (Guarantees zero text overflow)
     ========================================================================== */
  function truncateText(str, maxLen) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 1) + '…';
  }

  function truncateMiddle(str, maxLen) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    const half = Math.floor((maxLen - 2) / 2);
    return str.slice(0, half) + '…' + str.slice(str.length - half);
  }

  function getDisplayLabel(label, tier) {
    const limits = { 1: 24, 2: 21, 3: 18, 4: 16 };
    const limit = limits[tier] || 18;
    return truncateText(label, limit);
  }

  function getDisplaySubtitle(sub, tier) {
    const limits = { 1: 30, 2: 26, 3: 22, 4: 19 };
    const limit = limits[tier] || 22;
    if (sub && (sub.includes('/') || sub.includes(':'))) {
      if (sub.length <= limit) return sub;
      const parts = sub.split('/');
      if (parts.length > 2) {
        const last = parts[parts.length - 1];
        const first = parts[0];
        const combined = `${first}/…/${last}`;
        if (combined.length <= limit) return combined;
      }
      return truncateMiddle(sub, limit);
    }
    return truncateText(sub, limit);
  }

  /* ==========================================================================
     Audio Synthesizer (Web Audio API - Sci-Fi Blips & Pulses)
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playWhoosh() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  /* ==========================================================================
     Matrix Rain Background Animation
     ========================================================================== */
  const canvas = el.matrixCanvas;
  const ctx = canvas.getContext('2d');
  let characters = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
  characters = characters.split('');
  const fontSize = 13;
  let columns = 0;
  let drops = [];

  function initRain() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }
  }

  function drawRain() {
    if (!state.matrixRainEnabled) return;
    ctx.fillStyle = 'rgba(3, 6, 4, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  window.addEventListener('resize', initRain);
  initRain();
  setInterval(drawRain, 45);

  /* ==========================================================================
     Topology & Node Positioning (Constellation Layout + LocalStorage)
     ========================================================================== */
  function loadPersistedPositions() {
    try {
      const saved = localStorage.getItem('matrix_node_positions');
      if (saved) {
        state.nodePositions = JSON.parse(saved);
      } else {
        state.nodePositions = JSON.parse(JSON.stringify(DEFAULT_CONSTELLATION_LAYOUT));
      }
    } catch (e) {
      state.nodePositions = JSON.parse(JSON.stringify(DEFAULT_CONSTELLATION_LAYOUT));
    }
  }

  function savePersistedPositions() {
    try {
      localStorage.setItem('matrix_node_positions', JSON.stringify(state.nodePositions));
    } catch (e) {}
  }

  async function loadTopology() {
    try {
      const res = await fetch('/api/topology');
      state.topology = await res.json();
      loadPersistedPositions();

      // Apply coordinates to nodes
      state.topology.nodes.forEach(n => {
        const pos = state.nodePositions[n.id] || DEFAULT_CONSTELLATION_LAYOUT[n.id] || { x: n.x, y: n.y };
        n.x = pos.x;
        n.y = pos.y;
      });

      renderGraph();
      updateMinimap();
      initFlowingBubbles();
      connectEventStream();
      startPolling();
      startBubbleAnimationLoop();
    } catch (e) {
      console.error('Failed to load topology:', e);
      showToast('Error loading operations topology', 'error');
    }
  }

  function renderGraph() {
    if (!state.topology) return;

    renderConstellationAuras();
    renderConduitsAndPipes();
    renderDraggableNodes();
    updateTransform();
  }

  /* ==========================================================================
     Organic Constellation Nebulae (Replaces rigid column rectangles)
     ========================================================================== */
  function renderConstellationAuras() {
    el.aurasGroup.innerHTML = '';

    const auras = [
      { cx: 480, cy: 380, rx: 340, ry: 260, fill: 'url(#aura-command)', label: '✦ COMMAND NEXUS' },
      { cx: 1040, cy: 220, rx: 380, ry: 200, fill: 'url(#aura-reasoning)', label: '✦ REASONING ENGINES' },
      { cx: 1180, cy: 560, rx: 320, ry: 240, fill: 'url(#aura-memory)', label: '✦ MEMORY CITADEL' },
      { cx: 1450, cy: 480, rx: 260, ry: 220, fill: 'url(#aura-production)', label: '✦ PRODUCTION FOUNDRY' }
    ];

    auras.forEach(a => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellipse.setAttribute('class', 'constellation-aura');
      ellipse.setAttribute('cx', a.cx.toString());
      ellipse.setAttribute('cy', a.cy.toString());
      ellipse.setAttribute('rx', a.rx.toString());
      ellipse.setAttribute('ry', a.ry.toString());
      ellipse.setAttribute('fill', a.fill);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'constellation-label');
      text.setAttribute('x', (a.cx - a.rx + 20).toString());
      text.setAttribute('y', (a.cy - a.ry + 25).toString());
      text.textContent = a.label;

      g.appendChild(ellipse);
      g.appendChild(text);
      el.aurasGroup.appendChild(g);
    });
  }

  /* ==========================================================================
     Dynamic Conduit Pipe Geometry Recalculation
     ========================================================================== */
  function getEdgePathD(edge) {
    const s = state.topology.nodes.find(n => n.id === edge.source);
    const t = state.topology.nodes.find(n => n.id === edge.target);
    if (!s || !t) return '';

    const sCfg = NODE_CONFIG[s.id] || { width: 200, height: 80 };
    const tCfg = NODE_CONFIG[t.id] || { width: 200, height: 80 };

    // Connect from right of source to left of target (or closest edges)
    const sx = s.x + sCfg.width;
    const sy = s.y + sCfg.height / 2;
    const tx = t.x;
    const ty = t.y + tCfg.height / 2;

    const dx = Math.abs(tx - sx) * 0.55;
    const dy = (ty - sy) * 0.15;

    return `M ${sx} ${sy} C ${sx + dx} ${sy + dy}, ${tx - dx} ${ty - dy}, ${tx} ${ty}`;
  }

  function renderConduitsAndPipes() {
    el.pipesJacketGroup.innerHTML = '';
    el.connectionsGroup.innerHTML = '';

    state.topology.edges.forEach(edge => {
      const d = getEdgePathD(edge);
      if (!d) return;

      // 1. Outer Pipe Jacket
      const jacket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      jacket.setAttribute('id', `jacket-${edge.id}`);
      jacket.setAttribute('class', 'pipe-jacket');
      jacket.setAttribute('d', d);
      el.pipesJacketGroup.appendChild(jacket);

      // 2. Inner Fluid Lumen
      const fluid = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fluid.setAttribute('id', `fluid-${edge.id}`);
      let fluidClass = 'pipe-fluid';
      if (edge.type === 'delegation' || edge.type === 'network') fluidClass += ' fluid-cyan';
      if (edge.type === 'tool_use') fluidClass += ' fluid-amber';
      fluid.setAttribute('class', fluidClass);
      fluid.setAttribute('d', d);
      el.connectionsGroup.appendChild(fluid);

      // 3. Center Fiber Light Guide
      const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      core.setAttribute('id', edge.id);
      core.setAttribute('class', 'pipe-core');
      core.setAttribute('d', d);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${edge.label}: ${edge.plain_english} [Evidence: ${edge.evidence}]`;
      core.appendChild(title);

      core.addEventListener('click', (e) => {
        e.stopPropagation();
        showConnectionDetails(edge);
      });

      el.connectionsGroup.appendChild(core);
    });
  }

  function updateConnectedPipesForNode(nodeId) {
    state.topology.edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        const d = getEdgePathD(edge);
        const j = document.getElementById(`jacket-${edge.id}`);
        const f = document.getElementById(`fluid-${edge.id}`);
        const c = document.getElementById(edge.id);
        if (j) j.setAttribute('d', d);
        if (f) f.setAttribute('d', d);
        if (c) {
          c.setAttribute('d', d);
          // Update bubble path length cache
          const len = c.getTotalLength();
          state.bubbles.forEach(b => {
            if (b.edgeId === edge.id) b.length = len;
          });
        }
      }
    });
  }

  /* ==========================================================================
     Flowing Bubbles Simulation
     ========================================================================== */
  function initFlowingBubbles() {
    el.bubblesGroup.innerHTML = '';
    state.bubbles = [];

    if (state.bubbleDensity === 'off' || !state.topology) return;

    const countPerEdge = state.bubbleDensity === 'high' ? 4 : (state.bubbleDensity === 'med' ? 2 : 1);

    state.topology.edges.forEach(edge => {
      const pathEl = document.getElementById(edge.id);
      if (!pathEl) return;

      const len = pathEl.getTotalLength();
      if (!len) return;

      for (let i = 0; i < countPerEdge; i++) {
        const bubbleEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const radius = 3.5 + Math.random() * 3.5;
        circle.setAttribute('r', radius.toString());

        let bubbleClass = 'pipe-bubble';
        if (edge.type === 'delegation' || edge.type === 'network') bubbleClass += ' bubble-cyan';
        else if (edge.type === 'tool_use') bubbleClass += ' bubble-amber';
        circle.setAttribute('class', bubbleClass);

        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        highlight.setAttribute('class', 'bubble-highlight');
        highlight.setAttribute('cx', (-radius * 0.3).toString());
        highlight.setAttribute('cy', (-radius * 0.3).toString());
        highlight.setAttribute('r', (radius * 0.35).toString());

        bubbleEl.appendChild(circle);
        bubbleEl.appendChild(highlight);
        el.bubblesGroup.appendChild(bubbleEl);

        state.bubbles.push({
          el: bubbleEl,
          pathEl: pathEl,
          length: len,
          edgeId: edge.id,
          t: Math.random(),
          speed: (0.0018 + Math.random() * 0.0022),
          baseRadius: radius,
          wobbleOffset: Math.random() * Math.PI * 2
        });
      }
    });
  }

  function startBubbleAnimationLoop() {
    function animate() {
      if (state.bubbleDensity !== 'off') {
        const speedMult = state.flowSpeedMultiplier;

        for (let i = 0; i < state.bubbles.length; i++) {
          const b = state.bubbles[i];
          const isSurging = state.surgeEdges.has(b.edgeId);
          const currentSpeed = isSurging ? (b.speed * 3.5) : (b.speed * speedMult);

          b.t += currentSpeed;
          if (b.t > 1) {
            b.t -= 1;
          }

          if (b.length > 0) {
            const pt = b.pathEl.getPointAtLength(b.t * b.length);
            const wobble = Math.sin(b.t * 18 + b.wobbleOffset) * 1.5;
            b.el.setAttribute('transform', `translate(${pt.x}, ${pt.y + wobble})`);
          }
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* ==========================================================================
     Draggable Nodes with Slick 3D Tactile Modules, Strict Clipping & 3D Info Jewels
     ========================================================================== */
  function renderDraggableNodes() {
    el.nodesGroup.innerHTML = '';

    state.topology.nodes.forEach(node => {
      const cfg = NODE_CONFIG[node.id] || { tier: 3, width: 205, height: 78 };

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `node-card node-group-${node.group} node-tier-${cfg.tier}`);
      g.setAttribute('id', node.id);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      // 1. Build Layered 3D Physical Shape (Slab + Faceplate + Rim)
      const shape = createCustomNodeShape(node, cfg.width, cfg.height);
      g.appendChild(shape);

      // SVG Clip Path to physically GUARANTEE zero text bleed outside card
      const clipId = `clip-${node.id}`;
      const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clip.setAttribute('id', clipId);
      const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clipRect.setAttribute('x', '10');
      clipRect.setAttribute('y', '4');
      clipRect.setAttribute('width', (cfg.width - 20).toString());
      clipRect.setAttribute('height', (cfg.height - 8).toString());
      clipRect.setAttribute('rx', '8');
      clip.appendChild(clipRect);
      g.appendChild(clip);

      // 2. Debossed Status Well & Luminous Status Dot
      const well = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      well.setAttribute('class', 'status-well');
      well.setAttribute('cx', '18');
      well.setAttribute('cy', '18');
      well.setAttribute('r', cfg.tier === 1 ? '7' : '6');

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', `node-status-dot status-${getNodeStatus(node.id)}`);
      dot.setAttribute('cx', '18');
      dot.setAttribute('cy', '18');
      dot.setAttribute('r', cfg.tier === 1 ? '4.5' : '3.8');

      // 3. Category Badge (Cleanly truncated so it never clashes with info jewel)
      const catText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      catText.setAttribute('class', 'node-badge');
      catText.setAttribute('x', '28');
      catText.setAttribute('y', '21');
      catText.setAttribute('fill', getCategoryColor(node.group));
      catText.textContent = truncateText(node.category, cfg.tier <= 2 ? 15 : 11);

      // 4. Clickable 3D Tactile Info Jewel (ℹ)
      const infoBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      infoBtn.setAttribute('class', 'node-info-btn');
      const infoX = cfg.width - 18;
      const infoY = 18;
      infoBtn.setAttribute('transform', `translate(${infoX}, ${infoY})`);

      // Generous invisible hit-target circle ensuring effortless targeting
      const hitTarget = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hitTarget.setAttribute('class', 'info-hit-target');
      hitTarget.setAttribute('r', '16');
      hitTarget.setAttribute('fill', 'transparent');
      infoBtn.appendChild(hitTarget);

      // Outer socket
      const socket = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      socket.setAttribute('class', 'info-jewel-socket');
      socket.setAttribute('r', '10');

      // 3D Convex jewel body
      const jewel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      jewel.setAttribute('class', 'info-jewel-body');
      jewel.setAttribute('r', '8.5');

      // Glint highlight
      const glint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glint.setAttribute('class', 'info-jewel-highlight');
      glint.setAttribute('cx', '-2.5');
      glint.setAttribute('cy', '-2.5');
      glint.setAttribute('r', '2.2');

      const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      infoText.setAttribute('class', 'node-info-text');
      infoText.textContent = 'i';

      const infoTooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      infoTooltip.textContent = 'Click for plain-English explanation (No coding jargon)';
      infoBtn.appendChild(infoTooltip);

      infoBtn.appendChild(socket);
      infoBtn.appendChild(jewel);
      infoBtn.appendChild(glint);
      infoBtn.appendChild(infoText);

      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPlainEnglishModal(node.id);
        playTone(880, 'sine', 0.08, 0.05);
      });

      // 5 & 6. Clipped Text Group (Zero text spillover guaranteed)
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('clip-path', `url(#${clipId})`);

      // 5. Node Title
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('class', 'node-title');
      title.setAttribute('x', '16');
      title.setAttribute('y', cfg.tier === 1 ? '48' : (cfg.tier === 2 ? '44' : '41'));
      title.textContent = getDisplayLabel(node.label, cfg.tier);
      const titleTooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleTooltip.textContent = node.label;
      title.appendChild(titleTooltip);

      // 6. Node Subtitle
      const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      sub.setAttribute('class', 'node-subtitle');
      sub.setAttribute('x', '16');
      sub.setAttribute('y', cfg.tier === 1 ? '70' : (cfg.tier === 2 ? '65' : '60'));
      sub.textContent = getDisplaySubtitle(node.subtitle, cfg.tier);
      const subTooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      subTooltip.textContent = node.subtitle;
      sub.appendChild(subTooltip);

      textGroup.appendChild(title);
      textGroup.appendChild(sub);

      g.appendChild(well);
      g.appendChild(dot);
      g.appendChild(catText);
      g.appendChild(infoBtn);
      g.appendChild(textGroup);

      // Node Drag & Drop Handlers
      g.addEventListener('mousedown', (e) => {
        if (e.target.closest('.node-info-btn') || e.button !== 0) return;
        startNodeDrag(e, node, g);
      });

      // Node Hover Interactions: Surge connected pipes with bubbles
      g.addEventListener('mouseenter', () => {
        if (!state.draggedNode) {
          triggerNodePipeSurge(node.id, true);
          playTone(620, 'sine', 0.04, 0.02);
        }
      });

      g.addEventListener('mouseleave', () => {
        if (!state.draggedNode) {
          triggerNodePipeSurge(node.id, false);
        }
      });

      // Node Click handler
      g.addEventListener('click', (e) => {
        if (state.hasDragged) return;
        e.stopPropagation();
        triggerShockwave(node.x + cfg.width / 2, node.y + cfg.height / 2);
        selectNode(node.id);
        playTone(780, 'triangle', 0.08, 0.05);
      });

      // Node Double Click for Focus Mode
      g.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        toggleFocusNode(node.id);
        playTone(950, 'sine', 0.12, 0.06);
      });

      el.nodesGroup.appendChild(g);
    });
  }

  /* ==========================================================================
     Free Drag-and-Drop Implementation
     ========================================================================== */
  function startNodeDrag(e, node, gElement) {
    e.stopPropagation();
    state.draggedNode = { node, gElement };
    state.hasDragged = false;

    // Convert client coordinates to graph coordinates
    const scale = state.view.scale;
    state.dragOffset.x = (e.clientX - state.view.x) / scale - node.x;
    state.dragOffset.y = (e.clientY - state.view.y) / scale - node.y;

    gElement.classList.add('dragging');
    el.nodesGroup.appendChild(gElement); // Bring to front
  }

  window.addEventListener('mousemove', (e) => {
    if (!state.draggedNode) return;
    state.hasDragged = true;

    const scale = state.view.scale;
    const nx = (e.clientX - state.view.x) / scale - state.dragOffset.x;
    const ny = (e.clientY - state.view.y) / scale - state.dragOffset.y;

    const { node, gElement } = state.draggedNode;
    node.x = Math.round(nx);
    node.y = Math.round(ny);

    gElement.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    // Dynamically re-bend all connected conduit pipes
    updateConnectedPipesForNode(node.id);
    updateMinimap();
  });

  window.addEventListener('mouseup', () => {
    if (!state.draggedNode) return;
    const { node, gElement } = state.draggedNode;
    gElement.classList.remove('dragging');

    // Save positions
    state.nodePositions[node.id] = { x: node.x, y: node.y };
    savePersistedPositions();

    state.draggedNode = null;
    setTimeout(() => {
      state.hasDragged = false;
    }, 50);
  });

  /* ==========================================================================
     Scaled Geometric Shape Builders with Physical 3D Tactile Relief
     (Extruded 3D Base Slab, Elevated Faceplate, Top Specular Rim & Embellishments)
     ========================================================================== */
  function createCustomNodeShape(node, w, h) {
    const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    if (node.group === 'devices') {
      // 1. Hardware Chassis: Hexagonal Chamfered Bevel
      const c = 14;

      // 3D Extruded Slab (Base foundation)
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      slab.setAttribute('points', `0,${c+4} ${c},4 ${w-c},4 ${w},${c+4} ${w},${h-c+4} ${w-c},${h+4} ${c},${h+4} 0,${h-c+4}`);
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      face.setAttribute('points', `0,${c} ${c},0 ${w-c},0 ${w},${c} ${w},${h-c} ${w-c},${h} ${c},${h} 0,${h-c}`);
      face.setAttribute('class', 'node-3d-face shape-chassis');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      rim.setAttribute('points', `0,${c} ${c},0 ${w-c},0 ${w},${c}`);
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      const b1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      b1.setAttribute('d', `M 4,20 L 4,6 L 20,6`);
      b1.setAttribute('class', 'chassis-bracket');
      const b2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      b2.setAttribute('d', `M ${w-4},${h-20} L ${w-4},${h-6} L ${w-20},${h-6}`);
      b2.setAttribute('class', 'chassis-bracket');
      shapeGroup.appendChild(b1);
      shapeGroup.appendChild(b2);

    } else if (node.group === 'coordinators') {
      // 2. Command Shield / Hex-Capsule
      // 3D Extruded Slab
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      slab.setAttribute('d', `M 0,${16+4} Q ${w/2},4 ${w},${16+4} L ${w},${h-16+4} Q ${w/2},${h+4} 0,${h-16+4} Z`);
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      face.setAttribute('d', `M 0,16 Q ${w/2},0 ${w},16 L ${w},${h-16} Q ${w/2},${h} 0,${h-16} Z`);
      face.setAttribute('class', 'node-3d-face shape-shield');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      rim.setAttribute('d', `M 0,16 Q ${w/2},0 ${w},16`);
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      const reticle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      reticle.setAttribute('cx', (w - 22).toString());
      reticle.setAttribute('cy', (h - 20).toString());
      reticle.setAttribute('r', '7');
      reticle.setAttribute('class', 'shield-reticle');
      shapeGroup.appendChild(reticle);

    } else if (node.group === 'agents') {
      // 3. Neural Diamond / Octagon Core
      const c = 18;

      // 3D Extruded Slab
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      slab.setAttribute('points', `${c},4 ${w-c},4 ${w},${c+4} ${w},${h-c+4} ${w-c},${h+4} ${c},${h+4} 0,${h-c+4} 0,${c+4}`);
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      face.setAttribute('points', `${c},0 ${w-c},0 ${w},${c} ${w},${h-c} ${w-c},${h} ${c},${h} 0,${h-c} 0,${c}`);
      face.setAttribute('class', 'node-3d-face shape-neural');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      rim.setAttribute('points', `0,${c} ${c},0 ${w-c},0 ${w},${c}`);
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      const orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      orb.setAttribute('cx', (w - 22).toString());
      orb.setAttribute('cy', (h - 20).toString());
      orb.setAttribute('r', '4.5');
      orb.setAttribute('class', 'neural-orb');
      shapeGroup.appendChild(orb);

    } else if (node.group === 'services') {
      // 4. Cyber Pod / Rounded Tool Capsule
      // 3D Extruded Slab
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      slab.setAttribute('x', '0');
      slab.setAttribute('y', '4');
      slab.setAttribute('width', w.toString());
      slab.setAttribute('height', h.toString());
      slab.setAttribute('rx', '14');
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      face.setAttribute('x', '0');
      face.setAttribute('y', '0');
      face.setAttribute('width', w.toString());
      face.setAttribute('height', h.toString());
      face.setAttribute('rx', '14');
      face.setAttribute('class', 'node-3d-face shape-pod');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      rim.setAttribute('d', `M 14,0 L ${w - 14},0`);
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      p1.setAttribute('cx', (w - 8).toString());
      p1.setAttribute('cy', (h * 0.4).toString());
      p1.setAttribute('r', '3');
      p1.setAttribute('class', 'pod-port');

      const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      p2.setAttribute('cx', (w - 8).toString());
      p2.setAttribute('cy', (h * 0.6).toString());
      p2.setAttribute('r', '3');
      p2.setAttribute('class', 'pod-port');

      shapeGroup.appendChild(p1);
      shapeGroup.appendChild(p2);

    } else if (node.group === 'memory') {
      // 5. Data Bank / Segmented Storage Cylinder
      // 3D Extruded Slab
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      slab.setAttribute('x', '0');
      slab.setAttribute('y', '4');
      slab.setAttribute('width', w.toString());
      slab.setAttribute('height', h.toString());
      slab.setAttribute('rx', '8');
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      face.setAttribute('x', '0');
      face.setAttribute('y', '0');
      face.setAttribute('width', w.toString());
      face.setAttribute('height', h.toString());
      face.setAttribute('rx', '8');
      face.setAttribute('class', 'node-3d-face shape-cylinder');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      rim.setAttribute('x1', '8');
      rim.setAttribute('y1', '0');
      rim.setAttribute('x2', (w - 8).toString());
      rim.setAttribute('y2', '0');
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      for (let i = 0; i < 3; i++) {
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', (w - 38).toString());
        bar.setAttribute('y', (h - 28 + i * 8).toString());
        bar.setAttribute('width', '18');
        bar.setAttribute('height', '4');
        bar.setAttribute('rx', '1');
        bar.setAttribute('class', 'memory-tier-bar');

        const fill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        fill.setAttribute('x', (w - 38).toString());
        fill.setAttribute('y', (h - 28 + i * 8).toString());
        fill.setAttribute('width', (10 + (i % 2) * 6).toString());
        fill.setAttribute('height', '4');
        fill.setAttribute('rx', '1');
        fill.setAttribute('class', 'memory-tier-fill');

        shapeGroup.appendChild(bar);
        shapeGroup.appendChild(fill);
      }

    } else {
      // 6. Process Foundry / Angular Pipeline Module
      // 3D Extruded Slab
      const slab = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      slab.setAttribute('points', `0,4 ${w-12},4 ${w},${12+4} ${w},${h+4} 12,${h+4} 0,${h-12+4}`);
      slab.setAttribute('class', 'node-3d-slab');
      shapeGroup.appendChild(slab);

      // 3D Elevated Faceplate
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      face.setAttribute('points', `0,0 ${w-12},0 ${w},12 ${w},${h} 12,${h} 0,${h-12}`);
      face.setAttribute('class', 'node-3d-face shape-foundry');
      shapeGroup.appendChild(face);

      // Top Specular Rim Highlight
      const rim = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      rim.setAttribute('points', `0,0 ${w-12},0 ${w},12`);
      rim.setAttribute('class', 'node-3d-rim');
      shapeGroup.appendChild(rim);

      for (let i = 0; i < 3; i++) {
        const led = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        led.setAttribute('cx', (w - 36 + i * 9).toString());
        led.setAttribute('cy', (h - 16).toString());
        led.setAttribute('r', '2.5');
        led.setAttribute('class', 'foundry-led');
        shapeGroup.appendChild(led);
      }
    }

    return shapeGroup;
  }

  function getCategoryColor(group) {
    const colors = {
      devices: '#00ff66',
      coordinators: '#00e575',
      agents: '#39ff14',
      services: '#00f0ff',
      memory: '#70ff00',
      applications: '#ffea00'
    };
    return colors[group] || '#00ff66';
  }

  function getNodeStatus(nodeId) {
    if (!state.telemetry) {
      if (nodeId === 'node-queue-blocked') return 'attention';
      return 'running';
    }

    const s = state.telemetry;

    if (nodeId === 'node-queue-blocked') {
      return (s.hermes && s.hermes.blocked_count > 0) ? 'attention' : 'idle';
    }
    if (nodeId === 'node-coord-hermes-gateway') {
      return s.hermes && s.hermes.gateway_state === 'running' ? 'running' : 'disconnected';
    }
    if (nodeId === 'node-coord-antigravity-daemon') {
      return s.services && s.services['antigravity-cli-daemon'] && s.services['antigravity-cli-daemon'].active ? 'running' : 'disconnected';
    }
    if (nodeId === 'node-provider-ollama') {
      return s.ollama && s.ollama.online ? (s.ollama.loaded_models.length > 0 ? 'busy' : 'running') : 'disconnected';
    }
    if (nodeId === 'node-model-phi4') {
      return s.ollama && s.ollama.phi4_route_installed ? 'standby' : 'unverified';
    }
    if (nodeId === 'node-agent-codex') {
      return s.codex && s.codex.desktop_running ? 'idle' : 'ready';
    }
    if (nodeId === 'node-tool-github-mcp') {
      return s.processes && s.processes['docker-mcp'] && s.processes['docker-mcp'].length > 0 ? 'running' : 'running';
    }
    if (nodeId === 'node-integ-google-drive') {
      return s.workspace && s.workspace.google_drive_status === 'passed' ? 'verified' : 'configured';
    }
    if (nodeId === 'node-app-status-brief') {
      return s.workspace && s.workspace.latest_brief ? 'verified' : 'ready';
    }

    return 'running';
  }

  /* ==========================================================================
     Plain English Info Modal (When ℹ is clicked)
     ========================================================================== */
  function openPlainEnglishModal(nodeId) {
    const guide = PLAIN_ENGLISH_GUIDE[nodeId];
    const node = state.topology.nodes.find(n => n.id === nodeId);
    if (!node) return;

    document.getElementById('pe-title').textContent = guide ? guide.title : node.label;
    document.getElementById('pe-tagline').textContent = guide ? guide.tagline : node.subtitle;
    document.getElementById('pe-plain-english').textContent = guide ? guide.plain_english : node.role;
    document.getElementById('pe-why-it-matters').textContent = guide ? guide.why_it_matters : 'Essential building block in your local AI environment.';
    document.getElementById('pe-status-simple').textContent = guide ? guide.status_simple : 'Verified operational on this computer.';
    document.getElementById('pe-how-to-use').textContent = guide ? guide.how_to_use : 'Operates automatically when needed.';

    el.plainEnglishModal.classList.add('open');
  }

  /* ==========================================================================
     Dynamic Pipe Surges & Shockwave Ripples
     ========================================================================== */
  function triggerNodePipeSurge(nodeId, active) {
    state.topology.edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        const jacket = document.getElementById(`jacket-${edge.id}`);
        if (jacket) jacket.classList.toggle('active', active);

        if (active) state.surgeEdges.add(edge.id);
        else state.surgeEdges.delete(edge.id);
      }
    });
  }

  function triggerShockwave(cx, cy) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('class', 'shockwave-ring');
    ring.setAttribute('cx', cx.toString());
    ring.setAttribute('cy', cy.toString());
    el.shockwavesGroup.appendChild(ring);

    setTimeout(() => {
      ring.remove();
    }, 850);
  }

  /* ==========================================================================
     Pan, Zoom & 3D Camera Orbit Interactions
     ========================================================================== */
  function updateTransform() {
    const { x, y, scale } = state.view;
    const t = `translate(${x}, ${y}) scale(${scale})`;
    if (el.groundShadowsGroup) el.groundShadowsGroup.setAttribute('transform', t);
    el.aurasGroup.setAttribute('transform', t);
    el.pipesJacketGroup.setAttribute('transform', t);
    el.connectionsGroup.setAttribute('transform', t);
    el.shockwavesGroup.setAttribute('transform', t);
    el.bubblesGroup.setAttribute('transform', t);
    el.particlesGroup.setAttribute('transform', t);
    el.nodesGroup.setAttribute('transform', t);

    el.zoomIndicator.textContent = `${Math.round(scale * 100)}%`;
    updateMinimap();
  }

  /* ==========================================================================
     Natural Planar Canvas Navigation (Pan & Zoom)
     ========================================================================== */
  el.viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.node-card')) return;

    // Normal 2D Pan (Left-click or Middle-click)
    if (e.button === 0 || e.button === 1) {
      state.view.isDragging = true;
      state.view.startX = e.clientX - state.view.x;
      state.view.startY = e.clientY - state.view.y;
      el.viewport.classList.add('grabbing');
    }
  });

  window.addEventListener('mousemove', (e) => {
    // 2D Canvas Panning
    if (state.view.isDragging) {
      state.view.x = e.clientX - state.view.startX;
      state.view.y = e.clientY - state.view.startY;
      updateTransform();
    }
  });

  window.addEventListener('mouseup', () => {
    if (state.view.isDragging) {
      state.view.isDragging = false;
      el.viewport.classList.remove('grabbing');
    }
  });

  el.viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newScale = e.deltaY < 0 ? state.view.scale * zoomFactor : state.view.scale / zoomFactor;
    newScale = Math.max(0.25, Math.min(2.5, newScale));

    const rect = el.viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    state.view.x = mouseX - (mouseX - state.view.x) * (newScale / state.view.scale);
    state.view.y = mouseY - (mouseY - state.view.y) * (newScale / state.view.scale);
    state.view.scale = newScale;
    updateTransform();
  }, { passive: false });

  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    state.view.scale = Math.min(2.5, state.view.scale * 1.2);
    updateTransform();
  });

  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    state.view.scale = Math.max(0.25, state.view.scale / 1.2);
    updateTransform();
  });

  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    state.view.x = 30;
    state.view.y = 20;
    state.view.scale = 0.82;
    updateTransform();
  });

  document.getElementById('btn-fit-screen').addEventListener('click', () => {
    const vpWidth = el.viewport.clientWidth;
    const vpHeight = el.viewport.clientHeight;
    const graphWidth = 1900;
    const graphHeight = 1000;

    const scaleX = vpWidth / graphWidth;
    const scaleY = vpHeight / graphHeight;
    state.view.scale = Math.min(scaleX, scaleY) * 0.92;
    state.view.x = (vpWidth - graphWidth * state.view.scale) / 2;
    state.view.y = (vpHeight - graphHeight * state.view.scale) / 2;
    updateTransform();
  });

  // Reset Positions to default Constellation
  el.btnResetLayout.addEventListener('click', () => {
    state.nodePositions = JSON.parse(JSON.stringify(DEFAULT_CONSTELLATION_LAYOUT));
    savePersistedPositions();

    state.topology.nodes.forEach(n => {
      const pos = DEFAULT_CONSTELLATION_LAYOUT[n.id];
      if (pos) {
        n.x = pos.x;
        n.y = pos.y;
        const g = document.getElementById(n.id);
        if (g) g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
        updateConnectedPipesForNode(n.id);
      }
    });

    state.view.x = 30;
    state.view.y = 20;
    state.view.scale = 0.82;
    updateTransform();
    updateMinimap();
    showToast('Reset node positions to curated constellation layout', 'success');
    playTone(520, 'sine', 0.1, 0.05);
  });

  /* ==========================================================================
     Minimap
     ========================================================================== */
  function updateMinimap() {
    if (!state.topology) return;
    const mmW = 220;
    const mmH = 120;
    const gW = 1950;
    const gH = 1050;

    const scaleX = mmW / gW;
    const scaleY = mmH / gH;

    let miniNodes = el.minimapSvg.querySelector('#mini-nodes');
    if (!miniNodes) {
      miniNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      miniNodes.setAttribute('id', 'mini-nodes');
      el.minimapSvg.prepend(miniNodes);
    }

    miniNodes.innerHTML = '';
    state.topology.nodes.forEach(n => {
      const cfg = NODE_CONFIG[n.id] || { width: 185, height: 74 };
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      c.setAttribute('x', (n.x * scaleX).toString());
      c.setAttribute('y', (n.y * scaleY).toString());
      c.setAttribute('width', (cfg.width * scaleX).toString());
      c.setAttribute('height', (cfg.height * scaleY).toString());
      c.setAttribute('fill', getCategoryColor(n.group));
      c.setAttribute('opacity', '0.6');
      c.setAttribute('rx', '1');
      miniNodes.appendChild(c);
    });

    const vpW = el.viewport.clientWidth;
    const vpH = el.viewport.clientHeight;

    const vx = (-state.view.x / state.view.scale) * scaleX;
    const vy = (-state.view.y / state.view.scale) * scaleY;
    const vw = (vpW / state.view.scale) * scaleX;
    const vh = (vpH / state.view.scale) * scaleY;

    el.minimapViewportRect.setAttribute('x', Math.max(0, vx).toString());
    el.minimapViewportRect.setAttribute('y', Math.max(0, vy).toString());
    el.minimapViewportRect.setAttribute('width', Math.min(mmW, vw).toString());
    el.minimapViewportRect.setAttribute('height', Math.min(mmH, vh).toString());
  }

  /* ==========================================================================
     High-Energy Plasma Pulse Along Conduit
     ========================================================================== */
  function animatePacketAlongEdge(edgeId, isSimulated = false, duration = 1200) {
    const path = document.getElementById(edgeId);
    const jacket = document.getElementById(`jacket-${edgeId}`);
    if (!path) return;

    if (jacket) jacket.classList.add('active');
    path.classList.add('active');

    playWhoosh();

    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('class', `pipe-bubble bubble-plasma ${isSimulated ? 'bubble-cyan' : ''}`);
    particle.setAttribute('r', '7');
    el.particlesGroup.appendChild(particle);

    const length = path.getTotalLength();
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const point = path.getPointAtLength(progress * length);

      particle.setAttribute('cx', point.x);
      particle.setAttribute('cy', point.y);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        particle.remove();
        setTimeout(() => {
          path.classList.remove('active');
          if (jacket) jacket.classList.remove('active');
        }, 300);
      }
    }

    requestAnimationFrame(step);
  }

  /* ==========================================================================
     Node Selection & Inspector Drawer
     ========================================================================== */
  function selectNode(nodeId) {
    state.selectedNodeId = nodeId;

    document.querySelectorAll('.node-card').forEach(card => {
      card.classList.toggle('selected', card.id === nodeId);
    });

    const node = state.topology.nodes.find(n => n.id === nodeId);
    if (!node) return;

    renderInspector(node);
    el.drawer.classList.add('open');

    highlightNodeConnections(nodeId);
  }

  function highlightNodeConnections(nodeId) {
    document.querySelectorAll('.pipe-jacket').forEach(line => line.classList.remove('highlighted'));

    state.topology.edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        const jacket = document.getElementById(`jacket-${edge.id}`);
        if (jacket) jacket.classList.add('highlighted');
      }
    });
  }

  function renderInspector(node) {
    document.getElementById('drawer-node-title').textContent = node.label;
    document.getElementById('drawer-node-category').textContent = `${node.group} // ${node.category}`;

    const incoming = state.topology.edges.filter(e => e.target === node.id);
    const outgoing = state.topology.edges.filter(e => e.source === node.id);

    const status = getNodeStatus(node.id);
    const t = state.telemetry || {};

    let runtimeStats = '';
    if (node.id === 'node-device-laptop' && t.system) {
      runtimeStats = `
        <div class="detail-grid">
          <div class="detail-key">CPU Usage:</div>
          <div class="detail-val">${t.system.cpu.percent}% (${t.system.cpu.cores_logical} logical cores)</div>
          <div class="detail-key">Memory:</div>
          <div class="detail-val">${t.system.memory.used_mb} / ${t.system.memory.total_mb} MB (${t.system.memory.percent}%)</div>
          <div class="detail-key">Swap Used:</div>
          <div class="detail-val">${t.system.swap.used_mb} / ${t.system.swap.total_mb} MB (${t.system.swap.percent}%)</div>
          <div class="detail-key">GPU (GTX 850M):</div>
          <div class="detail-val">${t.system.gpu.memory_used_mb} / ${t.system.gpu.memory_total_mb} MB (${t.system.gpu.temperature_c}°C)</div>
          <div class="detail-key">Root Disk:</div>
          <div class="detail-val">${t.system.disk.used_gb} / ${t.system.disk.total_gb} GB (${t.system.disk.percent}%)</div>
          <div class="detail-key">Uptime:</div>
          <div class="detail-val">${t.system.uptime}</div>
        </div>
      `;
    } else if (node.id === 'node-provider-ollama' && t.ollama) {
      runtimeStats = `
        <div class="detail-grid">
          <div class="detail-key">Server:</div>
          <div class="detail-val">${t.ollama.endpoint} (Online)</div>
          <div class="detail-key">Installed Models:</div>
          <div class="detail-val">${t.ollama.installed_count} models in local catalog</div>
          <div class="detail-key">Loaded in RAM:</div>
          <div class="detail-val">${t.ollama.loaded_models.length > 0 ? t.ollama.loaded_models.map(m => m.name).join(', ') : 'None (Unloaded on idle to save RAM)'}</div>
          <div class="detail-key">Phi-4 Route:</div>
          <div class="detail-val">${t.ollama.phi4_route_installed ? 'Installed (phi4-mini:latest)' : 'Missing'}</div>
        </div>
      `;
    } else if (node.id === 'node-coord-hermes-gateway' && t.hermes) {
      runtimeStats = `
        <div class="detail-grid">
          <div class="detail-key">Gateway State:</div>
          <div class="detail-val">${t.hermes.gateway_state} (PID 1476)</div>
          <div class="detail-key">Telegram Link:</div>
          <div class="detail-val">${t.hermes.telegram_status}</div>
          <div class="detail-key">Active Agents:</div>
          <div class="detail-val">${t.hermes.active_agents} currently working</div>
          <div class="detail-key">Blocked Records:</div>
          <div class="detail-val">${t.hermes.blocked_count} awaiting review</div>
        </div>
      `;
    } else if (node.id === 'node-queue-blocked' && t.hermes) {
      runtimeStats = `
        <div class="detail-grid">
          <div class="detail-key">Queue Size:</div>
          <div class="detail-val amber">${t.hermes.blocked_count} records pending review</div>
          <div class="detail-key">Breakdown:</div>
          <div class="detail-val">16 approval timeouts, 3 needs verification</div>
          <div class="detail-key">Storage:</div>
          <div class="detail-val">~/.hermes/state/blocked-work/*.json</div>
        </div>
      `;
    }

    el.drawerContent.innerHTML = `
      <div class="drawer-section">
        <button id="btn-explain-plain" class="btn-ctrl" style="width:100%;justify-content:center;background:rgba(0,229,255,0.15);border-color:var(--accent-cyan);color:var(--accent-cyan)">
          ℹ Explain in Plain English (No Coding Jargon)
        </button>
      </div>

      <div class="drawer-section">
        <div class="section-label">Architecture Role & Purpose</div>
        <div class="section-desc">${node.role}</div>
      </div>

      <div class="drawer-section">
        <div class="section-label">Live Operational State</div>
        <div class="detail-grid">
          <div class="detail-key">Status:</div>
          <div class="detail-val badge"><span class="node-status-dot status-${status}" style="display:inline-block;width:8px;height:8px;border-radius:50%"></span> ${status.toUpperCase()}</div>
          <div class="detail-key">Telemetry:</div>
          <div class="detail-val">${node.telemetry_type}</div>
          <div class="detail-key">Evidence:</div>
          <div class="detail-val">${node.evidence}</div>
        </div>
      </div>

      ${runtimeStats ? `
      <div class="drawer-section">
        <div class="section-label">Runtime Measurements</div>
        ${runtimeStats}
      </div>
      ` : ''}

      <div class="drawer-section">
        <div class="section-label">Upstream Feeds (${incoming.length})</div>
        <div class="conn-list">
          ${incoming.map(e => `
            <div class="conn-item" data-target="${e.source}">
              <div class="conn-item-head">
                <span class="conn-target-name">← ${getNodeLabel(e.source)}</span>
                <span class="conn-type-badge">${e.type}</span>
              </div>
              <div class="conn-item-desc">${e.plain_english}</div>
            </div>
          `).join('') || '<div class="section-desc" style="font-size:11px;color:var(--text-muted)">No direct upstream feeds</div>'}
        </div>
      </div>

      <div class="drawer-section">
        <div class="section-label">Downstream Targets (${outgoing.length})</div>
        <div class="conn-list">
          ${outgoing.map(e => `
            <div class="conn-item" data-target="${e.target}">
              <div class="conn-item-head">
                <span class="conn-target-name">→ ${getNodeLabel(e.target)}</span>
                <span class="conn-type-badge">${e.type}</span>
              </div>
              <div class="conn-item-desc">${e.plain_english}</div>
            </div>
          `).join('') || '<div class="section-desc" style="font-size:11px;color:var(--text-muted)">No direct downstream targets</div>'}
        </div>
      </div>

      <div class="drawer-section" style="margin-top:10px">
        <button id="btn-focus-node" class="btn-ctrl" style="width:100%;justify-content:center">
          ${state.focusedNodeId === node.id ? '✕ Exit Focus Mode' : '⊙ Isolate In Focus Mode'}
        </button>
      </div>
    `;

    document.getElementById('btn-explain-plain').addEventListener('click', () => {
      openPlainEnglishModal(node.id);
    });

    el.drawerContent.querySelectorAll('.conn-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        selectNode(targetId);
      });
    });

    document.getElementById('btn-focus-node').addEventListener('click', () => {
      toggleFocusNode(node.id);
    });
  }

  function getNodeLabel(nodeId) {
    const n = state.topology.nodes.find(node => node.id === nodeId);
    return n ? n.label : nodeId;
  }

  document.getElementById('drawer-close').addEventListener('click', () => {
    el.drawer.classList.remove('open');
    document.querySelectorAll('.pipe-jacket').forEach(line => line.classList.remove('highlighted'));
  });

  /* ==========================================================================
     Focus Mode & Filtering
     ========================================================================== */
  function toggleFocusNode(nodeId) {
    if (state.focusedNodeId === nodeId) {
      state.focusedNodeId = null;
      document.querySelectorAll('.node-card').forEach(n => n.classList.remove('dimmed', 'focused'));
      document.querySelectorAll('.pipe-jacket').forEach(c => c.classList.remove('highlighted', 'dimmed'));
    } else {
      state.focusedNodeId = nodeId;
      const relatedNodes = new Set([nodeId]);

      state.topology.edges.forEach(e => {
        if (e.source === nodeId) relatedNodes.add(e.target);
        if (e.target === nodeId) relatedNodes.add(e.source);
      });

      document.querySelectorAll('.node-card').forEach(n => {
        const isRelated = relatedNodes.has(n.id);
        n.classList.toggle('dimmed', !isRelated);
        n.classList.toggle('focused', n.id === nodeId);
      });

      document.querySelectorAll('.pipe-jacket').forEach(c => {
        const edge = state.topology.edges.find(e => `jacket-${e.id}` === c.id);
        if (edge && (edge.source === nodeId || edge.target === nodeId)) {
          c.classList.add('highlighted');
          c.classList.remove('dimmed');
        } else {
          c.classList.add('dimmed');
          c.classList.remove('highlighted');
        }
      });
    }

    if (state.selectedNodeId) {
      const node = state.topology.nodes.find(n => n.id === state.selectedNodeId);
      if (node) renderInspector(node);
    }
  }

  el.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== el.searchInput) {
      e.preventDefault();
      el.searchInput.focus();
    }
    if (e.key === 'Escape') {
      el.drawer.classList.remove('open');
      closeAllModals();
      if (state.focusedNodeId) toggleFocusNode(state.focusedNodeId);
    }
  });

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeFilter = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  function applyFilters() {
    if (!state.topology) return;

    state.topology.nodes.forEach(node => {
      const card = document.getElementById(node.id);
      if (!card) return;

      let matchSearch = true;
      if (state.searchQuery) {
        const full = `${node.label} ${node.subtitle} ${node.category} ${node.role}`.toLowerCase();
        matchSearch = full.includes(state.searchQuery);
      }

      let matchFilter = true;
      if (state.activeFilter !== 'all') {
        const st = getNodeStatus(node.id);
        if (state.activeFilter === 'running') matchFilter = (st === 'running' || st === 'busy');
        else if (state.activeFilter === 'idle') matchFilter = (st === 'idle' || st === 'standby' || st === 'ready');
        else if (state.activeFilter === 'attention') matchFilter = (st === 'attention');
        else if (state.activeFilter === 'verified') matchFilter = (st === 'verified');
      }

      card.classList.toggle('dimmed', !(matchSearch && matchFilter));
    });
  }

  /* ==========================================================================
     Pipe Flow Controls
     ========================================================================== */
  el.btnFlowDensity.addEventListener('click', () => {
    if (state.bubbleDensity === 'high') {
      state.bubbleDensity = 'med';
      el.btnFlowDensity.textContent = 'Bubbles: Med';
    } else if (state.bubbleDensity === 'med') {
      state.bubbleDensity = 'low';
      el.btnFlowDensity.textContent = 'Bubbles: Low';
    } else if (state.bubbleDensity === 'low') {
      state.bubbleDensity = 'off';
      el.btnFlowDensity.textContent = 'Bubbles: OFF';
    } else {
      state.bubbleDensity = 'high';
      el.btnFlowDensity.textContent = 'Bubbles: High';
    }
    initFlowingBubbles();
    playTone(520, 'sine', 0.05, 0.03);
  });

  el.btnFlowSpeed.addEventListener('click', () => {
    if (state.flowSpeedMultiplier === 1.0) {
      state.flowSpeedMultiplier = 2.0;
      el.btnFlowSpeed.textContent = 'Speed: 2x';
    } else if (state.flowSpeedMultiplier === 2.0) {
      state.flowSpeedMultiplier = 3.5;
      el.btnFlowSpeed.textContent = 'Speed: Hyper ⚡';
    } else {
      state.flowSpeedMultiplier = 1.0;
      el.btnFlowSpeed.textContent = 'Speed: 1x';
    }
    playTone(660, 'sine', 0.05, 0.03);
  });

  el.btnAudioToggle.addEventListener('click', () => {
    initAudio();
    state.audioEnabled = !state.audioEnabled;
    el.btnAudioToggle.textContent = `Audio: ${state.audioEnabled ? '🔊 ON' : '🔇 OFF'}`;
    if (state.audioEnabled) {
      playTone(440, 'sine', 0.1, 0.05);
      showToast('🔊 Cyber Synth Audio Enabled', 'info');
    }
  });

  /* ==========================================================================
     Live Telemetry Polling & Server-Sent Events (SSE)
     ========================================================================== */
  function startPolling() {
    setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        state.telemetry = await res.json();
        updateLiveDashboard();
      } catch (e) {
        console.warn('Telemetry polling update failed:', e);
      }
    }, 2500);
  }

  function updateLiveDashboard() {
    if (!state.telemetry) return;
    const t = state.telemetry;

    if (t.system) {
      document.getElementById('stat-cpu-val').textContent = `${t.system.cpu.percent}%`;
      document.getElementById('stat-cpu-fill').style.width = `${Math.min(100, t.system.cpu.percent)}%`;

      document.getElementById('stat-ram-val').textContent = `${t.system.memory.used_mb}MB (${t.system.memory.percent}%)`;
      document.getElementById('stat-ram-fill').style.width = `${t.system.memory.percent}%`;

      document.getElementById('stat-gpu-val').textContent = `${t.system.gpu.memory_used_mb}MB (${t.system.gpu.temperature_c}°C)`;
    }

    if (t.hermes) {
      document.getElementById('stat-blocked-count').textContent = `${t.hermes.blocked_count} Items`;
      if (t.hermes.blocked_count > 0) {
        el.attentionBadge.classList.add('amber');
      }
    }

    state.topology.nodes.forEach(n => {
      const card = document.getElementById(n.id);
      if (card) {
        const dot = card.querySelector('.node-status-dot');
        if (dot) {
          const st = getNodeStatus(n.id);
          dot.className.baseVal = `node-status-dot status-${st}`;
        }
      }
    });

    if (state.selectedNodeId) {
      const n = state.topology.nodes.find(node => node.id === state.selectedNodeId);
      if (n) renderInspector(n);
    }
  }

  function connectEventStream() {
    const sse = new EventSource('/api/events');

    sse.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        handleIncomingEvent(event);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    sse.onerror = () => {
      console.warn('SSE connection dropped, retrying...');
    };
  }

  function handleIncomingEvent(event) {
    state.events.unshift(event);
    if (state.events.length > 100) state.events.pop();

    addEventToFeed(event);

    const edge = state.topology.edges.find(
      e => (e.source === event.source && e.target === event.target) ||
           (e.source === event.target && e.target === event.source)
    );

    if (edge) {
      animatePacketAlongEdge(edge.id, event.simulated);
    }

    if (state.followActivity && edge) {
      const targetCard = document.getElementById(edge.target);
      if (targetCard) {
        targetCard.classList.add('focused');
        setTimeout(() => targetCard.classList.remove('focused'), 1500);
      }
    }

    if (event.simulated) {
      showToast(`⚡ ${event.summary}`, 'info');
    }
  }

  function addEventToFeed(event) {
    const row = document.createElement('div');
    row.className = 'event-row';

    const time = new Date(event.timestamp).toLocaleTimeString();
    row.innerHTML = `
      <span class="event-time">${time}</span>
      <span class="event-type ${event.simulated ? 'simulated' : ''}">${event.type}</span>
      <span class="event-summary">${event.summary}</span>
      <span class="event-evidence">${event.evidence || ''}</span>
    `;

    el.dockBody.prepend(row);
    if (el.dockBody.children.length > 50) {
      el.dockBody.removeChild(el.dockBody.lastChild);
    }
  }

  /* ==========================================================================
     Task Tracer View
     ========================================================================== */
  const TASK_TRACES = [
    {
      id: 'trace-status-brief',
      title: 'Status Brief Invocation (Today Oct 24)',
      description: 'Verified on-demand server diagnostic brief requested from phone and executed through Hermes.',
      steps: [
        { node: 'node-access-telegram-client', label: 'Telegram Prompt' },
        { node: 'node-integ-telegram-bot', label: 'Bot Webhook' },
        { node: 'node-coord-hermes-gateway', label: 'Gateway Dispatch' },
        { node: 'node-coord-orchestrator', label: 'worker.py' },
        { node: 'node-device-laptop', label: 'System Inspections' },
        { node: 'node-app-status-brief', label: 'Brief Verification' },
        { node: 'node-storage-workspace', label: 'outputs/status-brief/' },
        { node: 'node-storage-wiki', label: 'Hermes-Wiki Journal' }
      ]
    },
    {
      id: 'trace-spreadsheet',
      title: 'Spreadsheet Explorer (NotebookLM Blueprint Pipeline)',
      description: '100% read-only Excel extraction creating verified blueprint.md for NotebookLM podcasting.',
      steps: [
        { node: 'node-interface-antigravity', label: 'Terminal / CLI' },
        { node: 'node-app-spreadsheet', label: 'spreadsheet-blueprint' },
        { node: 'node-storage-workspace', label: 'blueprint.md' },
        { node: 'node-integ-google-drive', label: 'Google Drive Mirror' }
      ]
    },
    {
      id: 'trace-prompt-council',
      title: 'Multi-Model Prompt Council (3-Stage Forge)',
      description: 'Multi-model pipeline refining rough prompts through Gemini architect and Phi-4 safety critic.',
      steps: [
        { node: 'node-app-prompt-council', label: 'Raw Idea' },
        { node: 'node-provider-gemini', label: 'Stage 1 (Architect)' },
        { node: 'node-model-phi4', label: 'Stage 2 (Local Critic)' },
        { node: 'node-agent-codex', label: 'Target Codex Compiler' },
        { node: 'node-storage-workspace', label: 'outputs/tasks/' }
      ]
    },
    {
      id: 'trace-codex-review',
      title: 'Codex Automated Code Review Run',
      description: 'Recorded orchestrator job executing read-only diff analysis within an isolated sandbox.',
      steps: [
        { node: 'node-coord-orchestrator', label: 'worker.py' },
        { node: 'node-agent-codex', label: 'Codex Runner' },
        { node: 'node-tool-node-repl', label: 'Node REPL Tools' },
        { node: 'node-output-orchestrations', label: 'result.json / answer.txt' }
      ]
    }
  ];

  function openTraceModal() {
    const list = document.getElementById('trace-list');
    list.innerHTML = TASK_TRACES.map(t => `
      <div class="trace-card" data-trace="${t.id}">
        <div class="trace-card-title">${t.title}</div>
        <div class="section-desc">${t.description}</div>
        <div class="trace-steps">
          ${t.steps.map((s, idx) => `
            <span class="trace-step-pill">${s.label}</span>
            ${idx < t.steps.length - 1 ? '<span class="trace-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.trace-card').forEach(card => {
      card.addEventListener('click', () => {
        const traceId = card.getAttribute('data-trace');
        executeTrace(traceId);
        closeAllModals();
      });
    });

    el.traceModal.classList.add('open');
  }

  function executeTrace(traceId) {
    const trace = TASK_TRACES.find(t => t.id === traceId);
    if (!trace) return;

    showToast(`▶ Executing Trace: ${trace.title}`, 'info');

    document.querySelectorAll('.node-card').forEach(n => n.classList.add('dimmed'));
    document.querySelectorAll('.pipe-jacket').forEach(c => c.classList.remove('trace'));

    trace.steps.forEach(s => {
      const nodeEl = document.getElementById(s.node);
      if (nodeEl) {
        nodeEl.classList.remove('dimmed');
        nodeEl.classList.add('focused');
      }
    });

    let delay = 0;
    for (let i = 0; i < trace.steps.length - 1; i++) {
      const sId = trace.steps[i].node;
      const tId = trace.steps[i + 1].node;

      const edge = state.topology.edges.find(
        e => (e.source === sId && e.target === tId) || (e.source === tId && e.target === sId)
      );

      if (edge) {
        setTimeout(() => {
          const jacket = document.getElementById(`jacket-${edge.id}`);
          if (jacket) jacket.classList.add('trace');
          animatePacketAlongEdge(edge.id, false, 950);
        }, delay);
        delay += 550;
      }
    }

    setTimeout(() => {
      document.querySelectorAll('.node-card').forEach(n => n.classList.remove('dimmed', 'focused'));
      document.querySelectorAll('.pipe-jacket').forEach(c => c.classList.remove('trace'));
    }, delay + 3000);
  }

  /* ==========================================================================
     Coverage Audit Modal
     ========================================================================= */
  async function openCoverageModal() {
    try {
      const res = await fetch('/api/coverage');
      const data = await res.json();

      document.getElementById('coverage-monitored-rows').innerHTML = data.monitored_components.map(c => `
        <tr>
          <td><strong style="color:var(--text-primary)">${c.component}</strong></td>
          <td>${c.method}</td>
          <td><span class="badge-green">${c.health}</span></td>
        </tr>
      `).join('');

      document.getElementById('coverage-unverified-rows').innerHTML = data.unverified_or_indirect.map(u => `
        <tr>
          <td><strong style="color:var(--accent-amber)">${u.relationship}</strong></td>
          <td>${u.reason}</td>
          <td><span class="badge-amber">${u.remedy}</span></td>
        </tr>
      `).join('');

      el.coverageModal.classList.add('open');
    } catch (e) {
      console.error('Failed to load coverage:', e);
    }
  }

  /* ==========================================================================
     Simulated Test Event Trigger
     ========================================================================== */
  async function triggerTestPacket() {
    initAudio();
    try {
      const res = await fetch('/api/test-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'node-interface-antigravity',
          target: 'node-coord-hermes-gateway',
          type: 'diagnostic_packet',
          summary: 'Simulated diagnostic packet: Antigravity -> Hermes Gateway'
        })
      });
      const data = await res.json();
    } catch (e) {
      console.error('Test packet trigger failed:', e);
    }
  }

  /* ==========================================================================
     Attention / Blocked Work Drawer
     ========================================================================== */
  async function openAttentionDrawer() {
    try {
      const res = await fetch('/api/blocked');
      const data = await res.json();

      el.dock.classList.add('expanded');
      document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-attention').classList.add('active');

      el.dockBody.innerHTML = `
        <div style="margin-bottom:8px;font-weight:600;color:var(--accent-amber)">
          🚨 Attention Needed: ${data.total} Blocked Operations & Review Items
        </div>
        <div style="margin-bottom:12px;color:var(--text-secondary);font-size:11px">
          These operations timed out waiting for tool execution approval or require explicit verification before closing.
        </div>
        ${data.items.map(item => `
          <div class="event-row" style="border-left:2px solid var(--accent-amber);padding-left:8px">
            <span class="event-time">${new Date(item.first_seen).toLocaleDateString()}</span>
            <span class="event-type" style="background:rgba(255,183,0,0.15);color:var(--accent-amber)">${item.status}</span>
            <span class="event-summary"><strong>${item.tool || 'Action'}</strong>: ${item.reason}</span>
            <span class="event-evidence">Session: ${item.session_ref || item.id}</span>
          </div>
        `).join('')}
      `;
    } catch (e) {
      console.error('Failed to load blocked items:', e);
    }
  }

  /* ==========================================================================
     UI Event Listeners
     ========================================================================== */
  document.getElementById('btn-test-packet').addEventListener('click', triggerTestPacket);
  document.getElementById('btn-trace-task').addEventListener('click', openTraceModal);
  document.getElementById('btn-coverage').addEventListener('click', openCoverageModal);
  document.getElementById('stat-attention-badge').addEventListener('click', openAttentionDrawer);

  document.getElementById('btn-rain-toggle').addEventListener('click', () => {
    state.matrixRainEnabled = !state.matrixRainEnabled;
    document.getElementById('btn-rain-toggle').textContent = `Matrix Rain: ${state.matrixRainEnabled ? 'ON' : 'OFF'}`;
  });

  document.getElementById('dock-toggle').addEventListener('click', () => {
    el.dock.classList.toggle('expanded');
  });

  document.getElementById('tab-feed').addEventListener('click', () => {
    document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-feed').classList.add('active');
    el.dock.classList.add('expanded');
    el.dockBody.innerHTML = '';
    state.events.forEach(addEventToFeed);
  });

  document.getElementById('tab-attention').addEventListener('click', openAttentionDrawer);

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  function closeAllModals() {
    el.plainEnglishModal.classList.remove('open');
    el.traceModal.classList.remove('open');
    el.coverageModal.classList.remove('open');
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Initialize Application
  loadTopology();

})();
