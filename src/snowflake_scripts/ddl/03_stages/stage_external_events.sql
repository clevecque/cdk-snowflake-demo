CREATE OR REPLACE STAGE stage.stage_external_events
    url='s3://cdk-snowflake-demo-bucket/data/'
    storage_integration=external_events
    file_format=(type = json);
    