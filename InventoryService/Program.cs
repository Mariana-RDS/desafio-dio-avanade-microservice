using InventoryService.Infrastructure.Data;
using InventoryService.Infrastructure.Data.Repositories;
using InventoryService.Application.Services;
using Microsoft.EntityFrameworkCore;
using InventoryService.Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Configuração do PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();




var jwtSecret = builder.Configuration["JwtSecret"];

if (string.IsNullOrEmpty(jwtSecret) || jwtSecret.Length < 32)
{
    if (File.Exists("jwt-secret.txt"))
    {
        jwtSecret = File.ReadAllText("jwt-secret.txt");
        Console.WriteLine($"JWT Secret lido do arquivo: {jwtSecret}");
    }
    else
    {
        var randomBytes = new byte[32];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        jwtSecret = Convert.ToBase64String(randomBytes);
        File.WriteAllText("jwt-secret.txt", jwtSecret);
    }
    
    builder.Configuration["JwtSecret"] = jwtSecret;
}

var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        Console.WriteLine("Banco de dados verificado/migrado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao migrar o banco: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();