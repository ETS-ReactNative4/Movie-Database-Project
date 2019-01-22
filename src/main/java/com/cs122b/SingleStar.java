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
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

@WebServlet(name = "SingleStar", urlPatterns = "/star")
public class SingleStar extends HttpServlet {
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
            String id = request.getParameter("id");
            String query = "SELECT * from stars where id =\'"+id+"\'";
            ResultSet resultSet = statement.executeQuery(query);
            JSONObject stuff = new JSONObject();
            while(resultSet.next()){
                String name = resultSet.getString("name");
                Integer birthYear = resultSet.getInt("birthYear");

                // Prepare json
                stuff.put("id",id);
                stuff.put("title",name);
                stuff.put("birthYear",birthYear);
                String movie_query = "SELECT title, id FROM movies where id in (select movieId from stars_in_movies where starId=\'"+id+"\')";
                statement = connection.createStatement();
                ResultSet movieSet = statement.executeQuery(movie_query);
                JSONArray movies = new JSONArray();
                while(movieSet.next()){
                    JSONObject movie = new JSONObject();
                    movie.put("title", movieSet.getString("title"));
                    movie.put("id", movieSet.getString("id"));
                    movies.put(movie);
                }
                stuff.put("movies", movies);
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
}
