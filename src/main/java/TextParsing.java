import com.mysql.cj.util.StringUtils;
import org.apache.commons.text.WordUtils;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.sql.*;

public class TextParsing
{
    private Document actorsDoc;

    private Document castsDoc;

    private Document mainsDoc;

    public static HashMap<String, Integer> StarMap;
    public static HashMap<String, Film> MovieMap;


    private TextParsing() {
        StarMap = new HashMap<>();
        MovieMap = new HashMap<>();
    }

//    public static void main(String[] args)
//    {
//        TextParsing parser = new TextParsing();
//
//        parser.runparsing();
//
//        //todo remove print
//        for (Film m : parser.MovieMap.values()) {
//            System.out.println(m);
//        }
//        for (String k :
//                parser.StarMap.keySet()) {
//            System.out.println(k + " Date of Birth: " + parser.StarMap.get(k));
//        }
//    }

    public static void main(String[] args)
    {
        // create the parser
        TextParsing parser = new TextParsing();

        // parse the xml files into the dom variables,
        // run my methods to store data into functions
        parser.runparsing();

        for (Film m : parser.MovieMap.values())
        {
            System.out.println(m);
        }
        for (String k :
                parser.StarMap.keySet()) {
            System.out.println(k + " Date of Birth: " + parser.StarMap.get(k));
        }

        try
        {
            String loginUser = "root";
            String loginPasswd = "Green254";
            String loginUrl = "jdbc:mysql://localhost:3306/MovieNight";

            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection connection = DriverManager.getConnection(loginUrl, loginUser, loginPasswd);
            connection.setAutoCommit(false);

            String query = "INSERT INTO movies VALUES (?, ?, ?, ?)";
            PreparedStatement pstate = connection.prepareStatement(query);

            String iduery = "SELECT * FROM movies WHERE id = (SELECT max(id) FROM movies) LIMIT 1";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(iduery);

            resultSet.next();

            String id = resultSet.getString("id");
            String id_num_as_string = id.substring(2, id.length());
            Integer int_id = Integer.parseInt(id_num_as_string);

            int_id += 1;
            id = "tt" + Integer.toString(int_id);


            Integer batch_size = 50;
            Integer count = 0;


            // each m is a movie
            for (Film movie : parser.MovieMap.values())
            {
                // inc count
                count += 1;

                // set movie id
                pstate.setString(1, id);
                movie.setMovieId(id);

                // set title
                pstate.setString(2, movie.getTitle());

                // set year as int
                pstate.setInt(3, Integer.parseInt(movie.getYear()));

                // set director
                pstate.setString(4, movie.getDirector());

                // add batch
                pstate.addBatch();

                // increment id
                int_id += 1;
                id = "tt" + Integer.toString(int_id);

                System.out.println(pstate.toString());

                if (count >= batch_size)
                {
                    System.out.println("EXECUTING BATCH");
                    pstate.executeBatch();
                    connection.commit();
                    count = 0;
                }
            }

            if (count % 100 != 0)
            {
                System.out.println("EXECUTING LEFT OVER BATCH");
                pstate.executeBatch();
                connection.commit();
            }

            // insert stars into stars and stars_in_movies

            String query2 = "INSERT INTO stars VALUES (?, ?, ?)";
            String query3 = "INSERT INTO stars_in_movies VALUES (?, ?)";
            PreparedStatement star_pstate = connection.prepareStatement(query2);
            PreparedStatement star_rel_movie = connection.prepareStatement(query3);



            // star id
            // get latest id and add 1 to it
            String star_id_q = "SELECT * FROM stars WHERE id = (SELECT max(id) FROM stars) LIMIT 1";
            Statement star_id_statement = connection.createStatement();
            ResultSet star_id_rs = star_id_statement.executeQuery(star_id_q);

            star_id_rs.next();

            String star_id = star_id_rs.getString("id");
            String star_id_num_as_string = star_id.substring(2, id.length());
            Integer star_int_id = Integer.parseInt(star_id_num_as_string);
            star_int_id += 1;
            star_id = "nm" + Integer.toString(int_id);

            Integer star_count = 0;

            // cycle through movies
            for (Film movie : parser.MovieMap.values())
            {
                // inc star count
                star_count += 1;

                // cycle through star array in the movie
                String[] starsAr = movie.getStars();
                for (int index = 0; index < starsAr.length; index++)
                {
                    // add params to star insert
                    star_pstate.setString(1, star_id);
                    star_pstate.setString(2, starsAr[index]);

                    if (StarMap.get(starsAr[index]) == null)
                    {
                        star_pstate.setInt(3, 0);
                    }
                    else {
                        star_pstate.setInt(3, StarMap.get(starsAr[index]));
                    }


                    // add params to star in movie
                    star_rel_movie.setString(1, star_id);
                    star_rel_movie.setString(2, movie.getMovieId());

                    // add to batch
                    star_pstate.addBatch();
                    star_rel_movie.addBatch();

                    System.out.println(star_pstate.toString());
                    System.out.println(star_rel_movie.toString());

                    // inc id
                    star_int_id += 1;
                    star_id = "nm" + Integer.toString(star_int_id);

                    if (star_count >= 100)
                    {
                        System.out.println("EXECUTING BATCH");
                        star_count = 0;
                        star_pstate.executeBatch();
                        star_rel_movie.executeBatch();
                        connection.commit();
                    }


                }

                if (star_count % 100 != 0)
                {
                    System.out.println("EXECUTING LEFT OVER BATCH");
                    star_pstate.executeBatch();
                    star_rel_movie.executeBatch();
                    connection.commit();
                }
            }





            try
            {
                if (pstate != null)
                {
                    pstate.close();

                    if (connection != null)
                    {
                        connection.close();
                    }
                }
            }
            catch (Exception e)
            {
                System.out.println(e.getMessage());
            }


        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

        System.exit(0);
    }

    private void parseAll() {
        readMainDoc();

        readcastsdoc();

        readActorsDoc();
    }

    private String getTextValue(Element ele, String tagName) {
        // initial text value
        String textVal = null;
        NodeList nl = ele.getElementsByTagName(tagName);
        if (nl != null && nl.getLength() > 0) {
            Element el = (Element) nl.item(0);
            textVal = el.getFirstChild().getNodeValue();
        }

        return textVal;
    }

    private void readActorsDoc() {
        Element rootElement = actorsDoc.getDocumentElement();

        NodeList actorNodeList = rootElement.getElementsByTagName("actor");

        if (actorNodeList != null && actorNodeList.getLength() >= 1){
            for (int index = 0; index < actorNodeList.getLength(); ++index){
                Element myElement = (Element)actorNodeList.item(index);

                int birthYear = 0;
                String Name = "";

                try{
                    Name = getTextValue(myElement, "stagename");
                }catch (DOMException de) {
                    System.out.println("Stars DOMError (Name): " + de.toString());
                }catch (Exception e){
                    System.out.println("Stars Error (Name): " + e.toString());
                }

                try{
                    String d = getTextValue(myElement, "dob");

                    birthYear = Integer.parseInt(d);
                }catch (DOMException de) {
                    System.out.println("Star DOMError (star birth): " + de.toString());
                }catch (NumberFormatException e) {
                    System.out.println("Star has an invalid birth (not an int)");
                }catch (Exception e) {
                    System.out.println("Star exception (actor birth): " + e.toString());
                }

                try
                {
                    StarMap.put(Name, birthYear);
                }catch (Exception e)
                {
                    System.out.println("Insert Error: " + Name + " into StarMap");
                }
            }
        }
    }

    private void readMainDoc() {
        Element rootElement = mainsDoc.getDocumentElement();

        NodeList directorFilmsList = rootElement.getElementsByTagName("directorfilms");

        if (directorFilmsList != null && directorFilmsList.getLength() >= 1) {
            for (int index = 0; index<directorFilmsList.getLength(); ++index) {

                Element dfilmElem = (Element) directorFilmsList.item(index);

                String directorName = getTextValue(dfilmElem, "dirname");

                NodeList filmsNodeList = dfilmElem.getElementsByTagName("film");

                if (filmsNodeList != null && filmsNodeList.getLength() > 0) {
                    for (int filmNodeIndex = 0; filmNodeIndex<filmsNodeList.getLength(); ++filmNodeIndex) {
                        Element filmNode = (Element)filmsNodeList.item(filmNodeIndex);

                        String filmYear = "";

                        String filmTitle = "";

                        try{
                            filmTitle = getTextValue(filmNode, "t");
                        }catch (Exception e){
                            System.out.println(e.toString());
                        }

                        try {
                            Integer filmYear_Int = Integer.parseInt(getTextValue(filmNode, "year"));
                            filmYear = getTextValue(filmNode, "year");
                        }catch (NumberFormatException e) {
                            filmYear = "0";
                        }catch (Exception e){
                            System.out.println(e.toString());
                        }

                        NodeList genreNodeList = ((Element)filmsNodeList.item(filmNodeIndex)).getElementsByTagName("cat");

                        ArrayList<String> genreList = new ArrayList<>();

                        if (genreNodeList != null && genreNodeList.getLength() >= 1){
                            for (int nodeIndex = 0; nodeIndex<genreNodeList.getLength(); ++nodeIndex){
                                try{

                                    String genre = genreNodeList.item(nodeIndex).getTextContent();

                                    genre = genre.trim();

                                    genre = WordUtils.capitalize(genre);

                                    genreList.add(genre);
                                }
                                catch (Exception e){
                                    System.out.println(e.toString());
                                }
                            }
                        }

                        if (!StringUtils.isEmptyOrWhitespaceOnly(directorName) && !StringUtils.isEmptyOrWhitespaceOnly(filmTitle)
                                && genreList.size() >= 1){
                            Object[] objArr = genreList.toArray();

                            MovieMap.put(filmTitle, new Film(directorName, filmTitle, filmYear, Arrays.copyOf(objArr, objArr.length, String[].class)));
                        }
                    }
                }
            }
        }
    }

    private void runparsing() {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        try
        {
            DocumentBuilder documentBuilder = factory.newDocumentBuilder();

            mainsDoc = documentBuilder.parse("mains243.xml");
            castsDoc = documentBuilder.parse("casts124.xml");
            actorsDoc = documentBuilder.parse("actors63.xml");
        }
        catch (Exception e)
        {
            System.out.println(e.toString());
            e.printStackTrace();
        }

        parseAll();
    }

    private void readcastsdoc() {
        Element rootElement = castsDoc.getDocumentElement();

        NodeList filmNodeList = rootElement.getElementsByTagName("filmc");

        if (filmNodeList != null && filmNodeList.getLength() >= 1){
            for (int index = 0; index<filmNodeList.getLength(); ++index){
                Element filmElement = (Element)filmNodeList.item(index);

                try{
                    NodeList m_tags = filmElement.getElementsByTagName("m");

                    if (m_tags != null && m_tags.getLength() >= 1){
                        String film_title = "";

                        ArrayList<String> star_list = new ArrayList<>();

                        for (int m_index = 0; m_index<m_tags.getLength(); ++m_index){
                            Element elementAtM = (Element) m_tags.item(m_index);

                            boolean first_time = (m_index == 0);

                            try{
                                if (first_time){
                                    film_title = getTextValue(elementAtM, "t");
                                }

                                String actorName = getTextValue(elementAtM, "a");

                                actorName = actorName.trim();

                                actorName = WordUtils.capitalize(actorName);
                                star_list.add(actorName);
                            }
                            catch (Exception e){
                                System.out.println("Exception at Actor: " + e.toString() + " + " + e.getMessage());
                            }
                        }

                        Object[] starsList = star_list.toArray();

                        if (starsList.length > 0)
                        {
                            try{
                                Film myFilm = MovieMap.get(film_title);

                                if (myFilm != null){

                                    myFilm.setStars(Arrays.copyOf(starsList, starsList.length, String[].class));
                                }
                            }
                            catch (Exception e){
                                for (String name : star_list){
                                    // print out the string in star_list
                                    System.out.println(name);
                                }

                                System.out.println("Error inserting movie: " + e.toString());
                            }
                        }
                    }
                }
                catch (Exception e){
                    System.out.println("Film error at " + e.toString());
                }
            }
        }
    }
}