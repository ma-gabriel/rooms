DOCKER_COMPOSE = docker compose
DOCKER_TARGET = Docker-compose.yml

export COMPOSE_BAKE=true

.PHONY: all
all: build start

.PHONY: build
build:
	mkdir -p built_data/www
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) build

.PHONY: start
start:
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) up -d

.PHONY: restart
restart:
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) restart

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) down

.PHONY: rm
rm: stop
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) rm

.PHONY: prune
prune:
	$(DOCKER_COMPOSE) -f $(DOCKER_TARGET) down -v
	docker system prune --all --force --volumes

.PHONY: db
db:
	 docker exec -it postgres_db psql "postgresql://rooms_user:rooms_password@localhost:5432/rooms_db"
