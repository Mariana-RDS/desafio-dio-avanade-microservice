using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.DTOs
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }
}