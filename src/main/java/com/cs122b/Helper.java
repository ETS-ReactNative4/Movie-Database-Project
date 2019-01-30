package com.cs122b;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.HttpServletResponse;
import java.sql.*;

public class Helper {
    static String loginUser = "username";
    static String loginPasswd = "password";
    static String loginUrl = "jdbc:mysql://localhost:3306/moviedb";
    static void getStarsNameId(ResultSet starSet, JSONArray stars) throws SQLException {
        while(starSet.next()){
            JSONObject star = new JSONObject();
            star.put("name",starSet.getString("name"));
            star.put("id",starSet.getString("id"));
            stars.put(star);
        }
    }
    static Connection connection() throws SQLException {
        // create database connection
        return DriverManager.getConnection(loginUrl, loginUser, loginPasswd);
    }
    static ResultSet getTwentyStars(Connection con) throws SQLException {
        Statement statement = con.createStatement();
        String query = "SELECT * from movies left join ratings on movies.id = ratings.movieId order by rating desc limit 20";
        return statement.executeQuery(query);
    }
    static ResultSet getGenres(Connection con, String id) throws SQLException {
        String genre_query = "SELECT name FROM genres where id in (select genreId from genres_in_movies where movieId=\'"+id+"\')";
        Statement statement = con.createStatement();
        return statement.executeQuery(genre_query);
    }
    static ResultSet getStars(Connection con, String id) throws SQLException {
        String star_query = "SELECT name, id FROM stars where id in (select starId from stars_in_movies where movieId=\'"+id+"\')";
        Statement statement = con.createStatement();
        return statement.executeQuery(star_query);
    }
    static ResultSet getSingleStar(Connection con, String id) throws SQLException {
        Statement statement = con.createStatement();
        String query = "SELECT * from stars where id =\'"+id+"\'";
        return statement.executeQuery(query);
    }
    static ResultSet getSingleMovie(Connection con, String id) throws SQLException{
        Statement statement = con.createStatement();
        String query = "SELECT * from movies left join ratings on movies.id=ratings.movieId where movies.id='"+id+"'";
        return statement.executeQuery(query);
    }
    static ResultSet getMovieTitles(Connection con, String id) throws SQLException{
        String movie_query = "SELECT title, id FROM movies where id in (select movieId from stars_in_movies where starId=\'"+id+"\')";
        Statement statement = con.createStatement();
        return statement.executeQuery(movie_query);
    }
    static void corsFix(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
