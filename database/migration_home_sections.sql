-- Home page CMS: hero, destinations, amenities, gallery, about
USE `gocozy_caravan`;

CREATE TABLE IF NOT EXISTS `cms_hero_slides` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `eyebrow` VARCHAR(190) NOT NULL DEFAULT '',
  `title` VARCHAR(190) NOT NULL,
  `highlight` VARCHAR(190) NOT NULL DEFAULT '',
  `caption` TEXT NULL,
  `image` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_hero_slug` (`slug`),
  KEY `idx_cms_hero_active` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_destinations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `name` VARCHAR(190) NOT NULL,
  `blurb` VARCHAR(255) NULL DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `show_on_home` TINYINT(1) NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_dest_slug` (`slug`),
  KEY `idx_cms_dest_home` (`show_on_home`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_amenities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `title` VARCHAR(190) NOT NULL,
  `description` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_amenity_slug` (`slug`),
  KEY `idx_cms_amenity_active` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cms_hero_slides` (`slug`, `eyebrow`, `title`, `highlight`, `caption`, `image`, `alt_text`, `sort_order`) VALUES
('slide-1', 'Luxury caravan travel across India', 'Your Journey,', 'Your Home On Wheels.', 'Luxury motorhomes & caravans for India road trips.', '/images/slider/slide-1.png', 'Go Cozy motorhome with outdoor seating', 1),
('slide-2', 'Luxury caravan travel across India', 'Travel in comfort.', 'Sleep under the stars.', 'Premium lounge, AC, and onboard bathroom ready.', '/images/slider/slide-2.png', 'Go Cozy Karavan front view on the road', 2),
('slide-3', 'Luxury caravan travel across India', 'Go Cozy fleet.', 'Built for the open road.', 'Caravan, kitchen caravan & Urbania for every group.', '/images/slider/slide-3.png', 'Go Cozy Caravan side branding', 3),
('slide-4', 'Luxury caravan travel across India', 'Camp in style.', 'Awning nights included.', 'Outdoor living with kitchen options on select vans.', '/images/slider/slide-4.png', 'Go Cozy caravan night setup with awning', 4),
('slide-urbania', 'Luxury caravan travel across India', 'Groups travel big.', 'Urbania 15–16 seats.', 'AC and smart sound for celebrations & tours.', '/images/fleet/urbania-hills.png', 'Go Cozy Urbania luxury van', 5),
('slide-palace', 'Luxury caravan travel across India', 'Arrive in style.', 'Urbania for every occasion.', 'Temple trips, weddings, corporate outings — book on WhatsApp.', '/images/fleet/urbania-palace.png', 'Go Cozy Urbania at heritage venue', 6),
('slide-lifestyle', 'Luxury caravan travel across India', 'Across all India.', 'Hills · coast · desert.', 'Pick a destination — we confirm on WhatsApp.', '/images/slider/slide-lifestyle.png', 'Caravan lifestyle by the lake', 7)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `cms_destinations` (`slug`, `name`, `blurb`, `image`, `sort_order`, `show_on_home`) VALUES
('lonavala', 'Lonavala & Khandala', 'Hill-station classic from Pune/Mumbai', '/images/slider/slide-1.png', 1, 1),
('alibaug', 'Alibaug & Konkan', 'Beach weekends and coastal sunsets', '/images/slider/slide-lifestyle.png', 2, 1),
('mahabaleshwar', 'Mahabaleshwar', 'Cool weather and scenic ghats', '/images/fleet/caravan-awning.png', 3, 1),
('goa', 'Goa', 'Beach roads and multi-day coastal loops', '/images/slider/slide-4.png', 4, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `cms_amenities` (`slug`, `title`, `description`, `sort_order`) VALUES
('luxury-seating', 'Luxury seating & bedding', 'Quilted leather lounge with convertible sleeping space for overnight comfort.', 1),
('climate', 'Climate control', 'Roof-mounted AC and ventilation for all-season travel across India.', 2),
('entertainment', 'Entertainment', 'Smart TV, premium / smart sound system, and charging points throughout.', 3),
('bathroom', 'Private bathroom', 'Compact wet bath with shower, geyser, and modern fittings.', 4),
('kitchen', 'Kitchen & fridge', 'Kitchenette with fridge and oven options for warm meals on the road.', 5),
('lighting', 'Ambient lighting', 'LED lounge strips and dimmable spots for a cozy evening atmosphere.', 6)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `site_media` (`slot_key`, `label`, `section`, `file_url`, `alt_text`) VALUES
('home_gallery_1', 'Fleet moments 1', 'home_gallery', '/images/slider/slide-1.png', 'Fleet moment 1'),
('home_gallery_2', 'Fleet moments 2', 'home_gallery', '/images/slider/slide-2.png', 'Fleet moment 2'),
('home_gallery_3', 'Fleet moments 3', 'home_gallery', '/images/slider/slide-3.png', 'Fleet moment 3'),
('home_gallery_4', 'Fleet moments 4', 'home_gallery', '/images/fleet/caravan-night.png', 'Night caravan with kitchen'),
('home_gallery_5', 'Fleet moments 5', 'home_gallery', '/images/fleet/caravan-awning.png', 'Awning and outdoor living'),
('home_gallery_6', 'Fleet moments 6', 'home_gallery', '/images/fleet/urbania-hills.png', 'Go Cozy Urbania exterior'),
('home_gallery_7', 'Fleet moments 7', 'home_gallery', '/images/fleet/urbania-palace.png', 'Urbania at heritage venue'),
('home_gallery_8', 'Fleet moments 8', 'home_gallery', '/images/gallery/interior-lounge-1.png', 'Luxury lounge interior'),
('home_gallery_9', 'Fleet moments 9', 'home_gallery', '/images/gallery/family-lounge.png', 'Family lounge seating'),
('about_hero', 'About page hero', 'about', '/images/fleet/caravan-awning.png', 'Go Cozy caravan outdoor setup'),
('about_main', 'About main image', 'about', '/images/gallery/team-van.png', 'Go Cozy hosts with branded van'),
('about_interior', 'About interior image', 'about', '/images/gallery/family-lounge.png', 'Family in lounge'),
('about_exterior', 'About exterior image', 'about', '/images/gallery/exterior-side-road.png', 'Caravan roadside')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);

INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('home_fleet_title', 'Home — Our fleet title', 'Our fleet'),
('home_fleet_subtitle', 'Home — Our fleet subtitle', 'Two cozy caravans for families and Urbania for larger groups.'),
('home_gallery_title', 'Home — Fleet moments title', 'Fleet moments'),
('home_gallery_subtitle', 'Home — Fleet moments subtitle', 'Real Go Cozy vans — day trips, overnight stays & groups.'),
('home_dest_title', 'Home — Destinations title', 'Popular destinations'),
('home_dest_subtitle', 'Home — Destinations subtitle', 'Hills, beaches & desert — pick a vibe, then book.'),
('home_amenities_title', 'Home — Amenities title', 'Onboard amenities'),
('home_amenities_subtitle', 'Home — Amenities subtitle', 'Everything you need for a cozy journey across India.'),
('about_title', 'About — Title', 'About Go Cozy Caravan'),
('about_subtitle', 'About — Subtitle', 'Hotel-level comfort on the open road — curated for families, friends, and explorers across all India.'),
('about_body_1', 'About — Paragraph 1', 'GoCozyCaravan operates premium Force Traveller caravans and Urbania coaches customised with lounge seating, climate control, entertainment, kitchen options, and private bathroom facilities — so you can focus on the journey, not the logistics.'),
('about_body_2', 'About — Paragraph 2', 'Based in Pune and serving travellers across India — from Lonavala and Goa to Manali, Rajasthan, Kerala, and beyond. Whether it is a weekend escape or a multi-day family tour, our team helps you pick the right vehicle and travel dates.'),
('about_body_3', 'About — Paragraph 3', 'Every booking is handled personally on WhatsApp. Follow our reels and trips on Instagram.')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);
