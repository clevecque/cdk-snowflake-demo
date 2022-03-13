CREATE stream IF NOT EXISTS store.stream_clicks
    ON TABLE stage.events;