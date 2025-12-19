.PHONY: build server watch bump

build:
	@npm install
	@npm run build

server:
	 @http-server -a 127.0.0.1 -c5

watch:
	@watchman-make --pattern 'src/**' 'package.json' 'Makefile' --target build

bump:
	@current=$$(jq -r '.version' package.json); \
	major=$$(echo $$current | cut -d. -f1); \
	minor=$$(echo $$current | cut -d. -f2); \
	patch=$$(echo $$current | cut -d. -f3); \
	new_patch=$$((patch + 1)); \
	new_version="$$major.$$minor.$$new_patch"; \
	jq ".version = \"$$new_version\"" package.json > package.json.tmp && mv package.json.tmp package.json; \
	echo "Version bumped from $$current to $$new_version"
