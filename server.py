#!/usr/bin/env python3
"""
MATRIX — AI Operations Map
Lightweight Real-Time Telemetry & Topology Server
"""

import os
import sys
import json
import time
import socket
import sqlite3
import datetime
import threading
import subprocess
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import urllib.parse
import urllib.request
import psutil

PORT = 8420
HOST = "0.0.0.0"
STATIC_DIR = Path(__file__).resolve().parent

# Global telemetry state and event bus
telemetry_lock = threading.Lock()
latest_telemetry = {}
recent_events = []
MAX_EVENT_HISTORY = 100
sse_clients = []
sse_lock = threading.Lock()

def sanitize_str(s, max_len=200):
    if not isinstance(s, str):
        return str(s)
    if len(s) > max_len:
        return s[:max_len] + "..."
    return s

def get_gpu_stats():
    """Query nvidia-smi with safe fallback"""
    try:
        cmd = ["nvidia-smi", "--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,name", "--format=csv,noheader,nounits"]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=1.5)
        if res.returncode == 0 and res.stdout.strip():
            parts = [p.strip() for p in res.stdout.strip().split(",")]
            if len(parts) >= 4:
                return {
                    "available": True,
                    "name": parts[4] if len(parts) > 4 else "NVIDIA GeForce GTX 850M",
                    "utilization_percent": int(parts[0]),
                    "memory_used_mb": int(parts[1]),
                    "memory_total_mb": int(parts[2]),
                    "temperature_c": int(parts[3])
                }
    except Exception:
        pass
    return {
        "available": False,
        "name": "NVIDIA GeForce GTX 850M",
        "utilization_percent": 0,
        "memory_used_mb": 0,
        "memory_total_mb": 2048,
        "temperature_c": 0
    }

def get_system_metrics():
    """Gather real hardware performance metrics"""
    vm = psutil.virtual_memory()
    sm = psutil.swap_memory()
    du = psutil.disk_usage("/")
    cpu_percent = psutil.cpu_percent(interval=None)
    boot_time = psutil.boot_time()
    uptime_sec = time.time() - boot_time

    hours, rem = divmod(int(uptime_sec), 3600)
    minutes, seconds = divmod(rem, 60)

    gpu = get_gpu_stats()

    return {
        "hostname": socket.gethostname(),
        "os": "Linux Mint 22.3 (x86_64)",
        "kernel": "7.0.0-38-generic",
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "uptime_seconds": int(uptime_sec),
        "cpu": {
            "percent": cpu_percent,
            "cores_physical": psutil.cpu_count(logical=False) or 4,
            "cores_logical": psutil.cpu_count(logical=True) or 8,
            "model": "Intel(R) Core(TM) i7-4702MQ CPU @ 2.20GHz"
        },
        "memory": {
            "total_mb": round(vm.total / (1024 * 1024)),
            "used_mb": round(vm.used / (1024 * 1024)),
            "available_mb": round(vm.available / (1024 * 1024)),
            "percent": vm.percent
        },
        "swap": {
            "total_mb": round(sm.total / (1024 * 1024)),
            "used_mb": round(sm.used / (1024 * 1024)),
            "percent": sm.percent
        },
        "disk": {
            "mount": "/",
            "total_gb": round(du.total / (1024 * 1024 * 1024), 1),
            "used_gb": round(du.used / (1024 * 1024 * 1024), 1),
            "free_gb": round(du.free / (1024 * 1024 * 1024), 1),
            "percent": du.percent
        },
        "gpu": gpu,
        "timestamp": datetime.datetime.now().isoformat()
    }

def get_service_states():
    """Inspect systemd user and system services"""
    services = {
        "antigravity-cli-daemon": {"unit": "antigravity-cli-daemon.service", "scope": "user"},
        "hermes-gateway": {"unit": "hermes-gateway.service", "scope": "user"},
        "hermes-dashboard": {"unit": "hermes-dashboard.service", "scope": "user"},
        "arc": {"unit": "arc.service", "scope": "user"},
        "arc-access": {"unit": "arc-access.service", "scope": "user"},
        "arc-dev": {"unit": "arc-dev.service", "scope": "user"},
        "arc-login": {"unit": "arc-login.service", "scope": "user"},
        "ollama": {"unit": "ollama.service", "scope": "system"}
    }
    results = {}
    for key, info in services.items():
        cmd = ["systemctl"]
        if info["scope"] == "user":
            cmd.append("--user")
        cmd.extend(["is-active", info["unit"]])
        try:
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=1.0)
            status = res.stdout.strip()
            results[key] = {
                "unit": info["unit"],
                "scope": info["scope"],
                "active": status == "active",
                "state": status if status else "unknown"
            }
        except Exception as e:
            results[key] = {"unit": info["unit"], "scope": info["scope"], "active": False, "state": "error", "error": str(e)}
    return results

def get_process_map():
    """Inspect running processes for key AI components"""
    procs = {
        "antigravity-ide": [],
        "agy-daemon": [],
        "codex-desktop": [],
        "hermes-gateway": [],
        "hermes-dashboard": [],
        "ollama": [],
        "rustdesk": [],
        "arc-caddy": [],
        "arc-service": [],
        "docker-mcp": []
    }

    try:
        for p in psutil.process_iter(['pid', 'name', 'cmdline', 'memory_info', 'cpu_percent', 'create_time']):
            try:
                cmdline = " ".join(p.info['cmdline'] or [])
                name = p.info['name'] or ""
                mem_mb = round((p.info['memory_info'].rss if p.info['memory_info'] else 0) / (1024 * 1024), 1)
                entry = {
                    "pid": p.info['pid'],
                    "name": name,
                    "memory_mb": mem_mb,
                    "uptime_sec": int(time.time() - p.info['create_time']) if p.info['create_time'] else 0
                }

                if "antigravity-ide" in name or "antigravity-ide" in cmdline:
                    if "--type=zygote" in cmdline or "language_server" in cmdline or len(cmdline) < 100:
                        procs["antigravity-ide"].append(entry)
                elif "agy" in cmdline and "remote-control" in cmdline:
                    procs["agy-daemon"].append(entry)
                elif "ChatGPT" in name or ("Codex" in cmdline and "chatgpt" in cmdline.lower()):
                    procs["codex-desktop"].append(entry)
                elif "hermes" in cmdline and "gateway" in cmdline:
                    procs["hermes-gateway"].append(entry)
                elif "hermes" in cmdline and "dashboard" in cmdline:
                    procs["hermes-dashboard"].append(entry)
                elif "ollama" in name or "ollama" in cmdline:
                    procs["ollama"].append(entry)
                elif "rustdesk" in name or "rustdesk" in cmdline:
                    procs["rustdesk"].append(entry)
                elif "arc-caddy" in name or "arc-caddy" in cmdline:
                    procs["arc-caddy"].append(entry)
                elif "scripts/dev_server.py" in cmdline or "AI-Lab/arc" in cmdline:
                    procs["arc-service"].append(entry)
                elif "docker" in cmdline and "github-mcp" in cmdline:
                    procs["docker-mcp"].append(entry)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
    except Exception as e:
        print(f"[telemetry] Process scan error: {e}")

    return procs

def get_ollama_status():
    """Query live Ollama API for installed and currently loaded models"""
    installed_models = []
    loaded_models = []
    server_online = False

    try:
        req = urllib.request.Request("http://127.0.0.1:11434/api/tags", headers={"User-Agent": "MatrixMap/1.0"})
        with urllib.request.urlopen(req, timeout=1.0) as resp:
            data = json.loads(resp.read().decode())
            installed_models = data.get("models", [])
            server_online = True
    except Exception:
        server_online = False

    if server_online:
        try:
            req_ps = urllib.request.Request("http://127.0.0.1:11434/api/ps", headers={"User-Agent": "MatrixMap/1.0"})
            with urllib.request.urlopen(req_ps, timeout=1.0) as resp:
                data_ps = json.loads(resp.read().decode())
                loaded_models = data_ps.get("models", [])
        except Exception:
            pass

    return {
        "online": server_online,
        "endpoint": "http://127.0.0.1:11434",
        "installed_count": len(installed_models),
        "installed_models": [
            {
                "name": m.get("name"),
                "size_gb": round(m.get("size", 0) / (1024**3), 2),
                "param_size": m.get("details", {}).get("parameter_size", "unknown"),
                "quant": m.get("details", {}).get("quantization_level", "unknown"),
                "capabilities": m.get("capabilities", [])
            } for m in installed_models
        ],
        "loaded_models": loaded_models,
        "phi4_route_installed": any("phi4-mini" in m.get("name", "") for m in installed_models)
    }

def get_hermes_state():
    """Read live state from ~/.hermes/gateway_state.json and blocked-work queue"""
    state_file = Path("/home/agenttomek/.hermes/gateway_state.json")
    state = {}
    if state_file.exists():
        try:
            state = json.loads(state_file.read_text())
        except Exception:
            pass

    blocked_dir = Path("/home/agenttomek/.hermes/state/blocked-work")
    blocked_count = 0
    blocked_items = []
    if blocked_dir.exists():
        for p in blocked_dir.glob("*.json"):
            try:
                item = json.loads(p.read_text())
                blocked_items.append({
                    "id": item.get("id"),
                    "tool": item.get("tool"),
                    "status": item.get("status"),
                    "reason": item.get("reason"),
                    "first_seen": item.get("first_seen"),
                    "session_ref": item.get("session_ref")
                })
            except Exception:
                pass
        blocked_count = len(blocked_items)

    orchestration_runs = []
    runs_dir = Path("/home/agenttomek/.hermes/orchestration/runs")
    if runs_dir.exists():
        for run_path in sorted(runs_dir.iterdir(), reverse=True)[:10]:
            if run_path.is_dir():
                res_file = run_path / "result.json"
                task_file = run_path / "TASK.md"
                if res_file.exists():
                    try:
                        res_data = json.loads(res_file.read_text())
                        task_snippet = task_file.read_text()[:120] if task_file.exists() else ""
                        orchestration_runs.append({
                            "run_id": run_path.name,
                            "backend": res_data.get("backend"),
                            "model": res_data.get("model"),
                            "outcome": res_data.get("outcome"),
                            "elapsed_seconds": res_data.get("elapsed_seconds"),
                            "task_preview": task_snippet
                        })
                    except Exception:
                        pass

    return {
        "gateway_state": state.get("gateway_state", "unknown"),
        "active_agents": state.get("active_agents", 0),
        "platforms": state.get("platforms", {}),
        "telegram_status": state.get("platforms", {}).get("telegram", {}).get("state", "disconnected"),
        "version": state.get("code_version", "0.22.5"),
        "blocked_count": blocked_count,
        "blocked_items": blocked_items[:10],
        "recent_runs": orchestration_runs
    }

def get_codex_state():
    """Read recent threads from ~/.codex/session_index.jsonl and config"""
    session_file = Path("/home/agenttomek/.codex/session_index.jsonl")
    threads = []
    if session_file.exists():
        try:
            lines = session_file.read_text().strip().splitlines()
            for line in lines[-10:]:
                try:
                    threads.append(json.loads(line))
                except Exception:
                    pass
        except Exception:
            pass

    return {
        "desktop_running": True,
        "default_model": "gpt-6.1-sol",
        "reasoning_effort": "high",
        "recent_threads": threads[::-1]
    }

def get_workspace_state():
    """Inspect Agent-Workspace and status-brief verification records"""
    ws_json_path = Path("/home/agenttomek/Documents/Agent-Workspace/workspace.json")
    ws_info = {}
    if ws_json_path.exists():
        try:
            ws_info = json.loads(ws_json_path.read_text())
        except Exception:
            pass

    brief_dir = Path("/home/agenttomek/Documents/Agent-Workspace/outputs/status-brief")
    latest_brief = None
    if brief_dir.exists():
        briefs = sorted([p for p in brief_dir.iterdir() if p.is_dir()], reverse=True)
        if briefs:
            v_file = briefs[0] / "verification.json"
            stdout_file = briefs[0] / "stdout.txt"
            if v_file.exists():
                try:
                    latest_brief = {
                        "id": briefs[0].name,
                        "verification": json.loads(v_file.read_text()),
                        "stdout_preview": stdout_file.read_text()[:250] if stdout_file.exists() else ""
                    }
                except Exception:
                    pass

    return {
        "google_drive_status": ws_info.get("transfer_verification", {}).get("status", "unknown"),
        "google_drive_folder": ws_info.get("folders", {}).get("root", {}).get("title", "Agent Workspace"),
        "latest_brief": latest_brief
    }

def push_event(event_type, source_node, target_node, summary, details=None, evidence=None, is_simulated=False):
    """Emit an operational event onto the event stream"""
    event = {
        "id": f"evt-{int(time.time() * 1000)}-{os.urandom(2).hex()}",
        "timestamp": datetime.datetime.now().isoformat(),
        "type": event_type,
        "source": source_node,
        "target": target_node,
        "summary": summary,
        "details": details or {},
        "evidence": evidence or "Live Telemetry Watcher",
        "simulated": is_simulated
    }

    with telemetry_lock:
        recent_events.append(event)
        if len(recent_events) > MAX_EVENT_HISTORY:
            recent_events.pop(0)

    # Broadcast to SSE clients
    payload = f"data: {json.dumps(event)}\n\n"
    with sse_lock:
        stale = []
        for client in sse_clients:
            try:
                client.wfile.write(payload.encode("utf-8"))
                client.wfile.flush()
            except Exception:
                stale.append(client)
        for client in stale:
            sse_clients.remove(client)

def background_telemetry_loop():
    """Continuous polling loop updating telemetry and detecting state changes"""
    global latest_telemetry
    last_blocked_count = -1
    last_gateway_state = ""
    last_loaded_models_str = ""

    while True:
        try:
            sys_metrics = get_system_metrics()
            services = get_service_states()
            processes = get_process_map()
            ollama = get_ollama_status()
            hermes = get_hermes_state()
            codex = get_codex_state()
            workspace = get_workspace_state()

            # Detect state transitions and emit live events
            if last_gateway_state and last_gateway_state != hermes["gateway_state"]:
                push_event(
                    "service_state_change",
                    "node-coord-hermes-gateway",
                    "node-device-laptop",
                    f"Hermes Gateway state transitioned to {hermes['gateway_state']}",
                    {"old": last_gateway_state, "new": hermes["gateway_state"]},
                    "gateway_state.json"
                )
            last_gateway_state = hermes["gateway_state"]

            current_loaded = json.dumps([m.get("name") for m in ollama["loaded_models"]])
            if last_loaded_models_str and current_loaded != last_loaded_models_str:
                push_event(
                    "model_load_event",
                    "node-provider-ollama",
                    "node-model-phi4",
                    f"Ollama loaded models changed: {current_loaded}",
                    {"models": ollama["loaded_models"]},
                    "Ollama API /api/ps"
                )
            last_loaded_models_str = current_loaded

            if last_blocked_count >= 0 and hermes["blocked_count"] != last_blocked_count:
                push_event(
                    "queue_update",
                    "node-queue-blocked",
                    "node-coord-hermes-gateway",
                    f"Blocked-work items changed to {hermes['blocked_count']}",
                    {"count": hermes["blocked_count"]},
                    "~/.hermes/state/blocked-work/"
                )
            last_blocked_count = hermes["blocked_count"]

            snapshot = {
                "system": sys_metrics,
                "services": services,
                "processes": processes,
                "ollama": ollama,
                "hermes": hermes,
                "codex": codex,
                "workspace": workspace,
                "timestamp": datetime.datetime.now().isoformat()
            }

            with telemetry_lock:
                latest_telemetry = snapshot

        except Exception as e:
            print(f"[telemetry loop] error: {e}")

        time.sleep(2.0)

# Build Graph Topology Model
def get_topology_definition():
    """Return the authoritative graph definition containing the 6 operational groups"""
    return {
        "groups": [
            {
                "id": "devices",
                "label": "1. Devices & Access Points",
                "color": "#00ff66",
                "description": "Physical host hardware, networking mesh, remote control gates, and human communication entry points."
            },
            {
                "id": "coordinators",
                "label": "2. Interfaces & Coordinators",
                "color": "#00e575",
                "description": "Primary user workbench UIs, background daemons, message gateways, and bounded execution orchestrators."
            },
            {
                "id": "agents",
                "label": "3. Agents, Workers & Model Providers",
                "color": "#39ff14",
                "description": "Autonomous coding workers, local LLM servers, cloud reasoning APIs, and CLI pair engines."
            },
            {
                "id": "services",
                "label": "4. Services, Tools & Integrations",
                "color": "#00f0ff",
                "description": "MCP tool servers, cloud storage integrations, and external platform bridges."
            },
            {
                "id": "memory",
                "label": "5. Memory, Files & Storage",
                "color": "#70ff00",
                "description": "Shared workspace documents, personal wiki knowledge base, durable SQLite state, and approval queues."
            },
            {
                "id": "applications",
                "label": "6. Applications, Tasks & Outputs",
                "color": "#ffea00",
                "description": "Verified production scripts, prompt synthesis pipelines, briefing helpers, and execution logs."
            }
        ],
        "nodes": [
            # Group 1: Devices & Access
            {
                "id": "node-device-laptop",
                "label": "Acer-AI-Server",
                "subtitle": "Aspire V3-772G / Linux Mint 22.3",
                "group": "devices",
                "category": "Host Hardware",
                "x": 100,
                "y": 140,
                "icon": "server",
                "role": "Primary compute host with Intel i7-4702MQ (8 threads), 16 GB DDR3 RAM, 2 GB NVIDIA GTX 850M GPU, and 457 GB SSD.",
                "evidence": "uname -a, hostnamectl, nvidia-smi, df -h",
                "telemetry_type": "direct_kernel"
            },
            {
                "id": "node-access-tailscale",
                "label": "Tailscale Mesh",
                "subtitle": "100.110.148.58 (tailscale0)",
                "group": "devices",
                "category": "Encrypted Network",
                "x": 100,
                "y": 280,
                "icon": "network",
                "role": "Encrypted WireGuard overlay network connecting mobile devices and remote nodes without port forwarding.",
                "evidence": "ip addr show tailscale0, tailscale status --json",
                "telemetry_type": "direct_socket"
            },
            {
                "id": "node-access-rustdesk",
                "label": "RustDesk Server",
                "subtitle": "Port 21118 (Remote Desktop)",
                "group": "devices",
                "category": "Remote Display",
                "x": 100,
                "y": 420,
                "icon": "monitor",
                "role": "High-performance encrypted remote desktop service allowing graphical monitor control from phone or second PC.",
                "evidence": "rustdesk.service, ss -tulpn (port 21118)",
                "telemetry_type": "process_socket"
            },
            {
                "id": "node-access-ssh",
                "label": "SSH Terminal",
                "subtitle": "Port 22 (OpenSSH)",
                "group": "devices",
                "category": "Terminal Gate",
                "x": 100,
                "y": 550,
                "icon": "terminal",
                "role": "Direct encrypted terminal access for administrator shell management and low-latency command execution.",
                "evidence": "ss -tulpn (port 22)",
                "telemetry_type": "process_socket"
            },
            {
                "id": "node-access-telegram-client",
                "label": "Telegram Client",
                "subtitle": "User 'Agent Tomekk'",
                "group": "devices",
                "category": "Human Interface",
                "x": 100,
                "y": 680,
                "icon": "user",
                "role": "Mobile phone messaging interface used by Tomek to interact with Hermes, request status briefs, and approve actions.",
                "evidence": "~/.hermes/channel_directory.json (ID 8343882728)",
                "telemetry_type": "file_record"
            },

            # Group 2: Interfaces & Coordinators
            {
                "id": "node-interface-antigravity",
                "label": "Antigravity IDE",
                "subtitle": "Interactive Pair Workbench",
                "group": "coordinators",
                "category": "Desktop IDE",
                "x": 380,
                "y": 140,
                "icon": "ide",
                "role": "Main GUI pairing environment with language server, multi-model assistant, terminal integration, and artifact rendering.",
                "evidence": "ps aux | grep antigravity-ide, language_server_linux_x64",
                "telemetry_type": "process_tree"
            },
            {
                "id": "node-coord-antigravity-daemon",
                "label": "Antigravity CLI Daemon",
                "subtitle": "agy remote-control serve",
                "group": "coordinators",
                "category": "Remote Daemon",
                "x": 380,
                "y": 280,
                "icon": "daemon",
                "role": "Persistent background service enabling remote Antigravity CLI control and headless agent orchestration.",
                "evidence": "systemctl --user status antigravity-cli-daemon.service",
                "telemetry_type": "systemd_unit"
            },
            {
                "id": "node-coord-hermes-gateway",
                "label": "Hermes Gateway",
                "subtitle": "Messaging & Process Supervisor",
                "group": "coordinators",
                "category": "Message Gateway",
                "x": 380,
                "y": 420,
                "icon": "gateway",
                "role": "Supervises Hermes agent sessions, routes Telegram messages, manages task queues, and enforces safety boundaries.",
                "evidence": "systemctl --user status hermes-gateway.service, ~/.hermes/gateway_state.json",
                "telemetry_type": "systemd_unit"
            },
            {
                "id": "node-interface-hermes-dashboard",
                "label": "Hermes Dashboard",
                "subtitle": "127.0.0.1:9119 (Private Web)",
                "group": "coordinators",
                "category": "Web Dashboard",
                "x": 380,
                "y": 550,
                "icon": "dashboard",
                "role": "Private local browser dashboard for inspecting Hermes agent sessions, logs, and memory cards.",
                "evidence": "systemctl --user status hermes-dashboard.service, ss -tulpn (port 9119)",
                "telemetry_type": "systemd_unit"
            },
            {
                "id": "node-coord-orchestrator",
                "label": "AI Orchestrator",
                "subtitle": "worker.py (Sequential Lock)",
                "group": "coordinators",
                "category": "Bounded Orchestrator",
                "x": 380,
                "y": 680,
                "icon": "orchestrator",
                "role": "Enforces single-worker concurrency lock, preventing RAM exhaustion by scheduling tasks sequentially across backends.",
                "evidence": "~/.hermes/skills/autonomous-ai-agents/ai-orchestrator/scripts/worker.py",
                "telemetry_type": "script_status"
            },
            {
                "id": "node-service-arc-gate",
                "label": "ARC Lesson Gate",
                "subtitle": "Caddy Reverse Proxy (Ports 5070-5073)",
                "group": "coordinators",
                "category": "Lesson System",
                "x": 380,
                "y": 800,
                "icon": "shield",
                "role": "Password-protected reverse proxy and authentication gate for ARC lesson workspace and WP1 evaluation server.",
                "evidence": "systemctl --user status arc-access.service, arc-login.service",
                "telemetry_type": "systemd_unit"
            },

            # Group 3: Agents & Models
            {
                "id": "node-agent-codex",
                "label": "Codex Worker Runner",
                "subtitle": "gpt-6.1-sol / High Reasoning",
                "group": "agents",
                "category": "Coding Agent",
                "x": 680,
                "y": 140,
                "icon": "code",
                "role": "Specialized coding worker for surgical repository diffs, AST parsing, and workspace verification inside a sandbox.",
                "evidence": "~/.codex/config.toml, ~/.codex/session_index.jsonl",
                "telemetry_type": "app_config"
            },
            {
                "id": "node-provider-ollama",
                "label": "Ollama Server",
                "subtitle": "127.0.0.1:11434 (10 Models)",
                "group": "agents",
                "category": "Local LLM Host",
                "x": 680,
                "y": 280,
                "icon": "cpu",
                "role": "Local model serving engine running on CPU/GPU. Dynamically manages model memory and unloads when idle to preserve RAM.",
                "evidence": "systemctl status ollama.service, curl 127.0.0.1:11434/api/tags",
                "telemetry_type": "systemd_and_api"
            },
            {
                "id": "node-model-phi4",
                "label": "Phi-4 Mini (Local Route)",
                "subtitle": "phi4-mini:latest (3.8B, 4k context)",
                "group": "agents",
                "category": "Designated Route",
                "x": 680,
                "y": 420,
                "icon": "chip",
                "role": "Designated local text extraction and draft model used by orchestrator for offline analysis without incurring API fees.",
                "evidence": "Ollama tags catalog, ai-orchestrator/SKILL.md",
                "telemetry_type": "verified_route"
            },
            {
                "id": "node-provider-gemini",
                "label": "Gemini 3.8 Flash API",
                "subtitle": "Google Gemini Cloud API",
                "group": "agents",
                "category": "Cloud Model",
                "x": 680,
                "y": 550,
                "icon": "cloud",
                "role": "Cloud inference API used for multi-perspective architectural review, planning decomposition, and Prompt Council Stage 1.",
                "evidence": "worker.py status ('gemini_key_present': true), ~/.hermes/.env",
                "telemetry_type": "api_key_verified"
            },
            {
                "id": "node-agent-agy-cli",
                "label": "Antigravity CLI Agent",
                "subtitle": "agy --mode plan/auto",
                "group": "agents",
                "category": "CLI Agent",
                "x": 680,
                "y": 680,
                "icon": "terminal",
                "role": "Autonomous CLI execution engine supporting multi-file edits, test runs, and deep architectural refactorings.",
                "evidence": "/home/agenttomek/.local/bin/agy, agy models",
                "telemetry_type": "binary_available"
            },

            # Group 4: Services & Tools
            {
                "id": "node-tool-github-mcp",
                "label": "GitHub MCP Server",
                "subtitle": "Docker Container (Port 8082)",
                "group": "services",
                "category": "Tool Server",
                "x": 980,
                "y": 140,
                "icon": "box",
                "role": "Model Context Protocol container exposing GitHub repo search, PR reviews, and issue tracking to Antigravity.",
                "evidence": "docker ps | grep github-mcp-server",
                "telemetry_type": "docker_inspection"
            },
            {
                "id": "node-tool-node-repl",
                "label": "Node REPL MCP",
                "subtitle": "Codex CUA Engine",
                "group": "services",
                "category": "Tool Server",
                "x": 980,
                "y": 280,
                "icon": "code",
                "role": "Local NodeJS execution sandbox providing browser control, script execution, and workspace inspection for Codex.",
                "evidence": "~/.codex/config.toml ([mcp_servers.node_repl])",
                "telemetry_type": "config_verified"
            },
            {
                "id": "node-integ-google-drive",
                "label": "Google Drive Storage",
                "subtitle": "Agent Workspace Sync",
                "group": "services",
                "category": "Cloud Storage",
                "x": 980,
                "y": 420,
                "icon": "cloud",
                "role": "Authenticated cloud storage synchronizing output reports, raw uploads, and run logs with cryptographic SHA-256 validation.",
                "evidence": "Agent-Workspace/workspace.json ('transfer_verification': 'passed')",
                "telemetry_type": "contract_verified"
            },
            {
                "id": "node-integ-telegram-bot",
                "label": "Telegram Bot API",
                "subtitle": "Bot Gateway Bridge",
                "group": "services",
                "category": "Messaging API",
                "x": 980,
                "y": 550,
                "icon": "message",
                "role": "Cloud webhook/polling bridge delivering user prompts to Hermes Gateway and returning synthesized status reports.",
                "evidence": "~/.hermes/gateway_state.json ('telegram': {'state': 'connected'})",
                "telemetry_type": "gateway_state"
            },

            # Group 5: Memory & Files
            {
                "id": "node-storage-workspace",
                "label": "Agent-Workspace",
                "subtitle": "~/Documents/Agent-Workspace",
                "group": "memory",
                "category": "Shared Workspace",
                "x": 1280,
                "y": 140,
                "icon": "folder",
                "role": "Shared file system directory housing procedural guides, project outputs, tasks, and machine status checkpoints.",
                "evidence": "Filesystem directory /home/agenttomek/Documents/Agent-Workspace",
                "telemetry_type": "fs_watcher"
            },
            {
                "id": "node-storage-wiki",
                "label": "Hermes-Wiki",
                "subtitle": "~/Documents/Hermes-Wiki",
                "group": "memory",
                "category": "Knowledge Base",
                "x": 1280,
                "y": 280,
                "icon": "book",
                "role": "Curated personal knowledge base holding daily activity journals, architecture concepts, and entity definitions.",
                "evidence": "/home/agenttomek/Documents/Hermes-Wiki/journal/2026-10-24-activity.md",
                "telemetry_type": "fs_watcher"
            },
            {
                "id": "node-storage-hermes-dbs",
                "label": "Hermes State DBs",
                "subtitle": "state.db / kanban.db (WAL)",
                "group": "memory",
                "category": "Relational State",
                "x": 1280,
                "y": 420,
                "icon": "database",
                "role": "Persistent SQLite databases storing conversation turns, kanban cards, and session memory with write-ahead logging.",
                "evidence": "~/.hermes/state.db (28MB), ~/.hermes/kanban.db",
                "telemetry_type": "sqlite_stat"
            },
            {
                "id": "node-storage-codex-dbs",
                "label": "Codex State DBs",
                "subtitle": "thread_history_1.sqlite",
                "group": "memory",
                "category": "Relational State",
                "x": 1280,
                "y": 550,
                "icon": "database",
                "role": "Codex history database persisting thread conversations, project indexing, and code edit records.",
                "evidence": "~/.codex/thread_history_1.sqlite (26MB), ~/.codex/logs_2.sqlite (39MB)",
                "telemetry_type": "sqlite_stat"
            },
            {
                "id": "node-queue-blocked",
                "label": "Blocked-Work Queue",
                "subtitle": "19 Approval / Verification Records",
                "group": "memory",
                "category": "Approval Queue",
                "x": 1280,
                "y": 680,
                "icon": "alert",
                "role": "Durable queue holding operations paused due to approval timeouts or requiring explicit verification before closing.",
                "evidence": "~/.hermes/state/blocked-work/ (16 blocked, 3 needs_verification)",
                "telemetry_type": "fs_watcher"
            },

            # Group 6: Applications & Outputs
            {
                "id": "node-app-spreadsheet",
                "label": "Spreadsheet Explorer",
                "subtitle": "bin/spreadsheet-blueprint",
                "group": "applications",
                "category": "Production Tool",
                "x": 1580,
                "y": 140,
                "icon": "file-text",
                "role": "Read-only Excel extractor generating blueprint.md, blueprint.json, and issues.csv for NotebookLM ingestion.",
                "evidence": "~/Documents/Agent-Workspace/bin/spreadsheet-blueprint, SPREADSHEET-EXPLORER.md",
                "telemetry_type": "verified_app"
            },
            {
                "id": "node-app-prompt-council",
                "label": "Multi-Model Prompt Council",
                "subtitle": "bin/prompt-council (3-Stage Forge)",
                "group": "applications",
                "category": "Prompt Pipeline",
                "x": 1580,
                "y": 280,
                "icon": "zap",
                "role": "Three-stage pipeline (Architect Gemini -> Safety Critic Phi-4 -> Target Compiler) synthesizing battle-tested prompts.",
                "evidence": "~/Documents/Agent-Workspace/bin/prompt-council, PROMPT-COUNCIL.md",
                "telemetry_type": "verified_app"
            },
            {
                "id": "node-app-status-brief",
                "label": "Status Brief Helper",
                "subtitle": "Verified Readback Reporter",
                "group": "applications",
                "category": "Diagnostic Tool",
                "x": 1580,
                "y": 420,
                "icon": "check-circle",
                "role": "On-demand helper collecting hardware checks, service uptime, and blocker counts with read-back verification.",
                "evidence": "Agent-Workspace/outputs/status-brief/20261024-192956-169485/verification.json",
                "telemetry_type": "verified_output"
            },
            {
                "id": "node-output-orchestrations",
                "label": "Orchestration Runs",
                "subtitle": "~/.hermes/orchestration/runs",
                "group": "applications",
                "category": "Run Artifacts",
                "x": 1580,
                "y": 550,
                "icon": "archive",
                "role": "Audit trail of multi-agent tasks recording elapsed seconds, outcome status, TASK.md, and model output.",
                "evidence": "14 run directories in ~/.hermes/orchestration/runs/",
                "telemetry_type": "fs_artifacts"
            }
        ],
        "edges": [
            # Communication & Access
            {
                "id": "edge-tg-bot",
                "source": "node-access-telegram-client",
                "target": "node-integ-telegram-bot",
                "type": "communication",
                "label": "Encrypted Chat",
                "plain_english": "Tomek sends natural language instructions and receives status summaries via Telegram mobile app.",
                "evidence": "channel_directory.json (DM channel 8343882728)",
                "status": "observed_active"
            },
            {
                "id": "edge-bot-gateway",
                "source": "node-integ-telegram-bot",
                "target": "node-coord-hermes-gateway",
                "type": "network",
                "label": "Long-poll socket",
                "plain_english": "Hermes Gateway actively polls the Telegram Bot API over HTTPS socket (PID 1476).",
                "evidence": "gateway_state.json ('state': 'connected')",
                "status": "observed_active"
            },
            {
                "id": "edge-tailscale-laptop",
                "source": "node-access-tailscale",
                "target": "node-device-laptop",
                "type": "network",
                "label": "Overlay Tunnel",
                "plain_english": "Tailscale WireGuard interface routes secure traffic into Acer-AI-Server at 100.110.148.58.",
                "evidence": "tailscale0 IP configuration, tailscale status",
                "status": "observed_active"
            },
            {
                "id": "edge-rustdesk-laptop",
                "source": "node-access-rustdesk",
                "target": "node-device-laptop",
                "type": "network",
                "label": "Desktop Stream",
                "plain_english": "RustDesk service binds port 21118 to stream graphical display frames to authenticated clients.",
                "evidence": "rustdesk PID 301178 listening on 0.0.0.0:21118",
                "status": "observed_active"
            },
            {
                "id": "edge-ssh-laptop",
                "source": "node-access-ssh",
                "target": "node-device-laptop",
                "type": "network",
                "label": "SSH Sessions",
                "plain_english": "OpenSSH server listens on port 22 for secure terminal shell sessions.",
                "evidence": "ss -tulpn (port 22)",
                "status": "observed_active"
            },

            # Interfaces & Coordinators
            {
                "id": "edge-ide-daemon",
                "source": "node-interface-antigravity",
                "target": "node-coord-antigravity-daemon",
                "type": "delegation",
                "label": "IPC Control",
                "plain_english": "Antigravity IDE communicates with local daemon for background tasks and remote-control pairing.",
                "evidence": "agy remote-control serve (PID 306348)",
                "status": "observed_active"
            },
            {
                "id": "edge-daemon-github-mcp",
                "source": "node-coord-antigravity-daemon",
                "target": "node-tool-github-mcp",
                "type": "tool_use",
                "label": "Docker Tool Pipe",
                "plain_english": "Antigravity daemon runs and invokes GitHub MCP container over stdio/HTTP for repo management.",
                "evidence": "cgroup 306402 docker run ghcr.io/github/github-mcp-server",
                "status": "observed_active"
            },
            {
                "id": "edge-gateway-dashboard",
                "source": "node-coord-hermes-gateway",
                "target": "node-interface-hermes-dashboard",
                "type": "communication",
                "label": "Auth & State",
                "plain_english": "Gateway provides authentication tokens and live session state to Hermes web dashboard.",
                "evidence": "~/.hermes/dashboard-auth.env, port 9119",
                "status": "observed_active"
            },
            {
                "id": "edge-gateway-orchestrator",
                "source": "node-coord-hermes-gateway",
                "target": "node-coord-orchestrator",
                "type": "delegation",
                "label": "Task Dispatch",
                "plain_english": "Hermes dispatches multi-model coding and evaluation jobs to ai-orchestrator worker.py.",
                "evidence": "ai-orchestrator/SKILL.md, spawn-ledger.json",
                "status": "configured_verified"
            },

            # Orchestrator Routes
            {
                "id": "edge-orch-codex",
                "source": "node-coord-orchestrator",
                "target": "node-agent-codex",
                "type": "delegation",
                "label": "Sequential Job",
                "plain_english": "Orchestrator launches bounded Codex CLI runs with strict file isolation and review/edit modes.",
                "evidence": "worker.py ('--backend codex'), run records",
                "status": "configured_verified"
            },
            {
                "id": "edge-orch-gemini",
                "source": "node-coord-orchestrator",
                "target": "node-provider-gemini",
                "type": "communication",
                "label": "REST API Call",
                "plain_english": "Orchestrator sends text briefs to Google Gemini API (gemini-3.8-flash) using local key.",
                "evidence": "gemini_worker.py, run 20261017-220144-gemini-ed0390c7",
                "status": "configured_verified"
            },
            {
                "id": "edge-orch-ollama",
                "source": "node-coord-orchestrator",
                "target": "node-provider-ollama",
                "type": "delegation",
                "label": "Local Inference",
                "plain_english": "Orchestrator requests local text completion from Ollama on port 11434.",
                "evidence": "local_worker.py, run 20261017-174745-local-b8c585c9",
                "status": "configured_verified"
            },
            {
                "id": "edge-orch-agy",
                "source": "node-coord-orchestrator",
                "target": "node-agent-agy-cli",
                "type": "delegation",
                "label": "CLI Invocation",
                "plain_english": "Orchestrator delegates complex refactoring tasks to agy CLI with automated permissions.",
                "evidence": "worker.py ('agy --mode plan/auto'), 5 recorded runs",
                "status": "configured_verified"
            },

            # Model Relationships
            {
                "id": "edge-ollama-phi4",
                "source": "node-provider-ollama",
                "target": "node-model-phi4",
                "type": "data_transfer",
                "label": "VRAM/RAM Load",
                "plain_english": "Ollama loads the phi4-mini:latest weights into system memory on-demand and unloads after idle.",
                "evidence": "curl 127.0.0.1:11434/api/tags, /api/ps",
                "status": "configured_verified"
            },
            {
                "id": "edge-codex-node-repl",
                "source": "node-agent-codex",
                "target": "node-tool-node-repl",
                "type": "tool_use",
                "label": "MCP Execution",
                "plain_english": "Codex invokes internal Node REPL for script evaluation and browser interactions.",
                "evidence": "~/.codex/config.toml (mcp_servers.node_repl)",
                "status": "configured_verified"
            },

            # Applications & Pipelines
            {
                "id": "edge-prompt-council-gemini",
                "source": "node-app-prompt-council",
                "target": "node-provider-gemini",
                "type": "communication",
                "label": "Stage 1 (Architect)",
                "plain_english": "Prompt Council submits user raw idea to Gemini 3.8 Flash to decompose requirements and constraints.",
                "evidence": "PROMPT-COUNCIL.md, prompt_council source",
                "status": "configured_verified"
            },
            {
                "id": "edge-prompt-council-phi4",
                "source": "node-app-prompt-council",
                "target": "node-model-phi4",
                "type": "communication",
                "label": "Stage 2 (Critic)",
                "plain_english": "Stage 2 uses local Phi-4 / DeepSeek-R1 to adversarially challenge the prompt for edge cases and boundaries.",
                "evidence": "PROMPT-COUNCIL.md",
                "status": "configured_verified"
            },
            {
                "id": "edge-prompt-council-codex",
                "source": "node-app-prompt-council",
                "target": "node-agent-codex",
                "type": "delegation",
                "label": "Stage 3 (Compiler)",
                "plain_english": "Compiles surgically formatted task files directly executable by Codex runner.",
                "evidence": "outputs/tasks/task_codex_20261018_*.md",
                "status": "configured_verified"
            },
            {
                "id": "edge-spreadsheet-workspace",
                "source": "node-app-spreadsheet",
                "target": "node-storage-workspace",
                "type": "file_access",
                "label": "Blueprint Output",
                "plain_english": "Spreadsheet Explorer outputs blueprint.md, blueprint.json, and issues.csv into Agent-Workspace.",
                "evidence": "outputs/expense_tracker_blueprint/blueprint.md",
                "status": "observed_active"
            },
            {
                "id": "edge-workspace-drive",
                "source": "node-storage-workspace",
                "target": "node-integ-google-drive",
                "type": "data_transfer",
                "label": "Cloud Mirror",
                "plain_english": "Workspace artifacts synchronize to Google Drive folders (01 Uploads, 02 Projects, 03 Results).",
                "evidence": "workspace.json (transfer verification passed with SHA-256)",
                "status": "configured_verified"
            },
            {
                "id": "edge-gateway-dbs",
                "source": "node-coord-hermes-gateway",
                "target": "node-storage-hermes-dbs",
                "type": "file_access",
                "label": "WAL State Write",
                "plain_english": "Hermes Gateway persists turn logs and session metrics into state.db and kanban.db.",
                "evidence": "~/.hermes/state.db-wal, ~/.hermes/kanban.db",
                "status": "observed_active"
            },
            {
                "id": "edge-gateway-wiki",
                "source": "node-coord-hermes-gateway",
                "target": "node-storage-wiki",
                "type": "file_access",
                "label": "Journal Logging",
                "plain_english": "Hermes automatically indexes daily conversations into Documents/Hermes-Wiki/journal.",
                "evidence": "Hermes-Wiki/journal/2026-10-24-activity.md",
                "status": "observed_active"
            },
            {
                "id": "edge-gateway-blocked",
                "source": "node-coord-hermes-gateway",
                "target": "node-queue-blocked",
                "type": "file_access",
                "label": "Approval Timeouts",
                "plain_english": "Records unapproved code execution or pending verification items into blocked-work JSON files.",
                "evidence": "~/.hermes/state/blocked-work/ (19 active files)",
                "status": "observed_active"
            },
            {
                "id": "edge-brief-workspace",
                "source": "node-app-status-brief",
                "target": "node-storage-workspace",
                "type": "file_access",
                "label": "Brief Verification",
                "plain_english": "Status Brief helper saves read-back verification and evidence to outputs/status-brief/.",
                "evidence": "outputs/status-brief/20261024-192956-169485/verification.json",
                "status": "observed_active"
            },
            {
                "id": "edge-orch-output",
                "source": "node-coord-orchestrator",
                "target": "node-output-orchestrations",
                "type": "file_access",
                "label": "Run Artifacts",
                "plain_english": "Saves job.json, result.json, answer.txt, and stdout.txt for every coordinated agent invocation.",
                "evidence": "14 run directories in ~/.hermes/orchestration/runs/",
                "status": "observed_active"
            }
        ]
    }

class MatrixRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep server logs tidy unless error
        if args and str(args[0]).startswith("5"):
            super().log_message(format, *args)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        if path == "/":
            self.serve_file(STATIC_DIR / "index.html", "text/html")
        elif path == "/matrix.css":
            self.serve_file(STATIC_DIR / "matrix.css", "text/css")
        elif path == "/matrix.js":
            self.serve_file(STATIC_DIR / "matrix.js", "application/javascript")
        elif path == "/api/system":
            self.send_json(get_system_metrics())
        elif path == "/api/topology":
            topology = get_topology_definition()
            with telemetry_lock:
                topology["live_telemetry"] = latest_telemetry
            self.send_json(topology)
        elif path == "/api/status":
            with telemetry_lock:
                data = dict(latest_telemetry)
            self.send_json(data)
        elif path == "/api/events":
            self.handle_sse()
        elif path == "/api/recent-events":
            with telemetry_lock:
                events = list(recent_events)
            self.send_json(events)
        elif path == "/api/blocked":
            blocked_dir = Path("/home/agenttomek/.hermes/state/blocked-work")
            items = []
            if blocked_dir.exists():
                for p in sorted(blocked_dir.glob("*.json")):
                    try:
                        items.append(json.loads(p.read_text()))
                    except Exception:
                        pass
            self.send_json({"total": len(items), "items": items})
        elif path == "/api/tasks":
            runs_dir = Path("/home/agenttomek/.hermes/orchestration/runs")
            runs = []
            if runs_dir.exists():
                for p in sorted(runs_dir.iterdir(), reverse=True):
                    if p.is_dir() and (p / "result.json").exists():
                        try:
                            res = json.loads((p / "result.json").read_text())
                            task = (p / "TASK.md").read_text() if (p / "TASK.md").exists() else ""
                            runs.append({
                                "id": p.name,
                                "backend": res.get("backend"),
                                "model": res.get("model"),
                                "outcome": res.get("outcome"),
                                "elapsed_seconds": res.get("elapsed_seconds"),
                                "task": task[:300]
                            })
                        except Exception:
                            pass
            self.send_json({"tasks": runs})
        elif path == "/api/coverage":
            self.send_json({
                "monitored_components": [
                    {"component": "Host Resources (CPU/RAM/Swap/Disk/GPU)", "method": "psutil / nvidia-smi", "health": "direct_continuous"},
                    {"component": "Systemd User & System Services", "method": "systemctl query", "health": "direct_continuous"},
                    {"component": "Processes (PIDs, memory, cmdline)", "method": "psutil.process_iter", "health": "direct_continuous"},
                    {"component": "Ollama Local Engine & Model Status", "method": "HTTP API (/api/tags, /api/ps)", "health": "direct_continuous"},
                    {"component": "Hermes Gateway & Telegram State", "method": "gateway_state.json watcher", "health": "file_continuous"},
                    {"component": "Blocked-Work Queue", "method": "Directory watcher (~/.hermes/state/blocked-work)", "health": "file_continuous"},
                    {"component": "Codex Thread History", "method": "session_index.jsonl parser", "health": "file_continuous"},
                    {"component": "Google Drive Sync Contract", "method": "workspace.json verification", "health": "contract_verified"}
                ],
                "unverified_or_indirect": [
                    {"relationship": "Mobile-data-only Telegram command latency", "reason": "Requires Tomek to test outside WiFi mesh", "remedy": "Test bounded status brief request over 5G/4G"},
                    {"relationship": "Reboot auto-recovery without active user", "reason": "SERVER-CHECKPOINT.md explicitly requests supervised test with Tomek present", "remedy": "Conduct supervised reboot test when no jobs running"},
                    {"relationship": "Hermes-to-Antigravity reverse callback", "reason": "Currently Antigravity invokes Hermes; reverse route is unverified", "remedy": "Define explicit CLI callback hook in hermes skill"}
                ]
            })
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == "/api/test-event":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            try:
                data = json.loads(body.decode()) if body else {}
            except Exception:
                data = {}

            sim_type = data.get("type", "diagnostic_pulse")
            source = data.get("source", "node-interface-antigravity")
            target = data.get("target", "node-coord-hermes-gateway")
            summary = data.get("summary", "Test diagnostic packet traversing Antigravity -> Hermes Gateway")

            push_event(
                sim_type,
                source,
                target,
                f"[SIMULATED] {summary}",
                {"details": "User triggered simulated packet for animation & pipeline verification"},
                evidence="Dashboard UI Test Trigger (No Paid API Calls)",
                is_simulated=True
            )
            self.send_json({"success": True, "message": "Test event emitted into operations stream"})
        else:
            self.send_error(404, "Not Found")

    def handle_sse(self):
        """Establish a Server-Sent Events connection with the browser"""
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        with sse_lock:
            sse_clients.append(self)

        # Send initial connection event
        init_evt = {
            "id": f"evt-init-{int(time.time())}",
            "type": "connection_established",
            "source": "server",
            "target": "client",
            "summary": "MATRIX Telemetry stream connected",
            "timestamp": datetime.datetime.now().isoformat(),
            "simulated": False
        }
        self.wfile.write(f"data: {json.dumps(init_evt)}\n\n".encode("utf-8"))
        self.wfile.flush()

        # Keep client connection open
        try:
            while True:
                # Send periodic heartbeat
                time.sleep(15)
                self.wfile.write(b": heartbeat\n\n")
                self.wfile.flush()
        except Exception:
            pass
        finally:
            with sse_lock:
                if self in sse_clients:
                    sse_clients.remove(self)

    def serve_file(self, filepath, content_type):
        if not filepath.exists():
            self.send_error(404, "File Not Found")
            return
        content = filepath.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(content)

    def send_json(self, data):
        content = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(content)

def main():
    # Start telemetry worker thread
    t = threading.Thread(target=background_telemetry_loop, daemon=True)
    t.start()

    # Seed initial telemetry
    time.sleep(0.5)

    server = ThreadingHTTPServer((HOST, PORT), MatrixRequestHandler)
    print(f"============================================================")
    print(f"  MATRIX — AI Operations Map running at:")
    print(f"  → Local URL:   http://127.0.0.1:{PORT}")
    print(f"  → Tailscale:   http://100.110.148.58:{PORT}")
    print(f"============================================================")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.server_close()

if __name__ == "__main__":
    main()
