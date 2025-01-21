package hr.fer.skydancers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import hr.fer.skydancers.enums.UserTypeEnum;
import hr.fer.skydancers.model.Admin;
import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.AuditionApplication;
import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.model.UserType;
import hr.fer.skydancers.repository.DanceRepository;
import hr.fer.skydancers.repository.UserRepository;
import hr.fer.skydancers.service.UserService;

@SpringBootTest
@AutoConfigureMockMvc
class SkydancersApplicationTests {

	private Dancer dancer;
    private Dance danceStyle1;
    private Dance danceStyle2;
	private Director director;
    private Audition audition1;
    private Audition audition2;

	

	@Autowired
    private MockMvc mockMvc;

	@Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;


    @MockBean
    private DanceRepository danceRepository;

    public static final UserType USER_TYPE = new UserType(1, UserTypeEnum.DANCER.name());
	public static final MyUser USER = new MyUser();
	static {
        USER.setId(1);
        USER.setUsername("user123");
    }
    

	@BeforeEach
    public void setUp() {
        danceStyle1 = new Dance();
        danceStyle2 = new Dance();
        List<Dance> danceStyles = Arrays.asList(danceStyle1, danceStyle2);
        List<AuditionApplication> applications = Arrays.asList(new AuditionApplication());
        dancer = new Dancer(true, LocalDate.of(2025, 1, 31), danceStyles, applications);

		audition1 = new Audition();
        audition2 = new Audition(); 
        List<Audition> auditions = Arrays.asList(audition1, audition2);
        director = new Director(true, LocalDate.of(2025, 1, 1), auditions);
        
    }
	
	@Test
    public void testDancerModel() {
        assertTrue(dancer.isInactive(), "Dancer should be inactive");
        assertEquals(LocalDate.of(2025, 1, 31), dancer.getInactiveuntil(), "Inactive date should be 2025-01-31");
        assertEquals(2, dancer.getDancestyles().size(), "Dancer should have 2 dance styles");
        assertFalse(dancer.getApplications().isEmpty(), "Dancer should have audition applications");
    }

	@Test
    public void testDirectorModel() {
        assertTrue(director.isPaid(), "Director should be marked as paid");
        assertEquals(LocalDate.of(2025, 1, 1), director.getSubscription(), "Subscription date should be 2025-01-01");
        assertEquals(2, director.getAudition().size(), "Director should have 2 auditions");
        assertFalse(director.getAudition().isEmpty(), "Director should have audition applications");
    }

    @Test
    public void testAuditionApplicationModel() {

        Audition audition = new Audition(); 
        Dancer dancer = new Dancer(); 
        LocalDateTime datetime = LocalDateTime.of(2025, 1, 31, 12, 30, 0, 0); // Set a test datetime
        String status = "Pending"; 
        AuditionApplication application = new AuditionApplication(1, datetime, status, audition, dancer);

        assertEquals(1, application.getId(), "Application ID should be 1");
        assertEquals(datetime, application.getDatetime(), "Datetime should be 2025-01-31 12:30:00");
        assertEquals(status, application.getStatus(), "Status should be 'Pending'");
        assertEquals(audition, application.getAudition(), "Audition should be the same as the one provided");
        assertEquals(dancer, application.getDancer(), "Dancer should be the same as the one provided");
    }
    
	@Test
    public void testAdminSubscriptionPrice() {
        Long expectedPrice = 100L;  
        Admin admin = new Admin(expectedPrice); 

        Long actualPrice = admin.getSubscriptionprice(); 
        assertEquals(expectedPrice, actualPrice, "Subscription price should match");
    }

	@Test
	public void testRegisterSuccessful() throws Exception {
    	String validRegistrationJson = "{"
            + "\"username\": \"validUsername\","
            + "\"name\": \"Test\","
            + "\"surname\": \"User\","
            + "\"email\": \"test.user@example.com\","
            + "\"password\": \"securePassword123\","
            + "\"type\": \"DANCER\","
            + "\"finishedoauth\": \"true\""
            + "}";

    	mockMvc.perform(post("/users/registerdancer")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(validRegistrationJson))
            .andExpect(status().isOk()) // Expecting HTTP 200
            .andExpect(content().string("Registration successful!"));
	}

	@Test
	public void testLoginNonExistentUser() throws Exception {
		String invalidLoginJson = "{"
				+ "\"username\": \"nonExistentUser\","
				+ "\"password\": \"wrongPassword123\""
				+ "}";
	
		mockMvc.perform(post("/users/authenticate")
						.contentType(MediaType.APPLICATION_JSON)
						.content(invalidLoginJson))
						.andExpect(status().isOk())
						.andExpect(content().string("Invalid credentials"));
	}
	
	@Test
    public void testGetByUsername() {
        when(userRepository.findByUsername("user123")).thenReturn(Optional.of(USER));
        Optional<MyUser> result = userService.get("user123");
        assertTrue(result.isPresent());
        assertEquals(USER, result.get());
        MyUser fetchedUser = result.get();
        assertEquals("user123", fetchedUser.getUsername());
    }

	
}
	

