-- Identity-Issuer Service Database Schema
CREATE TABLE IF NOT EXISTS identities (
    did TEXT PRIMARY KEY,
    gov_link_status TEXT NOT NULL DEFAULT 'PENDING',
    gov_id_ref TEXT UNIQUE,
    creation_timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
    vc_id TEXT PRIMARY KEY,
    did_owner TEXT,
    issue_date INTEGER NOT NULL,
    expiration_date INTEGER,
    FOREIGN KEY (did_owner) REFERENCES identities(did)
);

-- Proof-Verification Service Database Schema
CREATE TABLE IF NOT EXISTS verification_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    did_submitted TEXT NOT NULL,
    proof_result TEXT NOT NULL,
    verification_timestamp INTEGER NOT NULL,
    blockchain_tx_ref TEXT
);

-- Credential-Revocation Service Database Schema
CREATE TABLE IF NOT EXISTS revocations (
    vc_id TEXT PRIMARY KEY,
    revocation_date INTEGER NOT NULL,
    reason TEXT,
    blockchain_update_status TEXT NOT NULL DEFAULT 'PENDING'
);

-- Edge-Middleware Gateway Database Schema
CREATE TABLE IF NOT EXISTS traffic_anomalies (
    anomaly_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_ip TEXT NOT NULL,
    detection_timestamp INTEGER NOT NULL,
    anomaly_type TEXT NOT NULL,
    action_taken TEXT
);