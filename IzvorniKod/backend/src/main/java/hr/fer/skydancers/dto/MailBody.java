package hr.fer.skydancers.dto;

//DTO za prijenos tijela maila
public record MailBody(String to, String subject, String text) {
}
