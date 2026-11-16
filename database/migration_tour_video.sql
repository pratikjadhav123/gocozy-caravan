-- Tour / walkthrough video section (home) — editable via admin Pages → Tour video
INSERT INTO `site_texts` (`text_key`, `label`, `content`) VALUES
('home_tour_eyebrow', 'Home — Tour eyebrow', 'Take a closer look'),
('home_tour_title', 'Home — Tour title', 'Step inside'),
('home_tour_highlight', 'Home — Tour highlight (script line)', 'your next adventure.'),
('home_tour_body', 'Home — Tour body', 'See the layout, discover the amenities and get a feel for life on board before you enquire.'),
('home_tour_cta', 'Home — Tour CTA label', 'Watch the caravan tour'),
('home_tour_url', 'Home — Tour YouTube / video URL', ''),
('home_tour_badge', 'Home — Tour video badge', 'Caravan walkthrough')
ON DUPLICATE KEY UPDATE label = VALUES(label);
