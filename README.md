# Dusza Árpád webprogramozó verseny 2025
Ez a repó a Dusza Árpád webprogramozó verseny-re készült 2025-ben.
- A verseny weboldala: https://isze.hu/dusza-arpad-orszagos-programozoi-emlekverseny/
- A játék elérése: https://ma-elk.hu/damareen/

## Tartalom
- [Dusza Árpád webprogramozó verseny 2025](#dusza-árpád-webprogramozó-verseny-2025)
  - [Tartalom](#tartalom)
  - [Leírás](#leírás)
  - [Használat](#használat)
      - [Fiókok kezelése](#fiókok-kezelése)
    - [Szerepkörök](#szerepkörök)
      - [Játékmester](#játékmester)
      - [Játékos](#játékos)
    - [Csata](#csata)
      - [Párbaj eredményének meghatározása:](#párbaj-eredményének-meghatározása)
      - [Harc eredménye:](#harc-eredménye)
    - [Kazamata típusok és jutalmak:](#kazamata-típusok-és-jutalmak)
  - [Fejlesztés betekintés](#fejlesztés-betekintés)
  - [Kapcsolat és hibabejelentés](#kapcsolat-és-hibabejelentés)
  - [Készítők](#készítők)


## Leírás
A Damareen egy  gyűjtögetős fantasy kártyajáték, amelyben stratégia, szerencse és képzelet fonódik össze. A selyemutak játszóasztalaitól a modern digitális arénákig ez a műfaj mindig is a hősök és történetek kovácsa volt. Most rajtad a sor, hogy saját paklid lapjaira írd a történelmet: hősöket teremts, kazamatákon küzdj végig, és szörnyek vezéreivel mérkőzz meg. Vajon a gondosan kidolgozott stratégiád diadalt arat, vagy a kazamaták mélye örökre elnyel? Készítsd elő a paklidat, mert a kártyák sorsot hordoznak!

## Használat

#### Fiókok kezelése
  - A "Bejelentkezés" és "Regisztráció" gombok a Jobb-felső sarokban találhatóak  
    - Regisztráció: 
        - Felhasználónév és jelszó kétszeres megadásával
    - Bejelentkezés:
        - Felhasználónév és jelszó megadásával
    - Fiók törlése: 
        - Felhasználónév és jelszó megadásával

### Szerepkörök

#### Játékmester
  - Világok létrehozása a "Világok" alatt lévő '+' gombbal
    - Világnév megadása/módosítása 
        - bal felső sarok
  - Vezérkártyák létrehozása (sebzés vagy életerő duplázása): 
    - Sima kártyán a sebzés és életerő ikonok fölötti gombokkal, annak megfelelően, hogy melyik tulajdonság fölött van (életerő fölött ⇒ életerő duplázás)
    - Minden tulajdonság a származtató sima kártya tulajdonságaitól függ
  - Világkártyák létrehozása:
    - Név megadása/módosítása: 
        - A kártya tetején található névdobozba kattintással
    - Sebzés és életerő megadása/módosítása: 
        - sebzés és életerő ikonok fölötti és alatti nyilak segítségével
    - Kártyatípus megadása/módosítása: 
        - sebzés és életerő ikonok közötti gombra kattintással váltogathat
  - Világok módosítása:
    - Világon középen-alul található toll gombbal
    - Név megadása/módosítása: 
        - A kártya tetején található névdobozba kattintással
 


#### Játékos

 - Pakli összeállítása:
    - Rakd össze a paklidat a gyűjteményből

 - Játék indítása: Válassz a meglévő világok közül, vagy hozz létre újat
    - "Világok" menüpont alatti '+' gombra kattintva

 - Harc:
    - Válassz kazamatát (pakli kártyaszáma == kazamata kártyaszáma)

 - Győzelem esetén:
    - Jutalom: tetszőleges kártya fejlesztése

### Csata

#### Párbaj eredményének meghatározása:

1. **Sebzés vs Életerő:** Ha az egyik kártya sebzése nagyobb, mint a másik életereje ⋙ nyer ✔

2. **Típus előny:** 
   - 🔥 Tűz     ⋙   🏔️ Föld
   - 🏔️ Föld    ⋙   💧 Víz
   - 💧 Víz     ⋙   🍃 Levegő
   - 🍃 Levegő  ⋙   🔥 Tűz

3. **Döntetlen:** A kazamata nyer 💀

#### Harc eredménye:
A játékos akkor nyer, ha összességében legalább annyi kártyája nyert mint a kazamatának. 👑

### Kazamata típusok és jutalmak:

| Típus | Kártyák | Jutalom |
|-------|---------|---------|
| **Egyszerű találkozás** |      1 sima       | +1 sebzés |🥉 
| **Kis kazamata**        | 3 sima + 1 vezér  | +2 életerő|🥈
| **Nagy kazamata**       | 5 sima + 1 vezér  | +3 sebzés |🥇


## Fejlesztés betekintés
A Damareen kártyajáték teljességében egy weboldalként funkcionál, ahol a backend (pl.: fiókkezelés, komunikálás az adatbázissal) PHP nyelvben van implementálva. Minden backend funkció külön fájlban van az olvashatóság érdekében. Az adatbázis egy MySQL relációs adatbázis, ahol a különböző objektumok külön táblában vannak tárolva.

A MySQL-es adatok, mint a felhasználónév, a jelszó és a táblanevek egy `.env` fájlban vannak tárolva a nagyobb flexibilitás és biztonság érdekében. Maga az `.env` fájl itt nem elérhető (nyilván), de a felépítése megtalálható az `.env.example` fájlban.

A frontend és a játék működése HTML, CSS és JavaScript-ben lett megírva, semmilyen framework-öt nem használtunk. A kártyák drag-and-drop funkciója SortableJS-sel lett elkészítve.

A verseny vége óta (2025.11.09. 20:00) több változtatást is végeztünk, ezek megtalálhatóak a `changes.md` fájlban.


## Kapcsolat és hibabejelentés
Ha kérdésed van vagy hibát szeretnél bejelenteni, akkor írhatsz email-címeinkre, vagy [nyithatsz egy issue-t](https://github.com/Raketa10/dusza-web-verseny-2025/issues/new) a GitHub repóban. Ha hibát jelentesz be, ha tudod, írd le minél részletes leírással és előidézési utasításokkal, hogy minél érthetőbb és átláthatóbb legyen a probléma az egyszerű és gyors javítás érdekében.

- Kérdés vagy visszajelzés: [info@ma-elk.hu](https://ma-elk.hu/email/?to=other)
- Hibabejelentés: [hiba@ma-elk.hu](https://ma-elk.hu/email/?to=bug&url=https://ma-elk.hu/damareen)


## Készítők
- **Lemle-Kövesi Bálint**, [@Raketa10](https://github.com/Raketa10) - Backend fejlesztő
- **Magyar Márk**, [@MaelkMark](https://github.com/MaelkMark) - Frontend fejlesztő
- **Szőcs Nimród**, [@Zwixern](https://github.com/Zwixern) - UI/UX Designer, assetek