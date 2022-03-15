CREATE TABLE IF NOT EXISTS analytics.clicks_hourly (
    user_id VARCHAR,
    date DATE,
    cnt_clicks NUMBER,
    PRIMARY KEY (user_id, date)
);