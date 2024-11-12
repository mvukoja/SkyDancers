package hr.fer.skydancers.dto;

import java.time.LocalDate;


public class InactiveStatusRequest {
    private boolean inactive;
    private LocalDate inactiveUntil;

    public InactiveStatusRequest(){}
    public InactiveStatusRequest(boolean inactive,LocalDate inactiveUntil) {
        this.inactive = inactive;
        this.inactiveUntil = inactiveUntil;
    }
    public boolean isInactive() {
        return inactive;
    }

    public void setInactive(boolean inactive) {
        this.inactive = inactive;
    }

    public LocalDate getInactiveUntil() {
        return inactiveUntil;
    }

    public void setInactiveUntil(LocalDate inactiveUntil) {
        this.inactiveUntil = inactiveUntil;
    }
}
