# Stocks app - microservices & docker

University project - Service Oriented Architecture

## System diagram

```mermaid
graph TD
    User([User]) -. Interacts with .-> StockSystem(SOA-Stocks system)
    StockSystem -. Authenticates requests using .-> Auth0(Auth0 System)
		StockSystem -. Requests stock data from .-> Finnhub(Finnhub System)
```

## Container diagram (of SOA-Stocks system)

```mermaid
graph TD
		subgraph SOA-Stocks system
			WebApp(Web App - Single page application)
			API(Api Gateway)
			Auth(Authentication Microservice)
			Stocks(Stocks Microservice)
			Redis(Redis message broker)
		end

		Finnhub(Finnhub system)
		Auth0(Auth0 system)

		WebApp -. "[HTTP] Makes calls to" .-> API
		WebApp -. "Authenticates user" .-> Auth0
		API -. "[TCP] Authenticates user requests" .-> Auth
		API -. "[TCP] Requests stock data" .-> Stocks
		API -. "[WebSocket] Sends real-time stock prices" .-> WebApp
		Redis -. "[TCP] Sends stock prices" .-> API

		Auth -. "Verifies user tokens" ..-> Auth0

		Stocks -. "[HTTP] Makes calls to" ..-> Finnhub
		Stocks -. "[TCP] Publishes stock prices" .-> Redis
		Finnhub -. "[WebSocket] Sends real-time stock prices" ..-> Stocks
```
## Component diagram (of Web App - Single page application)

```mermaid
graph TD
		subgraph Web App - Single page application
			AppComponent --> NotAuthGuard --> LandingComponent 
			AppComponent --> AuthGuard --> DashboardComponent
			
			DashboardComponent --> StockChartComponent
			DashboardComponent --> StockSelectComponent
			DashboardComponent -. Uses .-> StockService

			StockChartComponent -. Uses .-> StockService

			StockSelectComponent -. Uses .-> StockService

		end

		AuthService("AuthService (Auth0 System)")
		AppComponent -. Uses ...-> AuthService
		LandingComponent -. Uses ...-> AuthService
		DashboardComponent -. Uses ...-> AuthService

		StockService -. "Makes calls to" .-> Api("Api Gateway")
```
## Component diagram (of Api Gateway)

```mermaid
graph TD
	subgraph Api Gateway
		AppModule --> SharedModule & StocksModule & RedisModule
		SharedModule ---> AuthGuard & WsAuthGuard
		RedisModule ---> RedisService
		StocksModule --> StocksController & StocksGateway
		StocksGateway -. uses .-> RedisService & WsAuthGuard
		StocksController -. uses .-> AuthGuard
	end

	AuthGuard & WsAuthGuard -. Makes calls to .-> AuthMicroservice(Authentication Microservice)
	RedisService -. Subscribes to messages from .-> Redis(Redis message broker)
	StocksController & StocksGateway -. Makes calls to ..-> StocksMicroservice(Stocks Microservice)
```

## Component diagram (of Auth Microservice)

```mermaid
graph TD
	subgraph Auth Microservice
		AppModule --> AuthModule
		AuthModule --> AuthController & AuthService
		AuthController -. uses .-> AuthService
	end

	AuthService -. verifies tokens using .-> Auth0(Auth0 System)
```

## Component diagram (of Stocks Microservice)

```mermaid
graph TD
	subgraph Stocks Microservice
		AppModule --> StockModule & RedisModule
		StockModule --> StockController & StockService
		StockController -. uses .-> StockService
		RedisModule ----> RedisService

		StockService -. uses .-> RedisService
	end

	StockService -. gets stock data from ..-> Finnhub(Finnhub System)
	RedisService -. publishes stock data to .-> Redis(Redis message broker)
```

## Sequence diagram (of get chart stock data)

```mermaid
sequenceDiagram
	participant WA as WebApp
	participant AG as ApiGateway
	participant AM as AuthMicroservice
	participant A as Auth0
	participant SM as StocksMicroservice
	participant F as Finnhub

	WA ->> AG: Get AAPL data
	activate AG

	AG ->> AM: Authenticate request
	activate AM

	AM ->> A: Get public key
	activate A
	A ->> AM: Return public key
	deactivate A

	alt token is valid
		AM ->> AG: Request is valid
	else token is invalid
		AM ->> AG: Request is invalid
	end
	deactivate AM

	alt token is invalid
		AG ->> WA: Return error
	else token is valid
		AG ->> SM: Get AAPL data
		activate SM
			SM ->> F: Get AAPL data
			activate F
				F ->> SM: Return AAPL data
			deactivate F
			SM ->> AG: Return AAPL data
		deactivate SM
		AG ->> WA: Return AAPL data
	end
	deactivate AG
```

## Microservice patterns used

Decomposition:
- **Decompose by business capability** - define services corresponding to business capabilities

Data management:
- **API Composition** - implement queries by invoking the services that own the data and performing an in-memory join

Deployment patterns:
- **Service instance per Container** - deploy each service instance in its container

Communication patterns:
- **Domain-specific protocol** - use a domain-specific protocol
- **Messaging** - use asynchronous messaging for inter-service communication
- **API gateway** - a service that provides each client with unified interface to services

Security:
- **Access Token** - a token that securely stores information about user that is exchanged between services