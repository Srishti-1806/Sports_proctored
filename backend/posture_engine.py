import math

def angle(a,b,c):
    ax, ay = a; bx, by = b; cx, cy = c
    ang = math.degrees(math.atan2(cy-by, cx-bx) -
                       math.atan2(ay-by, ax-bx))
    return abs(ang)

def joint_angle(landmarks, a, b, c):
    pa = (landmarks[a].x, landmarks[a].y)
    pb = (landmarks[b].x, landmarks[b].y)
    pc = (landmarks[c].x, landmarks[c].y)
    return angle(pa,pb,pc)