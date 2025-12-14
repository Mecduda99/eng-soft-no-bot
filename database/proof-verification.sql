-- Proof-Verification Service Database Schema
-- Tabela: verification_logs
CREATE TABLE IF NOT EXISTS verification_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    did_submitted TEXT NOT NULL,
    proof_result TEXT NOT NULL,
    verification_timestamp INTEGER NOT NULL,
    blockchain_tx_ref TEXT
);