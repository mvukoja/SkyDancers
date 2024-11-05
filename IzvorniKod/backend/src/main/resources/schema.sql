CREATE TABLE IF NOT EXISTS users (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(55) NOT NULL,
    name VARCHAR(55) NOT NULL,
    surname VARCHAR(55),
    email VARCHAR(55),
    password VARCHAR(55),
    type VARCHAR(55),
    oauth BOOLEAN
);
