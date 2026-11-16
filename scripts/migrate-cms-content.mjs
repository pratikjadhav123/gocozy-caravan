import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvLocal();

const vehicles = [
  {
    slug: "cozy-caravan-1",
    name: "Go Cozy Caravan",
    tagline: "LED lounge caravan with fridge — ideal for couples & small families",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, fridge",
    image: "/images/slider/slide-2.png",
    about:
      "A premium Force Traveller caravan fitted with quilted leather lounge seating, climate control, smart TV, and a fridge — perfect for weekend escapes and overnight road trips across India.",
    gallery: [
      { src: "/images/slider/slide-2.png", alt: "Go Cozy Caravan exterior front" },
      { src: "/images/slider/slide-3.png", alt: "Go Cozy Caravan side branding" },
      { src: "/images/slider/slide-1.png", alt: "Motorhome with outdoor seating" },
      { src: "/images/gallery/interior-lounge-1.png", alt: "LED lounge interior" },
      { src: "/images/gallery/interior-tv.png", alt: "Smart TV entertainment" },
      { src: "/images/gallery/interior-bathroom.png", alt: "Onboard bathroom" },
    ],
    specs: [
      { label: "Seats", value: "6–7" },
      { label: "Sleeps", value: "2 beds" },
      { label: "Type", value: "Luxury caravan" },
      { label: "Climate", value: "AC" },
      { label: "Min days", value: "1" },
    ],
    features: [
      { title: "LED lounge", description: "Ambient LED lighting with premium leather seating." },
      { title: "Smart TV", description: "Entertainment for long drives and overnight stays." },
      { title: "Air conditioning", description: "Roof AC for comfortable all-season travel." },
      { title: "Fridge", description: "Keep drinks and snacks cold on the road." },
      { title: "Private washroom", description: "Onboard bathroom with modern fittings." },
      { title: "Convertible beds", description: "Lounge converts for overnight sleeping." },
    ],
    sort_order: 1,
  },
  {
    slug: "cozy-caravan-2",
    name: "Go Cozy Caravan Kitchen",
    tagline: "Same cozy lounge — plus kitchen, fridge & oven for longer trips",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, kitchen, fridge, oven",
    image: "/images/fleet/caravan-night.png",
    about:
      "Built like our flagship lounge caravan, with a full kitchen setup — fridge and oven — so families can cook light meals and stay longer on multi-day journeys.",
    gallery: [
      { src: "/images/fleet/caravan-night.png", alt: "Kitchen caravan night setup" },
      { src: "/images/fleet/caravan-awning.png", alt: "Awning and outdoor living" },
      { src: "/images/slider/slide-4.png", alt: "Caravan with stairs and awning" },
      { src: "/images/gallery/family-lounge.png", alt: "Family lounge seating" },
      { src: "/images/gallery/interior-kitchen.png", alt: "Kitchen and fittings" },
      { src: "/images/gallery/interior-sofa.png", alt: "Quilted sofa seating" },
    ],
    specs: [
      { label: "Seats", value: "6–7" },
      { label: "Sleeps", value: "2 beds" },
      { label: "Type", value: "Kitchen caravan" },
      { label: "Climate", value: "AC" },
      { label: "Min days", value: "1" },
    ],
    features: [
      { title: "Kitchen", description: "Cook and prep light meals onboard." },
      { title: "Fridge", description: "Cold storage for family trips." },
      { title: "Oven", description: "Warm meals without stopping for restaurants." },
      { title: "LED lounge", description: "Premium leather seating with mood lighting." },
      { title: "Smart TV", description: "Entertainment for kids and adults." },
      { title: "Air conditioning", description: "Comfortable cabin climate control." },
    ],
    sort_order: 2,
  },
  {
    slug: "cozy-urbania",
    name: "Go Cozy Urbania",
    tagline: "15–16 seater Urbania — AC & smart sound for group travel",
    seats: "15–16",
    beds: null,
    highlight: "AC, smart sound system — spacious group travel",
    image: "/images/fleet/urbania-hills.png",
    about:
      "Go Cozy Urbania is built for larger groups — office outings, temple trips, and celebrations. Spacious 15–16 seating with AC and a smart sound system for a comfortable ride.",
    gallery: [
      { src: "/images/fleet/urbania-hills.png", alt: "Go Cozy Urbania front three-quarter view" },
      { src: "/images/fleet/urbania-heritage.png", alt: "Urbania parked at landmark" },
      { src: "/images/fleet/urbania-palace.png", alt: "Urbania at heritage palace venue" },
      { src: "/images/gallery/interior-lounge-1.png", alt: "Spacious cabin seating" },
      { src: "/images/gallery/interior-lounge-2.png", alt: "Group seating layout" },
      { src: "/images/gallery/family-lounge.png", alt: "Group travel lounge" },
    ],
    specs: [
      { label: "Seats", value: "15–16" },
      { label: "Sleeps", value: "Day travel" },
      { label: "Type", value: "Urbania coach" },
      { label: "Climate", value: "AC" },
      { label: "Audio", value: "Smart sound" },
    ],
    features: [
      { title: "15–16 seats", description: "Roomy cabin for family and group tours." },
      { title: "Air conditioning", description: "Cool, comfortable long-distance travel." },
      { title: "Smart sound system", description: "Music and announcements for the group." },
      { title: "Spacious layout", description: "Easy boarding and comfortable seating rows." },
      { title: "Chauffeur ready", description: "Professional driver available on request." },
      { title: "Event & tour friendly", description: "Ideal for day trips and celebrations." },
    ],
    sort_order: 3,
  },
];

const blogs = [
  {
    slug: "caravan-nights-desert-winter",
    title: "Caravan nights in the desert: Rann of Kutch & Jaisalmer in winter",
    category: "Travel guides",
    date: "2025-11-05",
    dateLabel: "5 NOV 2025",
    author: "Go Cozy Team",
    readMins: 8,
    excerpt: "How cold desert nights get, what to pack, and why a heated lounge caravan changes the trip.",
    image: "/images/fleet/caravan-night.png",
    content: [
      "Winter is peak season for Gujarat’s white desert and Rajasthan’s dunes. Days are bright; nights drop fast.",
      "With Go Cozy Caravan you sleep in a quilted LED lounge with AC/climate control — pack layers, but you won’t freeze in a tent.",
      "Plan 3–5 nights, book early for December–January weekends, and confirm fuel/halts on WhatsApp before you leave.",
    ],
  },
  {
    slug: "caravan-safety-india",
    title: "Caravan safety in India: who drives, where you halt, what to know",
    category: "Travel guides",
    date: "2025-10-20",
    dateLabel: "20 OCT 2025",
    author: "Go Cozy Team",
    readMins: 7,
    excerpt: "Chauffeur vs self-drive, overnight parking norms, and simple checks before every departure.",
    image: "/images/slider/slide-2.png",
    content: [
      "Most guests prefer a professional chauffeur — especially on ghats and night stretches.",
      "We brief you on halt etiquette, emergency contacts, and a quick walkthrough of lights, AC, and washroom before roll-out.",
      "Always share live location with family and keep FASTag / cash buffer for tolls and parking.",
    ],
  },
  {
    slug: "weekend-escape-lonavala",
    title: "Weekend escape: Lonavala & Khandala by caravan from Pune",
    category: "Routes",
    date: "2025-10-02",
    dateLabel: "2 OCT 2025",
    author: "Go Cozy Team",
    readMins: 6,
    excerpt: "Distance, drive time, and why this is the easiest first trip for new caravan travellers.",
    image: "/images/slider/slide-1.png",
    content: [
      "From Pune, Lonavala is about two hours — ideal for a Friday evening start or Saturday morning.",
      "Use the lounge for monsoon views, kids’ movies on the smart TV, and a calm overnight without hotel check-in stress.",
      "Book Go Cozy Caravan or Kitchen unit for 1–2 nights; Urbania works for larger day groups.",
    ],
  },
];

const schemaSql = fs.readFileSync(
  path.join(process.cwd(), "database", "migration_cms_content.sql"),
  "utf8"
);

try {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "gocozy_caravan",
    multipleStatements: true,
  });

  await conn.query(schemaSql.replace(/^USE\s+`gocozy_caravan`\s*;/im, ""));

  for (const v of vehicles) {
    await conn.query(
      `INSERT INTO cms_vehicles
        (slug, name, tagline, seats, beds, highlight, image, about, gallery_json, specs_json, features_json, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         name=VALUES(name), tagline=VALUES(tagline), seats=VALUES(seats), beds=VALUES(beds),
         highlight=VALUES(highlight), image=VALUES(image), about=VALUES(about),
         gallery_json=VALUES(gallery_json), specs_json=VALUES(specs_json),
         features_json=VALUES(features_json), sort_order=VALUES(sort_order)`,
      [
        v.slug,
        v.name,
        v.tagline,
        v.seats,
        v.beds,
        v.highlight,
        v.image,
        v.about,
        JSON.stringify(v.gallery),
        JSON.stringify(v.specs),
        JSON.stringify(v.features),
        v.sort_order,
      ]
    );
  }

  for (const [i, b] of blogs.entries()) {
    await conn.query(
      `INSERT INTO cms_blog_posts
        (slug, title, category, excerpt, content_json, image, author, post_date, date_label, read_mins, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), category=VALUES(category), excerpt=VALUES(excerpt),
         content_json=VALUES(content_json), image=VALUES(image), author=VALUES(author),
         post_date=VALUES(post_date), date_label=VALUES(date_label), read_mins=VALUES(read_mins)`,
      [
        b.slug,
        b.title,
        b.category,
        b.excerpt,
        JSON.stringify(b.content),
        b.image,
        b.author,
        b.date,
        b.dateLabel,
        b.readMins,
        i + 1,
      ]
    );
  }

  console.log("CMS content migration + seed done");
  await conn.end();
} catch (e) {
  console.error("Failed:", e.code || "", e.message);
  process.exit(1);
}
