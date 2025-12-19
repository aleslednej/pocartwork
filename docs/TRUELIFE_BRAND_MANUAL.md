# TrueLife Brand Manual

> Source: [truelife.visualbook.pro](https://truelife.visualbook.pro)

## Overview

TrueLife je značka zaměřená na péči - "True care for real life". Vizuální identita je postavena na konceptu **objetí/péče** (embrace), který se promítá do loga, fotografií a grafických prvků.

---

## 1. Logo

### Varianty loga

Logo existuje ve čtyřech barevných variantách:

| Varianta | Použití | Soubory |
|----------|---------|---------|
| **Vínová** (Wine) | Světlé pozadí | `logo/vinova/Truelife_Vinova.*` |
| **Levandulová** | Tmavé pozadí | `logo/levandulova/Truelife_Levandulova.*` |
| **Bílá** (White) | Tmavé pozadí | `logo/bila/Truelife_White.*` |
| **Černá** (Black) | Světlé pozadí | `logo/cerna/Truelife_Black.*` |

### Formáty
- **SVG** - vektorový formát pro web a tisk
- **PNG** - rastrový s průhledným pozadím
- **PDF** - pro tiskovou produkci

### Minimální velikost
- **Obrazovky:** min. výška 20px
- **Tisk:** min. výška 15mm

### Ochranná zóna
- 50% výšky loga kolem celého loga

### Zakázané úpravy
- Stíny
- Rotace
- Změna barev
- Deformace proporcí

---

## 2. Symbol

Zjednodušená verze loga - symbol (ikona).

| Varianta | Soubory |
|----------|---------|
| **Vínová** | `symbol/vinova/Truelife_symbol_Vinova.*` |
| **Levandulová** | `symbol/levandulova/Truelife_symbol_Levandulova.*` |
| **Bílá** | `symbol/bila/Truelife_symbol_White.*` |
| **Černá** | `symbol/cerna/Truelife_symbol_Black.*` |

### Minimální velikost
- **Obrazovky:** min. výška 16px
- **Tisk:** min. výška 20mm

### Ochranná zóna
- 25% výšky symbolu

---

## 3. Barvy

### Primární barvy (Základní)

| Název | HEX | RGB | CMYK | Pantone |
|-------|-----|-----|------|---------|
| **Levandulová** | `#DFDAEE` | rgb(223, 218, 238) | 14-15-0-0 | PANTONE 9360 C |
| **Vínová** | `#462A3F` | rgb(70, 42, 63) | 58-76-32-62 | PANTONE 7449 C |
| **Lila** | `#BEA2CD` | rgb(190, 162, 205) | 29-41-0-0 | PANTONE 2072 C |

### Použití primárních barev
- **Levandulová** - hlavní pozadí, plochy
- **Vínová** - logo, nadpisy, texty
- **Lila** - gradienty, akcenty, tlačítka

### Barvy kategorií produktů

| Kategorie | Název | HEX | RGB | CMYK | Pantone |
|-----------|-------|-----|-----|------|---------|
| Péče o miminko | Růžová | `#F5AEB9` | rgb(245, 174, 185) | 0-42-16-0 | PANTONE 494 C |
| Péče o zuby | Světle modrá | `#A4D8E2` | rgb(164, 216, 226) | 40-0-13-0 | PANTONE 635 C |
| Péče o vzduch | Modrá | `#00B7E4` | rgb(0, 183, 228) | 73-0-6-0 | PANTONE 298 C |
| Péče o tělo | Žlutozelená | `#CDD500` | rgb(205, 213, 0) | 28-0-100-0 | PANTONE 382 C |
| Péče o zdraví | Zelená | `#3BB392` | rgb(59, 179, 146) | 71-0-53-0 | PANTONE 2413 C |
| Péče o krásu | Fialová | `#9C5FA3` | rgb(156, 95, 163) | 46-71-0-0 | PANTONE 2583 C |

### CSS proměnné pro web

```css
:root {
  --truelife-levandulova: #DFDAEE;
  --truelife-vinova: #462A3F;
  --truelife-lila: #BEA2CD;
  --truelife-text: #697077;
  --truelife-title: #332231;

  /* Kategorie */
  --cat-baby: #F5AEB9;
  --cat-dental: #A4D8E2;
  --cat-air: #00B7E4;
  --cat-body: #CDD500;
  --cat-health: #3BB392;
  --cat-beauty: #9C5FA3;
}
```

---

## 4. Typografie

### Primární písmo

**Season Sans Variable**
- Autor: [Displaay](https://displaay.net/typeface/season-collection/season-sans/)
- Kontakt: rgb@displaay.net

### Použití váhy písma

| Váha | Použití |
|------|---------|
| **SemiBold (660)** | Nadpisy, názvy produktů |
| **Medium** | Text benefitů na produktech |
| **Regular** | Delší texty, publikace, web |

### CSS pro web

```css
/* Nadpisy */
h1, h2, h3 {
  font-family: 'Season Sans Variable', sans-serif;
  font-weight: 660;
}

/* Text */
p, body {
  font-family: 'Season Sans Variable', sans-serif;
  font-weight: 400;
  line-height: 1.5;
}

/* Fallback stack */
font-family: 'Season Sans Variable', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

---

## 5. Packaging (Balení)

### Layout systém

Přední strana krabice je rozdělena na **šestiny**:

```
┌─────────────────────────────────┐
│   2/6 - Logo + Kategorie        │
│   (barevný kruh s ikonou)       │
├─────────────────────────────────┤
│                                 │
│   3/6 - Fotografie produktu     │
│                                 │
│                                 │
├─────────────────────────────────┤
│   1/6 - Název + Benefity        │
│   (ikony s textem)              │
└─────────────────────────────────┘
```

### Rozměry produktových krabiček

| Produkt | Šířka (mm) | Výška (mm) | Hloubka (mm) |
|---------|------------|------------|--------------|
| HairDryer D2 | 107 | 270 | 82 |
| Standardní | 100 | 200 | 80 |

### Barevnost balení

- **Pozadí:** Levandulová (`#DFDAEE`)
- **Texty/Logo:** Vínová (`#462A3F`)
- **Kategorie:** Odpovídající barva kategorie
- **Dekorativní prvky:** Gradient levandulová → lila

### Parciální lak (UV)

- **Oblasti:** Logo, fotografie produktu
- **Efekt:** Lesklý UV lak na matném pozadí

---

## 6. Ikony

### Knihovna

Ikony pocházejí z knihovny **Streamline Carbon** - geometrické ikony vhodné pro moderní design TrueLife.

### Tlačítka s ikonami

```
┌────────────────────────────┐
│ 🔘 Icon │ Popisek textu    │
└────────────────────────────┘
```

- **Tvar:** Pilulka (pill-shaped) se zaoblenými hranami
- **Okraj:** Gradient lila
- **Písmo popisku:** Medium váha
- **Rozvržení:** Horizontálně nebo vertikálně dle formátu

---

## 7. Vizuální prvky

### Motiv objetí (Embrace)

Centrální vizuální koncept - "pečující ruce/objetí":

- Integrován do loga (písmena R a U)
- Používá se jako rámeček pro fotografie
- Dekorativní prvek na packaging a marketingových materiálech

### Kategoriální kruhy

Barevné kruhy pro rozlišení kategorií produktů:

- Plné kruhy s kategorií barvou
- Gradientové variace
- Badge pro social media a packaging

---

## 8. Struktura souborů

```
docs/assets/logos/
├── logo/
│   ├── bila/
│   │   ├── Truelife_White.svg
│   │   ├── Truelife_White.png
│   │   └── Truelife_White.pdf
│   ├── cerna/
│   │   ├── Truelife_Black.svg
│   │   ├── Truelife_Black.png
│   │   └── Truelife_Black.pdf
│   ├── levandulova/
│   │   ├── Truelife_Levandulova.svg
│   │   ├── Truelife_Levandulova.png
│   │   └── Truelife_Levandulova.pdf
│   └── vinova/
│       ├── Truelife_Vinova.svg
│       ├── Truelife_Vinova.png
│       └── Truelife_Vinova.pdf
└── symbol/
    ├── bila/
    │   └── Truelife_symbol_White.*
    ├── cerna/
    │   └── Truelife_symbol_Black.*
    ├── levandulova/
    │   └── Truelife_symbol_Levandulova.*
    └── vinova/
        └── Truelife_symbol_Vinova.*
```

---

## 9. Odkazy

- **Brand Manual:** [truelife.visualbook.pro](https://truelife.visualbook.pro)
- **Loga:** [truelife.visualbook.pro/loga](https://truelife.visualbook.pro/loga)
- **Barvy:** [truelife.visualbook.pro/barvy](https://truelife.visualbook.pro/barvy)
- **Písma:** [truelife.visualbook.pro/pisma](https://truelife.visualbook.pro/pisma)
- **Packaging:** [truelife.visualbook.pro/packaging](https://truelife.visualbook.pro/packaging)
- **Font Season Sans:** [displaay.net](https://displaay.net/typeface/season-collection/season-sans/)

---

*Dokumentace vytvořena: 2024-12*
*Zdroj: TrueLife Visual Book*
