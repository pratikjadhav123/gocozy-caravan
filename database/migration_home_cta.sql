-- Home "Ready to plan your trip?" CTA block (texts + image slot)
USE `gocozy_caravan`;

INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('home_cta_title', 'Home CTA — Title', 'Ready to plan your trip?'),
('home_cta_body', 'Home CTA — Body text', 'Share dates and group size — we confirm pricing on WhatsApp. Follow journeys on Instagram too.'),
('home_cta_phone', 'Home CTA — Phone display', '+91 91451 11125'),
('home_cta_email', 'Home CTA — Email', 'GoCozyCaravan@gmail.com'),
('home_cta_office', 'Home CTA — Office address', 'Office 103, Gera Imperium Rise, opposite Wipro Circle, Hinjawadi Phase II, Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057'),
('home_cta_instagram_label', 'Home CTA — Instagram label', 'Instagram @gocozycaravan'),
('home_cta_instagram_url', 'Home CTA — Instagram URL', 'https://www.instagram.com/gocozycaravan'),
('home_cta_primary_label', 'Home CTA — Primary button label', 'Book a slot'),
('home_cta_primary_href', 'Home CTA — Primary button link', '/book'),
('home_cta_secondary_label', 'Home CTA — Secondary button label', 'View packages'),
('home_cta_secondary_href', 'Home CTA — Secondary button link', '/packages'),
('home_cta_image_alt', 'Home CTA — Image alt text', 'Luxury caravan interior with seating and lighting')
ON DUPLICATE KEY UPDATE label = VALUES(label);

INSERT INTO `site_media` (`slot_key`, `label`, `section`, `file_url`, `alt_text`, `is_active`) VALUES
('home_cta_image', 'Home CTA — Side image', 'home_cta', '/images/gallery/interior-lounge-2.png', 'Luxury caravan interior with seating and lighting', 1)
ON DUPLICATE KEY UPDATE label = VALUES(label), section = VALUES(section);
