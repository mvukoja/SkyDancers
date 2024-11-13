package hr.fer.skydancers.dto;

import java.util.List;

//Ova klasa predstavlja zahtjev za ažuriranje plesnih stilova korisnika

public class DanceStylesRequest {

    private List<String> danceStyles;

    public DanceStylesRequest() {}

    public DanceStylesRequest(List<String> danceStyles) {
        this.danceStyles = danceStyles;
    }

    public List<String> getDanceStyles() {
        return danceStyles;
    }

    public void setDanceStyles(List<String> danceStyles) {
        this.danceStyles = danceStyles;
    }
}
