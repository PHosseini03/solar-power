"""Reusable field validators."""
import re

PHONE_RE = re.compile(r"^\+?[0-9 ()\-.]{7,20}$")
NAME_RE = re.compile(r"^[^\x00-\x1f<>]{2,80}$")


def clean_text(value: str) -> str:
    """Trim and collapse whitespace; reject control characters and angle brackets."""
    collapsed = " ".join(value.split())
    if any(ord(ch) < 32 for ch in collapsed) or "<" in collapsed or ">" in collapsed:
        raise ValueError("enthält ungültige Zeichen")
    return collapsed


def check_name(value: str) -> str:
    value = clean_text(value)
    if not NAME_RE.match(value):
        raise ValueError("muss 2–80 Zeichen lang sein")
    return value


def check_phone(value: str) -> str:
    value = value.strip()
    if not PHONE_RE.match(value):
        raise ValueError("muss eine gültige Telefonnummer sein")
    return value
