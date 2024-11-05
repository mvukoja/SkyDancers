package hr.fer.skydancers.service;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import hr.fer.skydancers.model.MyUser;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

	@Autowired
    private UserService userService;
	@Autowired
	private OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        Optional<MyUser> existingUser = userService.get(email);
        if (existingUser.isEmpty()) {
            MyUser newUser = new MyUser();
            newUser.setEmail(email);
            newUser.setName(oauth2User.getAttribute("name"));
            newUser.setUsername(oauth2User.getAttribute("login"));
            newUser.setOauth(true);
            userService.put(newUser);
        }

        return oauth2User;
    }
}
