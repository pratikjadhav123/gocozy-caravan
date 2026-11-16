-- CMS: dynamic images + package text (phpMyAdmin)
USE `gocozy_caravan`;

CREATE TABLE IF NOT EXISTS `site_media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slot_key` VARCHAR(80) NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `section` VARCHAR(60) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) NULL DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_site_media_slot` (`slot_key`),
  KEY `idx_site_media_section` (`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_packages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_key` VARCHAR(64) NOT NULL,
  `option_label` VARCHAR(190) NOT NULL,
  `title` VARCHAR(190) NOT NULL,
  `price` VARCHAR(64) NOT NULL,
  `unit` VARCHAR(64) NOT NULL DEFAULT '',
  `description` TEXT NULL,
  `includes_json` TEXT NULL,
  `excludes` VARCHAR(255) NULL DEFAULT NULL,
  `cta_label` VARCHAR(120) NOT NULL DEFAULT 'Enquire',
  `wa_message` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_site_packages_key` (`package_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_texts` (
  `text_key` VARCHAR(80) NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`text_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `site_media` (`slot_key`, `label`, `section`, `file_url`, `alt_text`) VALUES
('home_fleet_cozy-caravan-1', 'Home Fleet — Go Cozy Caravan', 'home_fleet', '/images/slider/slide-2.png', 'Go Cozy Caravan'),
('home_fleet_cozy-caravan-2', 'Home Fleet — Caravan Kitchen', 'home_fleet', '/images/fleet/caravan-night.png', 'Go Cozy Caravan Kitchen'),
('home_fleet_cozy-urbania', 'Home Fleet — Urbania', 'home_fleet', '/images/fleet/urbania-hills.png', 'Go Cozy Urbania'),
('blog_hero', 'Blog page hero image', 'blog', '/images/fleet/urbania-hills.png', 'Go Cozy on the road'),
('packages_hero', 'Packages page hero image', 'packages', '/images/slider/slide-1.png', 'Go Cozy trip packages'),
('home_gallery_1', 'Home gallery 1', 'home_gallery', '/images/slider/slide-1.png', 'Fleet moment 1'),
('home_gallery_2', 'Home gallery 2', 'home_gallery', '/images/slider/slide-2.png', 'Fleet moment 2'),
('home_gallery_3', 'Home gallery 3', 'home_gallery', '/images/slider/slide-3.png', 'Fleet moment 3')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);

INSERT INTO `site_packages` (
  `package_key`, `option_label`, `title`, `price`, `unit`, `description`,
  `includes_json`, `excludes`, `cta_label`, `wa_message`, `sort_order`
) VALUES
(
  'day-trip',
  'Option 01 — Below 400 km per day',
  '1-Day Trip Package',
  '₹13,000',
  '/ day',
  'A simple package for a day on the road.',
  '["1 driver and 1 assistant"]',
  'Tolls, fuel and border tax',
  'Enquire about this package',
  'Hi GoCozyCaravan, I want the 1-Day Trip Package (below 400 km/day) at ₹13,000/day. Please share availability.',
  1
),
(
  'km-wise',
  'Option 02 — Above 400 km per day',
  'KM-Wise Charges',
  '₹60',
  '/ km',
  'For longer routes and extended road journeys.',
  '["Driver, assistant and fuel included"]',
  'Toll tax and border tax',
  'Get a route-based quote',
  'Hi GoCozyCaravan, I need a KM-wise quote (above 400 km/day at ₹60/km). Here is my route and dates:',
  2
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('home_fleet_title', 'Home — Our fleet title', 'Our fleet'),
('home_fleet_subtitle', 'Home — Our fleet subtitle', 'Two cozy caravans for families and Urbania for larger groups.'),
('packages_eyebrow', 'Packages section eyebrow', 'Clear options, custom journeys'),
('packages_title', 'Packages section title', 'Choose your way to explore.'),
('packages_subtitle', 'Packages section subtitle', 'Share your route and schedule with us. We will help confirm the best option for your trip.')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);
