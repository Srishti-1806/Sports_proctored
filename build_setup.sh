#!/bin/bash

# Build executable for Sports Proctor using PyInstaller
# This script prepares the build artifacts that can be used to create MSI on Windows

set -e  # Exit on error

echo "========================================"
echo "Sports Proctor - Build Setup"
echo "========================================"
echo ""

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "[1/5] Python version: $PYTHON_VERSION"

# Install build dependencies
echo "[2/5] Installing build dependencies..."
pip install --quiet --upgrade pip setuptools wheel pyinstaller

# Install project dependencies
echo "[3/5] Installing project dependencies..."
pip install --quiet -r requirements.txt

# Create the executable spec (for Windows building)
echo "[4/5] PyInstaller spec ready at: Sports_Proctor.spec"

# Create proper directory structure
echo "[5/5] Setting up directory structure..."
mkdir -p build
mkdir -p dist

echo ""
echo "========================================"
echo "Build Setup Complete!"
echo "========================================"
echo ""
echo "To build the MSI installer on Windows:"
echo "  1. Copy the entire project to a Windows machine"
echo "  2. Run: build_msi.bat"
echo ""
echo "To build the executable for Windows (from any OS):"
echo "  1. Install PyInstaller: pip install pyinstaller"
echo "  2. Run: pyinstaller Sports_Proctor.spec"
echo ""
