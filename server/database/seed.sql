-- ============================================================================
-- Onecore Pharma Seed Data (MySQL)
-- Database: onecore_pharma
-- ============================================================================

USE `onecore_pharma`;

-- 1. Seed Admin Roles
INSERT INTO `admin_roles` (`id`, `name`, `description`) VALUES
(1, 'Super Admin', 'Full access to all CMS content, user management, and security settings'),
(2, 'Admin', 'Can manage all website content, enquiries, products, news, and media'),
(3, 'Editor', 'Can create and edit page content, products, and articles')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- 2. Seed Contact Settings
INSERT INTO `contact_settings` (`id`, `email`, `phone`, `business_hours`) VALUES
(1, 'info@onecorepharma.in', '8169255034', '10 AM to 7 PM')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `phone` = VALUES(`phone`), `business_hours` = VALUES(`business_hours`);

-- 3. Seed Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('company_name', 'Onecore Pharma Pvt. Ltd.', 'general'),
('footer_tagline', 'Healthcare centered on people.', 'general'),
('copyright_text', '© 2026 Onecore Pharma Pvt. Ltd.', 'general'),
('contact_email', 'info@onecorepharma.in', 'contact'),
('contact_phone', '8169255034', 'contact'),
('contact_hours', '10 AM to 7 PM', 'contact'),
('primary_cta_text', 'Explore areas of care', 'marketing')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- 4. Seed Therapeutic Areas
INSERT INTO `therapeutic_areas` (`id`, `name`, `slug`, `number_label`, `heading`, `description`, `image_url`, `display_order`, `is_active`) VALUES
(1, 'Women’s Health', 'womens-health', '01', 'Supporting women through different stages of care.', 'Our women’s health portfolio brings together prescription medicines and supportive formulations across reproductive health, fertility, pregnancy related nutrition, gynaecological care and intimate health.', '/assets/therapeutic-womens-health.jpg', 1, 1),
(2, 'Paediatrics', 'paediatrics', '02', 'Care designed around the needs of growing children.', 'A portfolio spanning paediatric therapeutic and nutritional needs, with formulations and dosage formats suited to different stages of childhood care.', '/assets/therapeutic-paediatrics.jpg', 2, 1),
(3, 'Orthopaedics', 'orthopaedics', '03', 'Supporting movement, mobility and musculoskeletal care.', 'Our orthopaedic portfolio spans joint health, bone health, mobility, pain management and musculoskeletal support.', '/assets/therapeutic-orthopaedics.jpg', 3, 1),
(4, 'Neurology', 'neurology', '04', 'A focused portfolio across neurological care.', 'Onecore’s neurology portfolio includes prescription therapies and supportive formulations used across a range of neurological and neuro nutritional needs.', '/assets/therapeutic-neurology.jpg', 4, 1),
(5, 'Ophthalmology', 'ophthalmology', '05', 'Specialised formulations for different areas of eye care.', 'Our ophthalmology range includes products used across ocular infection, inflammation, glaucoma related care, lubrication and other ophthalmic needs.', '/assets/therapeutic-ophthalmology.jpg', 5, 1),
(6, 'Dermatology', 'dermatology', '06', 'Formulations for medical and supportive skin care.', 'The dermatology portfolio spans prescription and supportive formulations across fungal infections, acne, inflammatory skin conditions, pigmentation and skin health.', '/assets/therapeutic-dermatology.jpg', 6, 1),
(7, 'ENT', 'ent', '07', 'Focused support across ear, nose and throat care.', 'A portfolio developed around common and specialised needs encountered across ENT practice.', '/assets/therapeutic-ent.jpg', 7, 1),
(8, 'General Medicine', 'general-medicine', '08', 'Everyday therapies across a broad range of clinical needs.', 'Our general medicine portfolio includes gastrointestinal care, anti infectives, pain management, allergy care and other commonly encountered therapeutic needs.', '/assets/therapeutic-general-medicine.jpg', 8, 1),
(9, 'Oncology', 'oncology', '09', 'Specialised therapies within cancer care.', 'Onecore’s oncology portfolio brings together specialised prescription products used across selected areas of cancer treatment and supportive care.', '/assets/therapeutic-oncology.jpg', 9, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `heading` = VALUES(`heading`), `description` = VALUES(`description`);

-- 5. Seed Therapeutic Area Tags
INSERT INTO `therapeutic_area_tags` (`therapeutic_area_id`, `name`, `display_order`) VALUES
(1, 'Reproductive health', 1), (1, 'Fertility', 2), (1, 'Pregnancy related nutrition', 3), (1, 'Gynaecological care', 4), (1, 'Intimate health', 5),
(2, 'Child health', 1), (2, 'Nutrition', 2), (2, 'Paediatric medicines', 3),
(3, 'Joint health', 1), (3, 'Bone health', 2), (3, 'Pain management', 3), (3, 'Mobility', 4),
(4, 'Neuropathic care', 1), (4, 'Neuro nutrition', 2), (4, 'CNS care', 3),
(5, 'Ocular infection', 1), (5, 'Inflammation', 2), (5, 'Glaucoma care', 3), (5, 'Ocular lubrication', 4),
(6, 'Acne', 1), (6, 'Fungal care', 2), (6, 'Inflammatory conditions', 3), (6, 'Pigmentation', 4),
(7, 'ENT care', 1), (7, 'Allergy', 2), (7, 'Infection management', 3),
(8, 'Gastrointestinal care', 1), (8, 'Anti infectives', 2), (8, 'Pain management', 3), (8, 'Allergy care', 4),
(9, 'Specialised therapies', 1), (9, 'Oncology care', 2), (9, 'Supportive care', 3);

-- 6. Seed Product: OneFLEXO
INSERT INTO `products` (`id`, `therapeutic_area_id`, `brand_name`, `slug`, `short_description`, `full_description`, `packshot_url`, `status`, `display_order`) VALUES
(1, 3, 'OneFLEXO', 'oneflexo', 'Specialised joint health formulation combining Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule.', 'OneFLEXO is a specialised joint health formulation that combines Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule. The formulation is designed to bring together complementary ingredients used in musculoskeletal and joint support.', '/assets/products/oneflexo-packshot.png', 'published', 1)
ON DUPLICATE KEY UPDATE `brand_name` = VALUES(`brand_name`);

-- 7. Seed Product Compositions (OneFLEXO)
INSERT INTO `product_compositions` (`product_id`, `ingredient_name`, `ingredient_description`, `strength`, `display_order`) VALUES
(1, 'Aflapin®', 'Boswellia serrata gum resin extract', '100 mg', 1),
(1, 'Native Type II Collagen', 'Undenatured collagen Type II', '40 mg', 2),
(1, 'Mobilee®', 'Sodium hyaluronate, polysaccharides and collagen complex', '40 mg', 3);

-- 8. Seed Product Benefits (OneFLEXO)
INSERT INTO `product_benefits` (`product_id`, `title`, `description`, `display_order`) VALUES
(1, 'JOINT COMFORT', 'Supports the formulation’s role in maintaining comfort during everyday movement.', 1),
(1, 'MOBILITY', 'Designed to support mobility as part of an overall musculoskeletal care approach.', 2),
(1, 'JOINT STRUCTURE SUPPORT', 'Combines ingredients selected for complementary roles in joint and connective tissue support.', 3);

-- 9. Seed Product Dosage (OneFLEXO)
INSERT INTO `product_dosage` (`product_id`, `heading`, `description`) VALUES
(1, 'How OneFLEXO should be taken.', 'Use as directed by a healthcare professional or according to the approved product label.')
ON DUPLICATE KEY UPDATE `heading` = VALUES(`heading`), `description` = VALUES(`description`);

-- 10. Seed News Articles
INSERT INTO `news_articles` (`id`, `title`, `slug`, `category`, `excerpt`, `featured_image_url`, `published_at`, `status`) VALUES
(1, 'Aligning formulation chemistry with real-world patient adherence', 'aligning-formulation-chemistry-with-patient-adherence', 'RESEARCH & FORMULATION', 'How disciplined formulation design and dosage form engineering reduce treatment complexity across chronic care therapeutic areas.', '/assets/news-1.jpg', NOW(), 'published'),
(2, 'Connecting medical practice insights to therapeutic portfolio depth', 'connecting-medical-practice-insights-to-portfolio-depth', 'CLINICAL PRACTICE', 'Engaging directly with healthcare practitioners to address unmet clinical nuances in paediatric and geriatric patient cohorts.', '/assets/news-2.jpg', NOW(), 'published'),
(3, 'Evaluating material efficiency in pharmaceutical cold-chain and packaging', 'evaluating-material-efficiency-pharmaceutical-packaging', 'SUSTAINABILITY', 'A structured look at reducing secondary material volume while strictly preserving formulation stability and barrier integrity.', '/assets/news-3.jpg', NOW(), 'published')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
