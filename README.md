# Hushållet

Hushållet är en nativ app byggd med React Native, Expo och TypeScript som gör det lättare för familjer, sambos och släktingar att samsas kring och bli påminda om sysslor i hemmet. Användare skapar eller går med i ett hushåll, väljer en avatar (🦊 🐷 🐸 🐥 🐙 🐬 🦉 🦄) och kan se vem som gjort vad, vad som är försenat och hur fördelningen ser ut över tid.

Produktägare: David Jensen

## Bygga och köra

Krav: Node.js 20.19+ (rekommenderat 22) och npm. Expo Go på mobilen eller en emulator.

```bash
npm ci            # installera beroenden
npm start         # starta Expo dev-server (skanna QR-koden med Expo Go)
npm run android   # Android-emulator
npm run ios       # iOS-simulator (macOS)
npm run web       # webbläsare
npx tsc --noEmit  # typkontroll
npm run lint      # lint
```

CI körs via GitHub Actions (`.github/workflows/ci.yml`): `npm ci`, `tsc --noEmit` och lint.

## Kravlista

40 krav totalt. G: 20 (50 %), VG: 32 (80 %). Krav markerade med * är obligatoriska.

### Kravlista (4)

- [ ] En logga, splashscreen och appikon ska designas och användas.
- [ ] * Applikationen ska byggas med RN, Expo & TS.
- [ ] * Designen av appen ska utgå ifrån befintliga skisser (undantag diskuteras med produktägare, godkänns och dokumenteras).
- [ ] * Information ska kommuniceras till och från en server.

### Hushåll (7)

- [ ] * Ett hushåll ska ha ett namn och en genererad (enkel) kod så andra kan gå med i hushållet; namnet ska gå att ändra.
- [ ] * Alla användare i ett hushåll ska kunna se vilka som tillhör hushållet.
- [ ] En ägare ska kunna se förfrågningar om att gå med i hushållet.
- [ ] En ägare ska kunna acceptera eller neka förfrågningar.
- [ ] En ägare ska kunna göra andra till ägare.
- [ ] En ägare ska kunna pausa en användare; under pausade perioder tas användaren inte med i statistiken.
- [ ] Om en användare pausats under en del av en period ska graferna normaliseras.

### Konto (5)

- [ ] * En användare ska kunna registrera och logga in sig.
- [ ] * En användare ska kunna skapa ett nytt hushåll.
- [ ] * En användare ska kunna gå med i ett hushåll genom att ange hushållets kod.
- [ ] När en användare valt att gå med i ett hushåll behöver en ägare först godkänna användaren.
- [ ] En användare ska kunna lämna ett hushåll.

### Profil (6)

- [ ] * En användare ska kunna ange sitt namn.
- [ ] * En användare ska kunna välja en avatar (emoji-djur + färg) från en fördefinierad lista.
- [ ] * Valda avatarer ska inte kunna väljas av andra användare i hushållet.
- [ ] * Avataren ska användas i appen för att visa vad användaren har gjort.
- [ ] En användare ska kunna ställa in appens utseende (mörkt, ljust, auto).
- [ ] Om en användare tillhör två eller fler hushåll ska denne kunna byta mellan dem.

### Sysslor (6)

- [ ] * En ägare ska kunna lägga till sysslor att göra i hemmet.
- [ ] * En syssla ska ha ett namn, en beskrivning, hur ofta den ska göras (dagar) och en vikt (energikrävande).
- [ ] En användare ska kunna lägga till en ljudinspelning och en bild för att beskriva sysslan.
- [ ] * En ägare ska kunna redigera en syssla.
- [ ] En ägare ska kunna ta bort en syssla.
- [ ] Vid borttagning ska användaren varnas om att statistiken tas bort och få välja att arkivera istället.

### Dagsvyn (3)

- [ ] * Alla sysslor ska listas i en dagsvy och ge en översikt kring vad som behöver göras.
- [ ] * Utöver namnet visas vem/vilka som gjort sysslan, hur många dagar sedan den gjordes senast samt om den är försenad.
- [ ] * När en användare väljer en syssla visas beskrivningen och den kan med ett enkelt tryck markeras som gjord.

### Statistik (6)

- [ ] * En användare ska kunna se fördelningen av gjorda sysslor mellan användarna i hushållet.
- [ ] * Varje statistikvy visar total fördelning (inräknat vikter) samt fördelning per syssla.
- [ ] * Det ska finnas en statistikvy över "nuvarande vecka".
- [ ] Det ska finnas en statistikvy över "förra veckan".
- [ ] Det ska finnas en statistikvy över "förra månaden".
- [ ] Om det inte finns statistik för en vy ska den vyn inte visas.

### Schemaläggning (3)

- [ ] En ägare ska kunna tilldela och ta bort sysslor från användare i hushållet.
- [ ] Användare ska kunna se de tilldelade sysslorna i sitt gränssnitt.
- [ ] En ägare ska kunna skapa grupper av sysslor som automatiskt tilldelas och roteras baserat på ett intervall i dagar.
