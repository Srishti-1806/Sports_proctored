@echo off
REM Build MSI Installer for Sports Proctor on Windows
REM Run this script on a Windows machine to create the MSI installer

echo ========================================
echo Sports Proctor - MSI Builder
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9 or higher from python.org
    pause
    exit /b 1
)

echo [1/6] Installing build dependencies...
pip install --upgrade pip setuptools wheel pyinstaller >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install build dependencies
    pause
    exit /b 1
)

echo [2/6] Installing project dependencies...
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install project dependencies
    pause
    exit /b 1
)

echo [3/6] Creating executable using PyInstaller...
pyinstaller Sports_Proctor.spec
if errorlevel 1 (
    echo ERROR: Failed to create executable
    pause
    exit /b 1
)

echo [4/6] Creating MSI installer using setuptools...
python setup.py bdist_msi
if errorlevel 1 (
    echo ERROR: Failed to create MSI installer
    echo Note: You may need to install Microsoft Visual C++ Build Tools
    pause
    exit /b 1
)

echo [5/6] Finalizing build...
mkdir dist 2>nul
copy dist\Sports_Proctor.msi build\ 2>nul

echo [6/6] Build complete!
echo.
echo ========================================
echo MSI Installer created successfully!
echo Location: dist\Sports_Proctor.msi
echo ========================================
echo.
pause
