INSERT INTO genre (name) 
VALUES 
("Drama"),
("Action"),
("Adventure"),
("Sci-fi"),
("Romance");

INSERT INTO movie (id, title, year, director, duration, poster, rate) 
VALUES
(UUID_TO_BIN(UUID()), "Interstellar", 1994, "Christopher Nolan", 180, "https://i.etsystatic.com/44758864/r/il/dd9a18/5382771889/il_600x600.5382771889_e75l.jpg", 7.1 ),
(UUID_TO_BIN(UUID()), "The Godfather", 1972, "Francis Ford Coppola", 175, "https://a.1stdibscdn.com/archivesE/upload/9891/29_14/org_godfather_1_sheet/ORG_GODFATHER_1_SHEET_s.jpeg", 9.2 ),
(UUID_TO_BIN(UUID()), "The Dark Knight", 2008, "Christopher Nolan", 152, "https://static.posters.cz/image/750/posters/the-dark-knight-trilogy-batman-i198201.jpg", 7.1 ),
(UUID_TO_BIN(UUID()), "Pulp Fiction", 1994, "Quentin Tarantino", 154, "https://static.posters.cz/image/350/posters/pulp-fiction-cover-i1288.jpg", 9.1 ),
(UUID_TO_BIN(UUID()), "Fight Club", 1999, "David Fincher", 139, "https://render.fineartamerica.com/images/rendered/search/poster/6/8/break/images-medium-5/fight-club-poster-1-irina-march.jpg", 8.9 );

INSERT INTO movie_genres(movie_id, genre_id)
VALUES
((SELECT id FROM movie WHERE title = 'Interstellar'), (SELECT id FROM genre WHERE name = "Sci-fi")),
((SELECT id FROM movie WHERE title = 'Interstellar'), (SELECT id FROM genre WHERE name = "Drama")),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = "Action")),
((SELECT id FROM movie WHERE title = 'Fight Club'), (SELECT id FROM genre WHERE name = "Drama"));

SELECT BIN_TO_UUID(id), title, year, director, duration, poster, rate FROM movie