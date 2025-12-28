from posture_engine import joint_angle
import time

class RepCounter:
    def __init__(self):
        self.state = "up"
        self.reps = 0
        self.side = "left"
        self.start_time = time.time()

    def reset(self):
        self.state = "up"
        self.reps = 0
        self.side = "left"
        self.start_time = time.time()

    # ------------------------------
    # **UTILITIES**
    # ------------------------------
    def incr(self):
        self.reps += 1
        return True

    # joint indexes for readability
    HIP_L, KNEE_L, ANKLE_L = 24,26,28
    HIP_R, KNEE_R, ANKLE_R = 23,25,27
    SHOULDER_L, ELBOW_L, WRIST_L = 11,13,15
    SHOULDER_R, ELBOW_R, WRIST_R = 12,14,16

    # ===================================================
    # 1) Squats (already given)
    # ===================================================
    def Squats(self, lms):
        aL = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
        aR = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)
        a = (aL + aR)/2

        if a < 110 and self.state == "up":
            self.state = "down"
        if a > 160 and self.state == "down":
            self.state = "up"
            return self.incr()
        return False

    # ===================================================
    # 2) Push Ups
    # ===================================================
    def push_ups(self, lms):
        try:
            # Need both arms + body straight
            armL = joint_angle(lms, self.SHOULDER_L, self.ELBOW_L, self.WRIST_L)
            armR = joint_angle(lms, self.SHOULDER_R, self.ELBOW_R, self.WRIST_R)
            avg_arm = (armL + armR) / 2

            # NEW: torso straight angle check
            body_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.ANKLE_L)

            # ---------- filters to avoid false count ----------
            # 1) Must be close to plank posture (not sitting)
            if body_angle < 150:   
                # body not straight -> ignore angles
                self.state = "up"   # reset to safe state
                return False

            # ---------- push up logic ----------
            # DOWN position (arms bent)
            if avg_arm < 90 and self.state == "up":
                self.state = "down"

            # UP position (arms straight again)
            if avg_arm > 150 and self.state == "down":
                self.state = "up"
                return self.incr()

        except Exception as e:
            print(f"Push-up Logic Error: {e}")

        return False

    # ===================================================
    # 3) Lunges
    # ===================================================
    def lunges(self, lms):
        try:
            # Current side ke hisaab se knee angle check karein
            if self.side == "left":
                # Left leg aage hai
                a = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            else:
                # Right leg aage hai
                a = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)

            # Logic:
            # 1. Jab ghutna mude (Down position)
            if a < 100 and self.state == "up":
                self.state = "down"
            
            # 2. Jab wapis khade ho jayein (Up position)
            if a > 160 and self.state == "down":
                self.state = "up"
                # Side switch karein taaki agla rep dusre pair se count ho
                self.side = "right" if self.side == "left" else "left"
                return self.incr()
                
        except Exception as e:
            print(f"Lunges Logic Error: {e}")
            
        return False
    # ===================================================
    # 4) Jumping Jacks
    # ===================================================   
    def jumping_jacks(self, lms):
        try:
            # Hum check karenge ki haath side se kitne upar uthe hain
            # Angle between Hip, Shoulder, and Elbow
            angleL = joint_angle(lms, self.HIP_L, self.SHOULDER_L, self.ELBOW_L)
            angleR = joint_angle(lms, self.HIP_R, self.SHOULDER_R, self.ELBOW_R)
            
            # Average angle for stability
            avg_shoulder_raise = (angleL + angleR) / 2

            # Logic:
            # 1. Jab haath upar uth jayein (Angle bada ho jaye) -> UP
            if avg_shoulder_raise > 130 and self.state == "down":
                self.state = "up"
                return self.incr()
            
            # 2. Jab haath wapis niche side mein aa jayein (Angle chota ho jaye) -> DOWN
            if avg_shoulder_raise < 50 and self.state == "up":
                self.state = "down"
                
        except Exception as e:
            print(f"Jumping Jacks Logic Error: {e}")
            
        return False
    # ===================================================
    # 5) Mountain Climbers
    # ===================================================
# ===================================================
    # 5) Mountain Climbers (Corrected for Task API)
    # ===================================================
    def mountain_climbers(self, lms):
        try:
            # Dono pairon ke knee angles nikaalein
            hip_knee_l = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            hip_knee_r = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)

            # Logic: 
            # 1. Jab Left ghutna chest ke paas aaye (Angle chota ho)
            if self.side == "left" and hip_knee_l < 110:
                self.side = "right"
                return self.incr()

            # 2. Jab Right ghutna chest ke paas aaye
            if self.side == "right" and hip_knee_r < 110:
                self.side = "left"
                return self.incr()

        except Exception as e:
            print(f"Mountain Climbers Logic Error: {e}")
            
        return False
    # ===================================================
    # 6) Burpees (Cycle: squat→pushup→jump)
    # ===================================================
# ===================================================
    # 6) Burpees (Corrected for Task API)
    # ===================================================
    def burpees(self, lms):
        try:
            # Knee angle (for squat detection)
            knee_angle = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            # Hip angle (to check if body is straight or bent)
            hip_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)
            
            # 1. STAND -> SQUAT (Ghutne mude aur body niche gayi)
            if self.state == "up" and knee_angle < 100:
                self.state = "squat"

            # 2. SQUAT -> PLANK (Body seedhi ho gayi lekin niche hai)
            # Yahan hum shoulder aur hip ki Y position check kar sakte hain
            elif self.state == "squat" and hip_angle > 150:
                # Agar shoulder aur hip ki height lagbhag barabar hai toh plank hai
                if abs(lms[self.SHOULDER_L].y - lms[self.HIP_L].y) < 0.2:
                    self.state = "plank"

            # 3. PLANK -> JUMP (Wapis khade hoke haath upar)
            elif self.state == "plank" and knee_angle > 160 and hip_angle > 160:
                # Insaan wapis khada ho gaya
                self.state = "up"
                return self.incr()

        except Exception as e:
            print(f"Burpee Logic Error: {e}")
            
        return False

    # ===================================================
    # 7) High Knees
    # ===================================================
# ===================================================
    # 7) High Knees (Corrected for Task API)
    # ===================================================
    def high_knees(self, lms):
        try:
            # MediaPipe mein Y-coordinate niche ki taraf badhta hai (0 upar, 1 niche)
            # Isliye Knee ki Y value Hip ki Y value se KAM honi chahiye tabhi ghutna upar mana jayega
            
            left_knee_up = lms[self.KNEE_L].y < lms[self.HIP_L].y
            right_knee_up = lms[self.KNEE_R].y < lms[self.HIP_R].y

            # Logic: Alternate legs
            if self.side == "left" and left_knee_up:
                self.side = "right"
                return self.incr()
            
            if self.side == "right" and right_knee_up:
                self.side = "left"
                return self.incr()

        except Exception as e:
            print(f"High Knees Logic Error: {e}")
            
        return False

    # ===================================================
    # 8) Butt Kicks
    # ===================================================
# ===================================================
    # 8) Butt Kicks (Corrected for Task API)
    # ===================================================
    def butt_kicks(self, lms):
        try:
            # Knee angles calculate karein
            knee_angle_L = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            knee_angle_R = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)

            # Logic: Alternate side switching
            # Threshold 90-100 fast movements ke liye better hai
            if self.side == "left" and knee_angle_L < 90:
                self.side = "right"
                return self.incr()
            
            if self.side == "right" and knee_angle_R < 90:
                self.side = "left"
                return self.incr()

        except Exception as e:
            print(f"Butt Kicks Logic Error: {e}")
            
        return False

    # ===================================================
    # 9) Side Lunges
    # ===================================================
# ===================================================
    # 9) Side Lunges (Lowercase call)
    # ===================================================
    def side_lunges(self, lms):
        try:
            # Hum purane lunges logic ko hi reuse karenge
            # Bas naam check karlo ki self.lunges (small 'l') hai
            return self.lunges(lms)
        except Exception as e:
            print(f"Side Lunges Error: {e}")
            return False
    # ===================================================
    # 10) Tricep Dips
    # ===================================================
# ===================================================
    # 10) Tricep Dips (Corrected for Task API)
    # ===================================================
    def tricep_dips(self, lms):
        try:
            # Dono elbows ka angle nikaal lo stability ke liye
            elbowL = joint_angle(lms, self.SHOULDER_L, self.ELBOW_L, self.WRIST_L)
            elbowR = joint_angle(lms, self.SHOULDER_R, self.ELBOW_R, self.WRIST_R)
            avg_elbow = (elbowL + elbowR) / 2

            # Logic:
            # 1. DOWN: Jab elbow mod kar niche jayein (Angle chota ho)
            if avg_elbow < 90 and self.state == "up":
                self.state = "down"
            
            # 2. UP: Jab haath wapis seedhe ho jayein (Angle bada ho)
            if avg_elbow > 150 and self.state == "down":
                self.state = "up"
                return self.incr()
                
        except Exception as e:
            print(f"Tricep Dips Error: {e}")
            
        return False
    # ===================================================
    # 11) Crunches
    # ===================================================
# ===================================================
    # 11) Crunches (Corrected for Task API)
    # ===================================================
    def crunches(self, lms):
        try:
            # Mid angle: Shoulder to Hip to Knee
            # Jab aap torso uthate hain, ye angle chota ho jata hai
            midL = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)
            midR = joint_angle(lms, self.SHOULDER_R, self.HIP_R, self.KNEE_R)
            avg_mid = (midL + midR) / 2

            # Logic:
            # 1. DOWN (Crunch position): Angle kam hua
            if avg_mid < 110 and self.state == "up":
                self.state = "down"
            
            # 2. UP (Back to floor): Angle wapis bada hua
            if avg_mid > 140 and self.state == "down":
                self.state = "up"
                return self.incr()
                
        except Exception as e:
            print(f"Crunches Logic Error: {e}")
            
        return False

    # ===================================================
    # 12) Leg Raises
    # ===================================================
# ===================================================
    # 12) Leg Raises (Corrected for Task API)
    # ===================================================
    def leg_raises(self, lms):
        try:
            # Pair seedhe hone chahiye, isliye hum Shoulder-Hip-Ankle angle check karenge
            # Jab pair 90 degree par uthenge, toh ye angle kam ho jayega
            angle_L = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.ANKLE_L)
            angle_R = joint_angle(lms, self.SHOULDER_R, self.HIP_R, self.ANKLE_R)
            avg_angle = (angle_L + angle_R) / 2

            # Logic:
            # 1. UP (Legs raised): Angle chota ho gaya (around 90-110 deg)
            if avg_angle < 110 and self.state == "down":
                self.state = "up"
            
            # 2. DOWN (Legs to floor): Angle bada ho gaya (around 150-170 deg)
            if avg_angle > 150 and self.state == "up":
                self.state = "down"
                return self.incr()
                
        except Exception as e:
            print(f"Leg Raises Logic Error: {e}")
            
        return False

    # ===================================================
    # 13) Russian Twists
    # ===================================================
# ===================================================
    # 13) Russian Twists (Corrected for Task API)
    # ===================================================
    def russian_twists(self, lms):
        try:
            # Russian twists mein hum wrists (kalaai) ki position dekhte hain
            # left_wrist.x agar left shoulder se kafi bahar hai toh matlab banda left mudi hai
            wrist_l_x = lms[self.WRIST_L].x
            wrist_r_x = lms[self.WRIST_R].x
            shoulder_l_x = lms[self.SHOULDER_L].x
            shoulder_r_x = lms[self.SHOULDER_R].x

            # Logic: Side to Side movement
            # 1. Check if hands moved to the LEFT side
            if wrist_l_x < shoulder_l_x - 0.05:
                self.side = "left"

            # 2. Check if hands moved to the RIGHT side AND we came from left
            if self.side == "left" and wrist_r_x > shoulder_r_x + 0.05:
                self.side = "right"
                return self.incr() # Ek full cycle (Left + Right) = 1 Rep
                
        except Exception as e:
            print(f"Russian Twist Error: {e}")
            
        return False
    # ===================================================
    # 14) Plank (every 5s = 1 rep)
    # ===================================================
# ===================================================
    # 14) Plank (Corrected for Task API)
    # ===================================================
    def plank(self, lms):
        try:
            # 1. Posture Check: Back seedhi honi chahiye (Shoulder-Hip-Knee angle)
            # 180 degree ka matlab hai bilkul straight body
            hip_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)
            
            # 2. Alignment Check: Shoulder aur Hip lagbhag ek hi level par honi chahiye (Horizontal)
            # Plank mein dono ki Y-coordinate value mein zyada farak nahi hota
            is_horizontal = abs(lms[self.SHOULDER_L].y - lms[self.HIP_L].y) < 0.2
            
            # Agar posture sahi hai
            if 150 < hip_angle < 210 and is_horizontal:
                now = time.time()
                # Har 5 second hold karne par 1 rep (point) milega
                if now - self.start_time >= 5:
                    self.start_time = now
                    return self.incr()
            else:
                # Agar posture bigad gaya, toh timer reset kar do (Strict coaching!)
                self.start_time = time.time()
                
        except Exception as e:
            print(f"Plank Logic Error: {e}")
            
        return False

# ===================================================
    # 15) Wall Sit (Corrected for Task API)
    # ===================================================
    def wall_sit(self, lms):
        try:
            # 1. Posture Check: Ghutne 90 degree par mude hone chahiye
            knee_angle_l = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            knee_angle_r = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)
            avg_knee = (knee_angle_l + knee_angle_r) / 2

            # 2. Hip Angle Check: Torso aur Thighs ke beech ka angle
            hip_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)

            # Agar insaan sahi "Chair Pose" mein hai
            # Knee around 90 deg aur Hip around 90 deg
            if 70 < avg_knee < 110 and 70 < hip_angle < 110:
                now = time.time()
                # Har 10 second hold karne par 1 rep milega
                if now - self.start_time >= 10:
                    self.start_time = now
                    return self.incr()
            else:
                # Agar posture kharab hua toh timer reset
                self.start_time = time.time()

        except Exception as e:
            print(f"Wall Sit Logic Error: {e}")
            
        return False