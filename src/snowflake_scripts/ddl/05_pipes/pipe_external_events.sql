CREATE OR REPLACE PIPE stage.pipe_external_events
    AUTO_INGEST = true
    AWS_SNS_TOPIC='arn:aws:sns:us-east-1:203945610915:cdk-snowflake-demo-bucket-topic'
    AS
    COPY INTO stage.events
        FROM
            (SELECT current_timestamp      AS _load_time
                , metadata$filename        AS _file_name
                , metadata$file_row_number AS _file_row_number
                , sha2($1)                 AS _hash_key
                , $1::variant              AS raw_data
            FROM @stage.stage_external_events
            )
        FILE_FORMAT = (type = json)
;