package com.cs122b;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;

@WebServlet(name = "Employee", urlPatterns = "/employee")
public class Employee extends HttpServlet {
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
            // create database connection
            Connection connection = Helper.connection();
            // declare statement
            String schema_desc = request.getParameter("schema");
            String genre_name = request.getParameter("genrename");
            String title = request.getParameter("title");
            String director = request.getParameter("director");
            int year = 0;
            try{
                year = Integer.parseInt(request.getParameter("year"));
            }catch (Exception x){
                System.out.println("Couldn't parse int for film year: "+x.toString());
            }
            String star = request.getParameter("star");
            String genre = request.getParameter("genre");
            String star_name = request.getParameter("starname");
            int star_dob = 0;
            try{
                star_dob = Integer.parseInt(request.getParameter("stardob"));
            }catch (Exception x){
                System.out.println("Couldn't parse int for birth year: "+x.toString());
            }
            if(schema_desc != null){
                ret.println(Helper.getDatabaseSchema(connection));
            }
            else if(genre_name != null){
                ret.println(Helper.addGenre(connection, genre_name));
            }
            else if(title != null && director != null && year != 0 && star != null && genre != null){
                ret.println(Helper.addMovie(connection, title, director, year, star, genre));
            }
            else{
                ret.println(Helper.addStar(connection, star_name, star_dob));
            }
            connection.close();
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
