using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.DTOs;
using InventoryService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;

namespace InventoryService.Controllers
{
    [Route("api/products")]
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetById(int id)
        {
            try
            {
                var product = _productService.GetById(id);
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ProductResponseDto>))]
        public IActionResult GetAll()
        {
            try
            {
                var products = _productService.GetAll();
                return Ok(products);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error fetching all products");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(List<ProductResponseDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Create([FromBody] ProductCreateDto dto)
        {
            try
            {
                
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error creating product");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}