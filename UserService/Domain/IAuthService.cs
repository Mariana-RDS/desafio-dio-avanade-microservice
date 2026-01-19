using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;
using UserService.Application;
using UserService.Domain.Entities;

namespace UserService.Domain

{
    public interface IAuthService
    {
        User Authenticate(string username, string password);
        string GenerateJwtToken(User user);
        (bool Success, string Message) Register(RegisterUserRequest register);
        
        IEnumerable<User> GetAll();
    }
}