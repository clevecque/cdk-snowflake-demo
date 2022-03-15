# Welcome to the CDK Snowflake demo repo

This is a project to:
1. Generate mock data using a Glue Job triggered on a continuous basis.
2. Exporting data to a S3 bucket.
3. Loading it within Snowflake.
4. Creating Snowflake objects and observing how they behave.

## Steps to reproduce setting up the CDK repo
You will need an AWS account with an Access Key. You can generate the latter in your account under `Security Credentials`.

  * `brew install cdk`
  * `cdk init app --language=typescript`
  * `aws configure` to link to your account and follow the prompt
  * `cdk bootstrap` to initialise objects and make it easier
  * `cdk deploy CdkSnowflakeDemoStack`

## Steps to set up Snowflake
You will need a Snowflake account. You can get a trial account with up to $400 free credit.

1. Create your database in the Snowflake UX.
2. Create a `.env` file in your root on the following template
```
SF_USER=
SF_PWD=
SF_ACCOUNT=
SF_DATABASE=
SF_WAREHOUSE=
```
Your `SF_ACCOUNT` value should be the one in the Snowflake URL : `https:/<SF_ACCOUNT>.snowflakecomputing.com`

3. Install `requirements.txt` in repo with `pip3 install -r requirements.txt`
4. Deploy Snowflake objects with `python3 src/snowflake_scripts/deploy_snowflake_objects.py`

## How to monitor Snowflake objects

1. Monitor the pipe: can give the status, hopefully `RUNNING`
```
SELECT SYSTEM$PIPE_STATUS('<NAME_OF_YOUR_PIPE>');
```
2. Monitor the tasks: make sure you are in the correct schema
```
SELECT *
  FROM TABLE(information_schema.task_history(
    SCHEDULED_TIME_RANGE_START=>DATEADD('hour',-1,current_timestamp()),
    RESULT_LIMIT => 10,
    TASK_NAME=>'<NAME_OF_YOUR_TASK>'));
``` 


## Default useful commands
  * `cdk deploy`      deploy this stack to your default AWS account/region
  * `cdk diff`        compare deployed stack with current state
  * `cdk synth`       emits the synthesized CloudFormation template
