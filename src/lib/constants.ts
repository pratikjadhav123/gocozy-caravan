export const SITE = {
  name: "GoCozyCaravan",
  tagline: "Luxury caravan travel across India",
  description:
    "Premium Force Traveller caravans for family trips, weekend getaways, and curated road journeys across India.",
  email: "GoCozyCaravan@gmail.com",
  phone: "9145111125",
  phoneDisplay: "+91 91451 11125",
  whatsappNumber: "919145111125",
  address: "Pune, Maharashtra · Serving all India",
  instagram: "https://www.instagram.com/gocozycaravan",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Our Fleet" },
  { href: "/destinations", label: "Destinations" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" },
  { href: "/amenities", label: "Amenities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const DESTINATIONS = [
  "Pune",
  "Mumbai",
  "Lonavala",
  "Mahabaleshwar",
  "Alibaug",
  "Goa",
  "Kolhapur",
  "Nashik",
  "Shirdi",
  "Delhi",
  "Agra",
  "Jaipur",
  "Udaipur",
  "Jaisalmer",
  "Manali",
  "Shimla",
  "Rishikesh",
  "Leh / Ladakh",
  "Rann of Kutch",
  "Ahmedabad",
  "Bengaluru",
  "Mysore",
  "Ooty",
  "Coorg",
  "Kerala (Munnar / Alleppey)",
  "Pondicherry",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Darjeeling",
  "Custom / Other (India)",
] as const;

export const INCLUDED_IN_QUOTE = [
  "Professional chauffeur (on request)",
  "Pre-trip vehicle walkthrough",
  "Basic insurance on trips",
  "Roadside assistance coordination",
  "WhatsApp booking support",
] as const;

export const NOT_INCLUDED = [
  "Toll taxes & state entry permits",
  "Parking charges",
  "Driver allowance / night halt",
  "Fuel (quoted separately by trip)",
] as const;

export const FAQS = [
  {
    q: "Do I need a special licence to drive?",
    a: "Most trips include a professional chauffeur. Self-drive is discussed case-by-case — we confirm at booking time.",
  },
  {
    q: "What is included in the rate?",
    a: "Base hire, vehicle amenities, and support as listed on each van page. Fuel, tolls, parking, and driver night halt are usually quoted separately.",
  },
  {
    q: "How many people can sleep on board?",
    a: "Go Cozy Caravan units sleep about 2 (convertible lounge). Urbaniya is a spacious 15–16 seater for day / group travel — overnight layouts are confirmed when you book.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Share your dates on WhatsApp and we confirm the advance and cancellation rules before you pay.",
  },
  {
    q: "Where do we pick up and drop off?",
    a: "Pickup is flexible across India (Pune base). Exact point is fixed when we confirm your slot.",
  },
  {
    q: "How do I book a particular van?",
    a: "Open the van’s detail page → Check availability / Book this caravan → fill dates → we open WhatsApp with that vehicle pre-selected.",
  },
] as const;

export const VEHICLES = [
  {
    id: "cozy-caravan-1",
    name: "Go Cozy Caravan",
    tagline: "LED lounge caravan with fridge — ideal for couples & small families",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, fridge",
    image: "/images/gallery/exterior-side-trees.png",
    gallery: [
      { src: "/images/gallery/exterior-side-trees.png", alt: "Go Cozy Caravan exterior" },
      { src: "/images/gallery/interior-lounge-1.png", alt: "LED lounge interior" },
      { src: "/images/gallery/interior-tv.png", alt: "Smart TV entertainment" },
      { src: "/images/gallery/interior-bed.png", alt: "Convertible sleeping area" },
      { src: "/images/gallery/interior-bathroom.png", alt: "Onboard bathroom" },
      { src: "/images/hero-van.png", alt: "Van front view" },
    ],
    about:
      "A premium Force Traveller caravan fitted with quilted leather lounge seating, climate control, smart TV, and a fridge — perfect for weekend escapes and overnight road trips across India.",
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
  },
  {
    id: "cozy-caravan-2",
    name: "Go Cozy Caravan Kitchen",
    tagline: "Same cozy lounge — plus kitchen, fridge & oven for longer trips",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, kitchen, fridge, oven",
    image: "/images/gallery/family-lounge.png",
    gallery: [
      { src: "/images/gallery/family-lounge.png", alt: "Family lounge seating" },
      { src: "/images/gallery/interior-sofa.png", alt: "Quilted sofa seating" },
      { src: "/images/gallery/interior-kitchen.png", alt: "Kitchen and fittings" },
      { src: "/images/gallery/interior-aisle.png", alt: "Cabin aisle view" },
      { src: "/images/gallery/interior-bathroom.png", alt: "Washroom" },
      { src: "/images/gallery/exterior-side-road.png", alt: "Exterior map wrap" },
    ],
    about:
      "Built like our flagship lounge caravan, with a full kitchen setup — fridge and oven — so families can cook light meals and stay longer on multi-day journeys.",
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
  },
  {
    id: "cozy-urbaniya",
    name: "Go Cozy Urbaniya",
    tagline: "15–16 seater Urbaniya — AC & smart sound for group travel",
    seats: "15–16",
    beds: null,
    highlight: "AC, smart sound system — spacious group travel",
    image: "/images/gallery/interior-lounge-1.png",
    gallery: [
      { src: "/images/gallery/interior-lounge-1.png", alt: "Urbania spacious cabin" },
      { src: "/images/gallery/interior-lounge-2.png", alt: "Group seating layout" },
      { src: "/images/gallery/interior-seating.png", alt: "Premium seating" },
      { src: "/images/gallery/interior-tv.png", alt: "Cabin entertainment" },
      { src: "/images/hero-van-side.png", alt: "Vehicle exterior side" },
      { src: "/images/gallery/exterior-rear.png", alt: "Rear exterior view" },
    ],
    about:
      "Go Cozy Urbaniya is built for larger groups — office outings, temple trips, and celebrations. Spacious 15–16 seating with AC and a smart sound system for a comfortable ride.",
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
  },
] as const;

export type Vehicle = (typeof VEHICLES)[number];

export function getVehicle(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

export function vehicleCapacityLabel(vehicle: Vehicle): string {
  if (vehicle.beds) return `${vehicle.seats} seats · ${vehicle.beds} beds`;
  return `${vehicle.seats} seats`;
}

export const AMENITIES = [
  {
    title: "Luxury seating & bedding",
    description: "Quilted leather lounge with convertible sleeping space for overnight comfort.",
    icon: "sofa",
  },
  {
    title: "Climate control",
    description: "Roof-mounted AC and ventilation for all-season travel across India.",
    icon: "ac",
  },
  {
    title: "Entertainment",
    description: "Smart TV, premium / smart sound system, and charging points throughout.",
    icon: "tv",
  },
  {
    title: "Private bathroom",
    description: "Compact wet bath with shower, geyser, and modern fittings.",
    icon: "bath",
  },
  {
    title: "Kitchen & fridge",
    description: "Kitchenette with fridge and oven options for warm meals on the road.",
    icon: "kitchen",
  },
  {
    title: "Ambient lighting",
    description: "LED lounge strips and dimmable spots for a cozy evening atmosphere.",
    icon: "light",
  },
] as const;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
