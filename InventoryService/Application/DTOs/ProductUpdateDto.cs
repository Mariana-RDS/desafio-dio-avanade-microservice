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

        [Range(0.01, double.MaxValue, ErrorMessage ="O preço em estoque não pode ser negativo")]
        public decimal? Price { get; set; }
        
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade em estoque não pode ser negativa")]
        public int? StockQuantity { get; set; }
    }
}