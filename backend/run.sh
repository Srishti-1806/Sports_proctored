##For proctored window
python -m venv env
env/scripts/activate
pip install -r requirements.txt
python main_window.py #for window
uvicorn main:app --reload #for backend