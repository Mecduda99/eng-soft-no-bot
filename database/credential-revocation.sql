-- Credential-Revocation Service Database Schema
-- Tabela: revocations
CREATE TABLE IF NOT EXISTS revocations (
    vc_id TEXT PRIMARY KEY,
    revocation_date INTEGER NOT NULL,
    reason TEXT,
    blockchain_update_status TEXT NOT NULL DEFAULT 'PENDING'
);