import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PolicyStatement, Effect, Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CfnJob, CfnTrigger } from 'aws-cdk-lib/aws-glue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSnowflakeDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create S3 Bucket to store our data
    const dataBucket = new Bucket(this, 'dataBucket', {
      bucketName: 'cdk-snowflake-demo-bucket',
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Create a role and policy to run our Glue Job
    const glueRole = new Role(this, 'glueRole', {
      roleName: 'glue-etl-role',
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
        // glueLogsPolicy
      ]
    });

    // Add Python generator script to bucket
    new BucketDeployment(this, 'deployGlueJobFile', {
      sources: [Source.asset('./src/glue_scripts')],
      destinationBucket: dataBucket,
      destinationKeyPrefix: 'glue-scripts'
    });

    // Define Glue Job
    const glueJobDataGenerator = new CfnJob(this, 'glueJobDataGenerator', {
      name: 'glue-job-data-generator',
      role: glueRole.roleArn,
      command: {
        name: 'pythonshell',
        pythonVersion: '3', 
        scriptLocation: 's3://cdk-snowflake-demo-bucket/glue-scripts/data_generator_script.py'
      }
    });

    // Schedule Glue Job
    const glueTrigger = new CfnTrigger(this, 'glueJobDataGeneratorTrigger', {
      name: 'etl-trigger',
      schedule: 'cron(0/10 * ? * * *)',
      type: 'SCHEDULED',
      actions: [
        {
          jobName: glueJobDataGenerator.name
        }
      ],
      startOnCreation: true
    });
    glueTrigger.addDependsOn(glueJobDataGenerator);


  }
}
