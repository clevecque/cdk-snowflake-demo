CREATE TABLE IF NOT EXISTS store.clicks (
    _load_time TIMESTAMP NOT NULL,
    _file_name VARCHAR NOT NULL,
    _file_row_number NUMBER NOT NULL,
    _hash_key VARCHAR NOT NULL,
    id VARCHAR, 
    user_id VARCHAR,
    timestamp TIMESTAMP,
    country VARCHAR,
    device VARCHAR,
    PRIMARY KEY (id)
);