using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Application.DTOs;
using SalesService.Domain.Entities;
using SalesService.Domain.Interfaces;

namespace SalesService.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IInventoryServiceClient _inventoryClient;
        private readonly ILogger<OrderService> _logger;

        public OrderService(
            IOrderRepository orderRepository,
            IInventoryServiceClient inventoryClient,
            ILogger<OrderService> logger)
        {
            _orderRepository = orderRepository;
            _inventoryClient = inventoryClient;
            _logger = logger;
        }

        public async Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto orderDto)
        {
            try
            {
                foreach (var item in orderDto.Items)
                {
                    var hasStock = await _inventoryClient.ValidateStockAsync(item.ProductId, item.Quantity);
                    if (!hasStock)
                        throw new InvalidOperationException($"Product {item.ProductId} out of stock");
                }

                var totalOrder = orderDto.Items.Sum(item => item.Quantity * item.UnitPrice);

                var order = new Order
                {
                    OrderDate = DateTime.UtcNow,
                    TotalOrder = totalOrder,
                    Status = OrderStatus.Pending,
                    Items = orderDto.Items.Select(item => new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    }).ToList()
                };

                var createdOrder = await _orderRepository.CreateAsync(order);

                foreach (var item in orderDto.Items)
                {
                    await _inventoryClient.UpdateStockAsync(item.ProductId, -item.Quantity);
                }

                await _orderRepository.UpdateStatusAsync(createdOrder.Id, OrderStatus.Completed);

                return MapToDto(createdOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                throw;
            }
        }

        public async Task<OrderResponseDto> GetOrderAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order != null ? MapToDto(order) : null;
        }

        public async Task<List<OrderResponseDto>> GetAllOrderAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToDto).ToList();
        }

        private OrderResponseDto MapToDto(Order order) => new()
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalOrder = order.TotalOrder,
            Status = order.Status,
            Items = order.Items.Select(item => new OrderItemResponseDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            }).ToList()
        };
    }
}