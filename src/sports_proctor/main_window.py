import sys, os, cv2, psutil, requests
from PyQt6.QtCore import QTimer, Qt, QUrl, pyqtSignal, QThread
from PyQt6.QtWidgets import *
from PyQt6.QtGui import QPixmap, QImage, QFont
from PyQt6.QtMultimedia import QMediaPlayer, QAudioOutput
from PyQt6.QtMultimediaWidgets import QVideoWidget

from camera_worker import CameraWorker
from exercise_list import EXERCISES, SPORTS
from rep_counter import RepCounter
from sound_manager import tick, swap, alert, play
from voice_alerts import say

import os
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"


# ---------------- SERVER CONFIG ----------------
SERVER_URL = "https://level-1-sports-proctored-system.onrender.com/" 

def server_online():
    try:
        r = requests.get(f"{SERVER_URL}/leaderboard", timeout=60)
        return r.status_code == 200
    except:
        return False

def send_score(name, sport, score):
    if not server_online():
        print("⚠ Server offline, score not sent")
        return
    try:
        r = requests.post(f"{SERVER_URL}/score", json={"name": name, "sport": sport, "score": score}, timeout=5)
        try:
            data = r.json()
            print(data)
        except ValueError:
            print(f"❌ Server returned non-JSON response: {r.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error sending score: {e}")



# ---------------- CONFIG ----------------
EXERCISE_CONFIG = {
    "squats": {"time": 30, "target": 15},
    "push_ups": {"time": 40, "target": 20},
    "jumping_jacks": {"time": 25, "target": 25},
    "high_knees": {"time": 20, "target": 30},
    "lunges": {"time": 30, "target": 20},
    "plank": {"time": 45, "target": 1},
    "mountain_climbers": {"time": 30, "target": 30},
    "burpees": {"time": 30, "target": 15},
    "butt_kicks": {"time": 20, "target": 30},
    "side_lunges": {"time": 30, "target": 20},
    "tricep_dips": {"time": 30, "target": 20},
    "crunches": {"time": 30, "target": 25},
    "leg_raises": {"time": 30, "target": 20},
    "russian_twists": {"time": 30, "target": 30},
    "wall_sit": {"time": 45, "target": 30}
}



BLOCKED_APPS = {
    "msedge.exe", "opera.exe", "copilot.exe", "chrome.exe", "firefox.exe", "brave.exe",
    "vivaldi.exe", "discord.exe", "teams.exe", "zoom.exe", "skype.exe", "twitch.exe",
    "spotify.exe", "filmora.exe", "vlc.exe", "word.exe", "excel.exe",
    "powerpnt.exe", "whatsapp.exe", "telegram.exe", "signal.exe", "line.exe", "wechat.exe"
}

def kill_blocked_apps(parent=None):
    for p in psutil.process_iter(['name']):
        try:
            if p.info['name'] and p.info['name'].lower() in BLOCKED_APPS:
                p.kill()
                if parent:
                    parent.show_toast(f"⚠ {p.info['name']} closed (blocked)")
        except:
            pass

# ---------------- SPORTS SELECTION DIALOG ----------------
class SportSelectionDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Select Your Sport")
        self.setMinimumSize(600, 500)
        self.selected_sport = None
        self.init_ui()
        self.setStyle(QStyleFactory.create('Fusion'))

    def init_ui(self):
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.setSpacing(15)

        # Title
        title = QLabel("🏋️ Choose Your Sport 🏋️")
        title.setFont(QFont("Arial", 26, QFont.Weight.Bold))
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        # Subtitle
        subtitle = QLabel("Select a sport to see its specific exercises")
        subtitle.setFont(QFont("Arial", 12))
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        subtitle.setStyleSheet("color: #666; margin-bottom: 20px;")
        layout.addWidget(subtitle)

        # Sports Grid
        grid = QGridLayout()
        grid.setSpacing(10)
        row = 0
        col = 0

        sports_list = list(SPORTS.keys())
        for sport in sports_list:
            btn = QPushButton(sport)
            btn.setMinimumHeight(80)
            btn.setMinimumWidth(150)
            btn.setFont(QFont("Arial", 14, QFont.Weight.Bold))
            btn.setStyleSheet("""
                QPushButton {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 10px;
                }
                QPushButton:hover {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                }
                QPushButton:pressed {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    padding: 12px 8px 8px 12px;
                }
            """)
            btn.clicked.connect(lambda checked, s=sport: self.select_sport(s))
            grid.addWidget(btn, row, col)
            col += 1
            if col > 2:
                col = 0
                row += 1

        layout.addLayout(grid)
        layout.addStretch()

        self.setLayout(layout)

    def select_sport(self, sport):
        self.selected_sport = sport
        self.accept()

# ---------------- TOAST ----------------
class Toast(QLabel):
    def __init__(self, parent, text, duration=2500):
        super().__init__(parent)
        self.setText(text)
        self.setStyleSheet("""
            background: rgba(0,0,0,180);
            color: red;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
        """)
        self.adjustSize()
        self.move(20, parent.height() - self.height() - 20)
        self.show()
        QTimer.singleShot(duration, self.close)

# ---------------- MAIN WINDOW ----------------
class MainWindow(QMainWindow):
    def __init__(self, selected_sport="Fitness"):
        super().__init__()
        self.setWindowTitle("Sports Proctor")
        self.setMinimumSize(1200, 750)

        self.selected_sport = selected_sport
        self.username = ""
        self.exercise_index = 0
        self.timer_seconds = 0
        self.total_points = 0
        self.rep_counter = RepCounter()
        self.paused = False
        
        # Load exercises for selected sport
        self.exercises = SPORTS[selected_sport]["exercises"]

        self.stacked = QStackedWidget()
        self.setCentralWidget(self.stacked)

        self.init_user_page()
        self.init_workout_page()
        self.stacked.setCurrentIndex(0)

        # Set window title with sport name
        self.setWindowTitle(f"Sports Proctor - {selected_sport}")

        # ---------------- Background tasks ----------------
        self.proc_timer = QTimer()
        self.proc_timer.timeout.connect(lambda: kill_blocked_apps(self))
        self.proc_timer.start(2000)

        if server_online():
            print("✔ Server reachable")
        else:
            QMessageBox.warning(self, "Server", "Backend not reachable. Scores won't be sent.")

    def show_toast(self, text):
        Toast(self, text)

    # --------- User Page ---------
    def init_user_page(self):
        page = QWidget()
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        title = QLabel("Enter Your Name")
        title.setFont(QFont("Arial", 24, QFont.Weight.Bold))
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.username_input = QLineEdit()
        self.username_input.setFont(QFont("Arial", 16))
        self.username_input.setFixedWidth(300)

        start_btn = QPushButton("START TEST")
        start_btn.setFont(QFont("Arial", 16, QFont.Weight.Bold))
        start_btn.clicked.connect(self.start_test)

        layout.addWidget(title)
        layout.addWidget(self.username_input)
        layout.addWidget(start_btn)

        page.setLayout(layout)
        self.stacked.addWidget(page)

    def start_test(self):
        self.username = self.username_input.text().strip()
        if not self.username: return
        say(f"Hello {self.username}, welcome to {self.selected_sport}!")
        play(os.path.join("assets", "sounds", "welcome.mp3"))
        self.stacked.setCurrentIndex(1)
        self.load_exercise()

    # --------- Workout Page ---------
    def init_workout_page(self):
        page = QWidget()
        main_h = QHBoxLayout()

        # LEFT: Camera + Exercise Name
        left_col = QVBoxLayout()
        self.exercise_label = QLabel("Starting...")
        self.exercise_label.setFont(QFont("Arial", 24, QFont.Weight.Bold))
        self.exercise_label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.video_label = QLabel()
        self.video_label.setFixedSize(640, 480)
        self.video_label.setStyleSheet("border:4px solid #34495e; background-color:black;")
        left_col.addWidget(self.exercise_label)
        left_col.addWidget(self.video_label)
        left_col.addStretch()

        # RIGHT: Score + MP4 demo
        right_col = QVBoxLayout()
        right_col.setContentsMargins(20,0,20,0)
        self.total_score_label = QLabel("Total Score: 0")
        self.total_score_label.setFont(QFont("Arial", 22, QFont.Weight.Bold))
        self.total_score_label.setStyleSheet("color: #27ae60;")

        self.video_title = QLabel("Demo Video:")
        self.video_title.setFont(QFont("Arial", 14))

        self.video_widget = QVideoWidget()
        self.video_widget.setFixedSize(400, 400)
        self.media_player = QMediaPlayer()
        self.audio_output = QAudioOutput()
        self.media_player.setAudioOutput(self.audio_output)
        self.media_player.setVideoOutput(self.video_widget)
        self.media_player.setLoops(-1)

        self.rep_label = QLabel("Reps: 0")
        self.rep_label.setFont(QFont("Arial", 20, QFont.Weight.Bold))
        self.rep_label.setStyleSheet("color: #2980b9;")

        right_col.addWidget(self.total_score_label)
        right_col.addSpacing(20)
        right_col.addWidget(self.video_title)
        right_col.addWidget(self.video_widget)
        right_col.addSpacing(20)
        right_col.addWidget(self.rep_label)
        right_col.addStretch()

        # BOTTOM: Timer + Buttons
        bottom_row = QVBoxLayout()
        self.timer_label = QLabel("00")
        self.timer_label.setFont(QFont("Arial", 40, QFont.Weight.Bold))
        self.timer_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.timer_label.setStyleSheet("color: #e74c3c;")

        # Buttons
        self.start_btn = QPushButton("START WORKOUT")
        self.pause_btn = QPushButton("PAUSE")
        self.next_btn = QPushButton("NEXT")
        self.prev_btn = QPushButton("PREV")
        self.end_btn = QPushButton("END TEST")

        for btn in [self.start_btn, self.pause_btn, self.next_btn, self.prev_btn, self.end_btn]:
            btn.setMinimumHeight(50)
            btn.setFont(QFont("Arial", 12, QFont.Weight.Bold))

        btn_layout = QHBoxLayout()
        for btn in [self.prev_btn, self.start_btn, self.pause_btn, self.next_btn, self.end_btn]:
            btn_layout.addWidget(btn)

        self.start_btn.clicked.connect(self.start_workout)
        self.pause_btn.clicked.connect(self.pause_resume)
        self.next_btn.clicked.connect(self.next_exercise)
        self.prev_btn.clicked.connect(self.prev_exercise)
        self.end_btn.clicked.connect(self.end_workout)

        # Camera
        self.camera = CameraWorker(self)
        self.camera.frame_signal.connect(self.update_frame)
        self.camera.start()

        # Timer
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_timer)

        # Layout assemble
        main_h.addLayout(left_col,2)
        main_h.addLayout(right_col,1)
        main_layout = QVBoxLayout()
        main_layout.addLayout(main_h)
        main_layout.addWidget(self.timer_label)
        main_layout.addLayout(btn_layout)
        page.setLayout(main_layout)
        self.stacked.addWidget(page)

    # ---------------- Exercise ----------------
    def load_exercise(self):
        swap()
        ex = self.exercises[self.exercise_index]
        self.exercise_label.setText(ex.upper())

        # Load MP4
        clean_name = ex.lower().replace(" ","_")
        base_path = os.path.dirname(os.path.abspath(__file__))
        video_path = os.path.join(base_path,"assets","exercises",f"{clean_name}.mp4")
        if os.path.exists(video_path):
            self.video_widget.show()
            self.media_player.setSource(QUrl.fromLocalFile(video_path))
            self.media_player.play()
        else:
            self.video_widget.hide()
            self.video_title.setText(f"Missing Video: {clean_name}.mp4")

        # Timer & reps
        self.timer_seconds = EXERCISE_CONFIG.get(clean_name,{"time":30})["time"]
        self.rep_counter.reset()
        self.rep_label.setText("Reps: 0")
        self.timer_label.setText(str(self.timer_seconds))
        say(f"Next exercise: {ex}")

    def start_workout(self):
        if not self.timer.isActive():
            say("Starting workout")
            self.paused = False
            self.timer.start(1000)

    def pause_resume(self):
        if self.timer.isActive():
            self.paused = True
            self.timer.stop()
            self.media_player.pause()
            say("Workout paused")
            self.pause_btn.setText("RESUME")
        else:
            self.paused = False
            self.timer.start(1000)
            self.media_player.play()
            say("Resuming")
            self.pause_btn.setText("PAUSE")

    def next_exercise(self):
        if self.exercise_index == len(self.exercises) - 1:
            self.next_btn.setEnabled(False)
            say(f"Well done {self.username}. Your total score is {self.total_points}")
            say("All exercises completed. Ending test.")
            self.end_workout()
            return

        self.exercise_index += 1
        self.load_exercise()


    def prev_exercise(self):
        if self.exercise_index > 0:
            self.exercise_index -= 1
            self.load_exercise()


    def update_timer(self):
        if self.paused: return
        if self.timer_seconds>0:
            tick()
            self.timer_seconds -= 1
            self.timer_label.setText(str(self.timer_seconds))
        else:
            self.timer.stop()
            say("Time up")
            alert()
            self.next_exercise()

    def update_frame(self, frame, landmarks):
        try:
            if landmarks is not None and len(landmarks)>0:
                exercise_name = self.exercises[self.exercise_index].lower().replace(" ","_")
                if hasattr(self.rep_counter, exercise_name):
                    count_func = getattr(self.rep_counter, exercise_name)
                    if count_func(landmarks):
                        self.total_points += 10
                        say("Good rep")
                        self.rep_label.setText(f"Reps: {self.rep_counter.reps}")
                        self.total_score_label.setText(f"Total Score: {self.total_points}")

            rgb_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            h,w,ch = rgb_img.shape
            qimg = QImage(rgb_img.data,w,h,ch*w,QImage.Format.Format_RGB888)
            pixmap = QPixmap.fromImage(qimg)
            self.video_label.setPixmap(pixmap.scaled(640,480,Qt.AspectRatioMode.KeepAspectRatio))
        except Exception as e:
            print(f"Error: {e}")

    def end_workout(self):
        send_score(self.username, self.selected_sport, self.total_points)
        self.camera.stop()
        self.camera.wait()
        self.media_player.stop()
        self.close()

    def closeEvent(self,event):
        self.camera.stop()
        self.camera.wait()
        self.media_player.stop()
        event.accept()

if __name__=="__main__":
    app = QApplication(sys.argv)
    
    # Show sport selection dialog first
    sport_dialog = SportSelectionDialog()
    if sport_dialog.exec() == QDialog.DialogCode.Accepted:
        selected_sport = sport_dialog.selected_sport
        win = MainWindow(selected_sport)
        win.show()
        sys.exit(app.exec())
    else:
        sys.exit(0)
