

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using BC = BCrypt.Net.BCrypt;
using UserService.Domain.Entities;
using UserService.Domain;

namespace UserService.Application.Service
{

    public class AuthService : IAuthService
    {
        private readonly byte[] _jwtSecret;
        private readonly IUserRepository _userRepository;

        public AuthService(IConfiguration configuration, IUserRepository userRepository)
        {
            _jwtSecret = Encoding.ASCII.GetBytes(configuration["JwtSecret"]);
            _userRepository = userRepository;
        }

        public User Authenticate(string username, string password)
        {
            var user = _userRepository.GetByUsername(username);
            if (user == null || !VerifyPassword(password, user.PasswordHash))
                return null;

            return user;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(_jwtSecret),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return BC.Verify(password, storedHash);
        }

        public (bool Success, string Message) Register(RegisterUserRequest register)
        {
            if (_userRepository.GetByUsername(register.Username) != null)
                return (false, "Username already exists");

            var user = new User
            {
                Username = register.Username,
                Email = register.Email,
                PasswordHash = BC.HashPassword(register.Password),
                Role = "User"
            };

            _userRepository.Add(user);
            return (true, "User registered successfully");
        }
    }
}