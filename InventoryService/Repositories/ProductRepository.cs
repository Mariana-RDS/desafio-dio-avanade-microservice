using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Data;
using InventoryService.Models;

namespace InventoryService.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public Product GetById(int id) => _context.Products.Find(id);

        public void Add(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
        }

        public void Update(int id, string name, decimal? price, int? StockQuantity)
        {
            var product = _context.Products.Find(id);
            if (product == null) return;

            product.Name = name ?? product.Name;
            product.Price = price ?? product.Price;
            product.StockQuantity = StockQuantity ?? product.StockQuantity;

            _context.SaveChanges();
        }

        public void Delete(Product product)
        {
            _context.Products.Remove(product);
            _context.SaveChanges();
        }
        public List<Product> GetAll() => _context.Products.ToList();
    }
}