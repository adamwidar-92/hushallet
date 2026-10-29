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

Kopiera `.env.example` till `.env` och fyll i Supabase-nycklarna (fås av gruppen).

CI körs via GitHub Actions (`.github/workflows/ci.yml`): `npm ci`, `tsc --noEmit` och lint.

## Projektstruktur

```
src/
  app/          # skärmar/routes (expo-router)
  lib/          # supabase-klient
  theme/        # färger och typografi från Figma
  types/        # TypeScript-typer som matchar databasen
supabase/migrations/  # databasschema (Postgres + RLS)
docs/DESIGN.md        # beskrivning av alla skärmar och komponenter
docs/design/          # skärmdumpar från Figma
```

Design: se [docs/DESIGN.md](docs/DESIGN.md) och [Figma](https://www.figma.com/design/wx5SmBt7SZ6v0CHravsYSj/Untitled?node-id=0-1).

## Så jobbar vi

1. **Välj en issue** på [GitHub Issues](https://github.com/adamwidar-92/hushallet/issues) som inte är tilldelad och vars beroenden är klara. Tilldela dig själv.
2. **Skapa en branch** från senaste `master`: `git checkout -b feature/<issuenummer>-kort-namn` (t.ex. `feature/13-login`).
3. **Koda** enligt `docs/DESIGN.md`. Använd typerna i `src/types`. Kör `npx tsc --noEmit` och `npm run lint` innan du pushar.
4. **Öppna en Pull Request** mot `master` och fyll i PR-mallen. Skriv `Closes #<nr>` så stängs issuen automatiskt.
5. **Review:** minst en annan i gruppen granskar och godkänner.
6. **CI måste vara grön** innan merge. Merga med *Squash and merge* och radera branchen.
7. Bocka av kravet i listan nedan när det är mergat.

## Kravlista

40 krav totalt. G: 20 (50 %), VG: 32 (80 %). Krav markerade med * är obligatoriska och har en issue med etiketten `G-krav`.

### Kravlista (4)

- [ ] * En logga, splashscreen och appikon ska designas och användas. ([#12](https://github.com/adamwidar-92/hushallet/issues/12))
- [ ] * Applikationen ska byggas med RN, Expo & TS. ([#9](https://github.com/adamwidar-92/hushallet/issues/9))
- [ ] * Designen av appen ska utgå ifrån befintliga skisser (undantag diskuteras med produktägare, godkänns och dokumenteras). ([#11](https://github.com/adamwidar-92/hushallet/issues/11))
- [ ] Information ska kommuniceras till och från en server. *(Obligatoriskt enligt Krav för godkänt, punkt 2.)* ([#10](https://github.com/adamwidar-92/hushallet/issues/10))

### Hushåll (7)

- [x] * Ett hushåll ska ha ett namn och en genererad (enkel) kod så andra kan gå med i hushållet; namnet ska gå att ändra. ([#19](https://github.com/adamwidar-92/hushallet/issues/19))
- [ ] Alla användare i ett hushåll ska kunna se vilka som tillhör hushållet.
- [ ] En ägare ska kunna se förfrågningar om att gå med i hushållet.
- [ ] En ägare ska kunna acceptera eller neka förfrågningar.
- [ ] En ägare ska kunna göra andra till ägare.
- [ ] En ägare ska kunna pausa en användare; under pausade perioder tas användaren inte med i statistiken.
- [ ] Om en användare pausats under en del av en period ska graferna normaliseras.

### Konto (5)

- [ ] * En användare ska kunna registrera och logga in sig. ([#13](https://github.com/adamwidar-92/hushallet/issues/13))
- [x] * En användare ska kunna skapa ett nytt hushåll. ([#16](https://github.com/adamwidar-92/hushallet/issues/16))
- [x] * En användare ska kunna gå med i ett hushåll genom att ange hushållets kod. ([#17](https://github.com/adamwidar-92/hushallet/issues/17))
- [ ] När en användare valt att gå med i ett hushåll behöver en ägare först godkänna användaren.
- [ ] En användare ska kunna lämna ett hushåll.

### Profil (6)

- [ ] * En användare ska kunna ange sitt namn. ([#14](https://github.com/adamwidar-92/hushallet/issues/14))
- [ ] * En användare ska kunna välja en avatar (emoji-djur + färg) från en fördefinierad lista. ([#15](https://github.com/adamwidar-92/hushallet/issues/15))
- [ ] * Valda avatarer ska inte kunna väljas av andra användare i hushållet. ([#18](https://github.com/adamwidar-92/hushallet/issues/18))
- [ ] * Avataren ska användas i appen för att visa vad användaren har gjort. ([#26](https://github.com/adamwidar-92/hushallet/issues/26))
- [ ] En användare ska kunna ställa in appens utseende (mörkt, ljust, auto).
- [ ] Om en användare tillhör två eller fler hushåll ska denne kunna byta mellan dem.

### Sysslor (6)

- [ ] * En ägare ska kunna lägga till sysslor att göra i hemmet. ([#21](https://github.com/adamwidar-92/hushallet/issues/21))
- [ ] * En syssla ska ha ett namn, en beskrivning, hur ofta den ska göras (dagar) och en vikt (energikrävande). ([#20](https://github.com/adamwidar-92/hushallet/issues/20))
- [ ] En användare ska kunna lägga till en ljudinspelning och en bild för att beskriva sysslan.
- [ ] * En ägare ska kunna redigera en syssla. ([#22](https://github.com/adamwidar-92/hushallet/issues/22))
- [ ] En ägare ska kunna ta bort en syssla.
- [ ] Vid borttagning ska användaren varnas om att statistiken tas bort och få välja att arkivera istället.

### Dagsvyn (3)

- [ ] * Alla sysslor ska listas i en dagsvy och ge en översikt kring vad som behöver göras. ([#23](https://github.com/adamwidar-92/hushallet/issues/23))
- [ ] * Utöver namnet visas vem/vilka som gjort sysslan, hur många dagar sedan den gjordes senast samt om den är försenad. ([#24](https://github.com/adamwidar-92/hushallet/issues/24))
- [ ] * När en användare väljer en syssla visas beskrivningen och den kan med ett enkelt tryck markeras som gjord. ([#25](https://github.com/adamwidar-92/hushallet/issues/25))

### Statistik (6)

- [ ] * En användare ska kunna se fördelningen av gjorda sysslor mellan användarna i hushållet. ([#27](https://github.com/adamwidar-92/hushallet/issues/27))
- [ ] * Varje statistikvy visar total fördelning (inräknat vikter) samt fördelning per syssla. ([#28](https://github.com/adamwidar-92/hushallet/issues/28))
- [ ] * Det ska finnas en statistikvy över "nuvarande vecka". ([#29](https://github.com/adamwidar-92/hushallet/issues/29))
- [ ] Det ska finnas en statistikvy över "förra veckan".
- [ ] Det ska finnas en statistikvy över "förra månaden".
- [ ] Om det inte finns statistik för en vy ska den vyn inte visas.

### Schemaläggning (3)

- [ ] En ägare ska kunna tilldela och ta bort sysslor från användare i hushållet.
- [ ] Användare ska kunna se de tilldelade sysslorna i sitt gränssnitt.
- [ ] En ägare ska kunna skapa grupper av sysslor som automatiskt tilldelas och roteras baserat på ett intervall i dagar.
