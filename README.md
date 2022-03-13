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




## Default useful commands
  * `npm run build`   compile typescript to js
  * `npm run watch`   watch for changes and compile
  * `npm run test`    perform the jest unit tests
  * `cdk deploy`      deploy this stack to your default AWS account/region
  * `cdk diff`        compare deployed stack with current state
  * `cdk synth`       emits the synthesized CloudFormation template
