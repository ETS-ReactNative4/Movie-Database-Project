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

@WebServlet(name = "FulltextSearch", urlPatterns = "/fullsearch")
public class FulltextSearch extends HttpServlet {
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
      SearchMovies.NumRecords numRecords = new SearchMovies.NumRecords();
      int offset;
      try{
        offset = Integer.parseInt(request.getParameter("offset"));
      }
      catch (NumberFormatException E){
        offset=0;
      }
      String queryString = request.getParameter("query");

      if(queryString!=null){
        ResultSet resultSet = Helper.getFullTextResults(connection, queryString, offset,numRecords);
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
      }
      else{
        ret.println();
      }
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
