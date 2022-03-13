import boto3
import random
import json
import datetime
import logging
import sys

logger = logging.getLogger('Logger')
log_level = logging.getLevelName('INFO')
logger.setLevel(log_level)
handler = logging.StreamHandler(
    sys.stdout
)  # Logging for Glue job must be redirected to stdout for it to appear in Cloudwatch logs
handler.setLevel(log_level)
formatter = logging.Formatter('%(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

bucket = 'cdk-snowflake-demo-bucket'

try:
    client = boto3.client('s3')
    output_filename='data/' + str(datetime.datetime.now().strftime('%Y/%m/%d/%I%M%S_%p'))
    output = ''

    country_list = ['Australia', 'USA', 'France', 'India', 'UK', 'Germany', 'China', 'Brazil', 'Indonesia']
    device_list = ['mobile', 'desktop', 'tablet']
    event_list = ['click', 'view']
    for i in range(0,100):
        for i in range (0,5):
            user_id = random.randint(100,999)
            id = random.randint(100000,99999999)
            time = datetime.datetime.utcnow().isoformat()
            country = random.choice(country_list)
            device = random.choice(device_list)
            event_type = random.choice(event_list)
            event = {
                'user_id': user_id,
                'id': id,
                'timestamp': time,
                'country': country,
                'device': device,
                'event_type': event_type
            }
            output += str(event)

    client.put_object(
        Body=output,
        Bucket=bucket,
        Key=output_filename
    )
    logger.info(f'Export succeeded for file {output_filename}')

except Exception as e:
    logger.error(f'Error caught: {e}')