CREATE stream IF NOT EXISTS store.stream_events
    ON TABLE stage.events;