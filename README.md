# TuraPlan

[![CI/CD](https://github.com/Vujkanizer/TuraPlan/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Vujkanizer/TuraPlan/actions/workflows/ci-cd.yml)

Spletna aplikacija za planiranje dostavnih tur distribucijskega podjetja. Disponent sestavi turo za vozilo, sistem sproti preveri, ali naročila po teži in številu palet gredo v vozilo, disponent določi vrstni red postankov in turo potrdi, voznik pa označuje opravljene dostave.

Nameščena aplikacija: [https://tura-plan.vercel.app/](https://tura-plan.vercel.app/)

## Cevovod

Ob vsakem pull requestu v `main` in ob vsakem pushu na `main` se zažene [GitHub Actions](.github/workflows/ci-cd.yml). Faze:

| Faza | Kdaj | Kaj naredi |
|---|---|---|
| `lint` | pull request in push | oxlint na frontendu in Ruff na backendu. Ob napaki faza pade. |
| `build` | pull request in push | zgradi frontend (`dist`) in pripravi paket backenda. Odvisnosti so predpomnjene, rezultat je shranjen kot artefakt. |
| `test` | pull request in push | Vitest in pytest. Poročilo o pokritosti je artefakt. Ob padlem testu pade tudi faza. |
| `deploy` | samo push na `main`, ko so lint, build in test zeleni | na Vercel postavi že zgrajen frontend, na Render pa sproži namestitev backenda. Aplikacije v tej fazi ne gradi znova. |

Veja `main` zahteva, da so `lint`, `build` in `test` zeleni, preden se pull request lahko združi.

## Uporabljene tehnologije

| Del | Tehnologije |
|---|---|
| Frontend | React, Vite, React Router, Bootstrap 5 |
| Backend | Python 3.12, Django 5, Django REST Framework |
| Podatkovna baza | SQLite |
| Avtentikacija | JWT (`djangorestframework-simplejwt`) |
| Zemljevid (izven MVP) | Leaflet + OpenStreetMap, Nominatim, OSRM (pot po cestah) |
| Testiranje | pytest-django (backend), oxlint (preverjanje kode frontenda) |

## Struktura repozitorija

```text
turaplan/
├── frontend/   React aplikacija (uporabniški vmesnik)
├── backend/    Django aplikacija z REST API-jem
└── docs/       projektna dokumentacija in arhitekturne odločitve
```

## Lokalni zagon

### Z Dockerjem

Potrebna sta [Git](https://git-scm.com/) in nameščen ter zagnan [Docker Desktop](https://www.docker.com/products/docker-desktop/). Vrata 5173 in 8000 morajo biti prosta.

1. Kloniraj repozitorij in pojdi v njegovo mapo:

   ```bash
   git clone https://github.com/n-varoscic/TuraPlan.git
   cd TuraPlan
   ```

   Če je projekt forkan, se namesto tega naslova uporabi naslov forka (`https://github.com/<uporabnisko-ime>/TuraPlan.git`).

2. Zaženi backend in frontend (prvi zagon traja nekaj minut, ker se namestijo knjižnice; tabele v bazi se ustvarijo samodejno):

   ```bash
   docker compose up --build
   ```

3. V drugem terminalu, v isti mapi, naloži testne podatke (uporabniki, vozila, stranke, naročila in ture):

   ```bash
   docker compose exec backend python manage.py seed_data
   ```

4. Odpri http://localhost:5173 in se prijavi kot disponent: `dejan.zupan@turaplan.si`, geslo `turaplan123`. Ostali testni uporabniki so v razdelku [Testni podatki](#testni-podatki).

Dodatno:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/health/
- Ustavitev: `Ctrl + C` ali `docker compose down`
- Spremembe kode se takoj uporabijo, ponovna gradnja (`--build`) je potrebna le ob novih knjižnicah
- Baza je shranjena v Docker volumnu `backend-data`, `docker compose down -v` jo izbriše
- Za zemljevid, iskanje lokacije in pot po cestah je potrebna internetna povezava; ostalo deluje tudi brez nje

### Brez Dockerja

Potrebna sta Python 3.12 in Node.js (LTS).

Backend (prvi terminal):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate         # ustvari tabele v bazi
python manage.py runserver       # http://localhost:8000
```

Frontend (drugi terminal):

```bash
cd frontend
npm install
npm run dev                      # http://localhost:5173
```

Testni podatki se nato naložijo v mapi `backend` z ukazom `python manage.py seed_data` (razdelek [Testni podatki](#testni-podatki)), prijava je na http://localhost:5173.

### Prvi uporabnik

Registracije ni, uporabnike ustvari administrator. Če so naloženi testni podatki, ta korak ni potreben, ker so uporabniki vseh vlog že med njimi. Brez testnih podatkov se prvi administrator ustvari z ukazom:

```bash
docker compose exec backend python manage.py createsuperuser   # z Dockerjem
python manage.py createsuperuser                               # brez Dockerja, v mapi backend
```

Disponenti in vozniki se nato dodajo v Django Admin (http://localhost:8000/admin/).

### Testni podatki

Ukaz izbriše obstoječe ture, naročila, stranke in vozila ter naloži testne podatke (uporabniki vseh vlog, vozila, stranke, naročila in ture v različnih statusih). Datumi tur so določeni glede na današnji dan: včeraj zaključena tura, danes tura v dostavi, jutri potrjena tura in osnutek.

Kaj je v testnih podatkih:

- **91 strank** v osmih regijah (Podravska, Pomurska, Savinjska, Osrednjeslovenska, Gorenjska, Goriška, Dolenjska, Obalno-kraška); imena so izmišljena, naslovi so resnični, koordinate so že shranjene
- **100 naročil**: manjša za kombi, večja za tovornjak in nekaj izjemno velikih; nekatere stranke imajo dve naročili
- **17 vozil**: 7 kombijev (1.200 kg, 4 paletna mesta) in 10 tovornjakov (8.000–10.000 kg, 16–18 paletnih mest); kombi `MB PR-632` ni aktiven
- **17 uporabnikov**: 1 disponent, 1 administrator in 15 voznikov
- **skladišče**: Tržaška cesta 65, 2000 Maribor
- **4 ture**, vsaka v svoji regiji: včeraj Pomurska (zaključena), danes Podravska (v dostavi), jutri Savinjska (potrjena, tovornjak) in Dolenjska (osnutek)

```bash
docker compose exec backend python manage.py seed_data   # z Dockerjem
python manage.py seed_data                               # brez Dockerja, v mapi backend
```

Testni uporabniki (geslo vseh je `turaplan123`):

| E-pošta | Vloga | Kaj je mogoče preizkusiti |
|---|---|---|
| `dejan.zupan@turaplan.si` | Disponent | seznam tur, sestavljanje, potrditev in vrnitev ture v osnutek |
| `vid.krajnc@turaplan.si` | Voznik | današnja tura v dostavi: označevanje dostav, popravek oznake in zaključek ture |
| `luka.horvat@turaplan.si` | Voznik | jutrišnja potrjena tura: gumb »Začni turo« je do datuma odpreme onemogočen |
| `maja.kovac@turaplan.si` | Voznik | včerajšnja zaključena tura |
| še 12 voznikov, npr. `nejc.potocnik@turaplan.si` | Voznik | brez tur, na voljo pri novi turi (vsi so v `seed_data.py`, seznam `USERS`) |
| `ana.novak@turaplan.si` | Administrator | Django Admin na http://localhost:8000/admin/ |

### Testi

Testi backenda preverijo poslovna pravila in sprejemne kriterije uporabniških zgodb (npr. tura s preseženo kapaciteto se ne da potrditi, voznik ne vidi tur drugih voznikov).

```bash
docker compose exec backend pytest   # z Dockerjem
pytest                               # brez Dockerja, v mapi backend
```

- Backend ima 124 testov (pytest-django), frontend avtomatskih testov nima
- Testi uporabljajo začasno bazo in ne spremenijo prave baze
- Testi ne kličejo zunanjih storitev (Nominatim, OSRM), zato ne potrebujejo interneta; zamenjava je v `backend/tours/tests/conftest.py`

| Datoteka | Testov | Kaj preverja |
|---|---|---|
| `users/tests/test_auth.py` | 8 | prijava z JWT, neaktiven uporabnik, dostop do Django Admin (US-01) |
| `users/tests/test_permissions.py` | 4 | dostop glede na vlogo: 401 brez prijave, 403 pri napačni vlogi (US-01) |
| `tours/tests/test_models.py` | 9 | palete v četrtinah, eno vozilo na datum, nastavitve, testni podatki |
| `tours/tests/test_tours_api.py` | 9 | seznam tur, filtri, podrobnosti ture (US-02) |
| `tours/tests/test_tour_builder_api.py` | 14 | nova tura, nerazporejena naročila, dodajanje in odstranjevanje (US-03) |
| `tours/tests/test_capacity_api.py` | 8 | preverjanje kapacitete in menjava vozila (US-04) |
| `tours/tests/test_stop_order_api.py` | 12 | vrstni red postankov in opombe (US-05) |
| `tours/tests/test_confirm_api.py` | 8 | potrditev ture in vrnitev v osnutek (US-06) |
| `tours/tests/test_driver_api.py` | 15 | tura voznika, oznake dostav, zaključek (US-07) |
| `tours/tests/test_order_search_api.py` | 12 | iskanje naročila (US-08) |
| `tours/tests/test_geocoding.py` | 6 | samodejna lokacija stranke (US-11) |
| `tours/tests/test_suggested_order_api.py` | 9 | predlog vrstnega reda (US-12) |
| `tours/tests/test_road_route_api.py` | 10 | pot po cestah, predlog po cestni razdalji, delovanje brez OSRM (US-16) |

Preverjanje kode frontenda:

```bash
docker compose exec frontend npm run lint   # z Dockerjem
npm run lint                                # brez Dockerja, v mapi frontend
```

## Okoljske spremenljivke

Nastavitve, ki se razlikujejo med lokalnim razvojem in strežnikom, se preberejo iz okoljskih spremenljivk. Za lokalni zagon ni treba nastaviti ničesar, privzete vrednosti so za razvoj.

| Spremenljivka | Del | Privzeta vrednost | Pomen |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | backend | ključ samo za lokalni razvoj | skrivni ključ Djanga (podpis JWT žetonov); na strežniku obvezno svoj, shranjen kot skrivnost |
| `DJANGO_DEBUG` | backend | `1` | `1` = razvojni način, `0` = produkcija |
| `DJANGO_ALLOWED_HOSTS` | backend | `localhost,127.0.0.1` | naslovi backenda, ločeni z vejico (npr. `turaplan-api.example.com`); upošteva se samo pri `DJANGO_DEBUG=0` |
| `DJANGO_CORS_ORIGINS` | backend | `http://localhost:5173,http://127.0.0.1:5173` | naslovi frontenda, ki smejo klicati API, ločeni z vejico, brez `/` na koncu |
| `DJANGO_DB_PATH` | backend | `backend/db.sqlite3` | pot do datoteke SQLite baze (z Dockerjem `/data/db.sqlite3`) |
| `VITE_API_URL` | frontend | `http://<naslov strani>:8000/api` | naslov API-ja (npr. `https://turaplan-api.example.com/api`); nastavi se že pri `npm run build` |

## Opombe za namestitev na strežnik

Projekt je zaenkrat pripravljen za lokalni zagon. Pri namestitvi na strežnik je treba upoštevati:

- `DJANGO_DEBUG` je privzeto `1`, zato mora biti na strežniku nastavljen na `0`; sicer so podrobnosti napak vidne vsem in backend sprejme zahteve za kateri koli naslov
- `python manage.py runserver` (tudi v `backend/Dockerfile`) je samo za razvoj; na strežniku je potreben produkcijski strežnik, npr. gunicorn, ki še ni v `requirements.txt`
- Pri `DJANGO_DEBUG=0` Django ne streže statičnih datotek, zato je Django Admin brez oblikovanja, dokler to ni urejeno (npr. `collectstatic` in whitenoise)
- SQLite baza je ena datoteka: na storitvi brez trajnega diska se ob vsaki namestitvi izbriše, zato je ob zagonu treba pognati `python manage.py migrate` in po potrebi `python manage.py seed_data`; pri trajnem disku se pot do baze nastavi z `DJANGO_DB_PATH`
- `seed_data` izbriše obstoječe ture, naročila, stranke in vozila, zato ni primeren za vsak zagon, če baza ostaja ohranjena
- Frontend je po `npm run build` navadna statična stran v mapi `frontend/dist/`; ker poti ureja React Router, mora gostovanje vse poti (npr. `/tours/5`) preusmeriti na `index.html`, sicer osvežitev podstrani vrne 404
- `DJANGO_CORS_ORIGINS` mora vsebovati točen naslov nameščenega frontenda (z `https://`), `VITE_API_URL` pa naslov nameščenega backenda s `/api` na koncu

## Dokumentacija

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)
7. [Arhitekturne odločitve (ADR)](docs/adr/)
