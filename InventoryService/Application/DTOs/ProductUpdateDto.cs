using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Application.DTOs
{
    public class ProductUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage ="The stock price cannot be negative")]
        public decimal? Price { get; set; }
        
        [Range(0, int.MaxValue, ErrorMessage = "The quantity in stock cannot be negative")]
        public int? StockQuantity { get; set; }
    }
}