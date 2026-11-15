# Backend

Django aplikacija z REST API-jem (poslovna pravila, prijava, dostop do podatkovne baze).

- Tehnologije: Python 3.12, Django 5, Django REST Framework, SQLite, JWT
- Arhitektura: [04 – Arhitektura in tehnološki sklad](../docs/04-arhitektura-in-tehnoloski-sklad.md)
- Zagon z Dockerjem, testni podatki in okoljske spremenljivke: glavni [README](../README.md)

## Struktura

| Mapa ali datoteka | Vsebina |
|---|---|
| `turaplan/` | nastavitve projekta (`settings.py`) in glavne poti (`urls.py`) |
| `users/` | uporabnik z vlogo, prijava z JWT, pravice dostopa (`permissions.py`) |
| `tours/` | stranke, vozila, naročila, ture in postanki |
| `tours/services.py` | poslovna pravila (kapaciteta, prehodi statusov, lokacija, pot po cestah) |
| `tours/management/commands/seed_data.py` | ukaz za nalaganje testnih podatkov |
| `users/tests/`, `tours/tests/` | testi (pytest-django) |

## Zagon brez Dockerja

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate         # ustvari tabele v bazi
python manage.py seed_data       # testni podatki
python manage.py runserver       # http://localhost:8000
```

## Testi

```bash
pytest
```

- Testi uporabljajo začasno bazo, prave baze ne spremenijo
- Testi ne kličejo zunanjih storitev (Nominatim, OSRM), zato ne potrebujejo interneta (`tours/tests/conftest.py`)
