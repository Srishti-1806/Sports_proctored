import cv2
import numpy as np
from PyQt6.QtCore import QThread, pyqtSignal
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from mediapipe import Image, ImageFormat

class CameraWorker(QThread):
    frame_signal = pyqtSignal(np.ndarray, object)

    def __init__(self, parent=None): # <-- Yahan 'parent=None' add karein
        super().__init__(parent)    # <-- Parent ko super mein pass karein
        self._run_flag = True
    def run(self):
        # 1. Setup Model Path (Ensure this file exists in models folder)
        model_path = "models/pose_landmarker_lite.task"
        
        # 2. Configure Pose Landmarker
        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = mp_vision.PoseLandmarkerOptions(
            base_options=base_options,
            output_segmentation_masks=False,
            running_mode=mp_vision.RunningMode.IMAGE
        )

        try:
            detector = mp_vision.PoseLandmarker.create_from_options(options)
        except Exception as e:
            print(f"Model Load Error: {e}. Check if {model_path} exists.")
            return

        cap = cv2.VideoCapture(0)

        while self._run_flag and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                continue

            # Selfie mode
            frame = cv2.flip(frame, 1)

            # 3. Convert Frame for MediaPipe
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = Image(image_format=ImageFormat.SRGB, data=rgb)

            # 4. Pose Detection
            result = detector.detect(mp_image)

            # 5. Extract Landmarks safely
            # Tasks API returns a list of lists. result.pose_landmarks[0] is the first person found.
            current_landmarks = None
            if result.pose_landmarks and len(result.pose_landmarks) > 0:
                current_landmarks = result.pose_landmarks[0]
                
                # Drawing for feedback
                for lm in current_landmarks:
                    cx = int(lm.x * frame.shape[1])
                    cy = int(lm.y * frame.shape[0])
                    cv2.circle(frame, (cx, cy), 3, (0, 255, 0), -1)

            # 6. Send to UI
            # IMPORTANT: current_landmarks yahan ek LIST hai (NormalizedLandmark objects ki)
            self.frame_signal.emit(frame, current_landmarks)

        cap.release()

    def stop(self):
        """MainWindow's closeEvent calls this"""
        self._run_flag = False
        self.wait() # Thread band hone ka intezar karein