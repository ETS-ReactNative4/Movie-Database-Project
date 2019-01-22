package com.cs122b;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;

@WebServlet(name = "SingleMovie", urlPatterns = "/movies")
public class SingleMovie extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter ret = response.getWriter();
        String loginUser = "username";
        String loginPasswd = "password";
        String loginUrl = "jdbc:mysql://localhost:3306/moviedb";
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            // create database connection
            Connection connection = DriverManager.getConnection(loginUrl, loginUser, loginPasswd);
            // declare statement
            Statement statement = connection.createStatement();
            String movie = request.getParameter("id");
            String query = "SELECT * from movies left join ratings on movies.id=ratings.movieId where movies.id='"+movie+"'";
            ResultSet resultSet = statement.executeQuery(query);
            JSONObject stuff = new JSONObject();
            while(resultSet.next()){
                String id = resultSet.getString("id");
                String title = resultSet.getString("title");
                Integer year = resultSet.getInt("year");
                String director = resultSet.getString("director");

                // Prepare json
                stuff.put("id",id);
                stuff.put("title",title);
                stuff.put("year",year);
                stuff.put("director",director);
                stuff.put("rating", resultSet.getFloat("rating"));
                String genre_query = "SELECT name FROM genres where id in (select genreId from genres_in_movies where movieId=\'"+movie+"\')";
                statement = connection.createStatement();
                ResultSet genreSet = statement.executeQuery(genre_query);
                ArrayList<String> genres = new ArrayList<>();
                while(genreSet.next()){
                    genres.add(genreSet.getString("name"));
                }
                stuff.put("genres", genres);
                // Start with star list
                String star_query = "SELECT name, id FROM stars where id in (select starId from stars_in_movies where movieId=\'"+movie+"\')";
                statement = connection.createStatement();
                ResultSet starSet = statement.executeQuery(star_query);
                JSONArray stars = new JSONArray();
                getStarsNameId(starSet, stars);
                stuff.put("stars", stars);
            }
            connection.close();
            ret.println(stuff);
            ret.flush();
        }
        catch (Exception e){
            JSONObject error = new JSONObject();
            error.put("error",e);
            ret.println(error);
            ret.flush();
        }
    }

    static void getStarsNameId(ResultSet starSet, JSONArray stars) throws SQLException {
        while(starSet.next()){
            JSONObject star = new JSONObject();
            star.put("name",starSet.getString("name"));
            star.put("id",starSet.getString("id"));
            stars.put(star);
        }
    }
}
