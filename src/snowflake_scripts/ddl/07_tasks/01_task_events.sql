CREATE OR REPLACE task store.task_events
  WAREHOUSE=COMPUTE_WH
  SCHEDULE='15 minute'
  WHEN SYSTEM$STREAM_HAS_DATA('store.stream_events')
  AS 
    INSERT FIRST 
    WHEN raw_data:event_type::varchar = 'click'
    THEN INTO store.clicks (
      _load_time,
      _file_name,
      _file_row_number,
      _hash_key,
      id,
      user_id,
      timestamp,
      country,
      device
    ) VALUES (
      _load_time,
      _file_name,
      _file_row_number,
      _hash_key,
      id,
      user_id,
      timestamp,
      country,
      device
    )

    ELSE INTO store.views (
      _load_time,
      _file_name,
      _file_row_number,
      _hash_key,
      id,
      user_id,
      timestamp,
      country,
      device
    ) VALUES (
      _load_time,
      _file_name,
      _file_row_number,
      _hash_key,
      id,
      user_id,
      timestamp,
      country,
      device
    )

    SELECT 
      _load_time,
      _file_name,
      _file_row_number,
      _hash_key,
      raw_data:id::varchar            AS id,
      raw_data:user_id::varchar       AS user_id,
      raw_data:timestamp::timestamp   AS timestamp,
      raw_data:country::varchar       AS country,
      raw_data:device::varchar        AS device
    FROM store.stream_events
;