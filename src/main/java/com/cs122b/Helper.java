package com.cs122b;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.*;
import java.util.Iterator;

import org.jasypt.util.password.StrongPasswordEncryptor;

import static java.lang.System.out;

public class Helper {
  static String loginUser = "username";
  static String loginPasswd = "password";
  static String loginUrl = "jdbc:mysql://localhost:3306/moviedb";

  static void getStarsNameId(ResultSet starSet, JSONArray stars) throws SQLException {
    while (starSet.next()) {
      JSONObject star = new JSONObject();
      star.put("name", starSet.getString("name"));
      star.put("id", starSet.getString("id"));
      stars.put(star);
    }
  }

  static Connection connection() throws SQLException, NamingException {
//     the following few lines are for connection pooling
//     Obtain our environment naming context

    Context initCtx = new InitialContext();

    Context envCtx = (Context) initCtx.lookup("java:comp/env");
    if (envCtx == null)
      out.println("envCtx is NULL");

    // Look up our data source (uncomment below line and comment following if on instance 1)
//    DataSource ds = (DataSource) envCtx.lookup("jdbc/moviedb");
    DataSource ds = (DataSource) envCtx.lookup("jdbc/TestDB");

    // the following commented lines are direct connections without pooling
    //Class.forName("org.gjt.mm.mysql.Driver");
    //Class.forName("com.mysql.jdbc.Driver").newInstance();
    //Connection dbcon = DriverManager.getConnection(loginUrl, loginUser, loginPasswd);

    if (ds == null)
      out.println("ds is null.");

    Connection dbcon = ds.getConnection();
    if (dbcon == null)
      out.println("dbcon is null.");

    // create database connection
//    return DriverManager.getConnection(loginUrl, loginUser, loginPasswd);
    return dbcon;
  }

  static JSONObject getDatabaseSchema(Connection con) throws SQLException {
    con.setReadOnly(true);
    JSONObject dtypes = new JSONObject();

    dtypes.put("12", "varchar");
    dtypes.put("4", "integer");
    dtypes.put("91", "date");
    dtypes.put("7", "float");
    dtypes.put("92", "time");
    dtypes.put("93", "timestamp");

    DatabaseMetaData metadata = con.getMetaData();
    ResultSet tables = metadata.getTables(null, null, null, new String[]{"TABLE"});
    JSONObject database_structure = new JSONObject();
    while (tables.next()) {
      String table = tables.getString("TABLE_NAME");
      JSONObject cols = new JSONObject();
      ResultSet columns = metadata.getColumns(null, null, table, null);

      while (columns.next()) {
        String colname = columns.getString("COLUMN_NAME");
        String colsize = columns.getString("COLUMN_SIZE");
        StringBuilder typebuilder = new StringBuilder();
        String datatype = columns.getString("DATA_TYPE");
        if (datatype.equals("12") || datatype.equals("4")) {
          typebuilder.append(dtypes.getString(datatype)).append(": ").append(colsize);
        } else {
          typebuilder.append(dtypes.getString(datatype));
        }
        cols.put(colname, typebuilder.toString());
      }
      database_structure.put(table, cols);
    }
    out.println(database_structure);
    return database_structure;
  }

  static JSONObject addGenre(Connection con, String genre_name) throws SQLException {
    con.setReadOnly(false);
    JSONArray message = new JSONArray();
    String query = "{call add_genre(?)}";
    CallableStatement statement = con.prepareCall(query);
    statement.setString(1, genre_name);
    if (statement.execute()) {
      ResultSet resultSet = statement.getResultSet();
      while (resultSet.next()) {
        message.put(resultSet.getString("message"));
      }
    }
    JSONObject retval = new JSONObject();
    retval.put("message", message);
    return retval;
  }

  static JSONArray getGenres(Connection con) throws SQLException {
    con.setReadOnly(true);
    JSONArray genres = new JSONArray();
    String query = "select name from genres";
    Statement statement = con.createStatement();
    ResultSet resultSet = statement.executeQuery(query);
    while (resultSet.next()) {
      genres.put(resultSet.getString("name"));
    }
    return genres;
  }

  static JSONObject addStar(Connection con, String star_name, int star_dob) throws SQLException {
    con.setReadOnly(false);
    JSONArray message = new JSONArray();
    String query = "{call add_star(?,?)}";
    CallableStatement statement = con.prepareCall(query);
    statement.setString(1, star_name);
    statement.setInt(2, star_dob);
    if (statement.execute()) {
      ResultSet resultSet = statement.getResultSet();
      while (resultSet.next()) {
        message.put(resultSet.getString("message"));
        out.println(resultSet.getString("message"));
      }
    }
    JSONObject retval = new JSONObject();
    retval.put("message", message);
    return retval;
  }

  static JSONObject addMovie(Connection con, String title, String director, int year, String star, String genre) throws SQLException {
    con.setReadOnly(false);
    JSONArray message = new JSONArray();
    String query = "{call add_movie(?,?,?,?,?)}";
    CallableStatement statement = con.prepareCall(query);
    statement.setString(1, title);
    statement.setInt(2, year);
    statement.setString(3, director);
    statement.setString(4, star);
    statement.setString(5, genre);

    if (statement.execute()) {
      ResultSet resultSet = statement.getResultSet();
      while (resultSet.next()) {
        message.put(resultSet.getString("message"));
      }
    }
    JSONObject retval = new JSONObject();
    retval.put("message", message);
    return retval;
  }

  static ResultSet getBrowseMovies(Connection con, String genre, String letter, String offset,
                                   String limit, String sort, String order, SearchMovies.NumRecords numRecords) throws SQLException {
    con.setReadOnly(true);
    PreparedStatement statement = null;
    sort = (sort != null) ? sort : "rating";
    order = (order != null) ? order : "DESC";
    offset = (offset != null) ? offset : "0";
    limit = (limit != null) ? limit : "10";
    letter = (letter != null) ? letter : "A";
    String query;
    String totalCount;
    ResultSet res = null;
    if (!genre.equals("")) {
      query = "SELECT movies.id, movies.title, `year`, director, genres.name, rating FROM genres_in_movies\n" +
              "\tINNER JOIN movies ON genres_in_movies.movieId=movies.id\n" +
              "    INNER JOIN genres on genres_in_movies.genreId=genres.id\n" +
              "    INNER JOIN ratings ON genres_in_movies.movieId=ratings.movieId" +
              "   WHERE genres.name LIKE ?";
      totalCount = "Select count(*) as count from (" + query + ") as distinctrecords";
      statement = con.prepareStatement(totalCount);
      statement.setString(1, genre);
      res = statement.executeQuery();
    } else {
      query = "Select id, title, `year`, director, rating from movies " +
              "INNER JOIN ratings on movies.id=ratings.movieId where title LIKE ?";
      totalCount = "Select count(*) as count from (" + query + ") as distinctrecords";
      statement = con.prepareStatement(totalCount);
      statement.setString(1, letter + "%");
      res = statement.executeQuery();
    }
    res.next();
    numRecords.num = res.getInt("count");

    if (sort.equals("rating")) {
      query = query + " ORDER BY rating ";
    } else {

      query = query + " ORDER BY title ";
    }
    if (order.equals("DESC")) {
      query = query + "DESC LIMIT ?, ?";
    } else {
      query = query + "ASC LIMIT ?, ?";
    }
    statement = con.prepareStatement(query);
    if (!genre.equals("")) {
      statement.setString(1, genre);
    } else {
      statement.setString(1, letter + "%");
    }
    statement.setInt(2, Integer.parseInt(offset));
    statement.setInt(3, Integer.parseInt(limit));
    out.println(statement.toString());
    return statement.executeQuery();
  }

  static JSONObject getSalesRecords(Connection con, JSONObject sale) throws SQLException {
    con.setReadOnly(false);
    JSONObject records = new JSONObject();
    Iterator<String> keys = sale.keys();
    PreparedStatement statement;
    Statement st = con.createStatement();
    String query = null;
    while (keys.hasNext()) {
      String key = keys.next();
      JSONArray stuff = new JSONArray();
      if (sale.get(key) instanceof JSONObject) {
        for (int i = 0; i < ((JSONObject) sale.get(key)).getInt("quantity"); i++) {
          query = "INSERT INTO sales(customerId, movieId, saleDate) VALUES (?, ?, DATE(NOW()))";
          statement = con.prepareStatement(query);
          statement.setInt(1, Integer.parseInt(sale.getString("customerId")));
          statement.setString(2, key);
          statement.executeUpdate();
          query = "SELECT last_insert_id() as id";
          ResultSet resultSet = st.executeQuery(query);
          resultSet.next();
          stuff.put(resultSet.getInt("id"));
        }
        records.put(key, stuff);
      }
    }
    return records;
  }

  static ResultSet getFullTextResults(Connection con, String queryString, int offset, SearchMovies.NumRecords numRecords) throws SQLException {
    con.setReadOnly(true);
    String[] tokens = queryString.split(" ");
    StringBuilder query_builder = new StringBuilder();
    for (String tok :
            tokens) {
      query_builder.append("+").append(tok).append("* ");
    }
    String query = "Select distinct id, title, `year`, director, rating FROM" +
            "(Select * from movies left join ratings on movies.id = ratings.movieId where "+
            "match(title) against ('"+query_builder.toString()+"' in boolean mode)) as records";

    String total = "Select count(*) as count from (" + query + ") as distinctrecords";
    Statement statement = con.createStatement();
    ResultSet res = statement.executeQuery(total);
    res.next();
    numRecords.num = res.getInt("count");
    statement = con.createStatement();
    return statement.executeQuery(query+" LIMIT "+offset+", 10");
  }

  static ResultSet getMovies(Connection con, String title, String year, String director, String star,
                             String offset, SearchMovies.NumRecords numRecords, String limit, String sort, String order) throws SQLException {
    con.setReadOnly(true);
    // Turn all null strings into ""
    title = (title != null) ? title : "";
    year = (year != null) ? year : "";
    director = (director != null) ? director : "";
    star = (star != null) ? star : "";
    offset = (offset != null) ? offset : "0";
    limit = (limit != null) ? limit : "10";
    sort = (sort != null) ? sort : "rating";
    order = (order != null) ? order : "DESC";

    String query = "Select distinct id, title, `year`, director, rating FROM " +
            "(SELECT movies.id, title, `year`, director, rating, starId, `name` " +
            "FROM stars_in_movies " +
            "INNER JOIN movies " +
            "ON stars_in_movies.movieId = movies.id " +
            "INNER JOIN stars " +
            "ON stars_in_movies.starId = stars.id " +
            "left join ratings " +
            "ON movies.id = ratings.movieId WHERE title LIKE ? " +
            "AND `year` LIKE ? AND director LIKE ? " +
            "AND `name` LIKE ?) as records";
    String totalCount = "Select count(*) as count from (" + query + ") as distinctrecords";
    PreparedStatement statement = con.prepareStatement(totalCount);
    statement.setString(1, "%" + title + "%");
    statement.setString(2, "%" + year + "%");
    statement.setString(3, "%" + director + "%");
    statement.setString(4, "%" + star + "%");
    ResultSet res = statement.executeQuery();
    res.next();
    numRecords.num = res.getInt("count");
    if (sort.equals("rating")) {
      query = query + " ORDER BY rating ";
    } else {

      query = query + " ORDER BY title ";
    }
    if (order.equals("DESC")) {
      query = query + "DESC LIMIT ?, ?";
    } else {
      query = query + "ASC LIMIT ?, ?";
    }
    statement = con.prepareStatement(query);
    out.println(query);
    statement.setString(1, "%" + title + "%");
    statement.setString(2, "%" + year + "%");
    statement.setString(3, "%" + director + "%");
    statement.setString(4, "%" + star + "%");
    statement.setInt(5, Integer.parseInt(offset));
    statement.setInt(6, Integer.parseInt(limit));

      // This is for the non-prep statements
//    Statement statement = con.createStatement();
//    // Turn all null strings into ""
//    title = (title != null) ? title : "";
//    year = (year != null) ? year : "";
//    director = (director != null) ? director : "";
//    star = (star != null) ? star : "";
//    offset = (offset != null) ? offset : "0";
//    limit = (limit != null) ? limit : "10";
//    sort = (sort != null) ? sort : "rating";
//    order = (order != null) ? order : "DESC";
//
//
//    String query = "Select distinct id, title, `year`, director, rating FROM "+
//            "(SELECT movies.id, title, `year`, director, rating, starId, `name` " +
//            "FROM stars_in_movies " +
//            "INNER JOIN movies " +
//            "ON stars_in_movies.movieId = movies.id " +
//            "INNER JOIN stars " +
//            "ON stars_in_movies.starId = stars.id " +
//            "left join ratings " +
//            "ON movies.id = ratings.movieId WHERE title LIKE '%"+title+
//            "%' AND `year` LIKE '%"+year+"%' AND director LIKE '%"+director+
//            "%' AND `name` LIKE '%"+star+"%') as records";
//    String totalCount = "Select count(*) as count from ("+query+") as distinctrecords";
//    ResultSet res = statement.executeQuery(totalCount);
//    res.next();
//    numRecords.num = res.getInt("count");
//    query = query + " ORDER BY "+sort+" "+order+" LIMIT "+offset+", "+limit;
//    System.out.println(query);
    long startJDBC = System.nanoTime();
//    ResultSet resultSet = statement.executeQuery(query);
    ResultSet resultSet = statement.executeQuery();
    long endJDBC = System.nanoTime();
    numRecords.jdbctime = endJDBC - startJDBC;
    return resultSet;
  }

  static ResultSet getTwentyStars(Connection con) throws SQLException {
    con.setReadOnly(true);
    Statement statement = con.createStatement();
    String query = "SELECT * from movies left join ratings on movies.id = ratings.movieId order by rating desc limit 20";
    return statement.executeQuery(query);
  }

  static ResultSet getGenres(Connection con, String id) throws SQLException {
    con.setReadOnly(true);
    String genre_query = "SELECT name FROM genres where id in (select genreId from genres_in_movies where movieId=?)";
    PreparedStatement statement = con.prepareStatement(genre_query);
    statement.setString(1, id);
    return statement.executeQuery();
  }

  static ResultSet getStars(Connection con, String id) throws SQLException {
    con.setReadOnly(true);
    String star_query = "SELECT name, id FROM stars where id in (select starId from stars_in_movies where movieId=?)";
    PreparedStatement statement = con.prepareStatement(star_query);
    statement.setString(1, id);
    return statement.executeQuery();
  }

  static ResultSet getSingleStar(Connection con, String id) throws SQLException {
    con.setReadOnly(true);
    String query = "SELECT * from stars where id = ?";
    PreparedStatement statement = con.prepareStatement(query);
    statement.setString(1, id);
    return statement.executeQuery();
  }

  static ResultSet getSingleMovie(Connection con, String id) throws SQLException {
    con.setReadOnly(true);
    String query = "SELECT * from movies left join ratings on movies.id=ratings.movieId where movies.id=?";
    PreparedStatement statement = con.prepareStatement(query);
    statement.setString(1, id);
    return statement.executeQuery();
  }

  static ResultSet getMovieTitles(Connection con, String id) throws SQLException {
    con.setReadOnly(true);
    String movie_query = "SELECT title, id FROM movies where id in (select movieId from stars_in_movies where starId=?)";
    PreparedStatement statement = con.prepareStatement(movie_query);
    statement.setString(1, id);
    return statement.executeQuery();
  }

  static JSONObject isValidEmployee(Connection con, JSONObject data) throws SQLException {
    con.setReadOnly(true);
    JSONObject employee = null;
    String query = "SELECT * from employees where email=?";
    PreparedStatement statement = con.prepareStatement(query);
    statement.setString(1, data.getString("username"));
    ResultSet resultSet = statement.executeQuery();
    boolean success;
    while (resultSet.next()) {
      success = new StrongPasswordEncryptor().checkPassword(data.getString("password"), resultSet.getString("password"));
      if (success) {
        employee = new JSONObject();
        employee.put("fullname", resultSet.getString("fullname"));
        employee.put("email", resultSet.getString("email"));
      }
    }
    return employee;
  }

  static JSONObject isValidUser(Connection con, JSONObject data) throws SQLException {
    con.setReadOnly(true);
    JSONObject customer = null;
    String query = "SELECT customers.id, customers.password, customers.firstName, customers.lastName, ccId, email, address, email, expiration" +
            "  from customers INNER JOIN creditcards on customers.ccId=creditcards.id WHERE email=?";
    PreparedStatement statement = con.prepareStatement(query);
    statement.setString(1, data.getString("username"));
    ResultSet resultSet = statement.executeQuery();
    boolean success;
    while (resultSet.next()) {
      success = new StrongPasswordEncryptor().checkPassword(data.getString("password"), resultSet.getString("password"));
      if (success) {
        customer = new JSONObject();
        customer.put("id", resultSet.getString("id"));
        customer.put("firstName", resultSet.getString("firstName"));
        customer.put("lastName", resultSet.getString("lastName"));
        customer.put("ccId", resultSet.getString("ccId"));
        customer.put("email", resultSet.getString("email"));
        customer.put("address", resultSet.getString("address"));
        customer.put("expiration", resultSet.getString("expiration"));
      }
    }
    return customer;
  }

  static void corsFix(HttpServletResponse resp, HttpServletRequest request) {
    String domain = request.getScheme() + "://";
    try {
      domain = domain + new URL(request.getRequestURL().toString()).getHost();
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }
    resp.setHeader("Access-Control-Allow-Origin", domain + ":3000");
    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    resp.setHeader("Access-Control-Allow-Credentials", "true");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  static boolean isLoggedIn(HttpServletRequest request, HttpServletResponse response) {
    Cookie[] cookies = request.getCookies();
    if (request.isRequestedSessionIdFromCookie() && !request.isRequestedSessionIdValid()) {
      for (Cookie c :
              cookies) {
        c.setMaxAge(0);
        response.addCookie(c);
        out.println(c.getName());
      }
      return false;
    } else if (!request.isRequestedSessionIdValid()) {
      return false;
    }
    return true;
  }
}
