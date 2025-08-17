using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Models;

namespace InventoryService.Repositories
{
    public interface IProductRepository
    {
        Product GetById(int id);
        void Add(Product product);
        List<Product> GetAll();
        void Update(int id, string name, decimal? price, int? StockQuantity);
        void Delete(Product product);
    }
}