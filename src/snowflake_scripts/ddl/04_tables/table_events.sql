CREATE TABLE IF NOT EXISTS stage.events (
    _load_time timestamp NOT NULL,
    _file_name varchar NOT NULL,
    _file_row_number number NOT NULL,
    _hash_key varchar NOT NULL,
    raw_data variant NOT NULL,
    primary key (_hash_key)
);