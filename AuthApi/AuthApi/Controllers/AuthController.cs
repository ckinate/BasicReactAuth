using AuthApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailSender<IdentityUser> _emailSender;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
           UserManager<IdentityUser> userManager,
           SignInManager<IdentityUser> signInManager,
           IEmailSender<IdentityUser> emailSender,
           ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new IdentityUser { UserName = registerDto.Email, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Add user to the "User" role
            await _userManager.AddToRoleAsync(user, "User");

            // Generate email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Auth", new { userId = user.Id, token }, Request.Scheme);

            // In a real app, you'd use a real email sender.
            _logger.LogInformation("Sending confirmation email to {Email} with link: {Link}", user.Email, confirmationLink);
            await _emailSender.SendConfirmationLinkAsync(user, user.Email, confirmationLink!);

            return Ok(new { Message = "Registration successful. Please check your email to confirm your account." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Note: PasswordSignInAsync handles lockout on failure
            var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, isPersistent: true, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} logged in.", loginDto.Email);
                return Ok(new { Message = "Login successful" });
            }
            if (result.IsNotAllowed)
            {
                return Unauthorized(new { Message = "Account not confirmed. Please check your email." });
            }
            if (result.IsLockedOut)
            {
                return Unauthorized(new { Message = "Account locked out." });
            }

            return Unauthorized(new { Message = "Invalid login attempt." });
        }

        [HttpPost("logout")]
        [Authorize] // Only logged-in users can log out
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return Ok(new { Message = "Logout successful" });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null)
            {
                return BadRequest("Invalid email confirmation URL.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                // In a real app, you would redirect to a "Email Confirmed" page on your React app
                return Ok("Email confirmed successfully! You can now log in.");
            }

            return BadRequest("Error confirming your email.");
        }

        // Endpoint to check the current user's auth status
        [HttpGet("me")]
        [Authorize] // This ensures only authenticated users can access it
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);

            // Return user information. Be careful not to expose sensitive data.
            return Ok(new
            {
                user.Email,
                user.Id,
                Roles = roles
            });
        }

        // Example of a protected endpoint for a specific role
        [HttpGet("admin-data")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAdminData()
        {
            return Ok(new { Message = "This is a secret message for Admins only!" });
        }
    }
}
