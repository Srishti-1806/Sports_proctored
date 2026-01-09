# Base image
FROM python:3.10-slim

# Working directory set karein
WORKDIR /app

# Dependencies copy aur install karein
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements2.txt

# Poora code copy karein
COPY . .

# Port expose karein
EXPOSE 8000

# Server start karne ki command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]