.PHONY: build server watch bump install

build:
	@npm install
	@npm run build
	@npm run build:firefox
	@npm run build:userscript

install:
	@pnpm install
	@pnpm add -D http-server 2>/dev/null; true

server: install
	@npm run build:userscript
	@pnpm dlx http-server -a 127.0.0.1 -p0 -c-1 . &
	@sleep 1 && open "http://127.0.0.1:8080/timekeeper.user.js" 2>/dev/null || true
	@wait

watch: install
	@pnpm dlx watchman-make --pattern 'src/**' 'package.json' 'Makefile' --target build

bump:
	@current=$$(jq -r '.version' package.json); \
	major=$$(echo $$current | cut -d. -f1); \
	minor=$$(echo $$current | cut -d. -f2); \
	patch=$$(echo $$current | cut -d. -f3); \
	new_patch=$$((patch + 1)); \
	new_version="$$major.$$minor.$$new_patch"; \
	jq ".version = \"$$new_version\"" package.json > package.json.tmp && mv package.json.tmp package.json; \
	jq ".version = \"$$new_version\"" manifest.json > manifest.json.tmp && mv manifest.json.tmp manifest.json; \
	printf "export const TIMEKEEPER_VERSION = '%s';\n" "$$new_version" > src/version.ts; \
	echo "Version bumped from $$current to $$new_version"
