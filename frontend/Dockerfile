FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt . 
#Im assuming we don't need this anymore ^

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

# Run the application when the container launches
CMD ["python", "app.py"]
