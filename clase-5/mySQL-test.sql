-- Creación de la database
-- DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;
USE moviesdb;

CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
	title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
	duration INT NOT NULL,
    poster TEXT,
	rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) UNIQUE NOT NULL
);

-- esta tabla existe porque no mySQL no tiene arrays de forma nativa
CREATE TABLE movie_genres (
	movie_id BINARY(16) REFERENCES movie(id),
    genre_id INT REFERENCES genre(id),
    PRIMARY KEY (movie_id, genre_id)
);