using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.DTOs;
using InventoryService.Models;
using InventoryService.Repositories;

namespace InventoryService.Services
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

        public ProductResponseDto GetById(int id)
        {
            try
            {
                var product = _repository.GetById(id);

                return new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error getting product with ID {id}");
                throw;
            }
        }

        public List<ProductResponseDto> GetAll()
        {
            try
            {
                var product = _repository.GetAll();
                return product.Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                }).ToList();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error getting all products");
                throw;
            }
        }

        public ProductResponseDto Add(ProductCreateDto dto)
        {
            try
            {
                var product = new Product
                {
                    Name = dto.Name,
                    Price = dto.Price,
                    StockQuantity = dto.StockQuantity
                };

                _repository.Add(product);

                return new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error creating product");
                throw;
            }
        }

        public ProductResponseDto Update(ProductUpdateDto dto)
        {
            try
            {
                _repository.Update(
                    dto.Id,
                    dto.Name,
                    dto.Price,
                    dto.StockQuantity
                );

                var updatedProduct = _repository.GetById(dto.Id);

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

        public bool Delete(int id)
        {
            try
            {
                var product = _repository.GetById(id);
                if (product == null) return false;

                _repository.Delete(product);
                return true;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error deleting product with ID {id}");
                throw;
            }
        }
    }
}