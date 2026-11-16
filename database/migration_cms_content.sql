-- Full website CMS: fleet + blog (phpMyAdmin)
USE `gocozy_caravan`;

CREATE TABLE IF NOT EXISTS `cms_vehicles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL DEFAULT '',
  `seats` VARCHAR(40) NOT NULL DEFAULT '',
  `beds` VARCHAR(40) NULL DEFAULT NULL,
  `highlight` VARCHAR(255) NOT NULL DEFAULT '',
  `image` VARCHAR(500) NOT NULL,
  `about` TEXT NULL,
  `gallery_json` LONGTEXT NULL,
  `specs_json` LONGTEXT NULL,
  `features_json` LONGTEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_vehicles_slug` (`slug`),
  KEY `idx_cms_vehicles_active` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(160) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(120) NOT NULL DEFAULT 'Travel guides',
  `excerpt` TEXT NULL,
  `content_json` LONGTEXT NULL,
  `image` VARCHAR(500) NOT NULL,
  `author` VARCHAR(120) NOT NULL DEFAULT 'Go Cozy Team',
  `post_date` DATE NOT NULL,
  `date_label` VARCHAR(40) NOT NULL DEFAULT '',
  `read_mins` SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_blog_slug` (`slug`),
  KEY `idx_cms_blog_active` (`is_active`, `post_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
