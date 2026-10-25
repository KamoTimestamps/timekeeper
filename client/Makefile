.PHONY: build build-devel server watch bump install release release-push

build:
	@pnpm install --frozen-lockfile
	@pnpm run build
	@pnpm run build:firefox
	@pnpm run build:userscript

# Devel-channel userscript only (../timekeeper.devel.user.js); commit it on the devel branch only.
build-devel:
	@pnpm install --frozen-lockfile
	@pnpm run build:userscript:devel

install:
	@pnpm install
	@pnpm add -D http-server 2>/dev/null; true

server: install
	@pnpm run build:userscript
	@pnpm dlx http-server -a 127.0.0.1 -p0 -c-1 .. &
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

# Legacy: use 'make release patch' instead

release:
	@BUMP_TYPE=$(filter-out $@,$(MAKECMDGOALS)); \
	if [ -z "$$BUMP_TYPE" ]; then BUMP_TYPE=patch; fi; \
	echo "Running release: $$BUMP_TYPE"; \
	npm run release:"$$BUMP_TYPE"

release-push:
	git push origin main --follow-tags
