# Cup S — Robotic Coffee Website

Premium static marketing site for Cup S, the robotic coffee shop in Lebanon.

Built with React + TypeScript + Vite, animated with GSAP + Lenis, and ships as
plain static HTML/CSS/JS files — perfect for Strato or any static host.

---

## Quick start

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

Total `dist/` size: ~18 MB (under the 20 MB Strato limit). Most of the weight
is in the three `.mp4` videos under `public/videos/`. If you need more
headroom, re-encode them at lower bitrate.

---

## Deploying to Strato

1. Run `npm run build`.
2. Upload **everything inside `dist/`** to Strato's web root (typically `/`).
   - This includes `index.html`, `assets/`, `images/`, `videos/`, `menu.csv`,
     and `favicon.svg`.
3. Open your domain. The site uses **HashRouter**, so URLs look like
   `your-domain.com/#/menu` — no server routing config needed.

---

## What goes where

| File | Edit this to change… |
|---|---|
| `src/lib/config.ts` | WhatsApp number, contact email, EmailJS keys, kiosk locations |
| `src/lib/i18n.ts` | EN/AR text strings |
| `public/menu.csv` | Menu items, prices, image paths |
| `public/images/menu/` | Menu item photos (referenced from CSV) |
| `public/images/` | Site photos |
| `public/videos/` | Hero + scrub + Lebanon background videos |

### Menu CSV format

```
id,category,name_en,name_ar,description_en,description_ar,price,image
1,Espresso,Espresso,إسبريسو,Single shot...,جرعة واحدة...,2.50,/images/menu/espresso.jpg
```

The image path must be **relative to the site root** (i.e. files inside
`public/`). If an image is missing, a placeholder SVG is rendered.

### EmailJS setup

1. Sign up at https://www.emailjs.com/
2. Create a service + template (template should accept `from_name`,
   `from_email`, `message`, `to_email`).
3. Paste the service ID, template ID, and public key into
   `src/lib/config.ts → EMAILJS`.

Until real keys are filled in, the contact form runs in demo mode (shows a
success message but doesn't actually send).

### WhatsApp + contact email

Edit `src/lib/config.ts → CONTACT`:

```ts
export const CONTACT = {
  email: "info@cup-s.com",
  phoneDisplay: "+961 3 000 000",
  whatsappUrl: "https://wa.me/9613000000",  // strip + and spaces from the number
  locationLabel: "Beirut, Lebanon",
};
```

### Locations

Edit the `LOCATIONS` array in `src/lib/config.ts`. Each kiosk needs:
- `id` (unique slug)
- `name` / `nameAr`
- `address` / `addressAr`
- `coords` (latitude, longitude)
- `status`: `"running"` | `"deploying"` | `"offline"`

---

## Pages

- `/` — Landing (hero video, marquee, how-it-works, video scrub, features,
  Lebanon section, CTA)
- `/menu` — 3D coverflow wheel of menu items loaded from `menu.csv`
- `/locations` — Leaflet map of Lebanon kiosks + filterable list
- `/contact` — EmailJS-powered form with rate limit (5 msgs/hour) +
  WhatsApp + email buttons

---

## Mobile / RTL

- Fully responsive from 360px up.
- Arabic mode (`ع` toggle in navbar) flips the entire layout to RTL via
  `dir="rtl"` and swaps the font to **Cairo**.
- Custom cursor only renders on devices with a fine pointer (mouse) — touch
  devices use the native cursor.
- All heavy effects respect `prefers-reduced-motion`.

---

## Tech stack

- **React 18** + **TypeScript 5** + **Vite 5**
- **Tailwind CSS 3** for styling
- **GSAP + ScrollTrigger** for scroll-driven animations
- **Lenis** for smooth scroll
- **Leaflet** for the locations map
- **EmailJS** for contact form delivery
- No backend, no database, no auth, no payments.
