using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Application.DTOs;
using InventoryService.Application.Services;
using InventoryService.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;

namespace InventoryService.Presentation.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ILogger<ProductController> _logger;
        private readonly IProductService _productService;

        public ProductController(ILogger<ProductController> logger, IProductService service)
        {
            _logger = logger;
            _productService = service;
        }

        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _productService.GetByIdAsync(id);
                return Ok(product);
            }
            catch (KeyNotFoundException exception)
            {
                _logger.LogWarning(exception, $"Product {id} not found");
                return NotFound();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error fetching product {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<ProductResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await _productService.GetAllAsync();
                return Ok(products);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error fetching all products");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createProduct = await _productService.AddAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = createProduct.Id },
                    createProduct
                );
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error creating product");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updateProduct = await _productService.UpdateAsync(id, dto);
                return Ok(updateProduct);
            }
            catch (KeyNotFoundException exception)
            {
                _logger.LogWarning(exception, $"Product {id} not found");
                return NotFound();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error updating product {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _productService.DeleteAsync(id);

                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Error deleting product {id}");
                return StatusCode(500, "Internal server error");
            }
        }





        [HttpGet("{id}/stock/validate")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateStock(int id, [FromQuery] int quantity)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(product.StockQuantity >= quantity);
        }

        [HttpPatch("{id}/stock")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] StockUpdateDto dto)
        {
            try
            {
                await _productService.UpdateStockAsync(id, dto.QuantityChange);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Product {id} not found");
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating stock of product {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        public class StockUpdateDto
        {
            public int QuantityChange { get; set; }
        }
    }
}