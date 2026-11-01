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

export const VEHICLES = [
  {
    id: "cozy-caravan-1",
    name: "Go Cozy Caravan",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, fridge",
    image: "/images/gallery/exterior-side-trees.png",
  },
  {
    id: "cozy-caravan-2",
    name: "Go Cozy Caravan Kitchen",
    seats: "6–7",
    beds: "2",
    highlight: "LED lounge, smart TV, AC, premium leather seating, kitchen, fridge, oven",
    image: "/images/gallery/family-lounge.png",
  },
  {
    id: "cozy-urbaniya",
    name: "Go Cozy Urbaniya",
    seats: "15–16",
    beds: null,
    highlight: "AC, smart sound system — spacious group travel",
    image: "/images/gallery/interior-lounge-1.png",
  },
] as const;

export type Vehicle = (typeof VEHICLES)[number];

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
