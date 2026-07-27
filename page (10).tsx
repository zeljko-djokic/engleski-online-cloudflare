# Engleski Online — Cloudflare izdanje

Kompletan sajt Željka Đokića, pripremljen za besplatan Cloudflare Workers
hosting. Javni deo sajta je dostupan svima, dok Cloudflare Access štiti
urednički panel i API za čuvanje sadržaja.

## Šta ostaje besplatno

- Cloudflare Workers hosting na adresi `*.workers.dev`
- Cloudflare D1 baza za tekstove, cene, popuste, FAQ i kontakt
- Cloudflare Zero Trust / Access zaštita uredničkog panela
- HTTPS sertifikat i osnovna zaštita sajta

## Prvo objavljivanje

1. Napraviti besplatan Cloudflare nalog mejlom
   `zeljko.d.djokic@gmail.com`.
2. U Workers & Pages podešavanjima izabrati profesionalni `workers.dev`
   poddomen, na primer `zeljko-djokic`.
3. Prijaviti Wrangler na taj Cloudflare nalog.
4. Kreirati bazu:

   ```bash
   npx wrangler d1 create engleski-online-content
   ```

5. Dobijeni `database_id` upisati u `wrangler.jsonc`.
6. Kreirati tabelu:

   ```bash
   npm run db:migrate:remote
   ```

7. Objaviti sajt:

   ```bash
   npm run deploy
   ```

Očekivana besplatna adresa je:

`https://engleski-online.zeljko-djokic.workers.dev`

Konačan naziv zavisi od dostupnosti izabranog Cloudflare poddomena.

## Zaštita uredničkog panela

U Cloudflare Zero Trust > Access > Applications treba zaštititi ove putanje:

- `engleski-online.<poddomen>.workers.dev/uredjivanje*`
- `engleski-online.<poddomen>.workers.dev/api/admin/*`

Access pravilo treba da dozvoli samo:

`zeljko.d.djokic@gmail.com`

Javni deo sajta ne treba stavljati iza Access prijave.

## Uređivanje sadržaja

Posle prijave, urednički panel je na:

`https://engleski-online.<poddomen>.workers.dev/uredjivanje`

U panelu se menjaju svi tekstovi, detaljni opisi kurseva i ispita, cene,
popusti, kontakt podaci, FAQ i budući Google kalendar link.

## Razvoj i provera

```bash
npm ci
npm run lint
npm run build
```
