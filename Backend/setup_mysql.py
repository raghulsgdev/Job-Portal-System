import os
import pymysql
import re

MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "raghulsgdev@20")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3306"))
MYSQL_DB = os.getenv("MYSQL_DB", "job_portal")

print(f"Connecting to MySQL server at {MYSQL_HOST}:{MYSQL_PORT} as {MYSQL_USER}...")

try:
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        port=MYSQL_PORT,
        autocommit=True
    )
    with conn.cursor() as cursor:
        print(f"Creating database '{MYSQL_DB}' if not exists...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.close()

    db_conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        port=MYSQL_PORT,
        database=MYSQL_DB,
        autocommit=True
    )

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")
    schema_path = os.path.join(sql_dir, "schema.sql")
    sample_path = os.path.join(sql_dir, "sample_data.sql")

    def execute_sql_script(filepath, connection):
        with open(filepath, "r", encoding="utf-8") as f:
            sql_text = f.read()

        # Remove single line comments
        lines = []
        for line in sql_text.splitlines():
            line_str = line.strip()
            if line_str.startswith("--") or line_str.startswith("#"):
                continue
            lines.append(line)
        cleaned_sql = "\n".join(lines)

        # Split into statements by semicolon
        statements = [s.strip() for s in cleaned_sql.split(";") if s.strip()]

        with connection.cursor() as cursor:
            for i, stmt in enumerate(statements):
                try:
                    cursor.execute(stmt)
                except Exception as err:
                    print(f"Error on stmt {i+1}: {err}\nSQL: {stmt[:100]}...\n")

    print("Executing schema.sql...")
    execute_sql_script(schema_path, db_conn)

    print("Executing sample_data.sql...")
    execute_sql_script(sample_path, db_conn)

    with db_conn.cursor() as cursor:
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(f"Tables successfully created in '{MYSQL_DB}': {[t[0] for t in tables]}")

        for t in tables:
            tbl_name = t[0]
            cursor.execute(f"SELECT COUNT(*) FROM `{tbl_name}`;")
            cnt = cursor.fetchone()[0]
            print(f"  - Table {tbl_name}: {cnt} rows")

    db_conn.close()
    print("MySQL database setup complete!")

except Exception as e:
    print(f"ERROR setting up MySQL database: {e}")
