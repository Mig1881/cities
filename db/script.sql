CREATE DATABASE cities;

GRANT ALL PRIVILEGES ON cities.* TO user;

USE cities;

CREATE TABLE cities (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    population INT,
    altitude FLOAT,
    foundation_date DATE,
    age INT,
    area INT,
    density FLOAT
);

INSERT INTO cities (name, population, altitude, foundation_date, age, area, density) VALUES
    ('Zaragoza', 700000, 200, '0001-01-01', 2000,2000, 2000),
    ('Madrid', 5000000, 700, '1498-01-01', 500, 1500, 3000),
    ('Jaca', 14000, 818, '1018-01-01',1020, 100,140);