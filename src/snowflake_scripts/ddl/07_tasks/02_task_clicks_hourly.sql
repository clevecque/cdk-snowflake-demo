CREATE OR REPLACE task store.task_clicks_hourly
  WAREHOUSE=COMPUTE_WH
  AFTER store.task_events
  AS 
    MERGE INTO analytics.clicks_hourly tb
    USING (
      SELECT
        user_id
        , date_trunc('hour', timestamp)    AS date
        , count(*)                         AS cnt_clicks
      FROM analytics.stream_clicks_hourly
      GROUP BY date
        , user_id
        , date
    ) st
    ON tb.date            = st.date 
      AND tb.user_id      = st.user_id
    
    WHEN MATCHED THEN 
      UPDATE SET tb.cnt_clicks = tb.cnt_clicks + st.cnt_clicks
    WHEN NOT MATCHED THEN 
      INSERT (
        user_id
        , date
        , cnt_clicks
      ) 
      VALUES (
        st.user_id
        , st.date
        , st.cnt_clicks
      )
;