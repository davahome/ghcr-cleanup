DC = docker-compose

create:
	$(DC) build --pull --parallel

build-action:
	$(DC) up action-builder

# make replace-tag -e OLD=v0.4 -e NEW=v0.5
replace-tag:
	find . -type f -name "*.md" -print0 | xargs -0 -n 1 sed -i 's#DavaHome/ghcr-cleanup@$(OLD)#DavaHome/ghcr-cleanup@$(NEW)#g'
	$(MAKE) build-action
