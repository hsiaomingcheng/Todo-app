"""Implements simple PostgreSQL database connectivity for a FastAPI web app.

This approach uses FastAPI's dependency injection system and lifespan context
manager to manage database connections per request.

Usage:
------
When initialising your FastAPI application, call `init_db` passing in your
database connection details, and include the lifespan handler:
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db('username', 'password', 'host', 'database', port)
    yield

app = FastAPI(lifespan=lifespan)
```

Then, in your route handlers, inject a database connection or cursor using
FastAPI's `Depends`:
```python
from fastapi import Depends
import db

@app.get("/example")
def example_route(conn = Depends(db.get_db)):
    # Use conn directly...

@app.get("/example2")
def example_route2(cursor = Depends(db.get_cursor)):
    # Use cursor directly...
```

The connection and cursor are automatically closed after each request.

References:
-----------
    [1] https://fastapi.tiangolo.com/tutorial/dependencies/
    [2] https://www.psycopg.org/docs/
"""

import psycopg2
import psycopg2.extras
from typing import Generator

# Database connection parameters (set when calling `init_db`).
connection_params: dict = {}


def init_db(user: str, password: str, host: str, database: str,
            port: int = 5432, autocommit: bool = True):
    """Sets up PostgreSQL connection parameters for the FastAPI app.

    This must be called once while initialising your FastAPI app, before any
    requests are handled (e.g. inside a lifespan handler).

    Args:
        user: Username used to connect to the PostgreSQL server.
        password: Password used to connect to the PostgreSQL server.
        host: Host name or IP address of the PostgreSQL server.
        database: Name of the database to connect to on the PostgreSQL server.
        port: Port used to connect to the PostgreSQL server (default `5432`).
        autocommit: Whether or not to enable auto-commit (default `True`).
    """
    connection_params['user'] = user
    connection_params['password'] = password
    connection_params['host'] = host
    connection_params['database'] = database
    connection_params['port'] = port
    connection_params['autocommit'] = autocommit


def get_db() -> Generator:
    """Dependency that provides a PostgreSQL connection for a single request.

    Yields a psycopg2 `Connection` instance, then closes it automatically
    when the request is complete.

    Yields:
        A psycopg2 `Connection` instance.

    Example:
        @app.get("/example")
        def route(conn = Depends(get_db)):
            ...
    """
    conn = psycopg2.connect(
        user=connection_params['user'],
        password=connection_params['password'],
        host=connection_params['host'],
        dbname=connection_params['database'],
        port=connection_params['port']
    )
    conn.autocommit = connection_params.get('autocommit', True)
    try:
        yield conn
    finally:
        conn.close()


def get_cursor() -> Generator:
    """Dependency that provides a PostgreSQL RealDictCursor for a single request.

    Rows returned by this cursor are accessible by column name (like a dict).
    The cursor and its underlying connection are closed automatically when the
    request is complete.

    Yields:
        A `psycopg2.extras.RealDictCursor` instance.

    Example:
        @app.get("/example")
        def route(cursor = Depends(get_cursor)):
            ...
    """
    conn = psycopg2.connect(
        user=connection_params['user'],
        password=connection_params['password'],
        host=connection_params['host'],
        dbname=connection_params['database'],
        port=connection_params['port']
    )
    conn.autocommit = connection_params.get('autocommit', True)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        yield cursor
    finally:
        cursor.close()
        conn.close()