.PHONY: help dev build start db db-stop db-push db-migrate db-studio clean logs logs-db logs-app up down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development server
	bun run dev

build: ## Build the application
	bun run build

start: ## Start production server
	bun run start

# Docker database commands
db: ## Start PostgreSQL database only
	docker compose up -d db

db-stop: ## Stop PostgreSQL database
	docker compose stop db

# Drizzle commands
db-push: ## Sync Drizzle schema to database
	bunx drizzle-kit push:pg

db-migrate: ## Apply Drizzle migrations
	bunx drizzle-kit migrate

db-studio: ## Open Drizzle Studio
	bunx drizzle-kit studio

# Docker compose commands
up: ## Start all services (database + app)
	docker compose up -d --build

down: ## Stop all services
	docker compose down

clean: ## Stop and remove all containers and volumes
	docker compose down -v

# Logs
logs: ## Show logs from all services
	docker compose logs -f

logs-db: ## Show database logs
	docker compose logs -f db

logs-app: ## Show app logs
	docker compose logs -f app

db-seed: ## Generate 1000 sample log entries (add --reset to clear existing)
	bun run scripts/seed.ts $(ARGS)
