package com.cs122b;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.*;
import java.util.Iterator;

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
    static ResultSet getBrowseMovies(Connection con, String genre, String letter, String offset,
                                     String limit, String sort, String order, SearchMovies.NumRecords numRecords) throws SQLException {
        Statement statement = con.createStatement();
        sort = (sort != null) ? sort : "rating";
        order = (order != null) ? order : "DESC";
        offset = (offset != null) ? offset : "0";
        limit = (limit != null) ? limit : "10";
        letter = (letter != null) ? letter : "A";
        String query = null;
        if(!genre.equals("")){
            query = "SELECT movies.id, movies.title, `year`, director, genres.name, rating FROM genres_in_movies\n" +
                    "\tINNER JOIN movies ON genres_in_movies.movieId=movies.id\n" +
                    "    INNER JOIN genres on genres_in_movies.genreId=genres.id\n" +
                    "    INNER JOIN ratings ON genres_in_movies.movieId=ratings.movieId" +
                    "   WHERE genres.name LIKE '"+genre+"'";
        }
        else{
            query = "Select id, title, `year`, director, rating from movies " +
                    "INNER JOIN ratings on movies.id=ratings.movieId where title LIKE '"+letter+"%'";
        }
        String totalCount = "Select count(*) as count from ("+query+") as distinctrecords";
        ResultSet res = statement.executeQuery(totalCount);
        res.next();
        numRecords.num = res.getInt("count");
        query = query + " ORDER BY "+sort+" "+order+" LIMIT "+offset+", "+limit;
        System.out.println(query);
        return statement.executeQuery(query);
    }
    static JSONObject getSalesRecords(Connection con, JSONObject sale) throws SQLException {
        JSONObject records = new JSONObject();
        Iterator<String> keys = sale.keys();
        Statement statement = con.createStatement();
        String query = null;
        while(keys.hasNext()){
            String key = keys.next();
            JSONArray stuff = new JSONArray();
            if(sale.get(key) instanceof  JSONObject){
                for (int i = 0; i < ((JSONObject) sale.get(key)).getInt("quantity"); i++){
                    query = "INSERT INTO sales(customerId, movieId, saleDate) VALUES ('"+sale.getString("customerId")+"', '"+
                            key+"', DATE(NOW()))";
                    statement.executeUpdate(query);
                    query = "SELECT last_insert_id() as id";
                    ResultSet resultSet = statement.executeQuery(query);
                    resultSet.next();
                    stuff.put(resultSet.getInt("id"));
                }
                records.put(key, stuff);
            }
        }
        return records;
    }
    static ResultSet getMovies(Connection con, String title, String year, String director, String star,
                               String offset, SearchMovies.NumRecords numRecords, String limit, String sort, String order) throws SQLException{
        Statement statement = con.createStatement();
        // Turn all null strings into ""
        title = (title != null) ? title : "";
        year = (year != null) ? year : "";
        director = (director != null) ? director : "";
        star = (star != null) ? star : "";
        offset = (offset != null) ? offset : "0";
        limit = (limit != null) ? limit : "10";
        sort = (sort != null) ? sort : "rating";
        order = (order != null) ? order : "DESC";


        String query = "Select distinct id, title, `year`, director, rating FROM "+
                "(SELECT movies.id, title, `year`, director, rating, starId, `name` " +
                "FROM stars_in_movies " +
                "INNER JOIN movies " +
                "ON stars_in_movies.movieId = movies.id " +
                "INNER JOIN stars " +
                "ON stars_in_movies.starId = stars.id " +
                "left join ratings " +
                "ON movies.id = ratings.movieId WHERE title LIKE '%"+title+
                "%' AND `year` LIKE '%"+year+"%' AND director LIKE '%"+director+
                "%' AND `name` LIKE '%"+star+"%') as records";
        String totalCount = "Select count(*) as count from ("+query+") as distinctrecords";
        ResultSet res = statement.executeQuery(totalCount);
        res.next();
        numRecords.num = res.getInt("count");
        query = query + " ORDER BY "+sort+" "+order+" LIMIT "+offset+", "+limit;
        System.out.println(query);
        return statement.executeQuery(query);
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
    static JSONObject isValidUser(Connection con, JSONObject data) throws SQLException{
        JSONObject customer = null;
        Statement statement = con.createStatement();
        String query = "SELECT customers.id, customers.firstName, customers.lastName, ccId, email, address, email, expiration" +
                "  from customers INNER JOIN creditcards on customers.ccId=creditcards.id WHERE email='"+
                data.getString("username")+"' and password='"+data.getString("password")+"'";
        ResultSet resultSet = statement.executeQuery(query);
        while(resultSet.next()){
            customer = new JSONObject();
            customer.put("id", resultSet.getString("id"));
            customer.put("firstName", resultSet.getString("firstName"));
            customer.put("lastName", resultSet.getString("lastName"));
            customer.put("ccId", resultSet.getString("ccId"));
            customer.put("email", resultSet.getString("email"));
            customer.put("address", resultSet.getString("address"));
            customer.put("expiration", resultSet.getString("expiration"));
        }
        return customer;
    }
    static void corsFix(HttpServletResponse resp, HttpServletRequest request) {
        String domain = "http://";
        try {
            domain = domain+new URL(request.getRequestURL().toString()).getHost();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        resp.setHeader("Access-Control-Allow-Origin", domain+":3000");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    static boolean isLoggedIn(HttpServletRequest request,HttpServletResponse response){
        Cookie[] cookies = request.getCookies();
        if(request.isRequestedSessionIdFromCookie() && !request.isRequestedSessionIdValid()){
            for (Cookie c :
                    cookies) {
                c.setMaxAge(0);
                response.addCookie(c);
                System.out.println(c.getName());
            }
            return false;
        }
        else if(!request.isRequestedSessionIdValid()){
            return false;
        }
        return true;
    }
}
