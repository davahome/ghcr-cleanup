DC = docker-compose

create:
	$(DC) build --pull --parallel

build-action:
	$(DC) up action-builder
