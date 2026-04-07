# Sports Proctor - MSI Installer Build Guide

This document explains how to build and distribute the Sports Proctor application as an MSI (Microsoft Installer) package for Windows.

## Overview

The Sports Proctor application can be packaged as an MSI installer for easy distribution and installation on Windows systems. There are multiple ways to build the MSI, depending on your setup and requirements.

## Prerequisites

- **Windows 10/11** or **Windows Server 2019+** (for MSI creation)
- **Python 3.9+** installed on Windows
- **Visual C++ Build Tools** (for some dependencies)
- approximately **2-3 GB** of disk space

## Method 1: Quick Build (Recommended)

### Step 1: Prepare on Your Current System
```bash
# On Linux/Mac or Windows
bash build_setup.sh          # On Linux/Mac
# or skip this on Windows - go directly to step 2
```

### Step 2: Build MSI on Windows
1. Copy the entire `Sports_proctored` folder to a Windows machine
2. Open Command Prompt or PowerShell in the folder
3. Run the build script:
   ```batch
   build_msi.bat
   ```
4. The MSI installer will be created in the `dist` folder
5. Look for `Sports_Proctor.msi`

## Method 2: Manual Build (Advanced)

### On Windows Command Prompt:

```batch
REM Step 1: Install dependencies
pip install --upgrade pip setuptools wheel pyinstaller

REM Step 2: Install project requirements
pip install -r requirements.txt

REM Step 3: Create standalone executable
pyinstaller Sports_Proctor.spec

REM Step 4: Create MSI installer
python setup.py bdist_msi
```

The MSI file will be located in: `build\` directory

## Method 3: Using PyInstaller Only (Creates EXE)

If you don't have MSI tooling available on Windows:

```batch
REM Create executable only (no MSI)
pip install pyinstaller
pyinstaller Sports_Proctor.spec
```

The executable will be in: `dist\Sports_Proctor\Sports_Proctor.exe`

You can then distribute this executable to users, or wrap it in a ZIP file.

## Method 4: Advanced - WiX Toolset (Professional)

For a more professional and customizable MSI:

1. Install WiX Toolset from: https://wixtoolset.org/
2. Create a WiX XML configuration file
3. Build using `candle` and `light` tools
4. Result: fully customizable MSI with branding and features

## Build Artifacts

After building, you'll have:

```
dist/
├── Sports_Proctor.msi           # Main installer (if using bdist_msi)
└── Sports_Proctor/              # Standalone executable directory
    ├── Sports_Proctor.exe       # Main application executable
    ├── python*.dll              # Python runtime
    └── ...other dependencies    # Libraries needed for the app
```

## Installation

Users can install using one of these methods:

### MSI Installation (Recommended)
1. Double-click `Sports_Proctor.msi`
2. Follow the installer wizard
3. Launch from Start Menu

### Executable Installation
1. Extract `Sports_Proctor.zip` (if provided as ZIP)
2. Double-click `Sports_Proctor.exe`
3. Or add to Start Menu manually

## Troubleshooting

### Error: "Visual C++ Build Tools not found"
**Solution:** Install Microsoft Visual C++ Build Tools from:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

### Error: "pyaudio installation failed"
**Solution:** On Windows, pre-built wheels are available. Try:
```batch
pip install pyaudio --only-binary :all:
```

### Error: "module not found"
**Solution:** Ensure all dependencies are installed:
```batch
pip install -r requirements.txt
```

### MSI file size too large (>500MB)
**Solution:** This is normal due to OpenCV and other heavy dependencies. Consider:
1. Allowing more installation time
2. Using compressed installation
3. Users can download the standalone executable instead

## Installation Folder

The default installation path is:
- **64-bit:** `C:\Program Files\Sports Proctor\`
- **32-bit:** `C:\Program Files (x86)\Sports Proctor\`

Users can choose a different path during installation.

## Verification

To verify the MSI was created correctly:

```batch
REM List MSI contents
msiexec /x {product-code} /quiet /norestart
```

Or simply try installing it on a test machine.

## Distribution

### For internal use:
- Share the `.msi` file directly
- Users can double-click to install
- Optionally host on a file server or intranet

### For public distribution:
- Digitally sign the MSI certificate
- Host on a distribution server with HTTPS
- Provide release notes and documentation

### For updates:
Increment the version in `pyproject.toml` and rebuild:
```toml
version = "0.2.0"  # Update version
```

## Version Updates

To create a new version:

1. Update version in `pyproject.toml`:
   ```toml
   version = "0.2.0"
   ```

2. Update version in `build-system` section if needed

3. Rebuild using the methods above

4. Old versions can coexist as separate installations

## Security & Code Signing

For production MSI files, consider:

1. **Code Signing:** Sign the executable and MSI with a certificate
2. **SHA-256:** Use SHA-256 for hashing integrity
3. **Virus Scanning:** Scan the final package before distribution

## System Requirements

End users will need:
- Windows 10/11 or Windows Server 2019+
- Webcam (required for Sports Proctor)
- Microphone (required for voice alerts)
- 4GB RAM minimum, 8GB recommended
- 2GB free disk space

## Support & Issues

For build issues or questions:
- Check the build logs in: `logs/briefcase.*.create.log`
- Review PyInstaller documentation: https://pyinstaller.org/
- Check project GitHub issues: https://github.com/Srishti-1806/Sports_proctored/issues

---

**Last Updated:** April 2026
**Version:** 0.1.0
