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

@WebServlet(name = "SingleStar", urlPatterns = "/star")
public class SingleStar extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    public JSONObject singleStarJSON(Connection connection, String id, ResultSet resultSet) throws SQLException {
        JSONObject stuff = new JSONObject();
        while(resultSet.next()){
            String name = resultSet.getString("name");
            Integer birthYear = resultSet.getInt("birthYear");

            // Prepare json
            stuff.put("id",id);
            stuff.put("title",name);
            stuff.put("birthYear",birthYear);
            ResultSet movieSet = Helper.getMovieTitles(connection, id);
            JSONArray movies = new JSONArray();
            while(movieSet.next()){
                JSONObject movie = new JSONObject();
                movie.put("title", movieSet.getString("title"));
                movie.put("id", movieSet.getString("id"));
                movies.put(movie);
            }
            stuff.put("movies", movies);
        }
        return stuff;
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Helper.corsFix(response);
        PrintWriter ret = response.getWriter();
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            // create database connection
            Connection connection = Helper.connection();
            String id = request.getParameter("id");
            // Get info from result set, then as json
            ResultSet resultSet = Helper.getSingleStar(connection, id);
            JSONObject starInfo = singleStarJSON(connection, id, resultSet);
            // Close connection and print out
            connection.close();
            ret.println(starInfo);
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
