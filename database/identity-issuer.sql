-- Identity-Issuer Service Database Schema
-- Tabela: identities
CREATE TABLE IF NOT EXISTS identities (
    did TEXT PRIMARY KEY,
    gov_link_status TEXT NOT NULL DEFAULT 'PENDING',
    gov_id_ref TEXT UNIQUE,
    creation_timestamp INTEGER NOT NULL
);

-- Tabela: credentials  
CREATE TABLE IF NOT EXISTS credentials (
    vc_id TEXT PRIMARY KEY,
    did_owner TEXT,
    issue_date INTEGER NOT NULL,
    expiration_date INTEGER,
    FOREIGN KEY (did_owner) REFERENCES identities(did)
);