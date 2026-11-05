/** Marketing content: destinations, pickup locations, blog */

export const TRAVEL_DESTINATIONS = [
  {
    slug: "lonavala",
    name: "Lonavala & Khandala",
    region: "Maharashtra",
    status: "LIVE",
    blurb: "Hill-station classic from Pune/Mumbai — waterfalls, viewpoints, and easy overnight stops.",
    image: "/images/slider/slide-1.png",
    drive: "~2 hrs from Pune",
    ideal: "1–2 nights",
  },
  {
    slug: "alibaug",
    name: "Alibaug & Konkan",
    region: "Maharashtra",
    status: "LIVE",
    blurb: "Beach weekends, Mandwa ferry loops, and coastal sunsets with your caravan as home base.",
    image: "/images/slider/slide-lifestyle.png",
    drive: "~3–4 hrs",
    ideal: "2 nights",
  },
  {
    slug: "mahabaleshwar",
    name: "Mahabaleshwar",
    region: "Maharashtra",
    status: "LIVE",
    blurb: "Cool weather, strawberry farms, and scenic ghats — perfect for family caravan trips.",
    image: "/images/fleet/caravan-awning.png",
    drive: "~3 hrs from Pune",
    ideal: "2–3 nights",
  },
  {
    slug: "goa",
    name: "Goa",
    region: "Goa",
    status: "LIVE",
    blurb: "Beach roads, night markets, and multi-day coastal loops in full lounge comfort.",
    image: "/images/slider/slide-4.png",
    drive: "Multi-day",
    ideal: "3–5 nights",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan desert trails",
    region: "Rajasthan",
    status: "LIVE",
    blurb: "Jaipur, Udaipur, Jaisalmer — forts, dunes, and winter caravan nights under clear skies.",
    image: "/images/fleet/urbania-palace.png",
    drive: "Multi-day",
    ideal: "4–7 nights",
  },
  {
    slug: "manali",
    name: "Manali & Himachal",
    region: "Himachal",
    status: "LIVE",
    blurb: "Mountain air, river valleys, and scenic overnight halts with AC lounge comfort.",
    image: "/images/fleet/urbania-hills.png",
    drive: "Multi-day",
    ideal: "4–6 nights",
  },
  {
    slug: "kerala",
    name: "Kerala backwaters",
    region: "Kerala",
    status: "LIVE",
    blurb: "Munnar greenery and Alleppey vibes — slow travel with kitchen-ready caravans.",
    image: "/images/fleet/caravan-night.png",
    drive: "Multi-day",
    ideal: "4–6 nights",
  },
  {
    slug: "rann-of-kutch",
    name: "Rann of Kutch",
    region: "Gujarat",
    status: "LIVE",
    blurb: "White desert camps, winter evenings, and unforgettable caravan nights.",
    image: "/images/slider/slide-3.png",
    drive: "Multi-day",
    ideal: "3–5 nights",
  },
] as const;

export const PICKUP_LOCATIONS = [
  {
    slug: "pune",
    name: "Pune",
    status: "LIVE",
    badge: "HOME BASE",
    blurb: "Our primary hub — easy pickup for Lonavala, Mahabaleshwar, Shirdi, and pan-India tours.",
    image: "/images/slider/slide-2.png",
    routes: ["Lonavala", "Mahabaleshwar", "Shirdi", "Goa"],
    why: [
      {
        title: "Closest to our depot",
        text: "Fast vehicle handover, walkthrough, and same-day starts for weekend plans.",
      },
      {
        title: "Four great short routes",
        text: "Hills, temples, and coast within a few hours — ideal first caravan trip.",
      },
      {
        title: "Airport & hotel delivery",
        text: "Arrange pickup near airport, hotel, or home on request.",
      },
      {
        title: "Trained chauffeurs",
        text: "Local drivers who know ghat roads and overnight halt options.",
      },
    ],
    pickups: [
      { title: "Pune city / Kharadi side", note: "Best for east Pune residents and airport arrivals." },
      { title: "Hinjewadi / Baner", note: "Convenient for west Pune and IT corridors." },
      { title: "Hotel delivery", note: "We can meet at your hotel lobby by appointment." },
      { title: "Custom point", note: "Share your pin on WhatsApp — we confirm feasibility." },
    ],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    status: "LIVE",
    badge: "WEEKEND ESCAPES",
    blurb: "Start from Mumbai metro for Lonavala, Alibaug, Nashik, and Konkan coastal loops.",
    image: "/images/fleet/urbania-front.png",
    routes: ["Lonavala", "Alibaug", "Nashik", "Konkan"],
    why: [
      {
        title: "Four routes within ~5 hours",
        text: "Hills, beaches, wine country, and Konkan — perfect weekend escapes.",
      },
      {
        title: "Metro pickup options",
        text: "Western suburbs, Thane, or Navi Mumbai — pick what suits your start.",
      },
      {
        title: "Airport-friendly",
        text: "Flying in? We coordinate handover near Andheri / BKC by request.",
      },
      {
        title: "Chauffeur included option",
        text: "Skip city traffic stress — sit back in the LED lounge.",
      },
    ],
    pickups: [
      { title: "Andheri / Airport side", note: "Best for flyers and western suburbs." },
      { title: "Thane / northern gateway", note: "Ideal for Nashik / Igatpuri direction." },
      { title: "Navi Mumbai / Konkan side", note: "Smooth start toward Alibaug & coast." },
      { title: "Western suburbs", note: "Borivali–Goregaon corridor by appointment." },
    ],
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    status: "LIVE",
    badge: "NORTH INDIA",
    blurb: "Gateway for Rajasthan, Agra, Rishikesh, and Himachal caravan journeys.",
    image: "/images/fleet/urbania-hills.png",
    routes: ["Jaipur", "Agra", "Rishikesh", "Manali"],
    why: [
      {
        title: "North India launchpad",
        text: "Desert, heritage, and mountains — plan multi-day loops with comfort onboard.",
      },
      {
        title: "Group-ready Urbania",
        text: "15–16 seater option for family reunions and corporate day trips.",
      },
      {
        title: "Flexible handover",
        text: "NCR pickup points confirmed on WhatsApp before travel day.",
      },
      {
        title: "Winter season specials",
        text: "Rajasthan & desert nights are peak — book early.",
      },
    ],
    pickups: [
      { title: "South Delhi / Airport", note: "Convenient for travellers flying into IGI." },
      { title: "Gurgaon / Noida", note: "Suburb starts for longer highway runs." },
      { title: "Hotel delivery", note: "Meet at your stay — confirm slot in advance." },
      { title: "Custom pin", note: "Share location; we confirm route timing." },
    ],
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    status: "LIVE",
    badge: "SOUTH INDIA",
    blurb: "South India base for Coorg, Ooty, Mysore, and Kerala leisure loops.",
    image: "/images/slider/slide-1.png",
    routes: ["Coorg", "Ooty", "Mysore", "Kerala"],
    why: [
      {
        title: "Weekend hill circuits",
        text: "Coorg and Ooty make excellent 2–3 night caravan breaks.",
      },
      {
        title: "Kitchen caravan friendly",
        text: "Longer south routes pair well with fridge & oven onboard.",
      },
      {
        title: "City to nature fast",
        text: "Leave the traffic behind and sleep under cool hill weather.",
      },
      {
        title: "Chauffeur support",
        text: "Professional drivers for ghat sections and overnight planning.",
      },
    ],
    pickups: [
      { title: "Airport / North Bengaluru", note: "Ideal for fly-in guests." },
      { title: "Whitefield / East", note: "Convenient for east-side residents." },
      { title: "South Bengaluru", note: "Good start toward Mysore / Ooty." },
      { title: "Hotel meet", note: "Lobby handover by appointment." },
    ],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    status: "LIVE",
    badge: "LIVE",
    blurb: "Central south hub — temple towns, weekend getaways, and comfort group travel.",
    image: "/images/fleet/urbania-heritage.png",
    routes: ["Tirupati", "Goa", "Coastal loops"],
    why: [
      { title: "Temple & leisure trips", text: "Urbania shines for larger family groups." },
      { title: "Multi-day comfort", text: "AC lounge and sound system for long highway days." },
      { title: "Flexible dates", text: "Confirm availability on WhatsApp with your route." },
      { title: "Verified walkthrough", text: "Full cabin briefing before you roll out." },
    ],
    pickups: [
      { title: "City / Airport", note: "Handover near airport or central hotels." },
      { title: "Financial district", note: "Weekend starts after work made easy." },
      { title: "Custom pin", note: "Share location on chat." },
      { title: "Hotel delivery", note: "Available on request." },
    ],
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    status: "LIVE",
    badge: "GUJARAT",
    blurb: "Start for Rann of Kutch, Dwarka, and Gujarat heritage road trips.",
    image: "/images/fleet/caravan-night.png",
    routes: ["Rann of Kutch", "Dwarka", "Gir region"],
    why: [
      { title: "Desert season ready", text: "Winter Rann trips are a guest favourite." },
      { title: "Family lounge comfort", text: "Sleep onboard between temple & beach stops." },
      { title: "Local route know-how", text: "We help plan halt points and timing." },
      { title: "WhatsApp booking", text: "Fast confirmation for peak winter weekends." },
    ],
    pickups: [
      { title: "City / SG Highway", note: "Popular residential start points." },
      { title: "Airport side", note: "Fly-in guests welcome." },
      { title: "Hotel meet", note: "By appointment." },
      { title: "Custom", note: "Share pin on WhatsApp." },
    ],
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "caravan-nights-desert-winter",
    title: "Caravan nights in the desert: Rann of Kutch & Jaisalmer in winter",
    category: "Travel guides",
    date: "2025-11-05",
    dateLabel: "5 NOV 2025",
    author: "Go Cozy Team",
    readMins: 8,
    excerpt:
      "How cold desert nights get, what to pack, and why a heated lounge caravan changes the trip.",
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
    excerpt:
      "Chauffeur vs self-drive, overnight parking norms, and simple checks before every departure.",
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
  {
    slug: "mumbai-routes-guide",
    title: "Best caravan routes from Mumbai: distances & why each works",
    category: "Routes",
    date: "2025-09-18",
    dateLabel: "18 SEP 2025",
    author: "Go Cozy Team",
    readMins: 10,
    excerpt: "Lonavala, Alibaug, Nashik, and Konkan — pick the loop that matches your group size.",
    image: "/images/fleet/urbania-front.png",
    content: [
      "Lonavala is the easiest first trip. Alibaug adds beach energy. Nashik is great for wine-country weekends. Konkan rewards multi-day travellers.",
      "Leave Mumbai outside peak traffic windows when you can — your chauffeur will suggest timing.",
      "Message us with dates and headcount; we’ll match Caravan, Kitchen, or Urbania.",
    ],
  },
  {
    slug: "what-is-included-booking",
    title: "What’s included when you book Go Cozy (and what isn’t)",
    category: "Booking tips",
    date: "2025-09-01",
    dateLabel: "1 SEP 2025",
    author: "Go Cozy Team",
    readMins: 5,
    excerpt: "Chauffeur, walkthrough, insurance basics vs tolls, parking, fuel, and driver night halt.",
    image: "/images/gallery/interior-lounge-2.png",
    content: [
      "Quotes typically cover vehicle hire, amenities onboard, and support over WhatsApp.",
      "Fuel, tolls, parking, permits, and driver night halt are usually extra — we state this before you pay advance.",
      "Open any vehicle detail page for the included / not-included checklist.",
    ],
  },
  {
    slug: "kitchen-vs-lounge-caravan",
    title: "Lounge caravan vs kitchen caravan: which should you book?",
    category: "Fleet tips",
    date: "2025-08-12",
    dateLabel: "12 AUG 2025",
    author: "Go Cozy Team",
    readMins: 5,
    excerpt: "Fridge-only vs kitchen + oven — choose based on trip length and how you like to eat.",
    image: "/images/fleet/caravan-awning.png",
    content: [
      "Go Cozy Caravan is perfect for short escapes with fridge and LED lounge comfort.",
      "Go Cozy Caravan Kitchen adds kitchen, fridge, and oven for multi-day family trips.",
      "Urbania is the group coach — 15–16 seats with AC and smart sound for day travel.",
    ],
  },
] as const;

export type BlogPost = (typeof BLOG_POSTS)[number];
export type TravelDestination = (typeof TRAVEL_DESTINATIONS)[number];
export type PickupLocation = (typeof PICKUP_LOCATIONS)[number];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getDestination(slug: string) {
  return TRAVEL_DESTINATIONS.find((d) => d.slug === slug);
}

export function getLocation(slug: string) {
  return PICKUP_LOCATIONS.find((l) => l.slug === slug);
}
