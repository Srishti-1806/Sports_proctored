#!/usr/bin/env python3
"""
Sports Proctor - Windows MSI Builder Script
This script helps build the MSI installer for Windows

Usage:
    python build_msi.py          # Interactive mode
    python build_msi.py --help   # Show help
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

class SportsProctorBuilder:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.src_dir = self.project_root / "src" / "sports_proctor"
        self.dist_dir = self.project_root / "dist"
        self.build_dir = self.project_root / "build"
        
    def check_python_version(self):
        """Verify Python version >= 3.9"""
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 9):
            print(f"❌ Python 3.9+ required. Current: {version.major}.{version.minor}")
            return False
        print(f"✅ Python {version.major}.{version.minor} detected")
        return True
    
    def install_dependencies(self):
        """Install PyInstaller and other build dependencies"""
        print("\n[1/5] Installing build dependencies...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "--quiet", "--upgrade",
                "pyinstaller", "setuptools", "wheel"
            ])
            print("✅ Build dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install build dependencies: {e}")
            return False
    
    def install_project_deps(self):
        """Install project dependencies from requirements.txt"""
        print("\n[2/5] Installing project dependencies...")
        req_file = self.project_root / "requirements.txt"
        if not req_file.exists():
            print("⚠️  requirements.txt not found")
            return False
        
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install",
                "--quiet", "-r", str(req_file)
            ])
            print("✅ Project dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install project dependencies: {e}")
            print("   Tip: Some packages may need to be pre-built on Windows")
            return False
    
    def create_directories(self):
        """Create necessary directories"""
        print("\n[3/5] Creating build directories...")
        self.dist_dir.mkdir(exist_ok=True)
        self.build_dir.mkdir(exist_ok=True)
        print("✅ Directories created")
    
    def build_executable(self):
        """Build executable using PyInstaller"""
        print("\n[4/5] Building executable with PyInstaller...")
        spec_file = self.project_root / "Sports_Proctor.spec"
        
        if not spec_file.exists():
            print(f"❌ Spec file not found: {spec_file}")
            return False
        
        try:
            subprocess.check_call([
                sys.executable, "-m", "PyInstaller",
                "--distpath", str(self.dist_dir),
                "--buildpath", str(self.build_dir),
                str(spec_file)
            ])
            print("✅ Executable built successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to build executable: {e}")
            return False
    
    def build_msi(self):
        """Build MSI installer (Windows only)"""
        print("\n[5/5] Building MSI installer...")
        
        if platform.system() != "Windows":
            print("⚠️  MSI building requires Windows")
            print("    On Linux/Mac, you can create the executable using this script")
            print("    Then copy it to Windows and run: python setup.py bdist_msi")
            return False
        
        try:
            subprocess.check_call([
                sys.executable, "setup.py", "bdist_msi"
            ], cwd=str(self.project_root))
            print("✅ MSI built successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to build MSI: {e}")
            print("   Make sure you're on Windows and have the required tools installed")
            return False
    
    def show_results(self):
        """Show build results"""
        print("\n" + "="*50)
        print("BUILD COMPLETE!")
        print("="*50)
        
        exe_path = self.dist_dir / "Sports_Proctor" / "Sports_Proctor.exe"
        msi_path = self.build_dir / "Sports_Proctor.msi"
        
        if exe_path.exists():
            print(f"✅ Executable created: {exe_path.relative_to(self.project_root)}")
        
        if msi_path.exists():
            print(f"✅ MSI Installer created: {msi_path.relative_to(self.project_root)}")
        
        print("\nNext steps:")
        if platform.system() != "Windows":
            print("1. Copy the 'dist' folder to a Windows machine")
            print("2. Run: python setup.py bdist_msi")
        else:
            print("1. The MSI installer is ready for distribution")
            print("2. Share with users or host on a web server")
    
    def run(self):
        """Run the complete build process"""
        print("="*50)
        print("Sports Proctor - MSI Builder")
        print("="*50)
        
        if not self.check_python_version():
            return False
        
        if not self.install_dependencies():
            return False
        
        if not self.install_project_deps():
            print("⚠️  Warning: Some dependencies may fail on non-Windows systems")
            print("   You can still build the executable structure")
        
        self.create_directories()
        
        if not self.build_executable():
            return False
        
        if platform.system() == "Windows":
            if not self.build_msi():
                print("⚠️  MSI building failed, but executable is ready")
                return True
        
        self.show_results()
        return True

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Build Sports Proctor MSI installer for Windows"
    )
    parser.add_argument(
        "--exe-only",
        action="store_true",
        help="Only build the executable, skip MSI"
    )
    parser.add_argument(
        "--deps-only",
        action="store_true",
        help="Only install dependencies, don't build"
    )
    
    args = parser.parse_args()
    
    builder = SportsProctorBuilder()
    
    if args.deps_only:
        print("Installing dependencies...")
        builder.install_dependencies()
        builder.install_project_deps()
        return 0
    
    if builder.run():
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())
