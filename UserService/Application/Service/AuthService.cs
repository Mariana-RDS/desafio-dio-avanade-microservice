

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
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration, IUserRepository userRepository)
        {
            _jwtSecret = Encoding.ASCII.GetBytes(configuration["JwtSecret"]);
            _userRepository = userRepository;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username))
                throw new ArgumentException("Username cannot be null or empty");

            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password cannot be null or empty");

            var userFromDb = _userRepository.GetByUsername(username);

            if (userFromDb == null)
            {
                return null;
            }

            if (VerifyPassword(password, userFromDb.PasswordHash))
            {
                return new User
                {
                    Id = userFromDb.Id,
                    Username = userFromDb.Username,
                    Email = userFromDb.Email,
                    Role = userFromDb.Role
                };
            }
            return null;
        }

        public string GenerateJwtToken(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null");

            if (string.IsNullOrEmpty(user.Username))
                throw new ArgumentException("Username cannot be null or empty");

            if (string.IsNullOrEmpty(user.Role))
                throw new ArgumentException("Role cannot be null or empty");

            var key = _jwtSecret;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            if (!string.IsNullOrEmpty(user.Email))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Email));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
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

            var validRoles = new[] { "User", "Admin" };
            var role = string.IsNullOrEmpty(register.Role) ? "User" : register.Role;

            if (!validRoles.Contains(role))
                return (false, "Invalid role. Use 'User' or 'Admin'");

            var user = new User
            {
                Username = register.Username,
                Email = register.Email,
                PasswordHash = BC.HashPassword(register.Password),
                Role = role
            };

            _userRepository.Add(user);
            return (true, $"User with role '{role}' registered successfully");
        }
    }
}