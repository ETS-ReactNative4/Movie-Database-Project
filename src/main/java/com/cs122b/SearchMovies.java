package com.cs122b;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;

@WebServlet(name = "SearchMovies", urlPatterns="/search")
public class SearchMovies extends HttpServlet {
    static class NumRecords {
        public int num;
        public long jdbctime;
    }
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp,req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long startquerytime = System.nanoTime();
        response.setContentType("application/json");
        Helper.corsFix(response,request);
        PrintWriter ret = response.getWriter();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            NumRecords numRecords = new NumRecords();
            String title = request.getParameter("title");
            String year = request.getParameter("year");
            String director = request.getParameter("director");
            String star = request.getParameter("name");
            String offset = request.getParameter("offset");
            String limit = request.getParameter("limit");
            String sort = request.getParameter("sort");
            String order = request.getParameter("order");
            ResultSet resultSet = Helper.getMovies(connection,title, year, director, star, offset, numRecords, limit, sort, order);
            JSONObject encapsulator = new JSONObject();
            encapsulator.put("numRecords", numRecords.num);
            JSONArray relatedMovies = new JSONArray();
            while(resultSet.next()){
                String id = resultSet.getString("id");
                JSONObject stuff = SingleMovie.singleMovieJSON(connection, id, resultSet);
                relatedMovies.put(stuff);
            }
            encapsulator.put("movies", relatedMovies);
            connection.close();
            ret.println(encapsulator);
            long endquerytime = System.nanoTime();
            long totalQueryTime = endquerytime - startquerytime;
            String filepath = getServletContext().getRealPath("/")+"times.csv";
            System.out.println(filepath);
            File outfile = new File(filepath);
            outfile.createNewFile();
            FileOutputStream ofile = new FileOutputStream(outfile, true);
            String times = Long.toString(totalQueryTime)+", "+Long.toString(numRecords.jdbctime)+"\n";
            ofile.write(times.getBytes());
            ofile.close();
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
