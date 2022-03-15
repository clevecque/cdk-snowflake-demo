CREATE OR REPLACE task store.task_views
  WAREHOUSE=COMPUTE_WH
  SCHEDULE='15 minute'
  WHEN SYSTEM$STREAM_HAS_DATA('store.stream_views')
  AS 
    INSERT INTO store.views (
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
      raw_data:id::varchar,
      raw_data:user_id::varchar,
      raw_data:timestamp::timestamp,
      raw_data:country::varchar,
      raw_data:device::varchar
    FROM store.stream_views
    WHERE raw_data:event_type::varchar = 'view'
;