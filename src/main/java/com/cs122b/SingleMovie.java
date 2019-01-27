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

@WebServlet(name = "SingleMovie", urlPatterns = "/movies")
public class SingleMovie extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    public static JSONObject singleMovieJSON(Connection connection, String id, ResultSet resultSet) throws SQLException {
        JSONObject stuff = new JSONObject();
        String title = resultSet.getString("title");
        Integer year = resultSet.getInt("year");
        String director = resultSet.getString("director");

        // Prepare json
        stuff.put("id",id);
        stuff.put("title",title);
        stuff.put("year",year);
        stuff.put("director",director);
        stuff.put("rating", resultSet.getFloat("rating"));
        ResultSet genreSet = Helper.getGenres(connection, id);
        JSONArray genres = new JSONArray();
        while(genreSet.next()){
            genres.put(genreSet.getString("name"));
        }
        stuff.put("genres", genres);
        // Start with star list
        ResultSet starSet = Helper.getStars(connection, id);
        JSONArray stars = new JSONArray();
        Helper.getStarsNameId(starSet, stars);
        stuff.put("stars", stars);
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
            // declare statement
            String movie = request.getParameter("id");
            ResultSet resultSet = Helper.getSingleMovie(connection, movie);
            resultSet.next();
            JSONObject movieInfo = singleMovieJSON(connection, movie, resultSet);
            connection.close();
            ret.println(movieInfo);
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
