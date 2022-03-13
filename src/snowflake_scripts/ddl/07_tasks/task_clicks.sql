CREATE OR REPLACE task store.task_clicks
  WAREHOUSE=COMPUTE_WH
  SCHEDULE='15 minute'
  WHEN SYSTEM$STREAM_HAS_DATA('store.stream_clicks')
  AS 
    INSERT INTO store.clicks (
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
    FROM store.stream_clicks
    WHERE raw_data:detail:eventType::varchar = 'click'
;