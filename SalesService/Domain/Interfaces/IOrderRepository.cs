using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Domain.Entities;

namespace SalesService.Domain.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(int id);
        Task<List<Order>> GetAllAsync();
        Task<Order> CreateAsync(Order order);
        Task UpdateAsync(Order order);
        Task UpdateStatusAsync(int orderId, OrderStatus status);
    }
}