CREATE TABLE characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    nickname VARCHAR(255),
    race VARCHAR(128),
    homeland VARCHAR(128)
);



CREATE TABLE spren (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255)
);



CREATE TABLE knight_radiant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kr_order VARCHAR(255),
    spren_id INT NOT NULL,
    char_id INT NOT NULL,
    FOREIGN KEY (spren_id) REFERENCES spren(id)
        ON DELETE CASCADE,
    FOREIGN KEY (char_id) REFERENCES characters(id)
        ON DELETE CASCADE
);



CREATE TABLE allegiance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);



CREATE TABLE ability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);



CREATE TABLE char_allegiances (
    char_id INT NOT NULL,
    allegiance_id INT NOT NULL,
    FOREIGN KEY (char_id) REFERENCES characters(id)
        ON DELETE CASCADE,
    FOREIGN KEY (allegiance_id) REFERENCES allegiance(id)
        ON DELETE CASCADE, 
    PRIMARY KEY (char_id, allegiance_id)
);


CREATE TABLE char_abilities (
    char_id INT NOT NULL,
    ability_id INT NOT NULL,
    FOREIGN KEY (char_id) REFERENCES characters(id)
        ON DELETE CASCADE,
    FOREIGN KEY (ability_id) REFERENCES ability(id)
        ON DELETE CASCADE,
    PRIMARY KEY (char_id, ability_id)
);

