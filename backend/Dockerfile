FROM python:3.12-slim
WORKDIR /srv
ENV PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY scripts ./scripts
# DATABASE_URL, JWT_SECRET, CORS_ORIGINS, FOOTBALL_API_KEY come from the host's environment.
# Seed once per environment:  python -m app.seed
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
