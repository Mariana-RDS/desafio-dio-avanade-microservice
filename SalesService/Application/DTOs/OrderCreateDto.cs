using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Domain.Entities;

namespace SalesService.Application.DTOs
{
    public class OrderCreateDto
    {
        public DateTime OrderDate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalOrder { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public OrderStatus Status { get; set; }
    }
}