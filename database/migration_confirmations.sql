-- Run in phpMyAdmin SQL tab if DB was created before confirmation fields.
-- Ignore "Duplicate column" errors if columns already exist.

USE `gocozy_caravan`;

ALTER TABLE `bookings`
  ADD COLUMN `confirmed_at` DATETIME NULL DEFAULT NULL AFTER `quoted_amount`;

ALTER TABLE `bookings`
  ADD COLUMN `confirmation_whatsapp_sent` TINYINT(1) NOT NULL DEFAULT 0 AFTER `whatsapp_sent`;

ALTER TABLE `bookings`
  ADD COLUMN `confirmation_email_sent` TINYINT(1) NOT NULL DEFAULT 0 AFTER `confirmation_whatsapp_sent`;

ALTER TABLE `bookings`
  ADD COLUMN `confirmation_sent_at` DATETIME NULL DEFAULT NULL AFTER `confirmation_email_sent`;
