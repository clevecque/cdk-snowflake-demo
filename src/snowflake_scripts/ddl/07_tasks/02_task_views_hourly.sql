CREATE OR REPLACE task store.task_views_hourly
  WAREHOUSE=COMPUTE_WH
  AFTER store.task_events
  AS 
    MERGE INTO analytics.views_hourly tb
    USING (
      SELECT
        user_id
        , date_trunc('hour', timestamp)    AS date
        , count(*)                         AS cnt_views
      FROM analytics.stream_views_hourly
      GROUP BY date
        , user_id
        , date
    ) st
    ON tb.date            = st.date 
      AND tb.user_id      = st.user_id
    
    WHEN MATCHED THEN 
      UPDATE SET tb.cnt_views = tb.cnt_views + st.cnt_views
    WHEN NOT MATCHED THEN 
      INSERT (
        user_id
        , date
        , cnt_views
      ) 
      VALUES (
        st.user_id
        , st.date
        , st.cnt_views
      )
;