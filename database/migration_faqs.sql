-- Dynamic FAQ items for public site
USE `gocozy_caravan`;

CREATE TABLE IF NOT EXISTS `cms_faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_faq_slug` (`slug`),
  KEY `idx_cms_faq_active` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cms_faqs` (`slug`, `question`, `answer`, `sort_order`, `is_active`) VALUES
('licence', 'Do I need a special licence to drive?', 'Most trips include a professional chauffeur. Self-drive is discussed case-by-case — we confirm at booking time.', 10, 1),
('rate-includes', 'What is included in the rate?', 'Base hire, vehicle amenities, and support as listed on each van page. Fuel, tolls, parking, and driver night halt are usually quoted separately.', 20, 1),
('sleeping', 'How many people can sleep on board?', 'Go Cozy Caravan units sleep about 2 (convertible lounge). Urbania is a spacious 15–16 seater for day / group travel — overnight layouts are confirmed when you book.', 30, 1),
('cancellation', 'What is the cancellation policy?', 'Share your dates on WhatsApp and we confirm the advance and cancellation rules before you pay.', 40, 1),
('pickup', 'Where do we pick up and drop off?', 'Pickup is flexible across India (Pune base). Exact point is fixed when we confirm your slot.', 50, 1),
('book-van', 'How do I book a particular van?', 'Open the van’s detail page → Check availability / Book this caravan → fill dates → we open WhatsApp with that vehicle pre-selected.', 60, 1)
ON DUPLICATE KEY UPDATE
  question = VALUES(question),
  answer = VALUES(answer),
  sort_order = VALUES(sort_order);

INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('faq_title', 'FAQ — Section title', 'Frequently asked questions'),
('faq_subtitle', 'FAQ — Section subtitle', 'Straight answers before you book your trip.'),
('footer_blurb', 'Footer — Brand description', 'Premium Force Traveller caravans for family trips, weekend getaways, and curated road journeys across India.')
ON DUPLICATE KEY UPDATE label = VALUES(label);
