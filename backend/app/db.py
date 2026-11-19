"""Tiny SQLite layer. All queries are parameterized."""
import sqlite3
import threading
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from .config import settings


def _connect(path: str) -> sqlite3.Connection:
    if path != ":memory:":
        Path(path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


_state: dict[str, sqlite3.Connection] = {}


def get_connection() -> sqlite3.Connection:
    if "conn" not in _state:
        _state["conn"] = _connect(settings.database_path)
    return _state["conn"]


def use_connection(conn: sqlite3.Connection) -> None:
    """Swap the active connection (used by tests)."""
    _state["conn"] = conn


# One shared connection is used from FastAPI's threadpool, so serialize access.
_lock = threading.RLock()


@contextmanager
def transaction() -> Iterator[sqlite3.Connection]:
    with _lock:
        conn = get_connection()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise


def fetch_all(sql: str, params: tuple = ()) -> list[dict]:
    with _lock:
        rows = get_connection().execute(sql, params).fetchall()
    return [dict(row) for row in rows]


def insert(sql: str, params: tuple) -> int:
    with transaction() as conn:
        cursor = conn.execute(sql, params)
        return int(cursor.lastrowid or 0)
