import os
import snowflake.connector
from dotenv import load_dotenv
load_dotenv()

def establish_connection():
  try:
    conn = snowflake.connector.connect(
      user=os.getenv("SF_USER"),
      password=os.getenv("SF_PWD"),
      account=os.getenv("SF_ACCOUNT"),
      database=os.getenv("SF_DATABASE"),
      warehouse=os.getenv("SF_WAREHOUSE"),
    )
    return conn
  except Exception as e:
    raise Exception(
      "Error connecting to Database : {} Error : {}".format(
          os.getenv("SF_DATABASE"), e
      )
    )

def execute_sql(sql, return_results=False):
  conn = establish_connection()
  try:
    cur = conn.cursor()
    cur.execute(sql)
    # print("SQL executed successfully: \n{}".format(sql))
    if return_results is True:
      result = cur.fetchall()
      return result

  except Exception as e:
    raise Exception("Error running sql {} {}".format(sql, e))
  finally:
      conn.close()


if __name__ =="__main__":
  main_dir = 'src/snowflake_scripts/ddl/'
  dirnames=sorted(os.listdir(main_dir))
  for dir in dirnames:
    dirname = os.path.join(main_dir, dir)
    for filename in sorted(os.listdir(dirname)):
      with open(os.path.join(dirname, filename), "r") as f:
        print("Deploying {}".format(filename))
        execute_sql(sql=f.read(),return_results=False)
