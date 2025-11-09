# Dusza

Egyszerű, könnyen áttekinthető projekt README. A Dusza egy kis eszköz (CLI/skript), amely célja X feladat automatizálása és Y feldolgozása — helyettesítsd az X/Y részeket a projekt konkrét céljával.

## Tartalom
- Leírás
- Használat
- Fejlesztés betekintés
- Hibajelentés és hozzájárulás
- Kapcsolat

## Leírás
A Damareen egy  gyűjtögetős fantasy kártyajáték, amelyben stratégia, szerencse és képzelet fonódik össze. A selyemutak játszóasztalaitól a modern digitális arénákig ez a műfaj mindig is a hősök és történetek kovácsa volt. Most rajtad a sor, hogy saját paklid lapjaira írd a történelmet: hősöket teremts, kazamatákon küzdj végig, és szörnyek vezéreivel mérkőzz meg. Vajon a gondosan kidolgozott stratégiád diadalt arat, vagy a kazamaták mélye örökre elnyel? Készítsd elő a paklidat, mert a kártyák sorsot hordoznak!

## Használat

#### Regisztráció
  - Jobb-felső

### Szerepkörök

#### Játékmester
  - Játékvilágok létrehozása/módosítása
  - Világkártyák létrehozása (név, sebzés, életerő, típus)
  - Vezérkártyák származtatása (sebzés vagy életerő duplázás)
  - Kazamaták összeállítása (kártyák sorrendje)
  - Kezdő gyűjtemény beállítása

#### Játékos

1. **Pakli összeállítása:** Rakd össze a paklidat a gyűjteményből
    - Kártya létrehozása
2. **Játék indítása:** Válassz meglévő világaid közül, vagy hozz létre újat
    • "Világok" menüpont alatti '+' gombra kattintva

3. **Harc:** Válassz kazamatát (pakli == kazamata)
4. **Győzelem esetén:** Jutalom: tetszőleges kártya fejlesztése

### Csata

#### Párbaj eredményének meghatározása:

1. **Sebzés vs Életerő:** Ha az egyik kártya sebzése nagyobb, mint a másik életereje ⋙ nyer ✔

2. **Típus előny:** 
   - 🔥 Tűz     ⋙   🏔️ Föld
   - 🏔️ Föld    ⋙   💧 Víz
   - 💧 Víz     ⋙   🍃 Levegő
   - 🍃 Levegő  ⋙   🔥 Tűz

3. **Döntetlen:** Kazamata nyer 💀

#### Harc eredménye:
A játékos akkor nyer, ha legalább annyi kártyája győzött, mint amennyi kártya van a kazamatában. 👑

### Kazamata típusok és jutalmak:

| Típus | Kártyák | Jutalom |
|-------|---------|---------|
| **Egyszerű találkozás** |      1 sima       | +1 sebzés |🥉 
| **Kis kazamata**        | 3 sima + 1 vezér  | +2 életerő|🥈
| **Nagy kazamata**       | 5 sima + 1 vezér  | +3 sebzés |🥇


## Fejlesztés betekintés

## Hibajelentés és hozzájárulás
- Hibát találsz? Nyiss issue-t a repoban részletes leírással és előidézési utasításokkal.

## Kapcsolat
Kérdés vagy visszajelzés: maelkmark@gmail.com vagy nyiss issue-t a tárolóban.
