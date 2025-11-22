install:
	npm ci

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

develop:
	npm run dev

build:
	npm run build