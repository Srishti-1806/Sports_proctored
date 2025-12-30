import pyttsx3

engine = pyttsx3.init()
engine.setProperty('rate', 175)

def say(text: str):
    try:
        engine.say(text)
        engine.runAndWait()
    except:
        pass
