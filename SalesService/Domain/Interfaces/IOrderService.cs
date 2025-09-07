using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Application.DTOs;

namespace SalesService.Domain.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto orderDto);
        Task<OrderResponseDto> GetOrderAsync(int id);
        Task<List<OrderResponseDto>> GetAllOrderAsync();

    }
}