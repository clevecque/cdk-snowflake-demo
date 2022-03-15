import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PolicyStatement, Effect, Role, ServicePrincipal, ManagedPolicy, ArnPrincipal, AnyPrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Topic } from 'aws-cdk-lib/aws-sns';
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

    // Create a SNS topic on top of it to track new data
    const dataBucketTopic = new Topic(this, `dataBucketTopic`, {
      topicName: `cdk-snowflake-demo-bucket-topic`
    })

    dataBucketTopic.addToResourcePolicy(
      new PolicyStatement({
        actions: [
          'SNS:Publish',
          'SNS:RemovePermission',
          'SNS:SetTopicAttributes',
          'SNS:DeleteTopic',
          'SNS:ListSubscriptionsByTopic',
          'SNS:GetTopicAttributes',
          'SNS:Receive',
          'SNS:AddPermission',
          'SNS:Subscribe'
        ],
        effect: Effect.ALLOW,
        resources: [dataBucketTopic.topicArn],
        principals: [new AnyPrincipal()]
      })
    )

    dataBucketTopic.addToResourcePolicy(
      new PolicyStatement({
        actions: ['SNS:Subscribe'],
        effect: Effect.ALLOW,
        resources: [dataBucketTopic.topicArn],
        principals: [new ArnPrincipal('arn:aws:iam::486855810640:user/f9ts-s-aust3232')]
      })
    )

    dataBucketTopic.addToResourcePolicy(
      new PolicyStatement({
        sid: 's3-event-notifier',
        effect: Effect.ALLOW,
        actions: ['SNS:Publish'],
        resources: [dataBucketTopic.topicArn],
        principals: [new ServicePrincipal('s3.amazonaws.com')],
        conditions: {
          ArnLike: {
            'aws:SourceArn': [dataBucket.bucketArn]
          }
        }
      })
    )

    dataBucket.addEventNotification(EventType.OBJECT_CREATED_PUT, new SnsDestination(dataBucketTopic), { prefix: 'stage/' })


    // Create a role and policy to run our Glue Job
    const glueRole = new Role(this, 'glueRole', {
      roleName: 'glue-etl-role',
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
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

    // Create an IAM role to allow Snowflake to connect to S3
    const snowflakePolicy = new ManagedPolicy(this, 'snowflakePolicy', {
      managedPolicyName: `snowflake-policy`,
      statements: [
        new PolicyStatement({
          actions: [
            's3:GetObject',
            's3:GetObjectVersion',
            's3:PutObject',
            's3:ListBucket'
          ],
          resources: [
            'arn:aws:s3:::cdk-snowflake-demo-bucket',
            'arn:aws:s3:::cdk-snowflake-demo-bucket/*'
          ],
          effect: Effect.ALLOW,
        }),
      ] // don't forget to add KMS permissions if the bucket is encrypted
    });

    new Role(this, 'snowflakeRole', {
      roleName: 'snowflake-role',
      assumedBy: new ArnPrincipal('arn:aws:iam::486855810640:user/f9ts-s-aust3232'),
      managedPolicies: [ snowflakePolicy ]
    });
  }
};