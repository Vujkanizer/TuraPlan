# 07 – Pregled projekta

Pregled prevzetega projekta **TuraPlan**. Ocena temelji na dokumentaciji v `docs/`, kodi frontenda in backenda ter na avtomatskih testih (pytest, razdeljeni po uporabniških zgodbah v [README](../README.md#testi)).

MVP so funkcionalnosti F-01 do F-07, torej uporabniške zgodbe US-01 do US-07 ([02](02-funkcionalnosti-in-obseg.md), [05](05-uporabniske-zgodbe.md)). Podrobneje so spodaj pregledane prve štiri zgodbe disponenta in prijava (US-01 do US-05).

## Implementirane funkcionalnosti za MVP

Vse funkcionalnosti, označene kot MVP, so v kodi in imajo teste sprejemnih kriterijev.

| Oznaka | Funkcionalnost | Stanje | Kje je vidno |
|---|---|---|---|
| F-01 | Prijava in dostop glede na vlogo | implementirano | `LoginPage`, `ProtectedRoute`, JWT v `users/views.py` |
| F-02 | Seznam tur, zasedenost in napredek dostav | implementirano | `ToursPage`, `TourDetailPage`, `GET /api/tours/` |
| F-03 | Sestavljanje ture | implementirano | `NewTourPage`, `TourBuilderPage`, `tours/services.py` |
| F-04 | Preverjanje kapacitete (teža in palete) | implementirano | `TourLoad`, `tour_load()` |
| F-05 | Vrstni red postankov in opombe | implementirano | `TourBuilderPage`, `DriverNoteInput` |
| F-06 | Potrditev ture in zaklepanje | implementirano | `confirm_tour()`, gumb »Potrdi turo« |
| F-07 | Izvedba ture pri vozniku | implementirano | `MyToursPage`, `MyTourPage` |

Izven MVP so dodatno narejeni še zemljevid (US-10), geokodiranje (US-11), predlog vrstnega reda (US-12), iskanje naročila (US-08) in pot po cestah (US-16). Nista narejena pregled nerazporejenih naročil po regijah (US-09) in izkoriščenost vozil (US-13). Uporabnike in vozila administrator ureja v Django Adminu, brez opozoril iz US-14 in US-15. To je skladno z obsegom: lastne strani zanje niso del MVP.

## Ali funkcionalnosti zadoščajo uporabniškim zgodbam

Za pet pregledanih zgodb implementacija zadošča sprejemnim kriterijem. Spodaj je po en kriterij in kje je pokrit.

### US-01 – Prijava in dostop glede na vlogo

Zadošča.

1. Po prijavi `HomeRedirect` disponenta pošlje na `/tours`, voznika na `/my-tours`, administratorja pa v Django Admin.
2. Napačna e-pošta in napačno geslo vrneta isto sporočilo »Napačna e-pošta ali geslo« (`LoginSerializer`, test `test_wrong_credentials_give_same_message`).
3. `ProtectedRoute` neprijavljenega uporabnika preusmeri na `/login`.
4. Stran tuje vloge prikaže `ForbiddenPage` z naslovom »Ni dostopa«.
5. Deaktiviran uporabnik dobi 401 in se ne more prijaviti (`test_inactive_user_cannot_login`). Že izdan žeton po deaktivaciji neha veljati.

### US-02 – Seznam tur in napredek dostav

Zadošča.

1. Seznam je razvrščen po datumu odpreme. Brez izbire filtra so prikazane ture od danes naprej; filter po datumu in statusu je v vrstici nad tabelo.
2. Vrstica ture vsebuje datum, vozilo, voznika, število postankov, težo in palete glede na vozilo ter status.
3. Pri turi v dostavi `DeliveryProgress` izpiše npr. »7 / 12 dostavljeno, 1 nedostavljeno«. Enak izpis je tudi pri zaključeni turi, kar kriterij ne prepoveduje.
4. Če je vsaj en postanek nedostavljen, je ob napredku opozorilni znak.
5. Podrobnosti ture (`TourDetailPage`) za vsak postanek pokažejo rezultat, čas označitve in razlog nedostave.

### US-03 – Sestavljanje ture

Zadošča.

1. Nova tura sprejme samo aktivno vozilo in aktivnega voznika, ki na izbrani datum še nimata ture. Zasedeni v izbirnem seznamu niso na voljo.
2. Na voljo so samo naročila `NEW` in `NOT_DELIVERED`, razvrščena po roku odpreme. Filter je po regiji in po roku (do datuma ture, do 3 dni po njem, vsi roki).
3. Naročilo, prejeto šele po datumu odpreme ture, ni na seznamu za dodajanje.
4. Naročilo po roku odpreme ima opozorilo »po roku odpreme«, dodajanje pa je dovoljeno.
5. Dodano naročilo postane `PLANNED` in izgine z nerazporejenih. Odstranjeno se vrne v `NEW`.

### US-04 – Preverjanje kapacitete vozila

Zadošča.

1. `TourLoad` prikaže npr. `980 / 1.200 kg` in `3,5 / 4 pal.`.
2. Zasedenost se preračuna po dodajanju, odstranitvi in menjavi vozila (`tour_load()`).
3. Presežena teža ali palete so rdeče, pod njimi pa opozorilo, za koliko je meja presežena.
4. Vrednost, ki je točno enaka zmogljivosti, ni presežena: presežek se šteje samo, če je razlika večja od nič.
5. Osnutek s preseženo kapaciteto se shrani. Gumb »Potrdi turo« je onemogočen, dokler `confirmation_errors` ni prazen, med razlogi pa je tudi presežena kapaciteta.

### US-05 – Razvrščanje postankov in opombe

Zadošča.

1. Postanek se premakne z gumboma gor in dol ali z vlečenjem z miško. Zaporedne številke se po premiku preštevilčijo od 1 brez lukenj.
2. Opomba za voznika ima največ 300 znakov. Daljša se ne shrani; vmesnik izpiše, za koliko znakov je predolga. Enaka omejitev je na backendu (`check_note_length`).
3. Stalna opomba stranke je prikazana pri postanku. Disponent jo lahko shrani kot stalno opombo stranke.
4. Naročilo stranke, ki je že v turi, se uvrsti takoj za njen zadnji postanek.
5. Zaporedni postanki iste stranke so vizualno združeni. Če niso zaporedni, se izpiše opozorilo »Postanki iste stranke niso zaporedni« (`split_customers`).

## Sklep

MVP je v prevzetem projektu zaključen: F-01 do F-07 so implementirane in pokrite s testi. Pregledanih pet zgodb (US-01 do US-05) sprejemnim kriterijem zadošča. Vrzeli so samo pri zgodbah izven MVP (US-09, US-13 in opozorila v US-14 ter US-15).
