"""Create tables and seed fictional demo data."""
import json
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, tagline TEXT NOT NULL,
    price_label TEXT NOT NULL, features TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, location TEXT NOT NULL,
    kw REAL NOT NULL, savings INTEGER NOT NULL, image TEXT NOT NULL, quote TEXT NOT NULL,
    customer TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT NOT NULL, address TEXT NOT NULL, monthly_bill REAL NOT NULL,
    property_type TEXT NOT NULL, message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

PLANS = [
    (1, "Solar-Pacht", "Ohne Anzahlung sofort sparen", "0 € Anzahlung",
     ["Keine Anschaffungskosten", "Wartung inklusive", "25 Jahre Leistungsgarantie", "Feste Monatsrate"], 0),
    (2, "Solar-Finanzierung", "Eigene Anlage, volle Einspeisevergütung", "Ab 3,99 % eff. Jahreszins",
     ["KfW-Förderkredit möglich", "Steigert den Immobilienwert", "Laufzeit 10–20 Jahre", "Monitoring-App"], 1),
    (3, "Direktkauf", "Maximale Ersparnis über die Laufzeit", "Beste Rendite",
     ["Schnellste Amortisation (8–10 Jahre)", "0 % MwSt. auf Anlage & Speicher", "25 Jahre Garantie", "Speicher-ready"], 0),
]

PROJECTS = [
    (1, "Einfamilienhaus am Hang", "Freiburg im Breisgau", 9.6, 1640, "/images/project-1.jpg",
     "Unsere Stromrechnung ist von 190 € auf 25 € im Monat gesunken. Die Montage dauerte nur einen Tag.",
     "Familie Becker"),
    (2, "Grünblatt Kaffeerösterei", "Hamburg", 42.0, 9600, "/images/project-2.jpg",
     "Jede Röstung läuft jetzt mit Sonnenstrom. Unsere Kundschaft liebt diese Geschichte.",
     "Inhaberin, Grünblatt"),
    (3, "Hof Talblick", "Landshut, Bayern", 120.0, 28400, "/images/project-3.jpg",
     "Die Bewässerungspumpen laufen mit Sonnenenergie. Nach weniger als sieben Jahren amortisiert.",
     "Hof Talblick"),
]


def seed(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM plans").fetchone()[0] == 0:
        conn.executemany(
            "INSERT INTO plans VALUES (?, ?, ?, ?, ?, ?)",
            [(p[0], p[1], p[2], p[3], json.dumps(p[4]), p[5]) for p in PLANS],
        )
        conn.executemany("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?)", PROJECTS)
    conn.commit()
