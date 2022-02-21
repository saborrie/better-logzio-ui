#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM node:16-alpine as clientbulid
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY BetterLogzioUI.Server/ClientApp/package.json ./
COPY BetterLogzioUI.Server/ClientApp/yarn.lock ./
RUN yarn --network-timeout 1000000 --frozen-lockfile --prod 
COPY BetterLogzioUI.Server/ClientApp/ ./
RUN yarn build

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["BetterLogzioUI.Server/BetterLogzioUI.Server.csproj", "BetterLogzioUI.Server/"]
RUN dotnet restore "BetterLogzioUI.Server/BetterLogzioUI.Server.csproj"
COPY . .
WORKDIR "/src/BetterLogzioUI.Server"
RUN dotnet build "BetterLogzioUI.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BetterLogzioUI.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=clientbulid /app/build ./wwwroot

ENTRYPOINT ["dotnet", "BetterLogzioUI.Server.dll"]