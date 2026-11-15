# Frontend

React aplikacija (uporabniški vmesnik za disponenta in voznika).

- Tehnologije: React, Vite, React Router, Bootstrap 5, Leaflet
- Arhitektura: [04 – Arhitektura in tehnološki sklad](../docs/04-arhitektura-in-tehnoloski-sklad.md)
- Zagon z Dockerjem in testni podatki: glavni [README](../README.md)

## Struktura

| Mapa | Vsebina |
|---|---|
| `src/pages/` | ena komponenta za vsako stran |
| `src/components/` | ponovno uporabni deli vmesnika |
| `src/api/` | vsi klici na backend |
| `src/auth/` | prijavljeni uporabnik (`AuthProvider`, `useAuth`) in vloge |

## Ukazi

```bash
npm install
npm run dev        # razvojni strežnik, http://localhost:5173
npm run lint       # preverjanje kode z oxlint (nastavitve v .oxlintrc.json)
npm run build      # zgradi aplikacijo v mapo dist/
npm run preview    # lokalno prikaže zgrajeno aplikacijo iz dist/
```

## Naslov backenda

- Privzeto frontend kliče backend na istem računalniku: `http://<naslov strani>:8000/api`
- Drug naslov se nastavi z okoljsko spremenljivko `VITE_API_URL`, npr. `VITE_API_URL=https://turaplan-api.example.com/api`
- Vite vrednost vpiše v kodo ob `npm run build`, zato mora biti nastavljena že pri gradnji

## Testi

- Frontend zaenkrat nima avtomatskih testov, kodo preverja samo `npm run lint`
