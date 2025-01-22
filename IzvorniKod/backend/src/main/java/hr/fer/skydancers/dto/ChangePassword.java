package hr.fer.skydancers.dto;

//DTO za izmjenu lozinke
public record ChangePassword(String password, String repeatPassword) {
}
