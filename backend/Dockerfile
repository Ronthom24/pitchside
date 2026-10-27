FROM python:3.12-slim
WORKDIR /srv
ENV PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY scripts ./scripts
# DATABASE_URL, JWT_SECRET, CORS_ORIGINS, FOOTBALL_API_KEY come from the host's environment.
# Seeds on every boot (idempotent upserts of content only), then serves.
CMD ["sh", "-c", "python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
