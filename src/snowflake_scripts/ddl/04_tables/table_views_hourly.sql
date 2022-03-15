CREATE TABLE IF NOT EXISTS analytics.views_hourly (
    user_id VARCHAR,
    date DATE,
    cnt_views NUMBER,
    PRIMARY KEY (user_id, date)
);