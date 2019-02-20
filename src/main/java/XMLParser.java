import java.util.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.text.WordUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class XMLParser {
    private Document mainDom;
    private Document castDom;
    private Document actorDom;
    private HashMap<String, Movie> Movies;
    private HashMap<String, Integer> BirthYears;

    public XMLParser() {
        Movies = new HashMap<>();
        BirthYears = new HashMap<>();
    }

    public void runExample() {
        //parse the xml file and get the mainDom object
        parseXmlFile();

        //get each xml file and start constructing movie objects
        parseMainFile();
        parseCastsFile();
        parseActorsFile();
    }

    private void parseXmlFile() {
        //get the factory
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        try {
            //Using factory get an instance of document builder
            DocumentBuilder db = dbf.newDocumentBuilder();
            //parse using builder to get DOM representation of the XML file
            mainDom = db.parse("mains243.xml");
            castDom = db.parse("casts124.xml");
            actorDom = db.parse("actors63.xml");
        } catch (Exception x) {
            System.out.println(x.toString());
            x.printStackTrace();
        }
    }

    private void parseActorsFile() {
        Element docEle = actorDom.getDocumentElement();

        NodeList nl = docEle.getElementsByTagName("actor");
        if (nl != null && nl.getLength() > 0) {
            for (int i = 0; i < nl.getLength(); i++) {
                Element el = (Element) nl.item(i);
                String actor = null;
                int dob = 0;
                try {
                    actor = getTextValue(el, "stagename");
                } catch (Exception e) {
                    System.out.println("Actors file actor name exception: " + e.toString());
                }
                try {
                    String d = getTextValue(el, "dob");
                    dob = Integer.parseInt(d);
                } catch (Exception e) {
                    System.out.println("Actor " + actor + " has invalid date of birth");
                }
                try {
                    BirthYears.put(actor, dob);
                } catch (Exception e) {
                    System.out.println("Actor: " + actor + ", DoB: " + dob);
                }
            }
        }
    }

    private void parseCastsFile() {
        Element docEle = castDom.getDocumentElement();

        NodeList nl = docEle.getElementsByTagName("filmc");
        if (nl != null && nl.getLength() > 0) {
            for (int i = 0; i < nl.getLength(); i++) {
                Element el = (Element) nl.item(i);
                try {
                    NodeList actors = el.getElementsByTagName("m");
                    if (actors != null && actors.getLength() > 0) {
                        String film = null;
                        ArrayList<String> stars = new ArrayList<>();
                        for (int j = 0; j < actors.getLength(); j++) {
                            Element ac = (Element) actors.item(j);
                            try {
                                if (j == 0) {
                                    film = getTextValue(ac, "t");
                                }
                                String actor = getTextValue(ac, "a");
                                actor = actor.trim();
                                // To Upper first characters, lowercase the rest
                                actor = WordUtils.capitalizeFully(actor);
                                stars.add(actor);
                            } catch (Exception x) {
                                System.out.println("Actor: " + x.toString());
                            }
                        }
                        Object[] objStars = stars.toArray();
                        if (objStars.length > 0) {
                            try {
                                Movie m = Movies.get(film);
                                if (m != null) {
                                    m.setStars(Arrays.copyOf(objStars, objStars.length, String[].class));
                                }
                            } catch (Exception z) {
                                for (String s :
                                        stars) {
                                    System.out.println(s);
                                }
                                System.out.println("Movie insert error: " + z.toString());
                            }
                        }
                    }
                } catch (Exception x) {
                    System.out.println("Film: " + x.toString());
                }
            }
        }
    }

    private void parseMainFile() {
        //get the root elememt
        Element docEle = mainDom.getDocumentElement();

        Set<String> new_genres = new HashSet<>();
        //get a nodelist of <employee> elements
        NodeList nl = docEle.getElementsByTagName("directorfilms");
        if (nl != null && nl.getLength() > 0) {
            for (int i = 0; i < nl.getLength(); i++) {

                Element el = (Element) nl.item(i);
                String director = getTextValue(el, "dirname");

                //get the Employee object
                //Employee e = getEmployee(el);
                NodeList films = el.getElementsByTagName("film");
                if (films != null && films.getLength() > 0) {
                    for (int j = 0; j < films.getLength(); j++) {
                        Element fl = (Element) films.item(j);
                        String title = null;
                        String year = null;
                        try {
                            title = getTextValue(fl, "t");
                        } catch (Exception e) {
                            System.out.println("Title exception at film element " + j + ": " + e.toString());
                        }
                        try {
                            Integer yearint = Integer.parseInt(getTextValue(fl, "year"));
                            year = getTextValue(fl, "year");
                        }catch (NumberFormatException e){
                            year = "0";
                        }
                        catch (Exception e) {
                            System.out.println("Year exception at film element " + j + ": " + e.toString());
                        }
                        NodeList genres = ((Element) films.item(j)).getElementsByTagName("cat");
                        ArrayList<String> gs = new ArrayList<>();
                        if (genres != null && genres.getLength() > 0) {
                            for (int k = 0; k < genres.getLength(); k++) {
                                try {
                                    String g = genres.item(k).getTextContent();
                                    g = g.trim();
                                    g = WordUtils.capitalizeFully(g);
                                    gs.add(g);
                                    new_genres.add(g);
                                } catch (Exception e) {
                                    System.out.println("Genres exception: " + e.toString());
                                }
                            }
                        }
                        if (director != null && title != null && gs.size() > 0) {
                            Object[] objArr = gs.toArray();
                            Movies.put(title, new Movie(director, title, year, Arrays.copyOf(objArr, objArr.length, String[].class)));
                        }
                    }
                }
            }
//            for (String s :
//                    new_genres) {
//                System.out.println(s);
//            }
            System.out.println(Movies.size());
        }
    }

    /**
     * I take a xml element and the tag name, look for the tag and get
     * the text content
     * i.e for <employee><name>John</name></employee> xml snippet if
     * the Element points to employee node and tagName is name I will return John
     *
     * @param ele
     * @param tagName
     * @return
     */
    private String getTextValue(Element ele, String tagName) {
        String textVal = null;
        NodeList nl = ele.getElementsByTagName(tagName);
        if (nl != null && nl.getLength() > 0) {
            Element el = (Element) nl.item(0);
            textVal = el.getFirstChild().getNodeValue();
        }

        return textVal;
    }

    public static void main(String[] args) {
        //create an instance
        XMLParser dpe = new XMLParser();

        //call run example
        dpe.runExample();
        for (Movie m :
                dpe.Movies.values()) {
            System.out.println(m);
        }
        for (String k :
                dpe.BirthYears.keySet()) {
            System.out.println(k + " Date of Birth: " + dpe.BirthYears.get(k));
        }
    }
}
