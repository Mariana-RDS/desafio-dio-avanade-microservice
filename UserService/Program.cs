using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserService.Domain;
using UserService.Infrastructure.Data.Repositories;
using UserService.Application.Service;
using UserService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("UserDatabase")));

builder.Services.AddControllers();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

var jwtSecret = builder.Configuration["JwtSecret"];

if (string.IsNullOrEmpty(jwtSecret) || jwtSecret.Length < 32)
{
    var randomBytes = new byte[32];
    using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
    {
        rng.GetBytes(randomBytes);
    }
    jwtSecret = Convert.ToBase64String(randomBytes);

    Console.WriteLine($"JWT Secret gerado: {jwtSecret}");
    builder.Configuration["JwtSecret"] = jwtSecret;

    File.WriteAllText("jwt-secret.txt", jwtSecret);
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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("UserOnly", policy =>
        policy.RequireRole("User"));
});

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

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

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();