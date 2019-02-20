public class Film {
    private String director;
    private String title;
    private String year;
    private String[] genres;
    private String[] stars;
    private String movieId;

    public Film(String director, String title, String year, String[] genres) {
        this.director = director;
        this.title = title;
        this.year = year;
        this.genres = genres;
        this.stars = new String[0];
        this.movieId = "";
    }
    public Film(){
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }
    public String toString() {
        StringBuilder gen = new StringBuilder();
        for (String x :
                genres) {
            gen.append(x).append(" ");
        }
        StringBuilder sta = new StringBuilder();
        for (String y :
                stars) {
            sta.append(y).append(" ");
        }
        StringBuffer sb = new StringBuffer();
        sb.append("Movie Details - ");
        sb.append("Director: " + getDirector());
        sb.append(", ");
        sb.append("Year: " + getYear());
        sb.append(", ");
        sb.append("Genres: " + gen.toString());
        sb.append(", ");
        sb.append("Stars: " + sta.toString());
        sb.append(", ");
        sb.append("Title: " + getTitle());
        return sb.toString();
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String[] getGenres() {
        return genres;
    }

    public void setGenres(String[] genres) {
        this.genres = genres;
    }

    public String[] getStars() {
        return stars;
    }

    public void setStars(String[] stars) {
        this.stars = stars;
    }

    public void setMovieId(String movieId)
    {
        this.movieId = movieId;
    }

    public String getMovieId()
    {
        return this.movieId;
    }
}
