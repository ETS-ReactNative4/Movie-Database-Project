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

@WebServlet(name = "TwentyMovies", urlPatterns = "/top20")
public class TwentyMovies extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Helper.corsFix(response);
        PrintWriter ret = response.getWriter();
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            ResultSet resultSet = Helper.getTwentyStars(connection);
            JSONArray main = new JSONArray();
            while(resultSet.next()){
                String id = resultSet.getString("id");
                JSONObject stuff = SingleMovie.singleMovieJSON(connection, id, resultSet);
                main.put(stuff);
            }
            connection.close();
            ret.println(main);
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
