"""Solar-specific endpoints."""
import json
import math

from fastapi import APIRouter, Request

from ..config import settings
from ..db import fetch_all, insert
from ..responses import ok
from ..schemas import QuoteRequest, SavingsRequest
from ..security import limiter

router = APIRouter()

PANEL_WATTS = 400
COST_PER_WATT = 1.60  # EUR per watt, turnkey incl. 0 % MwSt.
SUBSIDY = 0.0  # no direct subsidy; financing via KfW instead
PRICE_PER_KWH = 0.35  # EUR, average German household tariff
CO2_KG_PER_KWH = 0.38  # German grid mix
SYSTEM_EFFICIENCY = 0.8
BILL_OFFSET = 0.75  # self-consumption plus feed-in tariff (Einspeisevergütung)
LIFETIME_YEARS = 25
RATE_ESCALATION = 1.12
MIN_PANELS = 4
ROOF_FACTOR = {"asphalt": 1.0, "metal": 1.02, "tile": 0.97, "flat": 0.95}


def estimate_savings(req: SavingsRequest) -> dict:
    monthly_kwh = req.monthly_bill / PRICE_PER_KWH
    daily_kwh = monthly_kwh / 30
    raw_kw = daily_kwh / (req.sun_hours * SYSTEM_EFFICIENCY * ROOF_FACTOR[req.roof_type])
    panels = max(MIN_PANELS, math.ceil(raw_kw * 1000 / PANEL_WATTS))
    system_kw = panels * PANEL_WATTS / 1000
    net_cost = system_kw * 1000 * COST_PER_WATT * (1 - SUBSIDY)
    annual_savings = req.monthly_bill * 12 * BILL_OFFSET
    return {
        "panels": panels,
        "system_kw": round(system_kw, 1),
        "net_cost": round(net_cost),
        "annual_savings": round(annual_savings),
        "payback_years": round(net_cost / annual_savings, 1),
        "lifetime_savings": round(annual_savings * LIFETIME_YEARS * RATE_ESCALATION - net_cost),
        "co2_tons_per_year": round(monthly_kwh * 12 * CO2_KG_PER_KWH / 1000, 1),
    }


@router.get("/plans")
def list_plans():
    rows = fetch_all("SELECT * FROM plans ORDER BY id")
    return ok([{**r, "features": json.loads(r["features"]), "featured": bool(r["featured"])} for r in rows])


@router.get("/projects")
def list_projects():
    return ok(fetch_all("SELECT * FROM projects ORDER BY id"))


@router.get("/stats")
def stats():
    return ok({"homes_powered": 12480, "mw_installed": 186, "tons_co2_saved": 94200, "rating": 4.9})


@router.post("/savings/estimate")
@limiter.limit("120/minute")
def savings(request: Request, body: SavingsRequest):
    return ok(estimate_savings(body))


@router.post("/quotes", status_code=201)
@limiter.limit(settings.rate_limit)
def create_quote(request: Request, body: QuoteRequest):
    quote_id = insert(
        "INSERT INTO quotes (name, email, phone, address, monthly_bill, property_type, message)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.name, str(body.email), body.phone, body.address, body.monthly_bill,
         body.property_type, body.message),
    )
    first = body.name.split()[0]
    return ok({"id": quote_id, "message": f"Danke, {first}! Eine Solarberaterin oder ein Solarberater ruft Sie innerhalb von 24 Stunden an."})
