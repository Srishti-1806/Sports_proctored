import pygame
import os

# Initialize mixer with standard frequencies
pygame.mixer.init()

# BASE_DIR: e:/sports_proctor
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# SOUND_DIR: e:/sports_proctor/assets/sounds
SOUND_DIR = os.path.join(BASE_DIR, "assets", "sounds")

def play(sound_name):
    # .strip() isliye taaki agar filename mein galti se space ho toh wo hat jaye
    path = os.path.join(SOUND_DIR, sound_name.strip())
    
    if not os.path.exists(path):
        print(f"Bhai, file abhi bhi nahi mili: {path}")
        return
    
    try:
        # music.load() ki jagah Sound object use karna better hota hai chote sounds ke liye
        sound_effect = pygame.mixer.Sound(path)
        sound_effect.play()
    except Exception as e:
        print(f"Sound error: {e}")

def tick():
    play("tick.mp3")

def swap():
    play("swap.mp3")

def alert():
    play("alert.mp3")