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


# if __name__ == "__main__":
#   print("Walking directory to execute SQL")
#   for path, dirs, files in os.walk('ddl', topdown=True):
#     dirs[:] = [dir for dir in dirs]
#     files[:] = [file for file in files if os.path.splitext(file)[-1] == '.sql']
#     print(dirs.sort())

#     dirs[:] = [dir for dir in dirs].sort()
#     files[:] = [file for file in files if os.path.splitext(file)[-1] == '.sql']
#     print("Processing Path: {}, Dirs: {}, Files: {} ".format(path, dirs, files))
#     for file in files:
#       print("Deploying {}".format(file))
#       with open(os.path.join(path, file), "r") as f:
#         sql = f.read()
#         execute_sql(sql)

def deploy_ddl():
  main_dir = 'ddl/'
  dirnames=sorted(os.listdir(main_dir))
  for dir in dirnames:
    dirname = os.path.join(main_dir, dir)
    for filename in os.listdir(dirname):
      with open(os.path.join(dirname, filename), "r") as f:
        print("Deploying {}".format(filename))
        execute_sql(sql=f.read(),return_results=False)


  # for path, dirs, files in os.walk('ddl', topdown=True):
  #   dirs[:] = [dir for dir in dirs if dir]
  #   files[:] = [
  #     file
  #     for file in files
  #     if os.path.splitext(file)[-1]
  #     == '.sql'
  #   ]
  #   print('dirs', dirs)
  #   print('files', files)
  #   for file in files:
  #     print('file', file)
    # for file in files:
    #     logging.info(f"Deploying {file}")
    #     with open(os.path.join(path, file), "r") as f:
    #         helper.execute_sql(sql=f.read(),return_results=False)

if __name__ =="__main__":


  # ddl_dirs = config.SNOWFLAKE_DDL_CONFIG["DDL_FILE_PATH"]
  # ddl_dirs_exclusion = config.SNOWFLAKE_DDL_CONFIG["DDL_EXCLUDED_FOLDERS"]

    deploy_ddl()