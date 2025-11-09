# Dusza

Egyszerű, könnyen áttekinthető projekt README. A Dusza egy kis eszköz (CLI/skript), amely célja X feladat automatizálása és Y feldolgozása — helyettesítsd az X/Y részeket a projekt konkrét céljával.

## Tartalom
- Leírás
- Telepítés
- Használat
- Konfiguráció
- Hibajelentés és hozzájárulás
- Licenc
- Kapcsolat

## Leírás
A Dusza célja: röviden megoldani a következő problémát vagy nyújtani a következő funkciót:
- bemenet feldolgozása (pl. fájlok, API adat)
- egyszerű parancssori interfész gyakori feladatokhoz
- könnyű konfigurálhatóság YAML/.env fájlokkal

Adj meg itt egy-két mondatban pontosabb leírást a projekt funkciójáról és céljáról.

## Telepítés
1. Tároló klónozása:
   git clone <tároló-url>
2. Mappába lépés:
   cd Dusza
3. Virtuális környezet (ajánlott, Python példa):
   python -m venv .venv
   .venv\Scripts\activate  (Windows)
4. Függőségek telepítése:
   pip install -r requirements.txt
   (Ha Node.js projekt: npm install)

## Használat
Példák parancsokra és rövid leírásuk:


## Konfiguráció
Konfiguráció fájlok:
- config.yaml — fő beállítások (pl. bemenet, kimenet, módok)
- .env — érzékeny adatok (API kulcsok, jelszavak)

Példa config.yaml:
```yaml
input: "data/input.txt"
output: "data/output.txt"
mode: "fast" # vagy "safe"
log_level: "info"
```

Fontos .env kulcsok (példa):
- API_KEY=your_api_key_here
- DB_URI=sqlite:///data/db.sqlite

## Hibajelentés és hozzájárulás
- Hibát találsz? Nyiss issue-t a repoban részletes leírással és előidézési utasításokkal.
- PR-eket szívesen fogadunk. Kövesd az alábbiakat:
  - Fork -> feature branch -> PR
  - Részletes leírás a változtatásokról és tesztelési utasítás
  - Egyszerű, jól dokumentált commitok

## Licenc
Add meg a projekthez tartozó licencet (példa: MIT). Ha még nincs döntés, jelöld meg ideiglenesen: "Licenc: TBD".

## Kapcsolat
Kérdés vagy visszajelzés: maelkmark@gmail.com vagy nyiss issue-t a tárolóban.
