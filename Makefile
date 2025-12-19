.PHONY: build server watch

build:
	@npm run build

server:
	 @http-server -a 127.0.0.1 -c5

watch:
	@watchman-make --pattern 'src/**' 'package.json' 'Makefile' --target build
