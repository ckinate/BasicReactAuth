using Microsoft.AspNetCore.Identity;

namespace AuthApi.Services
{
    public class EmailSender : IEmailSender<IdentityUser>
    {
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(ILogger<EmailSender> logger)
        {
            _logger = logger;
        }

        // This is the method from the newer IEmailSender<TUser> interface
        public Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
        {
            // In a real app, you'd format a beautiful HTML email here
            var message = $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.";

            _logger.LogInformation("---- MOCK EMAIL SENDER ----");
            _logger.LogInformation("Sending email to {Email} with subject 'Confirm your email' and message:", email);
            _logger.LogInformation("{Message}", message);
            _logger.LogInformation("---------------------------");

            return Task.CompletedTask;
        }

        // This method is for password reset, which follows a similar pattern
        public Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
        {
            var message = $"Please reset your password by <a href='{resetLink}'>clicking here</a>.";

            _logger.LogInformation("---- MOCK EMAIL SENDER ----");
            _logger.LogInformation("Sending email to {Email} with subject 'Reset your password' and message:", email);
            _logger.LogInformation("{Message}", message);
            _logger.LogInformation("---------------------------");

            return Task.CompletedTask;
        }

        // This method is for password reset codes (e.g. for 2FA)
        public Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
        {
            var message = $"Your password reset code is: {resetCode}";

            _logger.LogInformation("---- MOCK EMAIL SENDER ----");
            _logger.LogInformation("Sending email to {Email} with subject 'Your password reset code' and message:", email);
            _logger.LogInformation("{Message}", message);
            _logger.LogInformation("---------------------------");

            return Task.CompletedTask;
        }
    }
}
