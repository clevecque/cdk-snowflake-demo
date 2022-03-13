CREATE stream IF NOT EXISTS store.stream_views
    ON TABLE stage.events;