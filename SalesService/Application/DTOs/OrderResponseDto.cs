using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Domain.Entities;

namespace SalesService.Application.DTOs
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalOrder { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }
}