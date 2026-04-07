"""
Setup script for Sports Proctor - MSI Installer Builder
This script is designed to build an MSI installer on Windows systems.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8") if (this_directory / "README.md").exists() else ""

setup(
    name="sports-proctor",
    version="0.1.0",
    author="Srishti",
    author_email="srishti@example.com",
    description="AI-powered sports performance testing and proctoring system",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Srishti-1806/Sports_proctored",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    package_data={
        "sports_proctor": [
            "assets/**/*",
            "models/**/*",
        ]
    },
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "License :: OSI Approved :: MIT License",
        "Operating System :: Microsoft :: Windows",
    ],
    python_requires=">=3.9",
    install_requires=[
        "opencv-python>=4.8.0",
        "mediapipe>=0.10.0",
        "PyQt6>=6.5.0",
        "numpy>=1.24.0",
        "pillow>=9.5.0",
        "pyttsx3>=2.90",
        "pyaudio>=0.2.13",
        "pygame>=2.2.0",
        "pandas>=2.0.0",
        "ultralytics>=8.0.0",
        "PyQt6-WebEngine>=6.5.0",
        "fastapi>=0.100.0",
        "uvicorn>=0.23.0",
        "motor>=3.3.0",
        "matplotlib>=3.7.0",
        "typing_extensions>=4.7.0",
        "requests>=2.31.0",
    ],
    entry_points={
        "console_scripts": [
            "sports-proctor=sports_proctor.__main__:main",
        ],
        "gui_scripts": [
            "Sports_Proctor=sports_proctor.__main__:main",
        ],
    },
    options={
        "bdist_msi": {
            "all_users": True,
            "install_dir": r"C:\Program Files\Sports Proctor",
        }
    },
)
