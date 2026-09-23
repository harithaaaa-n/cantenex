import os
import sqlite3
from contextlib import contextmanager
from typing import Generator, Any, Dict, List, Tuple
from backend.config import DATABASE_URL

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE_DB_PATH = os.path.join(BASE_DIR, "cantenex.db")
SQLITE_SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")
PG_SCHEMA_PATH = os.path.join(BASE_DIR, "schema_postgres.sql")

def is_postgres() -> bool:
    return bool(DATABASE_URL and ("postgres" in DATABASE_URL or "postgresql" in DATABASE_URL))

def get_normalized_pg_url() -> str:
    if DATABASE_URL.startswith("postgres://"):
        return DATABASE_URL.replace("postgres://", "postgresql://", 1)
    return DATABASE_URL

class DBConnection:
    def __init__(self, raw_conn, is_pg: bool):
        self.raw_conn = raw_conn
        self.is_pg = is_pg

    def cursor(self):
        if self.is_pg:
            import psycopg2.extras
            return self.raw_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        else:
            return self.raw_conn.cursor()

    def commit(self):
        self.raw_conn.commit()

    def rollback(self):
        self.raw_conn.rollback()

    def close(self):
        self.raw_conn.close()

_db_initialized = False

@contextmanager
def get_db() -> Generator[DBConnection, None, None]:
    global _db_initialized
    if not _db_initialized:
        init_db()
        _db_initialized = True

    if is_postgres():
        import psycopg2
        conn = psycopg2.connect(get_normalized_pg_url())
        db_conn = DBConnection(conn, is_pg=True)
    else:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        db_conn = DBConnection(conn, is_pg=False)
    
    try:
        yield db_conn
    finally:
        db_conn.close()

def init_db() -> bool:
    """Idempotently initializes schema and seed data."""
    try:
        if is_postgres():
            import psycopg2
            if not os.path.exists(PG_SCHEMA_PATH):
                print(f"Warning: PostgreSQL schema not found at {PG_SCHEMA_PATH}")
                return False
            with open(PG_SCHEMA_PATH, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            conn = psycopg2.connect(get_normalized_pg_url())
            with conn:
                with conn.cursor() as cur:
                    cur.execute(schema_sql)
            conn.close()
            print("✓ PostgreSQL database initialized with idempotent schema & 36 menu items.")
            return True
        else:
            if not os.path.exists(SQLITE_SCHEMA_PATH):
                print(f"Warning: SQLite schema not found at {SQLITE_SCHEMA_PATH}")
                return False
            with open(SQLITE_SCHEMA_PATH, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            conn = sqlite3.connect(SQLITE_DB_PATH)
            with conn:
                conn.executescript(schema_sql)
            conn.close()
            print(f"✓ SQLite database initialized at {SQLITE_DB_PATH}")
            return True
    except Exception as e:
        print(f"Database initialization error: {e}")
        return False
