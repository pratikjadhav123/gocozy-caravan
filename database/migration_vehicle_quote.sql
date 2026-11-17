-- Per-vehicle included / not-included quote lists
USE `gocozy_caravan`;

ALTER TABLE `cms_vehicles`
  ADD COLUMN IF NOT EXISTS `included_json` TEXT NULL AFTER `features_json`,
  ADD COLUMN IF NOT EXISTS `excluded_json` TEXT NULL AFTER `included_json`;

UPDATE `cms_vehicles`
SET
  `included_json` = COALESCE(
    `included_json`,
    JSON_ARRAY(
      'Professional chauffeur (on request)',
      'Pre-trip vehicle walkthrough',
      'Basic insurance on trips',
      'Roadside assistance coordination',
      'WhatsApp booking support'
    )
  ),
  `excluded_json` = COALESCE(
    `excluded_json`,
    JSON_ARRAY(
      'Toll taxes & state entry permits',
      'Parking charges',
      'Driver allowance / night halt',
      'Fuel (quoted separately by trip)'
    )
  );
