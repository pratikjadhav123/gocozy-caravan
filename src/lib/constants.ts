export const SITE = {
  name: "GoCozyCaravan",
  tagline: "Luxury caravan travel across Maharashtra",
  description:
    "Premium Force Traveller caravans for family trips, weekend getaways, and curated road journeys from Pune.",
  email: "GoCozyCaravan@gmail.com",
  phone: "9145111125",
  phoneDisplay: "+91 91451 11125",
  whatsappNumber: "919145111125",
  address: "Pune, Maharashtra, India",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/amenities", label: "Amenities" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/book", label: "Book Now" },
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
] as const;

export const VEHICLES = [
  {
    id: "cozy-premium",
    name: "Go Cozy Premium",
    seats: "8–12",
    beds: "4–6",
    highlight: "LED lounge, smart TV, AC, premium leather seating",
    image: "/images/gallery/interior-lounge-1.svg",
  },
  {
    id: "cozy-family",
    name: "Go Cozy Family",
    seats: "10–14",
    beds: "6–8",
    highlight: "Spacious layout, kitchenette, bathroom with shower",
    image: "/images/gallery/interior-seating.svg",
  },
  {
    id: "cozy-elite",
    name: "Go Cozy Elite",
    seats: "6–8",
    beds: "4",
    highlight: "Executive cabin, mood lighting, entertainment suite",
    image: "/images/gallery/interior-tv.svg",
  },
] as const;

export const AMENITIES = [
  {
    title: "Luxury seating & bedding",
    description: "Quilted leather lounge that converts to comfortable sleeping space.",
    icon: "sofa",
  },
  {
    title: "Climate control",
    description: "Roof-mounted AC and ventilation for all-season comfort.",
    icon: "ac",
  },
  {
    title: "Entertainment",
    description: "Large smart TV, premium audio, and charging points throughout.",
    icon: "tv",
  },
  {
    title: "Private bathroom",
    description: "Compact wet bath with shower, geyser, and modern fittings.",
    icon: "bath",
  },
  {
    title: "Kitchenette",
    description: "Microwave, storage, and essentials for snacks and warm meals on the road.",
    icon: "kitchen",
  },
  {
    title: "Ambient lighting",
    description: "LED strips and dimmable spots for a cozy evening atmosphere.",
    icon: "light",
  },
] as const;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
