"""FastAPI application factory."""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .db import get_connection
from .responses import fail, ok
from .routers import site
from .security import BodySizeLimitMiddleware, SecurityHeadersMiddleware, limiter
from .schemas import FIELD_LABELS
from .seed import seed

logger = logging.getLogger("demo")

HTTP_MESSAGES = {
    404: "Nicht gefunden.",
    405: "Methode nicht erlaubt.",
}


def _german_number(value: object) -> object:
    """Render 20.0 as 20 and 2.5 as 2,5 for German error messages."""
    if isinstance(value, float):
        return int(value) if value.is_integer() else str(value).replace(".", ",")
    return value


def _german_message(err: dict) -> str:
    """Translate Pydantic error types into German, user-facing messages."""
    ctx = err.get("ctx") or {}
    kind = err.get("type", "")
    templates = {
        "missing": "ist ein Pflichtfeld",
        "greater_than_equal": "muss mindestens {ge} sein",
        "less_than_equal": "darf höchstens {le} sein",
        "string_too_short": "muss mindestens {min_length} Zeichen lang sein",
        "string_too_long": "darf höchstens {max_length} Zeichen lang sein",
        "literal_error": "enthält einen ungültigen Wert",
        "extra_forbidden": "ist kein erlaubtes Feld",
        "float_parsing": "muss eine Zahl sein",
        "json_invalid": "ungültiges JSON",
    }
    if kind in templates:
        return templates[kind].format(**{k: _german_number(v) for k, v in ctx.items()})
    msg = str(err.get("msg", "ungültiger Wert"))
    if "email" in msg.lower():
        return "muss eine gültige E-Mail-Adresse sein"
    return msg.removeprefix("Value error, ")


def _format_validation(exc: RequestValidationError) -> str:
    messages = []
    for err in exc.errors():
        key = ".".join(str(p) for p in err.get("loc", ()) if p not in ("body", "query"))
        field = FIELD_LABELS.get(key, key)
        msg = _german_message(err)
        messages.append(f"{field}: {msg}" if field else msg)
    return "; ".join(messages) or "Ungültige Anfrage."


def create_app() -> FastAPI:
    app = FastAPI(title=f"{settings.site_name} API", version="1.0.0")
    app.state.limiter = limiter

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(BodySizeLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.exception_handler(RequestValidationError)
    async def on_validation(_: Request, exc: RequestValidationError):
        return JSONResponse(fail(_format_validation(exc)), status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def on_rate_limit(_: Request, __: RateLimitExceeded):
        return JSONResponse(fail("Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal."), status_code=429)

    @app.exception_handler(StarletteHTTPException)
    async def on_http(_: Request, exc: StarletteHTTPException):
        detail = HTTP_MESSAGES.get(exc.status_code) or (
            exc.detail if isinstance(exc.detail, str) else "Die Anfrage ist fehlgeschlagen."
        )
        return JSONResponse(fail(detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def on_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path, exc_info=exc)
        return JSONResponse(fail("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."), status_code=500)

    @app.get("/api/health")
    def health():
        return ok({"status": "ok", "site": settings.site_name})

    app.include_router(site.router, prefix="/api")
    seed(get_connection())
    return app


app = create_app()
