using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Application;
using UserService.Domain;

namespace UserService.Presentation.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _authService.Authenticate(request.Username, request.Password);
            if (user == null)
                return Unauthorized(new { Message = "Usuário ou senha inválidos" });

            var token = _authService.GenerateJwtToken(user);
            return Ok(new
            {
                Token = token,
                User = new { user.Username, user.Email, user.Role }
            });
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")] 
        public IActionResult Register([FromBody] RegisterUserRequest register)
        {
            var result = _authService.Register(register);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { Message = "Usuário criado com sucesso!" });
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _authService.GetAll(); 
            
            var userList = users.Select(u => new {
                u.Id,
                u.Username,
                u.Email,
                u.Role
            });

            return Ok(userList);
        }
    }
}