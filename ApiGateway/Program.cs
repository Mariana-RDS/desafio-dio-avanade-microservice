using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ CONFIGURAÇÃO JWT (igual aos outros serviços)
var jwtSecret = builder.Configuration["JwtSecret"];

if (string.IsNullOrEmpty(jwtSecret) || jwtSecret.Length < 32)
{
    if (File.Exists("jwt-secret.txt"))
    {
        jwtSecret = File.ReadAllText("jwt-secret.txt");
        Console.WriteLine($"JWT Secret lido do arquivo no Gateway: {jwtSecret}");
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
    .AddJwtBearer("Bearer",options =>
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

// ✅ CONFIGURAÇÃO DO OCELOT COM CORS
builder.Configuration
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");


app.UseAuthentication();
app.UseAuthorization();
await app.UseOcelot();

app.Run();