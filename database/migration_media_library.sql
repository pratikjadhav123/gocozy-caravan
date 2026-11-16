-- Media Library + Testimonials
USE `gocozy_caravan`;

CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(190) NOT NULL,
  `category` VARCHAR(80) NOT NULL DEFAULT 'general',
  `alt_text` VARCHAR(255) NULL DEFAULT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_name` VARCHAR(190) NULL DEFAULT NULL,
  `file_size` INT UNSIGNED NULL DEFAULT NULL,
  `mime_type` VARCHAR(80) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_media_library_category` (`category`),
  KEY `idx_media_library_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_testimonials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `customer_name` VARCHAR(190) NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `review` TEXT NOT NULL,
  `photo_url` VARCHAR(500) NULL DEFAULT NULL,
  `location` VARCHAR(120) NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_testimonials_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cms_testimonials` (`slug`, `customer_name`, `rating`, `review`, `location`, `sort_order`) VALUES
('anita-pune', 'Anita S.', 5, 'Perfect weekend escape to Lonavala. The lounge and AC made the trip so comfortable for our family.', 'Pune', 1),
('rahul-mumbai', 'Rahul M.', 5, 'Booked Urbania for a group temple trip. Smooth coordination on WhatsApp and a great experience.', 'Mumbai', 2),
('neha-goa', 'Neha K.', 5, 'Kitchen caravan was ideal for our Goa road trip. Clean interiors and helpful team.', 'Goa', 3)
ON DUPLICATE KEY UPDATE `customer_name` = VALUES(`customer_name`);

INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('settings_site_name', 'Settings — Site name', 'GoCozyCaravan'),
('settings_tagline', 'Settings — Tagline', 'Luxury caravan travel across India'),
('settings_phone', 'Settings — Phone display', '+91 91451 11125'),
('settings_email', 'Settings — Email', 'GoCozyCaravan@gmail.com'),
('settings_instagram', 'Settings — Instagram URL', 'https://www.instagram.com/gocozycaravan'),
('settings_seo_title', 'Settings — SEO title', 'Go Cozy Caravan | Luxury Caravan Rentals'),
('settings_seo_description', 'Settings — SEO description', 'Premium Force Traveller caravans for family trips, weekend getaways, and curated road journeys across India.')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);
