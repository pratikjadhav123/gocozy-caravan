# GoCozyCaravan

Next.js website for **Go Cozy Caravan** — luxury caravan rentals (Pune & Maharashtra).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/vehicles` | Fleet |
| `/amenities` | Onboard features |
| `/about` | About the business |
| `/contact` | Contact form + WhatsApp / email |
| `/book` | Booking slot request |

**Contact:** WhatsApp [9145111125](https://wa.me/919145111125) · [GoCozyCaravan@gmail.com](mailto:GoCozyCaravan@gmail.com)

## Run locally

```bash
cd gocozy-caravan
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add your photos

Replace SVG placeholders under `public/images/` with your JPG/PNG files **using the same filenames** (or update paths in `src/lib/constants.ts` and page components):

| File | Use |
|------|-----|
| `public/images/logo.svg` | Header logo (or use `logo.png`) |
| `public/images/hero-van.svg` | Home hero background |
| `public/images/hero-van-side.svg` | Vehicles page banner |
| `public/images/gallery/*.svg` | Interiors, bathroom, team photo |

After adding real JPGs, change extensions in code from `.svg` to `.jpg`.

## Bookings & messages

- **Book Now** and **Contact** forms POST to `/api/book` and `/api/contact`.
- Submissions are stored in `data/bookings.json` and `data/contacts.json` on the server (for your review).
- Customers get a booking reference and can open WhatsApp to confirm.

For production, connect email (Resend/SMTP) or a CRM and deploy to Vercel/your host.

## Build

```bash
npm run build
npm start
```

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- No external UI framework
