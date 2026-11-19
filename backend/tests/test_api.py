VALID_QUOTE = {
    "name": "Jonas Weber",
    "email": "jonas@example.com",
    "phone": "+49 89 1234 5678",
    "address": "Sonnenstraße 12, 80331 München",
    "monthly_bill": 180,
    "property_type": "home",
    "message": "Ich interessiere mich auch für einen Batteriespeicher.",
}


def test_health_returns_envelope(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"success": True, "data": {"status": "ok", "site": "HelioGrid Solar"}, "error": None}


def test_security_headers_present(client):
    res = client.get("/api/health")
    assert res.headers["x-content-type-options"] == "nosniff"
    assert res.headers["x-frame-options"] == "DENY"
    assert "default-src 'none'" in res.headers["content-security-policy"]


def test_cors_allows_only_configured_origin(client):
    allowed = client.get("/api/health", headers={"Origin": "http://localhost:5171"})
    blocked = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:5171"
    assert "access-control-allow-origin" not in blocked.headers


def test_plans_have_parsed_features(client):
    data = client.get("/api/plans").json()["data"]
    assert len(data) == 3
    assert isinstance(data[0]["features"], list)
    assert sum(p["featured"] for p in data) == 1


def test_projects_and_stats(client):
    assert len(client.get("/api/projects").json()["data"]) == 3
    assert client.get("/api/stats").json()["data"]["rating"] == 4.9


def test_savings_estimate_scales_with_bill(client):
    small = client.post("/api/savings/estimate", json={"monthly_bill": 80}).json()["data"]
    large = client.post("/api/savings/estimate", json={"monthly_bill": 400}).json()["data"]
    assert large["panels"] > small["panels"]
    assert large["annual_savings"] > small["annual_savings"]
    assert small["payback_years"] > 0


def test_savings_minimum_panels(client):
    data = client.post("/api/savings/estimate", json={"monthly_bill": 20, "sun_hours": 8}).json()["data"]
    assert data["panels"] == 4


def test_savings_rejects_out_of_range(client):
    res = client.post("/api/savings/estimate", json={"monthly_bill": 5})
    assert res.status_code == 422
    assert res.json()["success"] is False
    assert "Monatliche Stromkosten: muss mindestens 20 sein" in res.json()["error"]


def test_create_quote_success(client):
    res = client.post("/api/quotes", json=VALID_QUOTE)
    assert res.status_code == 201
    body = res.json()
    assert body["success"] is True
    assert body["data"]["id"] == 1
    assert "Jonas" in body["data"]["message"]
    assert "24 Stunden" in body["data"]["message"]


def test_quote_rejects_bad_email(client):
    res = client.post("/api/quotes", json={**VALID_QUOTE, "email": "not-an-email"})
    assert res.status_code == 422
    assert "E-Mail: muss eine gültige E-Mail-Adresse sein" in res.json()["error"]


def test_quote_rejects_html_injection(client):
    res = client.post("/api/quotes", json={**VALID_QUOTE, "name": "<script>alert(1)</script>"})
    assert res.status_code == 422


def test_quote_rejects_unknown_fields(client):
    res = client.post("/api/quotes", json={**VALID_QUOTE, "is_admin": True})
    assert res.status_code == 422


def test_quote_rejects_bad_phone(client):
    res = client.post("/api/quotes", json={**VALID_QUOTE, "phone": "call me maybe"})
    assert res.status_code == 422


def test_sql_injection_is_stored_as_text(client):
    payload = {**VALID_QUOTE, "message": "'); DROP TABLE quotes; --"}
    assert client.post("/api/quotes", json=payload).status_code == 201
    assert client.post("/api/quotes", json=VALID_QUOTE).json()["data"]["id"] == 2


def test_body_too_large_rejected(client):
    res = client.post("/api/quotes", content=b"x" * 20000, headers={"Content-Type": "application/json"})
    assert res.status_code == 413


def test_invalid_content_length_rejected(client):
    res = client.post("/api/quotes", content=b"{}", headers={"Content-Type": "application/json", "Content-Length": "abc"})
    assert res.status_code in (400, 422)


def test_rate_limit_on_quotes(client):
    codes = [client.post("/api/quotes", json=VALID_QUOTE).status_code for _ in range(12)]
    assert 429 in codes
    last = client.post("/api/quotes", json=VALID_QUOTE).json()
    assert last["success"] is False and "Zu viele Anfragen" in last["error"]


def test_unknown_route_uses_envelope(client):
    res = client.get("/api/nope")
    assert res.status_code == 404
    assert res.json() == {"success": False, "data": None, "error": "Nicht gefunden."}


def test_validation_messages_are_german(client):
    res = client.post("/api/quotes", json={k: v for k, v in VALID_QUOTE.items() if k != "address"})
    assert res.status_code == 422
    assert "Adresse: ist ein Pflichtfeld" in res.json()["error"]
    bad = client.post("/api/quotes", json={**VALID_QUOTE, "property_type": "castle", "is_admin": 1})
    sun = client.post("/api/savings/estimate", json={"monthly_bill": 100, "sun_hours": 1.5})
    assert "Sonnenstunden: muss mindestens 2 sein" in sun.json()["error"]
    long = client.post("/api/quotes", json={**VALID_QUOTE, "message": "x" * 1001})
    assert "Nachricht: darf höchstens 1000 Zeichen lang sein" in long.json()["error"]
    assert "Objektart: enthält einen ungültigen Wert" in bad.json()["error"]
    assert "is_admin: ist kein erlaubtes Feld" in bad.json()["error"]


def test_savings_uses_german_defaults(client):
    data = client.post("/api/savings/estimate", json={"monthly_bill": 100}).json()["data"]
    assert data == {
        "panels": 10, "system_kw": 4.0, "net_cost": 6400, "annual_savings": 900,
        "payback_years": 7.1, "lifetime_savings": 18800, "co2_tons_per_year": 1.3,
    }


def test_seed_data_is_german(client):
    plans = client.get("/api/plans").json()["data"]
    assert plans[0]["price_label"] == "0 € Anzahlung"
    assert client.get("/api/projects").json()["data"][1]["location"] == "Hamburg"
