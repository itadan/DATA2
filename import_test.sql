
CREATE DATABASE ObseDB;
USE ObseDB;

CREATE TABLE Sector (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coordinates VARCHAR(100),
    light_intensity DECIMAL(5, 2),
    foreign_objects INT,
    star_objects_count INT,
    unknown_objects_count INT,
    defined_objects_count INT,
    notes TEXT
);

CREATE TABLE Objects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    accuracy DECIMAL(5, 2),
    quantity INT,
    time TIME,
    date DATE,
    notes TEXT
);

CREATE TABLE NaturalObjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    galaxy VARCHAR(100),
    accuracy DECIMAL(5, 2),
    light_flux DECIMAL(10, 2),
    associated_objects TEXT,
    notes TEXT
);

CREATE TABLE CelestialPosition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    earth_position VARCHAR(100),
    sun_position VARCHAR(100),
    moon_position VARCHAR(100)
);

CREATE TABLE Observation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sector_id INT,
    object_id INT,
    natural_object_id INT,
    position_id INT,
    FOREIGN KEY (sector_id) REFERENCES Sector(id),
    FOREIGN KEY (object_id) REFERENCES Objects(id),
    FOREIGN KEY (natural_object_id) REFERENCES NaturalObjects(id),
    FOREIGN KEY (position_id) REFERENCES CelestialPosition(id)
);

CREATE TRIGGER Sector_update_trigger
AFTER UPDATE ON Sector
FOR EACH ROW
BEGIN
    DECLARE column_exists INT;
    SELECT COUNT(*) INTO column_exists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name='Sector' AND table_schema='ObservatoryDB' AND column_name='date_update';
    
    IF column_exists = 0 THEN
        ALTER TABLE Sector ADD COLUMN date_update TIMESTAMP;
    END IF;
    
    UPDATE Sector SET date_update = NOW() WHERE id = NEW.id;
END$$

CREATE PROCEDURE JoinTables(IN table1 VARCHAR(50), IN table2 VARCHAR(50))
BEGIN
    SET @query = CONCAT('SELECT * FROM ', table1, ' JOIN ', table2, ' ON ', table1, '.id = ', table2, '.', table1, '_id');
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$