using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SalesService.Domain.Entities;

namespace SalesService.Application.DTOs
{
    public class OrderCreateDto
    {

        [Required]
        [MinLength(1, ErrorMessage = "The order must have at least 1 item")]
        public List<OrderItemCreateDto> Items { get; set; } = new List<OrderItemCreateDto>();
    }
}