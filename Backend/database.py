import mysql.connector
from config import settings

def get_connection():
    """Establishes and returns a raw MySQL database connection."""
    return mysql.connector.connect(
        host=settings.MYSQL_HOST,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        database=settings.MYSQL_DB,
        port=int(settings.MYSQL_PORT)
    )

def fetch_one(query: str, args=tuple()):
    """Executes a SELECT query and returns a single dictionary record or None."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, args)
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

def fetch_all(query: str, args=tuple()):
    """Executes a SELECT query and returns a list of dictionary records."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, args)
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

def execute_query(query: str, args=tuple()):
    """
    Executes an INSERT, UPDATE, or DELETE SQL query.
    Returns lastrowid for INSERT queries, or rowcount for UPDATE/DELETE queries.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, args)
        conn.commit()
        if query.strip().upper().startswith("INSERT"):
            return cursor.lastrowid
        return cursor.rowcount
    finally:
        cursor.close()
        conn.close()