#!/usr/bin/env bash
# MATRIX — AI Operations Map Startup Script

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "============================================================"
echo "  Starting MATRIX — AI Operations Map"
echo "============================================================"
echo "  Location: $DIR"
echo "  Local URL:     http://127.0.0.1:8420"
echo "  Tailscale URL: http://100.110.148.58:8420"
echo "============================================================"

python3 server.py
