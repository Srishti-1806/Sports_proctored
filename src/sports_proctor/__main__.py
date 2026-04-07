"""Entry point for Sports Proctor application"""

from main_window import MainWindow, SportSelectionDialog
from exercise_list import SPORTS
import sys
from PyQt6.QtWidgets import QApplication

def main():
    app = QApplication(sys.argv)
    
    # Show sport selection dialog first
    sport_dialog = SportSelectionDialog()
    if sport_dialog.exec():
        selected_sport = sport_dialog.selected_sport
        win = MainWindow(selected_sport)
        win.show()
        sys.exit(app.exec())
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
