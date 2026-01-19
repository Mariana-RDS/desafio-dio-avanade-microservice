using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserService.Domain.Entities;

namespace UserService.Domain
{
    public interface IUserRepository
    {
        User GetByUsername(string username);
        void Add(User user);
        User GetById(int id);
        IEnumerable<User> GetAll();
    }
}

