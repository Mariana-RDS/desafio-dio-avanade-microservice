FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS base
WORKDIR /app

USER app
EXPOSE 5141

FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

COPY ["SalesService.csproj", "./"]
RUN dotnet restore "SalesService.csproj"

COPY . .
RUN dotnet build "SalesService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SalesService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SalesService.dll"]