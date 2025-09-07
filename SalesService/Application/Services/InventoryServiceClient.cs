using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using SalesService.Domain.Interfaces;

namespace SalesService.Application.Services
{
    public class InventoryServiceClient : IInventoryServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<InventoryServiceClient> _logger;

        public InventoryServiceClient(HttpClient httpClient, ILogger<InventoryServiceClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> ValidateStockAsync(int productId, int quantity)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/products/{productId}/stock/validate?quantity={quantity}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error validating stock of product {productId}");
                return false;
            }
        }

        public async Task UpdateStockAsync(int productId, int quantityChange)
        {
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(new { quantityChange }),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PatchAsync($"/api/products/{productId}/stock", content);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating stock of product {productId}");
                throw;
            }
        }
    }
}