-- Go Cozy Caravan — MySQL schema (phpMyAdmin compatible)
-- Import this file in phpMyAdmin → Import, or run in SQL tab.
-- Charset: utf8mb4 (emoji / Indian languages safe)

CREATE DATABASE IF NOT EXISTS `gocozy_caravan`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `gocozy_caravan`;

-- --------------------------------------------------------
-- Admins (CRM login)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin','admin','staff') NOT NULL DEFAULT 'admin',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin (change password after first login)
-- Email: admin@gocozycaravan.com
-- Password: Admin@123
INSERT INTO `admins` (`name`, `email`, `password_hash`, `role`)
VALUES (
  'Go Cozy Admin',
  'admin@gocozycaravan.com',
  '$2b$10$wnduw62y3Z/0m/m.ZuKm.OuOTuHv5iQLwG/J/R2Lo4JBUHZWdnFkK',
  'super_admin'
)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- --------------------------------------------------------
-- Bookings (user website → CRM)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_no` VARCHAR(32) NOT NULL COMMENT 'Public booking reference e.g. GCC-20261105-A1B2',
  `status` ENUM(
    'new',
    'contacted',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
  ) NOT NULL DEFAULT 'new',
  `customer_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(190) NULL DEFAULT NULL,
  `guests` SMALLINT UNSIGNED NULL DEFAULT NULL,
  `vehicle_id` VARCHAR(64) NOT NULL,
  `vehicle_name` VARCHAR(150) NOT NULL,
  `pickup_date` DATE NOT NULL,
  `return_date` DATE NOT NULL,
  `destination` VARCHAR(190) NOT NULL,
  `pickup_city` VARCHAR(120) NULL DEFAULT NULL,
  `message` TEXT NULL,
  `admin_notes` TEXT NULL,
  `quoted_amount` DECIMAL(12,2) NULL DEFAULT NULL,
  `confirmed_at` DATETIME NULL DEFAULT NULL,
  `currency` VARCHAR(8) NOT NULL DEFAULT 'INR',
  `source` VARCHAR(40) NOT NULL DEFAULT 'website',
  `assigned_admin_id` INT UNSIGNED NULL DEFAULT NULL,
  `whatsapp_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `confirmation_whatsapp_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `confirmation_email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `confirmation_sent_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bookings_reference` (`reference_no`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_pickup` (`pickup_date`),
  KEY `idx_bookings_created` (`created_at`),
  KEY `idx_bookings_phone` (`phone`),
  KEY `idx_bookings_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_bookings_admin`
    FOREIGN KEY (`assigned_admin_id`) REFERENCES `admins` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Booking status history (CRM audit trail)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `booking_status_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `old_status` VARCHAR(32) NULL DEFAULT NULL,
  `new_status` VARCHAR(32) NOT NULL,
  `changed_by_admin_id` INT UNSIGNED NULL DEFAULT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bsl_booking` (`booking_id`),
  CONSTRAINT `fk_bsl_booking`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bsl_admin`
    FOREIGN KEY (`changed_by_admin_id`) REFERENCES `admins` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Contact enquiries from website
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_no` VARCHAR(32) NOT NULL,
  `status` ENUM('new','replied','closed') NOT NULL DEFAULT 'new',
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(190) NULL DEFAULT NULL,
  `subject` VARCHAR(190) NULL DEFAULT NULL,
  `message` TEXT NOT NULL,
  `admin_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_contacts_reference` (`reference_no`),
  KEY `idx_contacts_status` (`status`),
  KEY `idx_contacts_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Daily CRM helpers (optional views)
-- --------------------------------------------------------
CREATE OR REPLACE VIEW `v_today_bookings` AS
SELECT *
FROM `bookings`
WHERE `pickup_date` = CURDATE()
   OR DATE(`created_at`) = CURDATE()
ORDER BY `created_at` DESC;

CREATE OR REPLACE VIEW `v_booking_pipeline` AS
SELECT
  `status`,
  COUNT(*) AS total,
  SUM(CASE WHEN DATE(`created_at`) = CURDATE() THEN 1 ELSE 0 END) AS created_today
FROM `bookings`
GROUP BY `status`;
