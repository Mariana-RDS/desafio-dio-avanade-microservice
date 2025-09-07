using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Application.DTOs
{
    public class StockUpdateDto
    {
        [Required]
        public int QuantityChange { get; set; }
    }
}