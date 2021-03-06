CREATE OR REPLACE STORAGE INTEGRATION external_events
  TYPE = EXTERNAL_STAGE
  STORAGE_PROVIDER = S3
  ENABLED = TRUE
  STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::203945610915:role/snowflake-role'
  STORAGE_ALLOWED_LOCATIONS = ('s3://cdk-snowflake-demo-bucket')
;