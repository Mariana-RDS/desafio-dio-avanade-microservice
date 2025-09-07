using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using InventoryService.Application.DTOs;
using InventoryService.Domain.Entities;
using InventoryService.Domain.Interfaces;
using InventoryService.Infrastructure.Data.Repositories;

namespace InventoryService.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly ILogger<ProductRepository> _logger;

        public ProductService(IProductRepository repository, ILogger<ProductRepository> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<ProductResponseDto> GetByIdAsync(int id)
        {
            try
            {
                var product = await _repository.GetByIdAsync(id);

                return new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error getting product with ID {id}");
                throw;
            }
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
        {
            try
            {
                var product = await _repository.GetAllAsync();
                return product.Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity
                }).ToList();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error getting all products");
                throw;
            }
        }

        public async Task<ProductResponseDto> AddAsync(ProductCreateDto dto)
        {
            try
            {
                if (dto.StockQuantity < 0)
                    throw new ArgumentException("The quantity in stock cannot be negative");

                if (dto.Price < 0)
                    throw new ArgumentException("The stock price cannot be negative");

                var product = new Product
                {
                    Name = dto.Name,
                    Price = dto.Price,
                    StockQuantity = dto.StockQuantity
                };

                await _repository.AddAsync(product);

                return new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error creating product");
                throw;
            }
        }

        public async Task<ProductResponseDto> UpdateAsync(int id, ProductUpdateDto dto)
        {
            try
            {
                await _repository.UpdateAsync(
                    dto.Id,
                    dto.Name,
                    dto.Price,
                    dto.StockQuantity
                );

                var updatedProduct = await _repository.GetByIdAsync(id);

                return new ProductResponseDto
                {
                    Id = updatedProduct.Id,
                    Name = updatedProduct.Name,
                    Price = updatedProduct.Price,
                    StockQuantity = updatedProduct.StockQuantity
                };

            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error updating product with ID {dto.Id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var product = await _repository.GetByIdAsync(id);
                if (product == null) return false;

                await _repository.DeleteAsync(product);
                return true;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error deleting product with ID {id}");
                throw;
            }
        }

        public async Task<ProductResponseDto> UpdateStockAsync(int productId, int quantityChange)
        {
            try
            {
                var product = await _repository.GetByIdAsync(productId);
                if (product == null)
                    throw new KeyNotFoundException($"Product {productId} not found");

                product.StockQuantity += quantityChange;

                await _repository.UpdateAsync(product); 

                return new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error updating stock of product {productId}");
                throw;
            }
        }
    }
}