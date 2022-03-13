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
    for i in range(0,100):
        for i in range (0,5):
            user_id = random.randint(100,999)
            transaction_id = random.randint(100000,99999999)
            transaction_amount = str(random.randint(1,10000))
            transaction_time = datetime.datetime.utcnow().isoformat()
            transaction_country = random.choice(country_list)
            transaction_device = random.choice(device_list)
            event = {
                'user_id': user_id,
                'transaction_id': transaction_id,
                'transaction_amount': transaction_amount,
                'transaction_time': transaction_time,
                'transaction_country': transaction_country,
                'transaction_device': transaction_device
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