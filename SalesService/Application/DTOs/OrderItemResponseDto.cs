using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs
{
    public class OrderItemResponseDto : OrderItemDto
    {
        public int Id { get; set; }
    }
}