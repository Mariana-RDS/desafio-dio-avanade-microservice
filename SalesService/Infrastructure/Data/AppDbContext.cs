using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;

namespace SalesService.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<Order>().HasKey(o => o.Id);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(o => o.Id).HasColumnName("id");
                entity.Property(o => o.OrderDate).HasColumnName("orderDate");
                entity.Property(o => o.TotalOrder).HasColumnName("totalOrder");
                entity.Property(o => o.Status).HasColumnName("status");
            });

            modelBuilder.Entity<OrderItem>().ToTable("order_items");
            modelBuilder.Entity<OrderItem>().HasKey(oi => oi.Id);

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.Property(oi => oi.Id).HasColumnName("id");
                entity.Property(oi => oi.ProductId).HasColumnName("product_id");
                entity.Property(oi => oi.ProductName).HasColumnName("product_name");
                entity.Property(oi => oi.Quantity).HasColumnName("quantity");
                entity.Property(oi => oi.UnitPrice).HasColumnName("unit_price");

                entity.HasOne<Order>()
                      .WithMany(o => o.Items)
                      .HasForeignKey(oi => oi.OrderId)
                      .IsRequired();
            });
        }
    }
}