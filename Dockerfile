#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# make sure we have node
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Pepper.csproj", ""]
RUN dotnet restore "./Pepper.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Pepper.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Pepper.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Pepper.dll", "--host", "0.0.0.0"]