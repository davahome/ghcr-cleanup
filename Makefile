DC = docker-compose

# make replace-tag -e OLD=v0.4 -e NEW=v0.5
replace-tag:
	find . -type f -name "*.md" -print0 | xargs -0 -n 1 sed -i 's#davahome/ghcr-cleanup@$(OLD)#davahome/ghcr-cleanup@$(NEW)#g'
	sed -i 's#ref: "$(OLD)"#ref: "$(NEW)"#g' action.yml
