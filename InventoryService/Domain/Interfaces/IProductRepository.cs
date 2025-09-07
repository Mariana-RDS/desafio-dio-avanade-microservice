using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Domain.Entities;

namespace InventoryService.Domain.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(int id);
        Task AddAsync(Product product);
        Task<List<Product>> GetAllAsync();
        Task UpdateAsync(Product product);
        Task UpdateAsync(int id, string name, decimal? price, int? StockQuantity);
        Task DeleteAsync(Product product);
    }
}