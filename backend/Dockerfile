FROM python:3.13-slim

# Dépendances système pour mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Utilisation de gunicorn pour la production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]