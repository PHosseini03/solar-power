import sqlite3

import pytest
from fastapi.testclient import TestClient

from app import db
from app.main import create_app
from app.security import limiter


@pytest.fixture()
def client():
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    db.use_connection(conn)
    limiter.reset()
    with TestClient(create_app()) as test_client:
        yield test_client
    conn.close()
