using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.DTOs;
using InventoryService.Models;

namespace InventoryService.Services
{
    public interface IProductService
    {
        ProductResponseDto  GetById(int id);
        List<ProductResponseDto > GetAll();
        ProductResponseDto Add(ProductCreateDto  product);
        ProductResponseDto Update(ProductUpdateDto  product);
        bool Delete(int id);
    }
}