using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Application.DTOs;
using InventoryService.Domain.Entities;

namespace InventoryService.Domain.Interfaces
{
    public interface IProductService
    {
        Task<ProductResponseDto>  GetByIdAsync(int id);
        Task<IEnumerable<ProductResponseDto>> GetAllAsync();
        Task<ProductResponseDto> AddAsync(ProductCreateDto  productDto);
        Task<ProductResponseDto> UpdateAsync(int id, ProductUpdateDto  productDto);
        Task<bool> DeleteAsync(int id);
    }
}