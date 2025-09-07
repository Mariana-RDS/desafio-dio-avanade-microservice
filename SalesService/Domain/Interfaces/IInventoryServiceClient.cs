using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesService.Domain.Interfaces
{
    public interface IInventoryServiceClient
    {
        Task<bool> ValidateStockAsync(int productId, int quantity);
        Task UpdateStockAsync(int productId, int quantityChange);
    }
}