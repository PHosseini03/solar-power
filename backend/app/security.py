"""Security middleware: headers, body-size limit, rate limiter."""
from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .responses import fail

limiter = Limiter(key_func=get_remote_address)

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Cross-Origin-Resource-Policy": "same-site",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        is_docs = request.url.path in ("/docs", "/redoc", "/openapi.json")
        for name, value in SECURITY_HEADERS.items():
            if is_docs and name == "Content-Security-Policy":
                continue
            response.headers[name] = value
        return response


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        length = request.headers.get("content-length")
        if length is not None:
            try:
                too_big = int(length) > settings.max_body_bytes
            except ValueError:
                return JSONResponse(fail("Ungültiger Content-Length-Header."), status_code=400)
            if too_big:
                return JSONResponse(fail("Die Anfrage ist zu groß."), status_code=413)
        return await call_next(request)
