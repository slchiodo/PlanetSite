CREATE TABLE Movies (movieID int UNIQUE, title varchar(200), year int);
COPY Movies FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/slchiodo-moviesout-phase2.txt' WITH DELIMITER '%';

CREATE TABLE Users (userID int UNIQUE);
CREATE TABLE UsersTemp (userID int, movieID int, tag varchar(250), timestamp int);
COPY UsersTemp FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/slchiodo-tagsout-phase2.txt' WITH DELIMITER '|';
COPY UsersTemp FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/ratings.txt' WITH DELIMITER ':';
INSERT INTO Users SELECT DISTINCT userID FROM UsersTemp;
drop table UsersTemp;

CREATE TABLE Genres (title varchar(30) UNIQUE);
CREATE TABLE GenresTemp (title varchar(30));
COPY GenresTemp FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/slchiodo-genresout-phase2.txt';
INSERT INTO Genres SELECT DISTINCT * FROM GenresTemp;
drop table GenresTemp;

CREATE TABLE Ratings (userID int, movieID int, rating DECIMAL(3,1), timestamp int, PRIMARY KEY(userID, movieID));
COPY Ratings FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/ratings.txt' WITH DELIMITER ':';

CREATE TABLE Tags (userID int, movieID int, tag varchar(250), timestamp int, PRIMARY KEY(userID, movieID, tag));
COPY Tags FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/slchiodo-tagsout-phase2.txt' WITH DELIMITER '|';

CREATE TABLE HasGenre (movieID int, title varchar(30), PRIMARY KEY(movieID, title));
COPY HasGenre FROM '/Users/stewartchiodo/Documents/FALL2019/CS333/Project/movies/slchiodo-hasgenresout-phase2.txt' WITH DELIMITER ':';

\d+

\d genres 

\d movies

\d ratings 

\d tags 

\d users 

\d hasgenre

select COUNT(*) FROM genres;

select COUNT(*) FROM movies;

select COUNT(*) FROM ratings;

select COUNT(*) FROM tags;

select COUNT(*) FROM users;

select COUNT(*) FROM hasgenre;

select * FROM movies limit 5; 

select COUNT(title) FROM movies;

select * FROM movies order by year desc limit 5;

select * FROM movies order by year limit 5;

select COUNT(year) FROM movies;

select COUNT(year) FROM movies WHERE year = 0;

select COUNT(year) FROM movies WHERE year > 1500;

SELECT * 
FROM Movies 
WHERE MovieID IS NULL OR Title IS NULL OR Year IS NULL;

SELECT * 
FROM Ratings 
WHERE UserID IS NULL OR MovieID IS NULL OR Rating IS NULL OR Timestamp IS NULL;

SELECT * 
FROM Tags 
WHERE UserID IS NULL OR MovieID IS NULL OR Tag IS NULL OR Timestamp IS NULL;

SELECT * 
FROM Users 
WHERE UserID IS NULL;

SELECT * 
FROM Genres 
WHERE Title IS NULL;

SELECT * 
FROM HasGenre 
WHERE MovieID IS NULL OR Title IS NULL;

SELECT year, Count(*)
FROM Movies
GROUP BY year
ORDER BY year;

SELECT COUNT(*) FROM Movies WHERE year < 2010 AND year >= 2000;
SELECT COUNT(*) FROM Movies WHERE year < 2000 AND year >= 1990;
SELECT COUNT(*) FROM Movies WHERE year < 1990 AND year >= 1980;
SELECT COUNT(*) FROM Movies WHERE year < 1980 AND year >= 1970;
SELECT COUNT(*) FROM Movies WHERE year < 1970 AND year >= 1960;
SELECT COUNT(*) FROM Movies WHERE year < 1960 AND year >= 1950;
SELECT COUNT(*) FROM Movies WHERE year < 1950 AND year >= 1940;
SELECT COUNT(*) FROM Movies WHERE year < 1940 AND year >= 1930;
SELECT COUNT(*) FROM Movies WHERE year < 1930 AND year >= 1920;
SELECT COUNT(*) FROM Movies WHERE year < 1920 AND year >= 1910;

SELECT title, Count(*)
FROM hasgenre
GROUP BY title;

SELECT Rating, COUNT(Rating) 
FROM Ratings
GROUP BY Rating;

SELECT COUNT(DISTINCT MovieID) 
FROM Ratings
WHERE NOT EXISTS (
SELECT * 
    FROM Tags
    WHERE Ratings.MovieID = Tags.MovieID);


SELECT COUNT(DISTINCT MovieID) 
FROM Tags
WHERE NOT EXISTS (
SELECT * 
    FROM Ratings
    WHERE Tags.MovieID = Ratings.MovieID);


SELECT COUNT(DISTINCT MovieID)
FROM Movies
WHERE MovieID NOT IN (
	SELECT MovieID
	FROM Ratings
	UNION
	SELECT MovieID
	FROM Tags);

SELECT COUNT(DISTINCT MovieID)
FROM (
	SELECT MovieID
	FROM Ratings
	INTERSECT
	SELECT MovieID
	FROM Tags) T;

SELECT title
FROM Movies
WHERE MovieID IN(
	SELECT MovieID
	FROM (
		SELECT MovieID, AVG(rating) AS avgrate
		FROM Ratings
		GROUP BY MovieID) R
	ORDER BY R.avgrate desc limit 10);

SELECT title
FROM Movies
WHERE MovieID IN(
	SELECT MovieID
	FROM (
		SELECT MovieID, AVG(rating) AS avgrate
		FROM Ratings
		GROUP BY MovieID) R
	ORDER BY R.avgrate asc limit 10);

SELECT title, COUNT(title)
FROM HasGenre
WHERE MovieID IN (
	SELECT MovieID 
	FROM Movies 
	WHERE year < 2000 AND year >= 1990)
GROUP BY title
ORDER BY COUNT(title) desc limit 1;

SELECT title, COUNT(title)
FROM HasGenre
WHERE MovieID IN (
	SELECT MovieID 
	FROM Movies 
	WHERE year < 2000 AND year >= 1990)
GROUP BY title
ORDER BY COUNT(title) asc limit 1;

SELECT title, M.Count
FROM Movies, (
	SELECT MovieID AS ID, COUNT(MovieID) AS Count
	FROM Ratings
	GROUP BY MovieID
	ORDER BY COUNT(MovieID) desc limit 10) M
WHERE M.id = Movies.MovieID;

SELECT title, M.Count
FROM Movies, (
	SELECT MovieID AS ID, COUNT(MovieID) AS Count
	FROM Ratings
	GROUP BY MovieID
	ORDER BY COUNT(MovieID) asc limit 10) M
WHERE M.id = Movies.MovieID;

SELECT title, M.Count
FROM Movies, (
	SELECT MovieID AS ID, COUNT(MovieID) AS Count
	FROM Tags
	GROUP BY MovieID
	ORDER BY COUNT(MovieID) desc limit 10) M
WHERE M.id = Movies.MovieID;

SELECT title, M.Count
FROM Movies, (
	SELECT MovieID AS ID, COUNT(MovieID) AS Count
	FROM Tags
	GROUP BY MovieID
	ORDER BY COUNT(MovieID) asc limit 10) M
WHERE M.id = Movies.MovieID;

SELECT UserID, SUM(R.Count) AS Activity
FROM (
	SELECT UserID, COUNT(UserID) AS Count
	FROM Ratings
	GROUP BY UserID
	UNION
	SELECT UserID, COUNT(UserID) AS Count
	FROM Tags
	GROUP BY UserID) R
GROUP BY R.UserID
ORDER BY SUM(R.Count) desc limit 10;

SELECT UserID, SUM(R.Count) AS Activity
FROM (
	SELECT UserID, COUNT(UserID) AS Count
	FROM Ratings
	GROUP BY UserID
	UNION
	SELECT UserID, COUNT(UserID) AS Count
	FROM Tags
	GROUP BY UserID) R
GROUP BY R.UserID
ORDER BY SUM(R.Count) asc limit 10;

SELECT Year, COUNT(Year) 
FROM movies
GROUP BY Year
ORDER BY COUNT(Year) desc limit 10;

SELECT Year, COUNT(Year) 
FROM movies
GROUP BY Year
ORDER BY COUNT(Year) asc limit 10;

SELECT Years
FROM Movies, (
	SELECT MovieID
	FROM HasGenre
	WHERE title = 'IMAX') I
WHERE Movies.MovieID = Movies.MovieID
ORDER BY Year asc limit 1;

SELECT title, year
FROM Movies
ORDER BY Year asc limit 1;


