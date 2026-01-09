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
    # UTILITIES
    # ------------------------------
    def incr(self):
        self.reps += 1
        return True

    # joint indexes for readability
    HIP_L, KNEE_L, ANKLE_L = 24, 26, 28
    HIP_R, KNEE_R, ANKLE_R = 23, 25, 27
    SHOULDER_L, ELBOW_L, WRIST_L = 11, 13, 15
    SHOULDER_R, ELBOW_R, WRIST_R = 12, 14, 16

    # ===================================================
    # 1) Squats
    # ===================================================
    def squats(self, lms):
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
            armL = joint_angle(lms, self.SHOULDER_L, self.ELBOW_L, self.WRIST_L)
            armR = joint_angle(lms, self.SHOULDER_R, self.ELBOW_R, self.WRIST_R)
            avg_arm = (armL + armR) / 2
            body_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.ANKLE_L)

            if body_angle < 150:
                self.state = "up"
                return False

            if avg_arm < 90 and self.state == "up":
                self.state = "down"

            if avg_arm > 150 and self.state == "down":
                self.state = "up"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 3) Lunges
    # ===================================================
    def lunges(self, lms):
        try:
            a = joint_angle(
                lms,
                self.HIP_L if self.side == "left" else self.HIP_R,
                self.KNEE_L if self.side == "left" else self.KNEE_R,
                self.ANKLE_L if self.side == "left" else self.ANKLE_R,
            )

            if a < 100 and self.state == "up":
                self.state = "down"

            if a > 160 and self.state == "down":
                self.state = "up"
                self.side = "right" if self.side == "left" else "left"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 4) Jumping Jacks
    # ===================================================
    def jumping_jacks(self, lms):
        try:
            angleL = joint_angle(lms, self.HIP_L, self.SHOULDER_L, self.ELBOW_L)
            angleR = joint_angle(lms, self.HIP_R, self.SHOULDER_R, self.ELBOW_R)
            avg = (angleL + angleR) / 2

            if avg > 130 and self.state == "down":
                self.state = "up"
                return self.incr()

            if avg < 50 and self.state == "up":
                self.state = "down"

        except Exception:
            pass
        return False

    # ===================================================
    # 5) Mountain Climbers
    # ===================================================
    def mountain_climbers(self, lms):
        try:
            hip_knee_l = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            hip_knee_r = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)

            if self.side == "left" and hip_knee_l < 110:
                self.side = "right"
                return self.incr()

            if self.side == "right" and hip_knee_r < 110:
                self.side = "left"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 6) Burpees
    # ===================================================
    def burpees(self, lms):
        try:
            knee_angle = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            hip_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)

            if self.state == "up" and knee_angle < 100:
                self.state = "squat"

            elif self.state == "squat" and hip_angle > 150:
                if abs(lms[self.SHOULDER_L].y - lms[self.HIP_L].y) < 0.2:
                    self.state = "plank"

            elif self.state == "plank" and knee_angle > 160 and hip_angle > 160:
                self.state = "up"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 7) High Knees
    # ===================================================
    def high_knees(self, lms):
        try:
            left_up = lms[self.KNEE_L].y < lms[self.HIP_L].y
            right_up = lms[self.KNEE_R].y < lms[self.HIP_R].y

            if self.side == "left" and left_up:
                self.side = "right"
                return self.incr()

            if self.side == "right" and right_up:
                self.side = "left"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 8) Butt Kicks
    # ===================================================
    def butt_kicks(self, lms):
        try:
            knee_L = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            knee_R = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)

            if self.side == "left" and knee_L < 90:
                self.side = "right"
                return self.incr()

            if self.side == "right" and knee_R < 90:
                self.side = "left"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 9) Side Lunges
    # ===================================================
    def side_lunges(self, lms):
        return self.lunges(lms)

    # ===================================================
    # 10) Tricep Dips
    # ===================================================
    def tricep_dips(self, lms):
        try:
            elbowL = joint_angle(lms, self.SHOULDER_L, self.ELBOW_L, self.WRIST_L)
            elbowR = joint_angle(lms, self.SHOULDER_R, self.ELBOW_R, self.WRIST_R)
            avg = (elbowL + elbowR) / 2

            if avg < 90 and self.state == "up":
                self.state = "down"

            if avg > 150 and self.state == "down":
                self.state = "up"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 11) Crunches
    # ===================================================
    def crunches(self, lms):
        try:
            midL = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)
            midR = joint_angle(lms, self.SHOULDER_R, self.HIP_R, self.KNEE_R)
            avg = (midL + midR) / 2

            if avg < 110 and self.state == "up":
                self.state = "down"

            if avg > 140 and self.state == "down":
                self.state = "up"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 12) Leg Raises
    # ===================================================
    def leg_raises(self, lms):
        try:
            angleL = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.ANKLE_L)
            angleR = joint_angle(lms, self.SHOULDER_R, self.HIP_R, self.ANKLE_R)
            avg = (angleL + angleR) / 2

            if avg < 110 and self.state == "down":
                self.state = "up"

            if avg > 150 and self.state == "up":
                self.state = "down"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 13) Russian Twists
    # ===================================================
    def russian_twists(self, lms):
        try:
            wrist_l_x = lms[self.WRIST_L].x
            wrist_r_x = lms[self.WRIST_R].x
            shoulder_l_x = lms[self.SHOULDER_L].x
            shoulder_r_x = lms[self.SHOULDER_R].x

            if wrist_l_x < shoulder_l_x - 0.05:
                self.side = "left"

            if self.side == "left" and wrist_r_x > shoulder_r_x + 0.05:
                self.side = "right"
                return self.incr()

        except Exception:
            pass
        return False

    # ===================================================
    # 14) Plank
    # ===================================================
    def plank(self, lms):
        try:
            hip_angle = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)
            horizontal = abs(lms[self.SHOULDER_L].y - lms[self.HIP_L].y) < 0.2

            if 150 < hip_angle < 210 and horizontal:
                if time.time() - self.start_time >= 5:
                    self.start_time = time.time()
                    return self.incr()
            else:
                self.start_time = time.time()

        except Exception:
            pass
        return False

    # ===================================================
    # 15) Wall Sit
    # ===================================================
    def wall_sit(self, lms):
        try:
            kneeL = joint_angle(lms, self.HIP_L, self.KNEE_L, self.ANKLE_L)
            kneeR = joint_angle(lms, self.HIP_R, self.KNEE_R, self.ANKLE_R)
            avgK = (kneeL + kneeR) / 2
            hipA = joint_angle(lms, self.SHOULDER_L, self.HIP_L, self.KNEE_L)

            if 70 < avgK < 110 and 70 < hipA < 110:
                if time.time() - self.start_time >= 10:
                    self.start_time = time.time()
                    return self.incr()
            else:
                self.start_time = time.time()

        except Exception:
            pass
        return False
