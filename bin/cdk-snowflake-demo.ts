#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSnowflakeDemoStack } from '../lib/cdk-snowflake-demo-stack';

const app = new cdk.App();
new CdkSnowflakeDemoStack(app, 'CdkSnowflakeDemoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});