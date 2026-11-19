"""Consistent API envelope: {success, data, error}."""
from typing import Any


def ok(data: Any) -> dict[str, Any]:
    return {"success": True, "data": data, "error": None}


def fail(message: str) -> dict[str, Any]:
    return {"success": False, "data": None, "error": message}
