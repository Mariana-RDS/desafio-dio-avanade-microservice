using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Infrastructure.Data.Repositories;
using InventoryService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using InventoryService.Domain.Interfaces;

namespace InventoryService.Infrastructure.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, string name, decimal? price, int? StockQuantity)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return;

            product.Name = name ?? product.Name;
            product.Price = price ?? product.Price;
            product.StockQuantity = StockQuantity ?? product.StockQuantity;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }
    }
}