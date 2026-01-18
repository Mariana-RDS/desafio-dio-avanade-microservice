using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UserService.Domain.Entities;

namespace UserService
{
    public class AppDbContext : DbContext 
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50).HasColumnName("username");
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100).HasColumnName("email");
                entity.Property(u => u.PasswordHash).IsRequired().HasColumnName("password");
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20).HasColumnName("role");                
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
            });
        }
    }
}