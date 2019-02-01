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
import java.sql.ResultSet;

@WebServlet(name = "SearchMovies", urlPatterns="/search")
public class SearchMovies extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp,req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Helper.corsFix(response,request);
        PrintWriter ret = response.getWriter();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            String title = request.getParameter("title");
            String year = request.getParameter("year");
            String director = request.getParameter("director");
            String star = request.getParameter("star");
            ResultSet resultSet = Helper.getMovies(connection,title, year, director, star);
            JSONArray relatedMovies = new JSONArray();
            while(resultSet.next()){
                String id = resultSet.getString("id");
                JSONObject stuff = SingleMovie.singleMovieJSON(connection, id, resultSet);
                relatedMovies.put(stuff);
            }
            connection.close();
            ret.println(relatedMovies);
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
