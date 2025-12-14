-- Edge-Middleware Gateway Database Schema
-- Tabela: traffic_anomalies
CREATE TABLE IF NOT EXISTS traffic_anomalies (
    anomaly_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_ip TEXT NOT NULL,
    detection_timestamp INTEGER NOT NULL,
    anomaly_type TEXT NOT NULL,
    action_taken TEXT
);