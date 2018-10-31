INSERT INTO characters (first_name, last_name, nickname, race, homeland)
VALUES
    ('Kaladin', '', 'Stormblessed', 'Alethi', 'Alethkar'),
    ('Dalinar', 'Kholin', 'Blackthorn', 'Alethi', 'Alethkar'),
    ('Shallan', 'Davar', '', 'Veden', 'Jah Keved'),
    ('Adolin', 'Kholin', '', 'Alethi', 'Alethkar'),
    ('Jasnah', 'Kholin', '', 'Alethi', 'Alethkar'),
    ('Odium', '', '', 'Unknown', 'Unknown'),
    ('Hoid', '', 'Wit', 'Unknown', 'Unknown'),
    ('Rock', '', 'Horneater', 'Unkalaki', 'Unkalaki'),
    ('Taravangian', '', '', 'Frostlandian', 'Frostlands'),
    ('Lift', '', '', 'Reshi', 'Reshi Isles'),
    ('Szeth', 'Son son Vollano', 'Truthless of Shinovar', 'Shin', 'Shinovar'),
    ('Eshonai', '', '', 'Parshendi', 'Narak'),
    ('Venli', '', '', 'Parshendi', 'Narak'),
    ('Mraize', '', '', 'Thaylen', 'Theylenah'),
    ('Iyatil', '', '', 'Southern Scadrian', 'Silverlight'),
    ('Meridas', 'Amaram', '', 'Alethi', 'Alethkar'),
    ('Adritagia', '', '', 'Kharbranthian', 'Kharbranth'),
    ('Graves', '', '', 'Alethi', 'Alethkar');


INSERT INTO spren (type, name)
VALUES
    ('Honorspren', 'Sylphrena'),
    ('Angerspren', ''),
    ('Awespren', ''),
    ('Fearspren', ''),
    ('Windspren', ''),
    ('Gloryspren', ''),
    ('Voidspren', 'Glys'),
    ('Lightweaverspren', 'Pattern'),
    ('Bondsmithspren', 'Stormfather'),
    ('Edgedancerspren', 'Wyndle'),
    ('Inkspren', 'Ivory'),
    ('Lightspren', 'Timber');


INSERT INTO knight_radiant (kr_order, spren_id, char_id)
VALUES
    ('Windrunners', '1', '1'),
    ('Edgedancers', '10', '10'),
    ('Lightweavers', '3', '8'),
    ('Elsecallers', '11', '5'),
    ('Bondsmiths', '9', '2'),
    ('Willshapers', '12', '13');


INSERT INTO allegiance (name)
VALUES
    ('Knights Radiant'),
    ('Ghostbloods'),
    ('Voidbringers'),
    ('The Diagram');


INSERT INTO ability (type)
VALUES
    ('Adhesion'),
    ('Gravitation'),
    ('Division'),
    ('Abrasion'),
    ('Progression'),
    ('Illumination'),
    ('Transformation'),
    ('Transportation'),
    ('Illumination'),
    ('Tension'),
    ('Cohesion'),
    ('Dueling'),
    ('Artist'),
    ('Espionage'),
    ('Battlefield Tactics');


INSERT INTO char_abilities (char_id, ability_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (2, 10),
    (3, 6),
    (3, 9),
    (4, 7),
    (4, 8),
    (10, 4),
    (10, 5),
    (11, 2),
    (11, 3);


INSERT INTO char_allegiances (char_id, allegiance_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (3, 2),
    (4, 1),
    (5, 1),
    (6, 3),
    (7, 1),
    (8, 1),
    (9, 4),
    (10, 1),
    (11, 1),
    (12, 3),
    (13, 3),
    (14, 2),
    (15, 2),
    (16, 3),
    (17, 4),
    (18, 4);
